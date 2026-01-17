import { useRef, useState, useCallback, useEffect } from 'react';
import Editor, { OnMount, Monaco } from '@monaco-editor/react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  readOnly?: boolean;
  height?: string;
  hideHeader?: boolean;
  hideBorder?: boolean;
}

export function CodeEditor({
  value,
  onChange,
  language = 'python',
  readOnly = false,
  height = '100%',
  hideHeader = false,
  hideBorder = false,
}: CodeEditorProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorRef = useRef<any>(null);
  const [lastLength, setLastLength] = useState(value.length);
  const [lastChangeTime, setLastChangeTime] = useState(Date.now());

  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Disable paste functionality
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    editor.onKeyDown((e: any) => {
      // Block Ctrl+V / Cmd+V
      if ((e.ctrlKey || e.metaKey) && e.keyCode === monaco.KeyCode.KeyV) {
        e.preventDefault();
        e.stopPropagation();
        toast.error('Pasting is disabled — please type your solution', {
          description: 'This helps ensure you understand and can write the code yourself.',
          duration: 3000,
        });
      }
    });

    // Configure editor settings
    editor.updateOptions({
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      fontSize: 14,
      lineNumbers: 'on',
      renderLineHighlight: 'line',
      automaticLayout: true,
      tabSize: 4,
      insertSpaces: true,
      wordWrap: 'on',
      bracketPairColorization: { enabled: true },
      autoClosingBrackets: 'always',
      autoClosingQuotes: 'always',
      suggestOnTriggerCharacters: true,
      quickSuggestions: true,
      folding: true,
      foldingHighlight: true,
      fontFamily: 'JetBrains Mono',
      foldingStrategy: 'indentation',
    });

    // 1. Define the One-Shot Fold Logic
    const performInitialFold = () => {
      setTimeout(() => {
        editor.getAction('editor.foldAllMarkerRegions')?.run();
      }, 500); // 500ms delay to ensure tokenization
    };

    // 2. Trigger for Initial Load (e.g. Python default)
    // We listen for the FIRST content change (or initial set), then immediately stop listening.
    const changeListener = editor.onDidChangeModelContent(() => {
      performInitialFold();
      changeListener.dispose(); // Stop listening after first run
    });

    // 3. Fallback: Also trigger once immediately for the initial load
    performInitialFold();
  };

  const handleChange = useCallback(
    (newValue: string | undefined) => {
      if (newValue === undefined) return;

      const currentTime = Date.now();
      const timeDiff = currentTime - lastChangeTime;
      const lengthDiff = newValue.length - lastLength;

      // Detect suspicious paste-like behavior (>50 chars in <100ms)
      if (lengthDiff > 50 && timeDiff < 100) {
        toast.warning('Suspicious input detected', {
          description: 'Large blocks of text added quickly may be flagged.',
          duration: 3000,
        });
      }

      setLastLength(newValue.length);
      setLastChangeTime(currentTime);
      onChange(newValue);
    },
    [onChange, lastLength, lastChangeTime]
  );

  // Block paste events at DOM level
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('.monaco-editor')) {
        e.preventDefault();
        toast.error('Pasting is disabled — please type your solution', {
          duration: 3000,
        });
      }
    };

    const handleDrop = (e: DragEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('.monaco-editor')) {
        e.preventDefault();
        toast.error('Drag and drop is disabled', {
          duration: 3000,
        });
      }
    };

    document.addEventListener('paste', handlePaste, true);
    document.addEventListener('drop', handleDrop, true);

    return () => {
      document.removeEventListener('paste', handlePaste, true);
      document.removeEventListener('drop', handleDrop, true);
    };
  }, []);

  // Re-trigger folding when value changes (e.g. on reset or language switch)
  useEffect(() => {
    if (editorRef.current && (value.includes('#region') || value.includes('# region'))) {
      const fold = () => editorRef.current.getAction('editor.foldAllMarkerRegions')?.run();
      // Staggered attempts to ensure markers are ready
      setTimeout(fold, 100);
      setTimeout(fold, 400);
      setTimeout(fold, 800);
    }
  }, [value, language]);

  return (
    <div className={cn(
      "h-full w-full flex flex-col overflow-hidden",
      !hideBorder && "rounded-lg border border-border bg-card"
    )}>
      {/* Editor Header */}
      {!hideHeader && (
        <div className="border-b border-border bg-muted/30 px-3 py-2 flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            {language.charAt(0).toUpperCase() + language.slice(1)} Editor
          </span>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Lines: {value.split('\n').length}</span>
            <span>•</span>
            <span>Chars: {value.length}</span>
          </div>
        </div>
      )}

      {/* Scrollable Editor Container */}
      <div className="flex-1 relative overflow-hidden">
        <Editor
          height="100%"
          language={language}
          value={value}
          onChange={handleChange}
          onMount={handleEditorMount}
          theme="vs-dark"
          options={{
            readOnly,
            minimap: { enabled: false },
            scrollBeyondLastLine: true, // Allow scrolling beyond last line
            fontSize: 14,
            lineNumbers: 'on',
            renderLineHighlight: 'line',
            automaticLayout: true,
            tabSize: 4,
            insertSpaces: true,
            wordWrap: 'on',
            scrollbar: {
              vertical: 'visible',
              horizontal: 'visible',
              useShadows: false,
              verticalHasArrows: false,
              horizontalHasArrows: false,
              verticalScrollbarSize: 10,
              horizontalScrollbarSize: 10,
            },
            padding: { top: 16, bottom: 16 },
          }}
          loading={
            <div className="flex h-full items-center justify-center bg-card">
              <div className="text-muted-foreground">Loading editor...</div>
            </div>
          }
        />
      </div>
    </div>
  );
}
