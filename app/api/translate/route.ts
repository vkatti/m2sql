import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";

// System prompt for M Code to SQL translation
const SYSTEM_PROMPT = `You are a Senior Data Engineer and Microsoft SQL Server specialist with expertise in translating Power Query (M) code into highly optimized, production-ready T-SQL.

## Translation Requirements:

### 1. CTE Architecture
- Use Common Table Expressions (CTEs) to represent the transformation flow
- Each CTE should map to logical transformation steps in the M code
- Example structure:
  WITH Step1 AS (...),
       Step2 AS (...),
       Step3 AS (...)
  SELECT * FROM Step3;

### 2. Window Functions
- Utilize SQL Window Functions (ROW_NUMBER(), RANK(), SUM(...) OVER(...))
- Use for grouping, indexing, or running totals to avoid inefficient self-joins

### 3. T-SQL Best Practices
- Use explicit column names
- Apply appropriate data types
- Use TRY_CAST where data integrity might be an issue
- Follow SQL Server naming conventions

### 4. Optimization & Consolidation (CRITICAL)
- **Club Simple Steps**: Do NOT create a new CTE for every single line of M code
- Consolidate sequential "low-value" transformations into a single CTE block:
  * Column renames (Table.RenameColumns)
  * Type changes (Table.TransformColumnTypes)
  * Simple filters (Table.SelectRows)
- **Preserve Complexity**: Keep complex steps in their own distinct CTEs:
  * Merges/Joins
  * Groupings/Aggregations
  * Window Function logic
  * Complex transformations

### 5. Mapping & Documentation
- Include inline comments that map original M code step names to SQL transformations
- If multiple M steps were consolidated into one CTE, list all mapped M steps in the comment header
- Example: -- Mapping M Steps: #"Renamed Columns", #"Changed Type", #"Filtered Rows"

### 6. Output Structure
Return a JSON object with these fields:
{
  "sql": "The complete T-SQL query with CTEs and proper formatting",
  "explanation": "Brief explanation of the translation approach and where steps were consolidated",
  "optimizations": ["List", "of", "optimization", "techniques", "applied"]
}

Important: Make the SQL production-ready, efficient, and well-documented.`;

export const runtime = "edge";

export async function POST(req: Request) {
    try {
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
            model: openrouter("inclusionai/ring-2.6-1t:free"), // Changed from free tier to paid model
            prompt: `Translate the following Power Query (M) code into optimized T-SQL:

\`\`\`m
${mCode}
\`\`\`

Return the result as a JSON object with "sql", "explanation", and "optimizations" fields.`,
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
