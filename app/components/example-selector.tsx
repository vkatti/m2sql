"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { examples } from "@/app/data/examples";
import { Sparkles, ChevronRight, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExampleSelectorProps {
    onLoadExample: (mCode: string) => void;
    autoTranslate?: boolean;
}

export function ExampleSelector({ onLoadExample, autoTranslate }: ExampleSelectorProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const basicExamples = examples.filter((ex) => ex.category === "basic");
    const intermediateExamples = examples.filter((ex) => ex.category === "intermediate");
    const advancedExamples = examples.filter((ex) => ex.category === "advanced");

    const getCategoryColor = (category: string) => {
        switch (category) {
            case "basic":
                return "bg-chart-3/20 text-chart-3 border-chart-3/40";
            case "intermediate":
                return "bg-chart-2/20 text-chart-2 border-chart-2/40";
            case "advanced":
                return "bg-chart-1/20 text-chart-1 border-chart-1/40";
            default:
                return "bg-muted text-muted-foreground";
        }
    };

    return (
        <Card className="backdrop-blur-xl bg-card/70 border border-border/40 shadow-lg rounded-2xl overflow-hidden shrink-0 transition-all">
            <CardHeader
                className="pb-3 cursor-pointer hover:bg-accent/5 transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Sparkles className="h-4 w-4 text-accent" />
                            Quick Start Examples
                        </CardTitle>
                        <CardDescription className="text-xs mt-1">
                            {autoTranslate
                                ? "Click to load and translate instantly"
                                : "Click to load into editor"}
                        </CardDescription>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 rounded-full"
                    >
                        {isExpanded ? (
                            <ChevronUp className="h-4 w-4" />
                        ) : (
                            <ChevronDown className="h-4 w-4" />
                        )}
                    </Button>
                </div>
            </CardHeader>

            {isExpanded && (
                <CardContent className="space-y-4 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-border/60 scrollbar-track-transparent animate-in slide-in-from-top-2">
                    {/* Basic Examples */}
                    {basicExamples.length > 0 && (
                        <div className="space-y-2">
                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                Basic
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {basicExamples.map((example) => (
                                    <button
                                        key={example.id}
                                        onClick={() => onLoadExample(example.mCode)}
                                        className={cn(
                                            "group w-full text-left p-3 rounded-xl border transition-all",
                                            "hover:scale-[1.02] hover:shadow-md hover:border-accent/60",
                                            "bg-card/50 hover:bg-accent/10",
                                            "focus:outline-none focus:ring-1 focus:ring-ring"
                                        )}
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                                <Badge
                                                    variant="outline"
                                                    className={cn("text-[10px] py-0 px-1.5 shrink-0", getCategoryColor(example.category))}
                                                >
                                                    {example.category}
                                                </Badge>
                                                <span className="font-medium text-xs truncate">
                                                    {example.title}
                                                </span>
                                            </div>
                                            <ChevronRight className="h-3 w-3 text-muted-foreground group-hover:text-accent transition-colors flex-shrink-0" />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Intermediate Examples */}
                    {intermediateExamples.length > 0 && (
                        <div className="space-y-2">
                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                Intermediate
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {intermediateExamples.map((example) => (
                                    <button
                                        key={example.id}
                                        onClick={() => onLoadExample(example.mCode)}
                                        className={cn(
                                            "group w-full text-left p-3 rounded-xl border transition-all",
                                            "hover:scale-[1.02] hover:shadow-md hover:border-accent/60",
                                            "bg-card/50 hover:bg-accent/10",
                                            "focus:outline-none focus:ring-1 focus:ring-ring"
                                        )}
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                                <Badge
                                                    variant="outline"
                                                    className={cn("text-[10px] py-0 px-1.5 shrink-0", getCategoryColor(example.category))}
                                                >
                                                    {example.category}
                                                </Badge>
                                                <span className="font-medium text-xs truncate">
                                                    {example.title}
                                                </span>
                                            </div>
                                            <ChevronRight className="h-3 w-3 text-muted-foreground group-hover:text-accent transition-colors flex-shrink-0" />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Advanced Examples */}
                    {advancedExamples.length > 0 && (
                        <div className="space-y-2">
                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                Advanced
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {advancedExamples.map((example) => (
                                    <button
                                        key={example.id}
                                        onClick={() => onLoadExample(example.mCode)}
                                        className={cn(
                                            "group w-full text-left p-3 rounded-xl border transition-all",
                                            "hover:scale-[1.02] hover:shadow-md hover:border-accent/60",
                                            "bg-card/50 hover:bg-accent/10",
                                            "focus:outline-none focus:ring-1 focus:ring-ring"
                                        )}
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                                <Badge
                                                    variant="outline"
                                                    className={cn("text-[10px] py-0 px-1.5 shrink-0", getCategoryColor(example.category))}
                                                >
                                                    {example.category}
                                                </Badge>
                                                <span className="font-medium text-xs truncate">
                                                    {example.title}
                                                </span>
                                            </div>
                                            <ChevronRight className="h-3 w-3 text-muted-foreground group-hover:text-accent transition-colors flex-shrink-0" />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            )}
        </Card>
    );
}
