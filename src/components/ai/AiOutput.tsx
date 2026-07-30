import { Copy, Download, RefreshCcw } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function download(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
  toast.success("Download started");
}

export async function copyText(content: string) {
  try {
    await navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard");
  } catch {
    toast.error("Couldn't copy — please copy manually");
  }
}

export function OutputActions({
  content,
  filename,
  onRegenerate,
  loading,
}: {
  content: string;
  filename: string;
  onRegenerate: () => void;
  loading?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="secondary" size="sm" onClick={() => copyText(content)}>
        <Copy className="h-4 w-4" /> Copy
      </Button>
      <Button variant="secondary" size="sm" onClick={() => download(filename, content)}>
        <Download className="h-4 w-4" /> Download
      </Button>
      <Button variant="outline" size="sm" onClick={onRegenerate} disabled={loading}>
        <RefreshCcw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Regenerate
      </Button>
    </div>
  );
}

export function EditableOutput({
  value,
  onChange,
  rows = 14,
  label = "AI output",
}: {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  label?: string;
}) {
  return (
    <Textarea
      aria-label={label}
      value={value}
      rows={rows}
      onChange={(e) => onChange(e.target.value)}
      className="resize-y rounded-xl bg-card font-medium leading-relaxed"
    />
  );
}

export function GeneratingState({ message = "Gemini is drafting your content…" }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-muted/40 py-14 text-center">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

export function EmptyState({ icon, title, hint }: { icon: React.ReactNode; title: string; hint: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/30 py-14 text-center">
      <span className="grid h-11 w-11 place-items-center rounded-full bg-accent text-accent-foreground">
        {icon}
      </span>
      <p className="text-sm font-medium">{title}</p>
      <p className="max-w-sm text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

export function AiDisclaimer() {
  return (
    <p className="mt-3 text-xs text-muted-foreground">
      AI-generated content may contain mistakes. Please review before use.
    </p>
  );
}