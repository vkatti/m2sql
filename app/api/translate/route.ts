import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";
import { createClient } from "@/lib/supabase/server";

// System prompt for M Code to SQL translation
const SYSTEM_PROMPT = `You are a Senior Data Engineer and Microsoft SQL Server specialist with expertise in translating Power Query (M) code into highly optimized, production-ready T-SQL.

Translation Requirements:

1. CTE Architecture
- Use Common Table Expressions (CTEs) to represent the transformation flow
- Each CTE should map to logical transformation steps in the M code
- Name CTEs descriptively based on their purpose (e.g., RenamedColumns, FilteredData, JoinedTables)
- DO NOT USE CTEs if the overall query can be implemented more efficiently without them (e.g., simple SELECT with minimal transformations)

2. Window Functions
- Utilize SQL Window Functions (ROW_NUMBER(), RANK(), DENSE_RANK(), SUM() OVER(), etc.)
- Use for grouping, indexing, or running totals to avoid inefficient self-joins
- Prefer PARTITION BY over GROUP BY when maintaining row-level detail

3. T-SQL Best Practices
- Use explicit column names (avoid SELECT *)
- Apply appropriate data types with correct precision
- Use TRY_CAST or TRY_CONVERT where data integrity might be an issue
- Follow SQL Server naming conventions (PascalCase for objects, avoid spaces)
- Include proper NULL handling

4. Optimization & Consolidation (CRITICAL)
- **Club Simple Steps**: Do NOT create a new CTE for every single line of M code
- Consolidate sequential "low-value" transformations into a single CTE:
  * Column renames (Table.RenameColumns)
  * Type changes (Table.TransformColumnTypes)
  * Simple filters (Table.SelectRows with basic conditions)
  * Column additions/removals (Table.AddColumn, Table.RemoveColumns)
- **Preserve Complexity**: Keep these in their own distinct CTEs:
  * Merges/Joins (Table.NestedJoin, Table.Join)
  * Groupings/Aggregations (Table.Group)
  * Window Function logic
  * Complex transformations (Table.Pivot, Table.Unpivot)
  * Expand operations (Table.ExpandTableColumn)
- Use CROSS APPLY if necessary to maintain row-level transformations without losing performance

5. Mapping & Documentation
- Include inline comments mapping original M step names to SQL transformations
- Format: -- Step: #"Step Name" (original M code step identifier)
- For consolidated CTEs, list all mapped M steps:
  -- Consolidated Steps: #"Renamed Columns", #"Changed Type", #"Filtered Rows"
- Add brief explanatory comments for complex logic

6. Output Structure
Return ONLY a valid JSON object with these fields:
{
  "sql": "The complete, executable T-SQL query with proper formatting and indentation",
  "explanation": "2-3 sentences explaining the translation approach and key consolidations made",
  "optimizations": ["Array of 3-5 specific optimization techniques applied (e.g., 'Consolidated 3 simple transformations into InitialCleanup CTE', 'Used ROW_NUMBER() instead of self-join for ranking')"]
}

Important: Make the SQL production-ready, efficient, and executable. Do not include markdown code blocks in the JSON output.`;

export const runtime = "edge";

export async function POST(req: Request) {
    try {
        // Verify authentication
        const supabase = await createClient()
        const {
            data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
            return new Response('Unauthorized', { status: 401 })
        }

        const { mCode } = await req.json();

        if (!mCode || typeof mCode !== "string") {
            return new Response("Invalid M Code provided", { status: 400 });
        }

        const apiKey = process.env.OPENROUTER_API_KEY;
        console.log('API Key present:', !!apiKey);
        console.log('API Key length:', apiKey?.length || 0);
        if (!apiKey) {
            return new Response("OpenRouter API key not configured", { status: 500 });
        }

        const openrouter = createOpenRouter({
            apiKey,
        });

        const result = streamText({
            model: openrouter("deepseek/deepseek-v4-flash:free"),                          // Changed from free tier to paid model
            system: SYSTEM_PROMPT,
            prompt: `Translate the following Power Query (M) code into optimized T-SQL:

\`\`\`m
${mCode}
\`\`\`

Follow the translation requirements strictly. Return a valid JSON object with "sql", "explanation", and "optimizations" fields.`,
            temperature: 0.3,
        });

        // Create a custom streaming response
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    let buffer = "";
                    let sqlCollected = "";
                    let explanationCollected = "";
                    const optimizationsCollected: string[] = [];

                    for await (const chunk of result.textStream) {
                        buffer += chunk;

                        // Try to parse as we stream
                        try {
                            // Look for JSON patterns
                            const jsonMatch = buffer.match(/\{[\s\S]*\}/);
                            if (jsonMatch) {
                                const parsed = JSON.parse(jsonMatch[0]);

                                if (parsed.sql && parsed.sql !== sqlCollected) {
                                    const newSql = parsed.sql.substring(sqlCollected.length);
                                    sqlCollected = parsed.sql;
                                    controller.enqueue(
                                        new TextEncoder().encode(
                                            JSON.stringify({ sql: newSql }) + "\n"
                                        )
                                    );
                                }

                                if (parsed.explanation && parsed.explanation !== explanationCollected) {
                                    const newExplanation = parsed.explanation.substring(explanationCollected.length);
                                    explanationCollected = parsed.explanation;
                                    controller.enqueue(
                                        new TextEncoder().encode(
                                            JSON.stringify({ explanation: newExplanation }) + "\n"
                                        )
                                    );
                                }

                                if (parsed.optimizations && Array.isArray(parsed.optimizations)) {
                                    const newOpts = parsed.optimizations.filter(
                                        (opt: string) => !optimizationsCollected.includes(opt)
                                    );
                                    if (newOpts.length > 0) {
                                        optimizationsCollected.push(...newOpts);
                                        controller.enqueue(
                                            new TextEncoder().encode(
                                                JSON.stringify({ optimizations: newOpts }) + "\n"
                                            )
                                        );
                                    }
                                }
                            }
                        } catch {
                            // Continue buffering if JSON is incomplete
                        }
                    }

                    // Final parse attempt
                    try {
                        const jsonMatch = buffer.match(/\{[\s\S]*\}/);
                        if (jsonMatch) {
                            const parsed = JSON.parse(jsonMatch[0]);

                            // Send any remaining data
                            if (parsed.sql && parsed.sql !== sqlCollected) {
                                controller.enqueue(
                                    new TextEncoder().encode(
                                        JSON.stringify({ sql: parsed.sql.substring(sqlCollected.length) }) + "\n"
                                    )
                                );
                            }

                            if (parsed.explanation && parsed.explanation !== explanationCollected) {
                                controller.enqueue(
                                    new TextEncoder().encode(
                                        JSON.stringify({ explanation: parsed.explanation.substring(explanationCollected.length) }) + "\n"
                                    )
                                );
                            }

                            if (parsed.optimizations && Array.isArray(parsed.optimizations)) {
                                const newOpts = parsed.optimizations.filter(
                                    (opt: string) => !optimizationsCollected.includes(opt)
                                );
                                if (newOpts.length > 0) {
                                    controller.enqueue(
                                        new TextEncoder().encode(
                                            JSON.stringify({ optimizations: newOpts }) + "\n"
                                        )
                                    );
                                }
                            }
                        }
                    } catch (error) {
                        console.error("Final parse error:", error);
                    }

                    controller.close();
                } catch (error) {
                    console.error("Stream error:", error);
                    controller.error(error);
                }
            },
        });

        return new Response(stream, {
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-cache",
            },
        });
    } catch (error) {
        console.error("Translation error:", error);
        return new Response(
            JSON.stringify({
                error: error instanceof Error ? error.message : "Translation failed",
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}
