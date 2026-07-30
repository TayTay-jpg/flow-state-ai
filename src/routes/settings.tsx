import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Save } from "lucide-react";
import { toast } from "sonner";

import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Aurelia AI" },
      {
        name: "description",
        content:
          "Configure theme, notifications, language, AI response length, default email tone and accessibility options.",
      },
      { property: "og:title", content: "Settings — Aurelia AI" },
      { property: "og:description", content: "Personalise your Aurelia AI workspace preferences." },
    ],
  }),
  component: SettingsPage,
});

function Row({ label, hint, children }: { label: string; hint: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-4">
      <div className="min-w-0">
        <Label className="text-sm font-medium">{label}</Label>
        <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function SettingsPage() {
  const [theme, setTheme] = useState("pastel");
  const [language, setLanguage] = useState("en");
  const [responseLength, setResponseLength] = useState("medium");
  const [tone, setTone] = useState("formal");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [productUpdates, setProductUpdates] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  return (
    <AppLayout title="Settings" description="Tune Aurelia to the way your team works.">
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="rounded-2xl border-border/70 shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Appearance & language</CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-border/70 py-0">
            <Row label="Theme" hint="Pastel is the recommended Aurelia look.">
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pastel">Pastel</SelectItem>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </Row>
            <Row label="Language" hint="Interface and AI output language.">
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">Hindi</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                </SelectContent>
              </Select>
            </Row>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/70 shadow-card">
          <CardHeader>
            <CardTitle className="text-base">AI preferences</CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-border/70 py-0">
            <Row label="AI response length" hint="Default verbosity for generated content.">
              <Select value={responseLength} onValueChange={setResponseLength}>
                <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Short</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="detailed">Detailed</SelectItem>
                </SelectContent>
              </Select>
            </Row>
            <Row label="Default email tone" hint="Applied to every new email draft.">
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="persuasive">Persuasive</SelectItem>
                </SelectContent>
              </Select>
            </Row>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/70 shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Notifications</CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-border/70 py-0">
            <Row label="Task & deadline alerts" hint="Reminders for upcoming action items.">
              <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} />
            </Row>
            <Row label="Product updates" hint="Occasional emails about new AI features.">
              <Switch checked={productUpdates} onCheckedChange={setProductUpdates} />
            </Row>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/70 shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Accessibility</CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-border/70 py-0">
            <Row label="Reduced motion" hint="Minimise animations and transitions.">
              <Switch checked={reducedMotion} onCheckedChange={setReducedMotion} />
            </Row>
            <Row label="Larger text" hint="Increase base font size across the app.">
              <Switch checked={largeText} onCheckedChange={setLargeText} />
            </Row>
            <Row label="High contrast" hint="Stronger contrast for text and controls.">
              <Switch checked={highContrast} onCheckedChange={setHighContrast} />
            </Row>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-6" />
      <div className="flex justify-end">
        <Button className="rounded-xl" onClick={() => toast.success("Settings saved")}>
          <Save className="h-4 w-4" /> Save changes
        </Button>
      </div>
    </AppLayout>
  );
}