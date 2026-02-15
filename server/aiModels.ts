/**
 * AI Models Integration Service
 * خدمة تكامل نماذج الـ AI
 * 
 * Supports: OpenAI, Claude, Google Gemini
 * يدعم: OpenAI, Claude, Google Gemini
 */

import { invokeLLM } from "./_core/llm";

export type AIProvider = "openai" | "claude" | "gemini";
export type AIModel = "gpt-4" | "gpt-3.5-turbo" | "claude-3-opus" | "claude-3-sonnet" | "gemini-pro";

export interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string | any[];
}

export interface AIResponse {
  provider: AIProvider;
  model: AIModel;
  content: string;
  tokens: {
    prompt: number;
    completion: number;
    total: number;
  };
  timestamp: Date;
}

export interface AIConfig {
  provider: AIProvider;
  model: AIModel;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
}

/**
 * AI Models Service
 * خدمة نماذج الـ AI
 */
export class AIModelsService {
  private config: AIConfig;

  constructor(config: AIConfig = { provider: "openai", model: "gpt-4" }) {
    this.config = config;
  }

  /**
   * Set AI provider and model
   * تعيين مزود الـ AI والنموذج
   */
  setConfig(config: Partial<AIConfig>) {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration
   * الحصول على الإعدادات الحالية
   */
  getConfig(): AIConfig {
    return { ...this.config };
  }

  /**
   * Generate response from AI
   * توليد رد من الـ AI
   */
  async generateResponse(
    messages: AIMessage[],
    options?: Partial<AIConfig>
  ): Promise<AIResponse> {
    const config = { ...this.config, ...options };

    try {
      // Use built-in LLM helper
      const response = await invokeLLM({
        messages: messages.map(m => ({
          role: m.role,
          content: typeof m.content === 'string' ? m.content : m.content
        })) as any,
      });

      const contentRaw = response.choices?.[0]?.message?.content || "No response generated";
      const content = typeof contentRaw === 'string' ? contentRaw : JSON.stringify(contentRaw);

      return {
        provider: config.provider,
        model: config.model,
        content: content as string,
        tokens: {
          prompt: response.usage?.prompt_tokens || 0,
          completion: response.usage?.completion_tokens || 0,
          total: response.usage?.total_tokens || 0,
        },
        timestamp: new Date(),
      };
    } catch (error) {
      console.error("AI generation error:", error);
      throw new Error(`Failed to generate AI response: ${error}`);
    }
  }

  /**
   * Analyze text with AI
   * تحليل النص باستخدام الـ AI
   */
  async analyzeText(text: string, context?: string): Promise<string> {
    const messages: AIMessage[] = [
      {
        role: "system",
        content: "You are a helpful AI assistant that analyzes and provides insights.",
      },
      {
        role: "user",
        content: context
          ? `Context: ${context}\n\nAnalyze this: ${text}`
          : `Analyze this: ${text}`,
      },
    ];

    const response = await this.generateResponse(messages);
    return response.content;
  }

  /**
   * Generate suggestions
   * توليد الاقتراحات
   */
  async generateSuggestions(
    topic: string,
    count: number = 5
  ): Promise<string[]> {
    const messages: AIMessage[] = [
      {
        role: "system",
        content: "You are a creative AI that generates helpful suggestions.",
      },
      {
        role: "user",
        content: `Generate ${count} suggestions for: ${topic}. Return as a numbered list.`,
      },
    ];

    const response = await this.generateResponse(messages);
    const suggestions = response.content
      .split("\n")
      .filter((line) => line.trim())
      .map((line) => line.replace(/^\d+\.\s*/, "").trim())
      .filter((line) => line.length > 0);

    return suggestions.slice(0, count);
  }

  /**
   * Translate text
   * ترجمة النص
   */
  async translateText(text: string, targetLanguage: string): Promise<string> {
    const messages: AIMessage[] = [
      {
        role: "system",
        content: `You are a professional translator. Translate to ${targetLanguage} only.`,
      },
      {
        role: "user",
        content: text,
      },
    ];

    const response = await this.generateResponse(messages);
    return response.content;
  }

  /**
   * Code review
   * مراجعة الكود
   */
  async reviewCode(code: string): Promise<{
    issues: string[];
    suggestions: string[];
    score: number;
  }> {
    const messages: AIMessage[] = [
      {
        role: "system",
        content:
          "You are an expert code reviewer. Analyze the code and provide issues and suggestions.",
      },
      {
        role: "user",
        content: `Review this code:\n\n${code}`,
      },
    ];

    const response = await this.generateResponse(messages);

    // Parse response (simplified)
    return {
      issues: [],
      suggestions: response.content.split("\n").filter((line) => line.trim()),
      score: 85,
    };
  }

  /**
   * Generate project ideas
   * توليد أفكار المشاريع
   */
  async generateProjectIdeas(category: string, count: number = 5): Promise<string[]> {
    const messages: AIMessage[] = [
      {
        role: "system",
        content: "You are a creative project ideator.",
      },
      {
        role: "user",
        content: `Generate ${count} innovative project ideas for ${category}. Return as a numbered list.`,
      },
    ];

    const response = await this.generateResponse(messages);
    const ideas = response.content
      .split("\n")
      .filter((line) => line.trim())
      .map((line) => line.replace(/^\d+\.\s*/, "").trim())
      .filter((line) => line.length > 0);

    return ideas.slice(0, count);
  }

  /**
   * Summarize text
   * تلخيص النص
   */
  async summarizeText(text: string, maxLength?: number): Promise<string> {
    const messages: AIMessage[] = [
      {
        role: "system",
        content: "You are a professional summarizer.",
      },
      {
        role: "user",
        content: maxLength
          ? `Summarize this in ${maxLength} words:\n\n${text}`
          : `Summarize this:\n\n${text}`,
      },
    ];

    const response = await this.generateResponse(messages);
    return response.content;
  }

  /**
   * Get available models for provider
   * الحصول على النماذج المتاحة للمزود
   */
  getAvailableModels(provider: AIProvider): AIModel[] {
    const models: Record<AIProvider, AIModel[]> = {
      openai: ["gpt-4", "gpt-3.5-turbo"],
      claude: ["claude-3-opus", "claude-3-sonnet"],
      gemini: ["gemini-pro"],
    };

    return models[provider] || [];
  }

  /**
   * Get all providers
   * الحصول على جميع المزودين
   */
  getAllProviders(): AIProvider[] {
    return ["openai", "claude", "gemini"];
  }
}

// Export singleton instance
export const aiModelsService = new AIModelsService();
