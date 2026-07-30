import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
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

const SAMPLE_NOTES = `Q3 Roadmap Review — 12 July, 10:00–11:05 IST
Present: Aarohi Sharma (PM), Dev Menon (Eng Lead), Priya Nair (Client Success), Rohan Gupta (Design), Lisa Fernandes (QA), Sam Okoye (Data)

- Dev reported the payments integration is 80% complete; sandbox reconciliation bug still open.
- Rohan showed the new onboarding flow; team agreed to drop the third tutorial step, it hurts completion.
- Priya flagged that Northwind wants UAT extended by one week; they only have two testers available.
- Lisa said the regression suite takes 4 hours and is blocking daily releases; proposes parallelising.
- Sam requested event tracking on the new onboarding before launch, otherwise no funnel data.
- Budget: no extra headcount this quarter. Contractor for QA automation approved for 6 weeks.
- Agreed launch stays in Q3 but shifts from 25 Aug to 1 Sep.`;

const SAMPLE_SUMMARY = `SUMMARY
The team reviewed Q3 delivery status and agreed to shift the Project Atlas launch from 25 August to 1 September to accommodate an extended UAT window requested by Northwind. Engineering is 80% complete on payments integration, design simplified the onboarding flow, and QA raised release-blocking regression times. A six-week QA automation contractor was approved; no additional headcount otherwise.

KEY DECISIONS
1. Launch date moved from 25 August to 1 September (still within Q3).
2. Onboarding tutorial reduced from three steps to two to improve completion.
3. UAT extended by one week for Northwind with two client testers.
4. QA automation contractor approved for six weeks; no new permanent headcount.
5. Regression suite to be parallelised before daily releases resume.

ACTION ITEMS
- Dev Menon — Close the sandbox reconciliation bug and complete payments integration.
- Rohan Gupta — Ship updated two-step onboarding designs to engineering.
- Sam Okoye — Add event tracking to the onboarding funnel before launch.
- Lisa Fernandes — Draft the parallelised regression plan and onboard the QA contractor.
- Priya Nair — Confirm Northwind's two UAT testers and share sandbox credentials.
- Aarohi Sharma — Circulate the revised project plan and milestone sign-off request.

DEADLINES
- 19 July — Sandbox reconciliation bug fixed; onboarding designs delivered.
- 26 July — Event tracking live in staging; QA contractor onboarded.
- 14 August — Integration work complete.
- 18–25 August — User acceptance testing.
- 1 September — Go-live.

PARTICIPANTS
Aarohi Sharma (Product Manager), Dev Menon (Engineering Lead), Priya Nair (Client Success), Rohan Gupta (Design), Lisa Fernandes (QA), Sam Okoye (Data).`;

function MeetingsPage() {
  const [notes, setNotes] = useState(SAMPLE_NOTES);
  const [output, setOutput] = useState(SAMPLE_SUMMARY);
  const [loading, setLoading] = useState(false);

  const generate = () => {
    if (!notes.trim()) {
      toast.error("Paste or upload your meeting notes first.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setOutput(SAMPLE_SUMMARY);
      setLoading(false);
      toast.success("Summary generated");
    }, 1400);
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