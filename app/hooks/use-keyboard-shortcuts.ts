import { useEffect } from "react";

interface KeyboardShortcutsOptions {
    onTranslate: () => void;
    onClear: () => void;
    onClearError?: () => void;
    isLoading?: boolean;
}

export function useKeyboardShortcuts({
    onTranslate,
    onClear,
    onClearError,
    isLoading = false,
}: KeyboardShortcutsOptions) {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Ctrl+Enter or Cmd+Enter: Trigger translation
            if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
                event.preventDefault();
                if (!isLoading) {
                    onTranslate();
                }
            }

            // Ctrl+K or Cmd+K: Clear all inputs
            if ((event.ctrlKey || event.metaKey) && event.key === "k") {
                event.preventDefault();
                if (!isLoading) {
                    onClear();
                }
            }

            // Escape: Clear error messages
            if (event.key === "Escape" && onClearError) {
                onClearError();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [onTranslate, onClear, onClearError, isLoading]);
}
