import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const EmailInput = z.object({
  recipient: z.string(),
  subject: z.string(),
  prompt: z.string().min(1),
  tone: z.string(),
  length: z.string(),
});

const NotesInput = z.object({ notes: z.string().min(1) });

const PlanInput = z.object({
  tasks: z.array(z.object({ title: z.string(), priority: z.string() })).min(1),
  range: z.string(),
});

async function runPrompt(system: string, prompt: string) {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("AI is not configured yet. Please try again later.");

  const [{ streamText }, { createLovableAiGatewayProvider }] = await Promise.all([
    import("ai"),
    import("./ai-gateway.server"),
  ]);

  const gateway = createLovableAiGatewayProvider(key);
  try {
    const result = streamText({
      model: gateway("openai/gpt-5.6-sol"),
      system,
      prompt,
      providerOptions: { lovable: { reasoningEffort: "none" } },
    });
    return { text: await result.text };
  } catch (error) {
    const status =
      (error as { statusCode?: number }).statusCode ?? (error as { status?: number }).status;
    if (status === 429) throw new Error("Rate limit reached — please retry in a moment.");
    if (status === 402) throw new Error("AI credits exhausted. Please add credits to continue.");
    throw new Error("The AI request failed. Please try again.");
  }
}

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => EmailInput.parse(input))
  .handler(async ({ data }) =>
    runPrompt(
      "You are a professional workplace email writer. Return only the email itself, starting with a 'Subject:' line, then the body. Use a neutral sign-off such as 'Best regards,' followed by [Your Name] — never invent a real person's name, company or contact details. Plain text only.",
      `Write a ${data.length} length, ${data.tone} email.\nRecipient: ${data.recipient || "the recipient"}\nSubject hint: ${data.subject || "(choose a suitable subject)"}\nWhat the email should say: ${data.prompt}`,
    ),
  );

export const summarizeNotes = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => NotesInput.parse(input))
  .handler(async ({ data }) =>
    runPrompt(
      "You summarize meeting notes. Return plain text with these uppercase sections in order: SUMMARY, KEY DECISIONS, ACTION ITEMS, DEADLINES, PARTICIPANTS. Only use information present in the notes; write 'Not specified' when a section has no content. No markdown.",
      `Summarize these meeting notes:\n\n${data.notes}`,
    ),
  );

export const planTasks = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => PlanInput.parse(input))
  .handler(async ({ data }) =>
    runPrompt(
      "You are a productivity planner. Build a realistic schedule in plain text with time blocks, breaks and buffers, ordered by priority. End with a short capacity line. No markdown.",
      `Create a ${data.range} schedule for these tasks:\n${data.tasks
        .map((t) => `- ${t.title} (${t.priority} priority)`)
        .join("\n")}`,
    ),
  );