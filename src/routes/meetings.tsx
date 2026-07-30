import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { NotebookPen, Upload, Wand2 } from "lucide-react";
import { toast } from "sonner";

import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AiDisclaimer,
  EditableOutput,
  EmptyState,
  GeneratingState,
  OutputActions,
} from "@/components/ai/AiOutput";
import { summarizeNotes } from "@/lib/ai.functions";

export const Route = createFileRoute("/meetings")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — Aurelia AI" },
      {
        name: "description",
        content:
          "Turn raw meeting notes into a clean summary with key decisions, action items, deadlines and participants.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer — Aurelia AI" },
      {
        property: "og:description",
        content: "Summaries, decisions, action items and deadlines from any meeting notes.",
      },
    ],
  }),
  component: MeetingsPage,
});

function MeetingsPage() {
  const [notes, setNotes] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const runSummarize = useServerFn(summarizeNotes);

  const generate = async () => {
    if (!notes.trim()) {
      toast.error("Paste or upload your meeting notes first.");
      return;
    }
    setLoading(true);
    try {
      const { text } = await runSummarize({ data: { notes } });
      setOutput(text.trim());
      toast.success("Summary generated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Couldn't summarize those notes.");
    } finally {
      setLoading(false);
    }
  };

  const onUpload = (file?: File) => {
    if (!file) return;
    file
      .text()
      .then((text) => {
        setNotes(text);
        toast.success(`${file.name} loaded`);
      })
      .catch(() => toast.error("Couldn't read that file"));
  };

  return (
    <AppLayout
      title="Meeting Notes Summarizer"
      description="Paste or upload raw notes and get a structured, shareable recap."
    >
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <Card className="rounded-2xl border-border/70 shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Meeting notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="notes">Paste your notes</Label>
              <Textarea
                id="notes"
                rows={16}
                placeholder="Paste your raw meeting notes here — attendees, discussion points, decisions and dates."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="rounded-xl"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="secondary" className="rounded-xl">
                <label className="cursor-pointer">
                  <Upload className="h-4 w-4" /> Upload .txt
                  <input
                    type="file"
                    accept=".txt,.md"
                    className="sr-only"
                    onChange={(e) => onUpload(e.target.files?.[0])}
                  />
                </label>
              </Button>
              <Button className="flex-1 rounded-xl" onClick={generate} disabled={loading}>
                <Wand2 className="h-4 w-4" /> {loading ? "Summarizing…" : "Generate summary"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/70 shadow-card">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">AI summary</CardTitle>
            {output && !loading && (
              <OutputActions
                content={output}
                filename="meeting-summary.txt"
                onRegenerate={generate}
                loading={loading}
              />
            )}
          </CardHeader>
          <CardContent>
            {loading ? (
              <GeneratingState message="Extracting decisions, action items and deadlines…" />
            ) : output ? (
              <>
                <EditableOutput value={output} onChange={setOutput} rows={26} label="Meeting summary" />
                <AiDisclaimer />
              </>
            ) : (
              <EmptyState
                icon={<NotebookPen className="h-5 w-5" />}
                title="No summary yet"
                hint="Add your meeting notes and generate a structured recap."
              />
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}