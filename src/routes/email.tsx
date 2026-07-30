import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
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
import { generateEmail } from "@/lib/ai.functions";

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

function EmailPage() {
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [prompt, setPrompt] = useState("");
  const [tone, setTone] = useState("formal");
  const [length, setLength] = useState("medium");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const runGenerate = useServerFn(generateEmail);

  const generate = async () => {
    if (!recipient.trim() || !prompt.trim()) {
      toast.error("Add a recipient and a prompt to generate an email.");
      return;
    }
    setLoading(true);
    try {
      const { text } = await runGenerate({ data: { recipient, subject, prompt, tone, length } });
      setOutput(text.trim());
      toast.success("Email drafted successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Couldn't generate the email.");
    } finally {
      setLoading(false);
    }
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
              <Input
                id="recipient"
                placeholder="e.g. Client team <team@company.com>"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="Optional — AI will suggest one"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="prompt">What should the email say?</Label>
              <Textarea
                id="prompt"
                rows={5}
                placeholder="e.g. Ask the client to confirm the revised timeline and offer a call this week."
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