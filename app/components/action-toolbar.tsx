"use client";

import { Button } from "@/components/ui/button";
import { Zap, Copy, Trash2, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ActionToolbarProps {
    onTranslate: () => void;
    onClear: () => void;
    sqlOutput: string;
    isLoading: boolean;
    mCode: string;
}

export function ActionToolbar({
    onTranslate,
    onClear,
    sqlOutput,
    isLoading,
    mCode,
}: ActionToolbarProps) {
    const handleCopySQL = async () => {
        if (!sqlOutput) {
            toast.error("No SQL to copy");
            return;
        }
        try {
            await navigator.clipboard.writeText(sqlOutput);
            toast.success("SQL copied to clipboard!");
        } catch {
            toast.error("Failed to copy SQL");
        }
    };

    const handleDownloadSQL = () => {
        if (!sqlOutput) {
            toast.error("No SQL to download");
            return;
        }
        try {
            const blob = new Blob([sqlOutput], { type: "text/plain" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `translated-query-${Date.now()}.sql`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            toast.success("SQL downloaded!");
        } catch {
            toast.error("Failed to download SQL");
        }
    };

    return (
        <div className="flex gap-2 items-center justify-between flex-wrap p-4 border-b bg-muted/10">
            <div className="flex gap-2 flex-wrap">
                <Button
                    onClick={onTranslate}
                    disabled={isLoading || !mCode.trim()}
                    className="gap-2"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Translating...
                        </>
                    ) : (
                        <>
                            <Zap className="h-4 w-4" />
                            Translate
                        </>
                    )}
                </Button>
                <Button
                    variant="outline"
                    onClick={handleCopySQL}
                    disabled={!sqlOutput || isLoading}
                    className="gap-2"
                >
                    <Copy className="h-4 w-4" />
                    Copy SQL
                </Button>
                <Button
                    variant="outline"
                    onClick={handleDownloadSQL}
                    disabled={!sqlOutput || isLoading}
                    className="gap-2"
                >
                    <Download className="h-4 w-4" />
                    Download SQL
                </Button>
            </div>
            <Button
                variant="outline"
                onClick={onClear}
                disabled={isLoading}
                className="gap-2"
            >
                <Trash2 className="h-4 w-4" />
                Clear All
            </Button>
        </div>
    );
}
