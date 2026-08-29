"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { Code2, Save, RotateCcw } from "lucide-react";
import * as SheetPrimitive from "@radix-ui/react-dialog";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Dynamically import AceEditor for Next.js SSR compatibility
const AceEditor = dynamic(
  async () => {
    const ace = await import("react-ace");
    await import("ace-builds/src-noconflict/ext-language_tools");
    await import("ace-builds/src-noconflict/mode-css");
    await import("ace-builds/src-noconflict/mode-javascript");
    await import("ace-builds/src-noconflict/mode-html");
    await import("ace-builds/src-noconflict/mode-python");
    await import("ace-builds/src-noconflict/mode-java");
    await import("ace-builds/src-noconflict/mode-c_cpp");
    await import("ace-builds/src-noconflict/theme-tomorrow");
    await import("ace-builds/src-noconflict/theme-tomorrow_night");
    return ace.default;
  },
  { ssr: false, loading: () => <div className="p-4 text-xs font-mono text-slate-500">Loading Code Editor...</div> }
);

// Allowed Languages: C, C++, Python, Java, HTML, CSS, JavaScript
export type CodeLanguage =
  | "c_cpp"
  | "python"
  | "java"
  | "html"
  | "css"
  | "javascript";

interface LanguageOption {
  value: CodeLanguage;
  label: string;
  extension: string;
}

interface CodeEditorProps {
  className?: string;
  language?: CodeLanguage;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

// Filtered Languages
const LANGUAGE_OPTIONS: LanguageOption[] = [
  { value: "c_cpp", label: "C / C++", extension: ".cpp" },
  { value: "python", label: "Python", extension: ".py" },
  { value: "java", label: "Java", extension: ".java" },
  { value: "javascript", label: "JavaScript", extension: ".js" },
  { value: "html", label: "HTML", extension: ".html" },
  { value: "css", label: "CSS", extension: ".css" },
];

const PLACEHOLDERS: Record<CodeLanguage, string> = {
  c_cpp: `// C/C++ Solution Template
#include <iostream>
using namespace std;

int main() {
    // Write your algorithmic solution here
    cout << "Ready for challenge" << endl;
    return 0;
}`,
  python: `# Python Solution Template
def solve():
    # Write your solution here
    pass

if __name__ == "__main__":
    solve()`,
  java: `// Java Solution Template
public class Main {
    public static void main(String[] args) {
        // Write your solution here
        System.out.println("Ready for challenge");
    }
}`,
  javascript: `// JavaScript Solution Template
function solve() {
    // Write your solution here
    console.log("Ready for challenge");
}

solve();`,
  html: `<!-- HTML Interface Solution -->
<div class="challenge-container">
    <h1>Challenge Solution</h1>
</div>`,
  css: `/* CSS Styling Solution */
.challenge-container {
    display: flex;
    justify-content: center;
    align-items: center;
}`,
};

const useAceTheme = () => {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return "tomorrow_night";
  const currentTheme = theme === "system" ? systemTheme : theme;
  return currentTheme === "dark" ? "tomorrow_night" : "tomorrow_night";
};

function CodeEditorSheet({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="code-editor-sheet" {...props} />;
}

function CodeEditorSheetTrigger({
  className,
  children = (
    <Button variant="outline" className="gap-2">
      <Code2 className="h-4 w-4" />
      Open Code Editor
    </Button>
  ),
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return (
    <SheetPrimitive.Trigger
      data-slot="code-editor-sheet-trigger"
      className={cn(className)}
      asChild
      {...props}
    >
      {children}
    </SheetPrimitive.Trigger>
  );
}

function CodeEditorSheetContent({
  className,
  side = "right",
  children,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: "top" | "right" | "bottom" | "left";
}) {
  return (
    <SheetPrimitive.Portal>
      <SheetPrimitive.Overlay
        data-slot="code-editor-sheet-overlay"
        className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
      />
      <SheetPrimitive.Content
        data-slot="code-editor-sheet-content"
        className={cn(
          "bg-[#0d0e1b] border-l border-white/10 text-white data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col shadow-2xl transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
          side === "right" &&
            "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-full sm:max-w-[850px]",
          className
        )}
        {...props}
      >
        {children}
      </SheetPrimitive.Content>
    </SheetPrimitive.Portal>
  );
}

function CodeEditorSheetHeader({
  className,
  title = "Code Editor",
  description = "Write and edit your custom code",
  language,
  ...props
}: React.ComponentProps<"div"> & {
  title?: string;
  description?: string;
  language?: CodeLanguage;
}) {
  const selectedLanguage = LANGUAGE_OPTIONS.find(
    (opt) => opt.value === language
  );
  return (
    <div
      data-slot="code-editor-sheet-header"
      className={cn("px-6 py-4 border-b border-white/10 bg-white/[0.02]", className)}
      {...props}
    >
      <div className="flex items-center justify-between">
        <div>
          <SheetPrimitive.Title
            data-slot="code-editor-sheet-title"
            className="flex items-center gap-2 text-white font-bold text-base font-heading"
          >
            <Code2 className="h-5 w-5 text-cyan-400" />
            {title}
          </SheetPrimitive.Title>
          <SheetPrimitive.Description
            data-slot="code-editor-sheet-description"
            className="mt-1 text-slate-400 text-xs font-mono"
          >
            {description}
          </SheetPrimitive.Description>
        </div>
        {selectedLanguage && (
          <Badge variant="secondary" className="ml-2 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono">
            {selectedLanguage.extension}
          </Badge>
        )}
      </div>
    </div>
  );
}

function CodeEditorSheetControls({
  className,
  language,
  allowLanguageChange = false,
  onLanguageChange,
  onReset,
  onSave,
  ...props
}: React.ComponentProps<"div"> & {
  language: CodeLanguage;
  allowLanguageChange?: boolean;
  onLanguageChange?: (value: CodeLanguage) => void;
  onReset?: () => void;
  onSave?: () => void;
}) {
  return (
    <div
      data-slot="code-editor-sheet-controls"
      className={cn("px-6 py-3 border-b border-white/10 bg-[#0a0b16]", className)}
      {...props}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {allowLanguageChange && onLanguageChange ? (
            <Select value={language} onValueChange={onLanguageChange}>
              <SelectTrigger className="w-[150px] h-8 bg-white/5 border-white/10 text-white font-mono text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#121324] border-white/10 text-white font-mono text-xs">
                {LANGUAGE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="focus:bg-white/10 focus:text-white">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="border border-white/10 bg-white/5 rounded-md px-2.5 py-1 uppercase text-xs font-mono text-cyan-300">
              {language}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {onReset && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="h-8 px-3 text-slate-400 hover:text-white hover:bg-white/10 text-xs font-mono"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Reset
            </Button>
          )}
          {onSave && (
            <Button onClick={onSave} size="sm" className="h-8 px-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs font-mono shadow-md shadow-cyan-600/30">
              <Save className="h-3 w-3 mr-1" />
              Save
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function CodeEditor({
  className,
  language = "python",
  value = "",
  onChange,
  placeholder,
  ...props
}: CodeEditorProps) {
  const theme = useAceTheme();
  return (
    <div
      data-slot="code-editor"
      className={cn("flex-1 relative min-h-[420px] bg-[#090a14]", className)}
      {...props}
    >
      <AceEditor
        mode={language === 'c_cpp' ? 'c_cpp' : language}
        theme={theme}
        value={value}
        onChange={onChange}
        name="code-editor"
        width="100%"
        height="100%"
        fontSize={14}
        showPrintMargin={false}
        showGutter={true}
        highlightActiveLine={true}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
          showLineNumbers: true,
          tabSize: 2,
          useWorker: false,
          wrap: true,
          fontFamily:
            "'JetBrains Mono', 'Fira Code', 'Monaco', 'Menlo', 'Ubuntu Mono', monospace",
        }}
        placeholder={placeholder || PLACEHOLDERS[language] || ""}
        style={{
          fontFamily:
            "'JetBrains Mono', 'Fira Code', 'Monaco', 'Menlo', 'Ubuntu Mono', monospace",
        }}
      />
    </div>
  );
}

interface CodeEditorSheetComposedProps {
  trigger?: React.ReactNode;
  title?: string;
  description?: string;
  defaultLanguage?: CodeLanguage;
  allowLanguageChange?: boolean;
  defaultValue?: string;
  onSave?: (code: string, language: CodeLanguage) => void;
  onReset?: () => void;
  placeholder?: string;
}

function CodeEditorSheetComposed({
  trigger,
  title,
  description,
  defaultLanguage = "python",
  allowLanguageChange = true,
  defaultValue = "",
  onSave,
  onReset,
  placeholder,
}: CodeEditorSheetComposedProps) {
  const [language, setLanguage] = React.useState<CodeLanguage>(defaultLanguage);
  const [code, setCode] = React.useState<string>(defaultValue || PLACEHOLDERS[defaultLanguage] || "");

  const handleSave = () => {
    onSave?.(code, language);
  };

  const handleReset = () => {
    setCode(defaultValue || PLACEHOLDERS[language] || "");
    onReset?.();
  };

  return (
    <CodeEditorSheet>
      <CodeEditorSheetTrigger>{trigger}</CodeEditorSheetTrigger>
      <CodeEditorSheetContent>
        <CodeEditorSheetHeader
          title={title}
          description={description}
          language={language}
        />
        <CodeEditorSheetControls
          language={language}
          allowLanguageChange={allowLanguageChange}
          onLanguageChange={(newLang) => {
            setLanguage(newLang);
            if (!code || code === PLACEHOLDERS[language]) {
              setCode(PLACEHOLDERS[newLang]);
            }
          }}
          onReset={handleReset}
          onSave={handleSave}
        />
        <CodeEditor
          language={language}
          value={code}
          onChange={setCode}
          placeholder={placeholder}
        />
      </CodeEditorSheetContent>
    </CodeEditorSheet>
  );
}

export {
  CodeEditorSheet,
  CodeEditorSheetTrigger,
  CodeEditorSheetContent,
  CodeEditorSheetHeader,
  CodeEditorSheetControls,
  CodeEditor,
  CodeEditorSheetComposed,
};
