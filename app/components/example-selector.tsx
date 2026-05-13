"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { examples } from "@/app/data/examples";
import { Sparkles, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExampleSelectorProps {
    onLoadExample: (mCode: string) => void;
    autoTranslate?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function ExampleSelector({ onLoadExample, autoTranslate, open, onOpenChange }: ExampleSelectorProps) {
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

    const handleExampleClick = (mCode: string) => {
        onLoadExample(mCode);
        onOpenChange?.(false); // Close the modal after selection
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger
                render={
                    <Button
                        variant="outline"
                        className="gap-2 backdrop-blur-xl bg-card/70 border border-border/40 shadow-md hover:shadow-lg transition-all rounded-full"
                    />
                }
            >
                <Sparkles className="h-4 w-4 text-accent" />
                Quick Start Examples
            </DialogTrigger>
            <DialogContent className="!max-w-[90vw] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <Sparkles className="h-5 w-5 text-accent" />
                        Quick Start Examples
                    </DialogTitle>
                    <DialogDescription>
                        {autoTranslate
                            ? "Click to load and translate instantly"
                            : "Click to load into editor"}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 mt-4">
                    {/* Basic Examples */}
                    {basicExamples.length > 0 && (
                        <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                                Basic
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {basicExamples.map((example) => (
                                    <button
                                        key={example.id}
                                        onClick={() => handleExampleClick(example.mCode)}
                                        className={cn(
                                            "group w-full text-left p-4 rounded-xl border transition-all",
                                            "hover:scale-[1.02] hover:shadow-md hover:border-accent/60",
                                            "bg-card/50 hover:bg-accent/10",
                                            "focus:outline-none focus:ring-2 focus:ring-ring"
                                        )}
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                                <Badge
                                                    variant="outline"
                                                    className={cn("text-[10px] py-0.5 px-2 shrink-0", getCategoryColor(example.category))}
                                                >
                                                    {example.category}
                                                </Badge>
                                                <span className="font-medium text-sm">
                                                    {example.title}
                                                </span>
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors flex-shrink-0" />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Intermediate Examples */}
                    {intermediateExamples.length > 0 && (
                        <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                                Intermediate
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {intermediateExamples.map((example) => (
                                    <button
                                        key={example.id}
                                        onClick={() => handleExampleClick(example.mCode)}
                                        className={cn(
                                            "group w-full text-left p-4 rounded-xl border transition-all",
                                            "hover:scale-[1.02] hover:shadow-md hover:border-accent/60",
                                            "bg-card/50 hover:bg-accent/10",
                                            "focus:outline-none focus:ring-2 focus:ring-ring"
                                        )}
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                                <Badge
                                                    variant="outline"
                                                    className={cn("text-[10px] py-0.5 px-2 shrink-0", getCategoryColor(example.category))}
                                                >
                                                    {example.category}
                                                </Badge>
                                                <span className="font-medium text-sm">
                                                    {example.title}
                                                </span>
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors flex-shrink-0" />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Advanced Examples */}
                    {advancedExamples.length > 0 && (
                        <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                                Advanced
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {advancedExamples.map((example) => (
                                    <button
                                        key={example.id}
                                        onClick={() => handleExampleClick(example.mCode)}
                                        className={cn(
                                            "group w-full text-left p-4 rounded-xl border transition-all",
                                            "hover:scale-[1.02] hover:shadow-md hover:border-accent/60",
                                            "bg-card/50 hover:bg-accent/10",
                                            "focus:outline-none focus:ring-2 focus:ring-ring"
                                        )}
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                                <Badge
                                                    variant="outline"
                                                    className={cn("text-[10px] py-0.5 px-2 shrink-0", getCategoryColor(example.category))}
                                                >
                                                    {example.category}
                                                </Badge>
                                                <span className="font-medium text-sm">
                                                    {example.title}
                                                </span>
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors flex-shrink-0" />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
