"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Lightbulb, Zap } from "lucide-react";

interface ExplanationPanelProps {
    explanation: string;
    optimizations: (string | { technique: string; description?: string })[];
}

export function ExplanationPanel({
    explanation,
    optimizations,
}: ExplanationPanelProps) {
    if (!explanation && (!optimizations || optimizations.length === 0)) {
        return null;
    }

    // Helper function to extract the display text from optimization
    const getOptimizationText = (opt: string | { technique: string; description?: string }): string => {
        if (typeof opt === 'string') {
            return opt;
        }
        return opt.technique;
    };

    return (
        <Card className="backdrop-blur-xl bg-card/70 border border-border/40 shadow-lg transition-all duration-300 hover:shadow-xl rounded-2xl overflow-hidden">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-warning" />
                    Translation Insights
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
                <ScrollArea className="max-h-[300px]">
                    {explanation && (
                        <div className="mb-6 pr-4">
                            <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
                                Explanation
                            </h4>
                            <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
                                {explanation}
                            </p>
                        </div>
                    )}
                    {optimizations && optimizations.length > 0 && (
                        <div className="pr-4">
                            <h4 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                                <Zap className="h-4 w-4 text-success" />
                                Optimizations Applied
                            </h4>
                            <ul className="space-y-3">
                                {optimizations.map((opt, index) => (
                                    <li 
                                        key={index} 
                                        className="flex items-start gap-3 text-sm leading-relaxed group"
                                    >
                                        <span className="text-success text-lg mt-0.5 shrink-0 group-hover:scale-125 transition-transform">•</span>
                                        <span className="text-foreground/90">
                                            {getOptimizationText(opt)}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
