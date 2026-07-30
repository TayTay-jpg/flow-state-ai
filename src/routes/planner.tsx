import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ListChecks, Plus, Trash2, Wand2 } from "lucide-react";
import { toast } from "sonner";

import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
import { planTasks } from "@/lib/ai.functions";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — Aurelia AI" },
      {
        name: "description",
        content:
          "Turn a task list into a realistic daily or weekly schedule with priorities, focus blocks and buffers.",
      },
      { property: "og:title", content: "AI Task Planner — Aurelia AI" },
      {
        property: "og:description",
        content: "Generate a realistic productivity schedule from your tasks and priorities.",
      },
    ],
  }),
  component: PlannerPage,
});

type Task = { id: number; title: string; priority: "High" | "Medium" | "Low" };

function PlannerPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Task["priority"]>("High");
  const [range, setRange] = useState("daily");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const runPlan = useServerFn(planTasks);

  const addTask = () => {
    if (!title.trim()) {
      toast.error("Enter a task before adding it.");
      return;
    }
    setTasks((t) => [...t, { id: Date.now(), title: title.trim(), priority }]);
    setTitle("");
    toast.success("Task added");
  };

  const generate = async () => {
    if (tasks.length === 0) {
      toast.error("Add at least one task to build a schedule.");
      return;
    }
    setLoading(true);
    try {
      const { text } = await runPlan({
        data: { tasks: tasks.map((t) => ({ title: t.title, priority: t.priority })), range },
      });
      setOutput(text.trim());
      toast.success("Schedule generated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Couldn't build a schedule.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout
      title="AI Task Planner"
      description="Add your tasks, pick a horizon and let Aurelia build a realistic schedule."
    >
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <Card className="rounded-2xl border-border/70 shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Your tasks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="task">Task</Label>
              <Input
                id="task"
                placeholder="e.g. Prepare board deck"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTask()}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Priority</Label>
                <Select value={priority} onValueChange={(v) => setPriority(v as Task["priority"])}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Schedule</Label>
                <Select value={range} onValueChange={setRange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button variant="secondary" className="w-full rounded-xl" onClick={addTask}>
              <Plus className="h-4 w-4" /> Add task
            </Button>

            <div className="space-y-2">
              {tasks.length === 0 ? (
                <EmptyState
                  icon={<ListChecks className="h-5 w-5" />}
                  title="No tasks yet"
                  hint="Add a few tasks to generate your schedule."
                />
              ) : (
                tasks.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between gap-2 rounded-xl border border-border/70 bg-card px-3 py-2 transition-colors hover:bg-muted/50"
                  >
                    <span className="min-w-0 truncate text-sm">{t.title}</span>
                    <span className="flex shrink-0 items-center gap-2">
                      <Badge
                        variant={t.priority === "High" ? "default" : "secondary"}
                        className="rounded-full"
                      >
                        {t.priority}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setTasks((list) => list.filter((x) => x.id !== t.id))}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove task</span>
                      </Button>
                    </span>
                  </div>
                ))
              )}
            </div>

            <Button className="w-full rounded-xl" onClick={generate} disabled={loading}>
              <Wand2 className="h-4 w-4" /> {loading ? "Planning…" : "Generate schedule"}
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/70 shadow-card">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Your schedule</CardTitle>
            {output && !loading && (
              <OutputActions
                content={output}
                filename="aurelia-schedule.txt"
                onRegenerate={generate}
                loading={loading}
              />
            )}
          </CardHeader>
          <CardContent>
            {loading ? (
              <GeneratingState message="Balancing priorities and focus blocks…" />
            ) : output ? (
              <>
                <EditableOutput value={output} onChange={setOutput} rows={24} label="Schedule" />
                <AiDisclaimer />
              </>
            ) : (
              <EmptyState
                icon={<ListChecks className="h-5 w-5" />}
                title="No schedule yet"
                hint="Generate a plan once you've added your tasks."
              />
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}