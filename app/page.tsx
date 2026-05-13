"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CodeEditor } from "./components/code-editor";
import { SQLOutput } from "./components/sql-output";
import { ExplanationPanel } from "./components/explanation-panel";
import { ExampleSelector } from "./components/example-selector";
import { useKeyboardShortcuts } from "./hooks/use-keyboard-shortcuts";
import { AlertCircle, Zap, Trash2, FileCode, Copy, Download, Loader2, Code2 } from "lucide-react";
import { toast } from "sonner";

export default function Home() {
  const [mCode, setMCode] = useState("");
  const [sqlOutput, setSqlOutput] = useState("");
  const [explanation, setExplanation] = useState("");
  const [optimizations, setOptimizations] = useState<(string | { technique: string; description?: string })[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoTranslate, setAutoTranslate] = useState(false);

  const handleTranslate = async (code?: string) => {
    const codeToTranslate = code || mCode;

    if (!codeToTranslate.trim()) {
      setError("Please enter M Code to translate");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSqlOutput("");
    setExplanation("");
    setOptimizations([]);

    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mCode: codeToTranslate }),
      });

      if (!response.ok) {
        throw new Error(`Translation failed: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No response body");
      }

      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.trim() === "") continue;

          try {
            const data = JSON.parse(line);

            if (data.sql) {
              setSqlOutput((prev) => prev + data.sql);
            }
            if (data.explanation) {
              setExplanation((prev) => prev + data.explanation);
            }
            if (data.optimizations && Array.isArray(data.optimizations)) {
              setOptimizations((prev) => [...prev, ...data.optimizations]);
            }
          } catch (e) {
            // Skip invalid JSON lines
            console.error("Failed to parse line:", line, e);
          }
        }
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred during translation"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadExample = (code: string) => {
    setMCode(code);
    if (autoTranslate) {
      // Small delay to let state update
      setTimeout(() => handleTranslate(code), 100);
    }
  };

  const handleClear = () => {
    setMCode("");
    setSqlOutput("");
    setExplanation("");
    setOptimizations([]);
    setError(null);
  };

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onTranslate: handleTranslate,
    onClear: handleClear,
    onClearError: () => setError(null),
    isLoading,
  });

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gradient-to-br from-background via-accent/5 to-primary/5">
      {/* Hero Header */}
      <header className="relative border-b border-border/40 backdrop-blur-xl bg-card/80 shadow-lg shrink-0">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient">
                M2SQL
              </h1>
              <p className="text-sm text-muted-foreground font-light">
                Transform Power Query to Optimized SQL
              </p>
            </div>

            {/* Keyboard Shortcuts Badge - Top Right */}
            <div className="backdrop-blur-xl bg-card/90 border border-border/40 shadow-xl px-5 py-2.5 text-xs text-muted-foreground rounded-full opacity-80 hover:opacity-100 transition-all hover:scale-105 hover:shadow-[0_0_30px_-10px_oklch(0.65_0.22_275_/_30%)]">
              <span className="font-mono font-semibold text-primary">Ctrl+Enter</span> <span className="text-muted-foreground/60">translate</span> • <span className="font-mono font-semibold text-accent">Ctrl+K</span> <span className="text-muted-foreground/60">clear</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="container mx-auto max-w-[1600px] px-6 py-6 space-y-6">

          {/* Error Display */}
          {error && (
            <Alert variant="destructive" className="backdrop-blur-xl bg-destructive/10 border border-destructive/30 shadow-lg rounded-2xl shrink-0 animate-in slide-in-from-top-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Quick Actions Bar */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <label className="flex items-center gap-2.5 text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors bg-card/40 backdrop-blur-sm px-4 py-2 rounded-full border border-border/20">
              <input
                type="checkbox"
                checked={autoTranslate}
                onChange={(e) => setAutoTranslate(e.target.checked)}
                className="w-4 h-4 rounded border-border accent-primary cursor-pointer"
              />
              <span className="font-medium">Auto-translate examples</span>
            </label>

            <Button
              variant="outline"
              onClick={handleClear}
              disabled={isLoading}
              size="sm"
              className="gap-2 backdrop-blur-xl bg-card/70 border border-border/40 shadow-md hover:shadow-lg transition-all rounded-full"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear All
            </Button>
          </div>

          {/* Example Selector - Collapsible */}
          <ExampleSelector onLoadExample={handleLoadExample} autoTranslate={autoTranslate} />

          {/* Main Editor Area - Side by Side with Center Button */}
          <div className="relative flex items-stretch gap-4">
            {/* M Code Input - Left Side */}
            <Card className="flex-1 flex flex-col min-h-[500px] backdrop-blur-xl bg-card/70 border border-border/40 shadow-lg transition-all duration-300 hover:shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="pb-3 shrink-0">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <FileCode className="h-5 w-5 text-accent" />
                  M Code Input
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 min-h-0 overflow-hidden p-0">
                <CodeEditor
                  value={mCode}
                  onChange={setMCode}
                  language="mcode"
                  placeholder="Paste your Power Query (M) code here or select an example above..."
                />
              </CardContent>
            </Card>

            {/* Big Round Translate Button - Center */}
            <div className="flex items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <Button
                onClick={() => handleTranslate()}
                disabled={isLoading || !mCode.trim()}
                size="lg"
                className="h-20 w-20 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-[0_0_50px_-5px_oklch(0.65_0.22_275_/_60%)] disabled:opacity-50 disabled:scale-100 bg-gradient-to-br from-primary via-accent to-primary p-0 border-4 border-background"
              >
                {isLoading ? (
                  <Loader2 className="h-8 w-8 animate-spin" />
                ) : (
                  <Zap className="h-8 w-8" />
                )}
              </Button>
            </div>

            {/* SQL Output - Right Side */}
            <Card className="flex-1 flex flex-col min-h-[500px] backdrop-blur-xl bg-card/70 border border-border/40 shadow-lg transition-all duration-300 hover:shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="pb-3 shrink-0">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Code2 className="h-5 w-5 text-primary" />
                    SQL Output
                  </CardTitle>
                  {/* Output Actions */}
                  {sqlOutput && (
                    <div className="flex gap-2 animate-in slide-in-from-top-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={async () => {
                          await navigator.clipboard.writeText(sqlOutput);
                          toast.success("SQL copied to clipboard!");
                        }}
                        className="gap-2 h-8 rounded-full hover:bg-accent/20"
                      >
                        <Copy className="h-3.5 w-3.5" />
                        Copy
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
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
                        }}
                        className="gap-2 h-8 rounded-full hover:bg-accent/20"
                      >
                        <Download className="h-3.5 w-3.5" />
                        Save
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-1 min-h-0 overflow-hidden p-0">
                <SQLOutput sql={sqlOutput} isLoading={isLoading} />
              </CardContent>
            </Card>
          </div>

          {/* Translation Insights - Full Width Below */}
          {(explanation || optimizations.length > 0) && (
            <ExplanationPanel
              explanation={explanation}
              optimizations={optimizations}
            />
          )}
        </div>
      </div>
    </div>
  );
}
