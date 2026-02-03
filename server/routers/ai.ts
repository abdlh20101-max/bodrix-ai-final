import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { invokeLLM } from "../_core/llm";
import { addMessage } from "../db";

export const aiRouter = router({
  // Chat with AI
  chat: protectedProcedure
    .input(
      z.object({
        content: z.string().min(1).max(5000),
        language: z.enum(["ar", "en"]).default("ar"),
        conversationHistory: z.array(
          z.object({
            role: z.enum(["user", "assistant", "system"]),
            content: z.string(),
          })
        ).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Save user message
      await addMessage({
        userId: ctx.user.id,
        content: input.content,
        role: "user",
        language: input.language,
      });

      // Build system prompt
      const systemPrompt = input.language === "ar"
        ? `أنت Bodrix AI، مساعد ذكي متقدم. 
        - تقدم إجابات دقيقة وسريعة
        - تدعم العربية والإنجليزية
        - تساعد في حل المشاكل والإجابة على الأسئلة
        - تكون احترافياً وودياً
        - تقدم حلولاً عملية`
        : `You are Bodrix AI, an advanced intelligent assistant.
        - Provide accurate and quick answers
        - Support Arabic and English
        - Help solve problems and answer questions
        - Be professional and friendly
        - Provide practical solutions`;

      // Build messages for LLM
      const messages: Array<{ role: string; content: string }> = [
        { role: "system", content: systemPrompt },
        ...(input.conversationHistory || []),
        { role: "user", content: input.content },
      ];

      try {
        // Call LLM
        const response = await invokeLLM({
          messages: messages as any,
        });

        const aiResponseContent = response.choices?.[0]?.message?.content;
        const aiResponse = typeof aiResponseContent === 'string' 
          ? aiResponseContent 
          : "عذراً، حدث خطأ في الرد.";

        // Save AI response
        await addMessage({
          userId: ctx.user.id,
          content: aiResponse,
          role: "assistant",
          language: input.language,
        });

        return {
          success: true,
          response: aiResponse,
          language: input.language,
        };
      } catch (error) {
        console.error("LLM Error:", error);
        throw new Error("Failed to get AI response");
      }
    }),

  // Generate marketing content
  generateMarketingContent: protectedProcedure
    .input(
      z.object({
        type: z.enum(["ad", "seo_keywords", "social_post", "email"]),
        topic: z.string().min(1).max(500),
        language: z.enum(["ar", "en"]).default("ar"),
        tone: z.enum(["professional", "casual", "creative"]).default("professional"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Only developers can generate marketing content
      if (ctx.user.accountType !== "developer") {
        throw new Error("Only developers can generate marketing content");
      }

      const prompts = {
        ad: input.language === "ar"
          ? `اكتب إعلان جذاب وقصير عن: ${input.topic}. بأسلوب ${input.tone}. الحد الأقصى 150 كلمة.`
          : `Write an attractive short ad about: ${input.topic}. In a ${input.tone} tone. Max 150 words.`,
        seo_keywords: input.language === "ar"
          ? `اكتب 10 كلمات مفتاحية SEO عن: ${input.topic}. بصيغة JSON مع وصف قصير لكل كلمة.`
          : `Write 10 SEO keywords about: ${input.topic}. In JSON format with a short description for each.`,
        social_post: input.language === "ar"
          ? `اكتب منشور وسائط اجتماعية جذاب عن: ${input.topic}. بأسلوب ${input.tone}. أضف emojis مناسبة.`
          : `Write an engaging social media post about: ${input.topic}. In a ${input.tone} tone. Add appropriate emojis.`,
        email: input.language === "ar"
          ? `اكتب بريد إلكتروني تسويقي عن: ${input.topic}. بأسلوب ${input.tone}. مع subject line وcall to action واضح.`
          : `Write a marketing email about: ${input.topic}. In a ${input.tone} tone. Include subject line and clear CTA.`,
      };

      try {
        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: input.language === "ar"
                ? "أنت خبير تسويق متقدم. اكتب محتوى تسويقي عالي الجودة وجذاب."
                : "You are an advanced marketing expert. Write high-quality and engaging marketing content.",
            },
            {
              role: "user",
              content: prompts[input.type],
            },
          ],
        });

        const contentData = response.choices?.[0]?.message?.content;
        const content = typeof contentData === 'string' ? contentData : "";

        return {
          success: true,
          type: input.type,
          content,
          language: input.language,
        };
      } catch (error) {
        console.error("Marketing Generation Error:", error);
        throw new Error("Failed to generate marketing content");
      }
    }),

  // Analyze and improve text
  improveText: protectedProcedure
    .input(
      z.object({
        text: z.string().min(1).max(2000),
        language: z.enum(["ar", "en"]),
        style: z.enum(["professional", "casual", "creative", "academic"]).default("professional"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const prompt = input.language === "ar"
        ? `حسّن هذا النص بأسلوب ${input.style}: "${input.text}". قدم النص المحسّن فقط بدون شرح.`
        : `Improve this text in a ${input.style} style: "${input.text}". Provide only the improved text without explanation.`;

      try {
        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: input.language === "ar"
                ? "أنت محرر نصوص متقدم. حسّن النصوص بدون تغيير المعنى الأساسي."
                : "You are an advanced text editor. Improve texts without changing the core meaning.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
        });

        const improvedTextData = response.choices?.[0]?.message?.content;
        const improvedText = typeof improvedTextData === 'string' ? improvedTextData : input.text;

        return {
          success: true,
          originalText: input.text,
          improvedText,
          language: input.language,
        };
      } catch (error) {
        console.error("Text Improvement Error:", error);
        throw new Error("Failed to improve text");
      }
    }),
});
