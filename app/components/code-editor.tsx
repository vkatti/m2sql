"use client";

import CodeMirror from "@uiw/react-codemirror";
import { sql } from "@codemirror/lang-sql";
import { mCode } from "@/app/lib/m-lang";
import { EditorView } from "@codemirror/view";

interface CodeEditorProps {
    value: string;
    onChange?: (value: string) => void;
    language?: "sql" | "mcode";
    readOnly?: boolean;
    placeholder?: string;
    className?: string;
}

export function CodeEditor({
    value,
    onChange,
    language = "mcode",
    readOnly = false,
    placeholder,
    className = "",
}: CodeEditorProps) {
    const extensions = [
        language === "sql" ? sql() : mCode(),
        EditorView.lineWrapping,
    ];

    return (
        <div className={`min-h-[300px] ${className}`}>
            <CodeMirror
                value={value}
                onChange={onChange}
                extensions={extensions}
                readOnly={readOnly}
                placeholder={placeholder}
                theme="dark"
                height="100%"
                className="h-full text-sm"
                basicSetup={{
                    lineNumbers: true,
                    highlightActiveLineGutter: true,
                    highlightSpecialChars: true,
                    history: true,
                    foldGutter: true,
                    drawSelection: true,
                    dropCursor: true,
                    allowMultipleSelections: true,
                    indentOnInput: true,
                    syntaxHighlighting: true,
                    bracketMatching: true,
                    closeBrackets: true,
                    autocompletion: true,
                    rectangularSelection: true,
                    crosshairCursor: true,
                    highlightActiveLine: true,
                    highlightSelectionMatches: true,
                    closeBracketsKeymap: true,
                    defaultKeymap: true,
                    searchKeymap: true,
                    historyKeymap: true,
                    foldKeymap: true,
                    completionKeymap: true,
                    lintKeymap: true,
                }}
            />
        </div>
    );
}
