"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { CodeEditor } from "./code-editor";
import { Sparkles } from "lucide-react";

interface SQLOutputProps {
    sql: string;
    isLoading?: boolean;
}

export function SQLOutput({ sql, isLoading }: SQLOutputProps) {
    if (isLoading && !sql) {
        return (
            <div className="p-6 space-y-3">
                <Skeleton className="h-4 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4 rounded-lg" />
                <Skeleton className="h-4 w-5/6 rounded-lg" />
                <Skeleton className="h-4 w-2/3 rounded-lg" />
                <Skeleton className="h-4 w-4/5 rounded-lg" />
            </div>
        );
    }

    return (
        <div className="min-h-[150px] h-full">
            <CodeEditor
                value={sql}
                onChange={() => { }}
                language="sql"
                placeholder="SQL output will appear here..."
                readOnly
            />
        </div>
    );
}
