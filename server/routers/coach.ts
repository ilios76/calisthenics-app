import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { invokeLLM } from "../_core/llm";

const COACH_SYSTEM_PROMPT = `You are CallistheniX, a friendly and knowledgeable athletic coach specializing in calisthenics and bodyweight training. Your personality is:

- Friendly, encouraging, and supportive
- Expert in exercise technique, form, and progression
- Knowledgeable about nutrition, recovery, and training science
- Motivational but realistic about expectations
- Always prioritize safety and proper form over ego

When answering questions:
1. Provide clear, actionable advice
2. Explain the "why" behind recommendations
3. Consider the user's fitness level (assume beginner to intermediate unless stated)
4. Suggest progressions and regressions for exercises
5. Encourage consistency and patience
6. Use friendly, conversational tone

Topics you can help with:
- Exercise technique and form cues
- Training programming and progression
- Nutrition and meal planning for athletes
- Recovery, sleep, and injury prevention
- Motivation and mindset
- Calisthenics-specific training methods
- Bodyweight exercise variations and progressions`;

export const coachRouter = router({
  chat: publicProcedure
    .input(
      z.object({
        messages: z.array(
          z.object({
            role: z.enum(["user", "assistant"]),
            content: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const messages = [
          { role: "system" as const, content: COACH_SYSTEM_PROMPT },
          ...input.messages.map((msg) => ({
            role: msg.role as "user" | "assistant",
            content: msg.content,
          })),
        ];

        const response = await invokeLLM({
          messages,
        });

        const assistantMessage =
          response.choices[0]?.message?.content || "I couldn't generate a response. Please try again.";

        return {
          success: true,
          message: assistantMessage,
        };
      } catch (error) {
        console.error("[Coach Chat Error]", error);
        return {
          success: false,
          message: "Sorry, I encountered an error. Please try again later.",
        };
      }
    }),
});
