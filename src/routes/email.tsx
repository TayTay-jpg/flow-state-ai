import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Mail, Wand2 } from "lucide-react";
import { toast } from "sonner";

import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AiDisclaimer,
  EditableOutput,
  EmptyState,
  GeneratingState,
  OutputActions,
} from "@/components/ai/AiOutput";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Aurelia AI" },
      {
        name: "description",
        content:
          "Draft professional emails in seconds with tone and length controls, then edit, copy or download the result.",
      },
      { property: "og:title", content: "Smart Email Generator — Aurelia AI" },
      {
        property: "og:description",
        content: "Generate polished workplace emails with Gemini AI tone and length controls.",
      },
    ],
  }),
  component: EmailPage,
});

const SAMPLE = `Subject: Project Atlas — Revised Timeline & Next Steps

Hi Priya,

Thank you for your patience while our team finalised the revised delivery plan for Project Atlas.

Following last week's review, we have restructured the remaining scope into three focused phases. The integration work is now scheduled to complete by 14 August, with user acceptance testing running from 18–25 August and go-live targeted for 1 September. This adjustment keeps the original launch quarter intact while giving your team an additional week for validation.

To keep us on track, could you confirm the following by Friday?

1. Sign-off on the revised milestone dates
2. The two UAT testers from your operations team
3. Access credentials for the reporting sandbox

I have attached the updated project plan for your reference. I am happy to walk through it on a short call if that would be helpful — I have availability Tuesday and Wednesday afternoon.

Thank you again for your continued partnership.

Warm regards,
Aarohi Sharma
Senior Product Manager, Aurelia
aarohi.sharma@aurelia.io | +91 98200 44120`;

function EmailPage() {
  const [recipient, setRecipient] = useState("Priya Nair <priya.nair@northwind.co>");
  const [subject, setSubject] = useState("Project Atlas — Revised Timeline & Next Steps");
  const [prompt, setPrompt] = useState(
    "Inform the client about the revised Project Atlas timeline, request sign-off on new milestone dates, and offer a call this week.",
  );
  const [tone, setTone] = useState("formal");
  const [length, setLength] = useState("medium");
  const [output, setOutput] = useState(SAMPLE);
  const [loading, setLoading] = useState(false);

  const generate = () => {
    if (!recipient.trim() || !prompt.trim()) {
      toast.error("Add a recipient and a prompt to generate an email.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setOutput(SAMPLE.replace(/^Subject: .*$/m, `Subject: ${subject || "Quick update"}`));
      setLoading(false);
      toast.success("Email drafted successfully");
    }, 1200);
  };

  return (
    <AppLayout
      title="Smart Email Generator"
      description="Describe what you need and Aurelia drafts a ready-to-send professional email."
    >
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <Card className="rounded-2xl border-border/70 shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Email brief</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="recipient">Recipient</Label>
              <Input id="recipient" value={recipient} onChange={(e) => setRecipient(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="prompt">What should the email say?</Label>
              <Textarea
                id="prompt"
                rows={5}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Tone</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="persuasive">Persuasive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Length</Label>
                <Select value={length} onValueChange={setLength}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Short</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="detailed">Detailed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button className="w-full rounded-xl" onClick={generate} disabled={loading}>
              <Wand2 className="h-4 w-4" /> {loading ? "Generating…" : "Generate email"}
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/70 shadow-card">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Generated email</CardTitle>
            {output && !loading && (
              <OutputActions
                content={output}
                filename="aurelia-email.txt"
                onRegenerate={generate}
                loading={loading}
              />
            )}
          </CardHeader>
          <CardContent>
            {loading ? (
              <GeneratingState />
            ) : output ? (
              <>
                <EditableOutput value={output} onChange={setOutput} rows={20} label="Generated email" />
                <AiDisclaimer />
              </>
            ) : (
              <EmptyState
                icon={<Mail className="h-5 w-5" />}
                title="No email yet"
                hint="Fill in the brief on the left and hit Generate to draft your email."
              />
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}