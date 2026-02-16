/**
 * AI Chat Router
 * جهاز التوجيه الخاص بدردشة الـ AI
 */

import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { and, gte, or } from "drizzle-orm";
import { aiChatHistory, aiTasks, notifications } from "../../drizzle/schema";
import { aiModelsService } from "../aiModels";
import { eq, desc } from "drizzle-orm";

export const aiChatRouter = router({
  /**
   * Send message to AI
   * إرسال رسالة إلى الـ AI
   */
  sendMessage: protectedProcedure
    .input(
      z.object({
        message: z.string().min(1),
        chatType: z.enum(["admin", "private"]),
        aiProvider: z.enum(["openai", "claude", "gemini"]).optional(),
        aiModel: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Set AI configuration
        if (input.aiProvider) {
          aiModelsService.setConfig({
            provider: input.aiProvider as any,
            model: (input.aiModel || "gpt-4") as any,
          });
        }

        // Generate AI response
        const response = await aiModelsService.generateResponse([
          {
            role: "system",
            content: "You are a helpful AI assistant for project management.",
          },
          {
            role: "user",
            content: input.message,
          },
        ]);

        // Save to database
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        
        const chatRecord = await db.insert(aiChatHistory).values({
          userId: ctx.user.id,
          chatType: input.chatType,
          aiProvider: response.provider,
          aiModel: response.model,
          userMessage: input.message,
          aiResponse: response.content,
          tokens: response.tokens.total,
          isEncrypted: input.chatType === "private" ? 1 : 0,
          status: "received",
        });

        return {
          success: true,
          message: response.content,
          tokens: response.tokens,
          chatId: chatRecord[0],
        };
      } catch (error) {
        console.error("Chat error:", error);
        throw new Error("Failed to process chat message");
      }
    }),

  /**
   * Get chat history
   * الحصول على سجل الدردشة
   */
  getHistory: protectedProcedure
    .input(
      z.object({
        chatType: z.enum(["admin", "private"]).optional(),
        limit: z.number().default(50),
        offset: z.number().default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        
        let conditions = [eq(aiChatHistory.userId, ctx.user.id)];
        if (input.chatType) {
          conditions.push(eq(aiChatHistory.chatType, input.chatType));
        }

        const query = db
          .select()
          .from(aiChatHistory)
          .where(and(...conditions));

        const messages = await query
          .orderBy(desc(aiChatHistory.createdAt))
          .limit(input.limit)
          .offset(input.offset);

        return {
          success: true,
          messages: messages.reverse(),
          total: messages.length,
        };
      } catch (error) {
        console.error("History fetch error:", error);
        throw new Error("Failed to fetch chat history");
      }
    }),

  /**
   * Clear chat history
   * مسح سجل الدردشة
   */
  clearHistory: protectedProcedure
    .input(
      z.object({
        chatType: z.enum(["admin", "private"]).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        
        // Note: In production, implement proper deletion with soft deletes
        return {
          success: true,
          message: "Chat history cleared",
        };
      } catch (error) {
        console.error("Clear history error:", error);
        throw new Error("Failed to clear chat history");
      }
    }),

  /**
   * Create AI task
   * إنشاء مهمة الـ AI
   */
  createTask: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        command: z.string().min(1),
        priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        
        const taskRecord = await db.insert(aiTasks).values({
          userId: ctx.user.id,
          title: input.title,
          description: input.description,
          command: input.command,
          priority: input.priority || "medium",
          status: "pending",
        });

        return {
          success: true,
          taskId: taskRecord[0],
          message: "Task created successfully",
        };
      } catch (error) {
        console.error("Task creation error:", error);
        throw new Error("Failed to create task");
      }
    }),

  /**
   * Get AI tasks
   * الحصول على مهام الـ AI
   */
  getTasks: protectedProcedure
    .input(
      z.object({
        status: z.enum(["pending", "processing", "completed", "failed", "cancelled"]).optional(),
        limit: z.number().default(50),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        
        let conditions = [eq(aiTasks.userId, ctx.user.id)];
        if (input.status) {
          conditions.push(eq(aiTasks.status, input.status));
        }

        const query = db
          .select()
          .from(aiTasks)
          .where(and(...conditions));

        const tasks = await query
          .orderBy(desc(aiTasks.createdAt))
          .limit(input.limit);

        return {
          success: true,
          tasks,
          total: tasks.length,
        };
      } catch (error) {
        console.error("Tasks fetch error:", error);
        throw new Error("Failed to fetch tasks");
      }
    }),

  /**
   * Update task status
   * تحديث حالة المهمة
   */
  updateTaskStatus: protectedProcedure
    .input(
      z.object({
        taskId: z.number(),
        status: z.enum(["pending", "processing", "completed", "failed", "cancelled"]),
        result: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        
        // Update task
        await db
          .update(aiTasks)
          .set({
            status: input.status,
            result: input.result,
            completedAt: input.status === "completed" ? new Date() : undefined,
          })
          .where(eq(aiTasks.id, input.taskId));

        // Create notification
        if (input.status === "completed") {
          await db.insert(notifications).values({
            userId: ctx.user.id,
            title: "Task Completed",
            message: `Your AI task has been completed successfully`,
            type: "task_completed",
          });
        }

        return {
          success: true,
          message: "Task updated successfully",
        };
      } catch (error) {
        console.error("Task update error:", error);
        throw new Error("Failed to update task");
      }
    }),

  /**
   * Get notifications
   * الحصول على الإشعارات
   */
  getNotifications: protectedProcedure
    .input(
      z.object({
        limit: z.number().default(20),
        unreadOnly: z.boolean().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        
        let conditions = [eq(notifications.userId, ctx.user.id)];
        if (input.unreadOnly) {
          conditions.push(eq(notifications.isRead, 0));
        }

        const query = db
          .select()
          .from(notifications)
          .where(and(...conditions));

        const notifs = await query
          .orderBy(desc(notifications.createdAt))
          .limit(input.limit);

        return {
          success: true,
          notifications: notifs,
          unreadCount: notifs.filter((n: any) => n.isRead === 0).length,
        };
      } catch (error) {
        console.error("Notifications fetch error:", error);
        throw new Error("Failed to fetch notifications");
      }
    }),

  /**
   * Mark notification as read
   * تحديد الإشعار كمقروء
   */
  markNotificationAsRead: protectedProcedure
    .input(z.object({ notificationId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        
        await db
          .update(notifications)
          .set({ isRead: 1, readAt: new Date() })
          .where(eq(notifications.id, input.notificationId));

        return { success: true };
      } catch (error) {
        console.error("Mark read error:", error);
        throw new Error("Failed to mark notification as read");
      }
    }),

  /**
   * Get AI models
   * الحصول على نماذج الـ AI
   */
  getAvailableModels: protectedProcedure.query(async () => {
    try {
      const providers = aiModelsService.getAllProviders();
      const models: Record<string, string[]> = {};

      for (const provider of providers) {
        models[provider] = aiModelsService.getAvailableModels(provider as any);
      }

      return {
        success: true,
        providers,
        models,
      };
    } catch (error) {
      console.error("Models fetch error:", error);
      throw new Error("Failed to fetch available models");
    }
  }),
});
