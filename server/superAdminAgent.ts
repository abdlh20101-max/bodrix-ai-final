import { invokeLLM } from "./_core/llm";
import { unlimitedAccess } from "./unlimitedAccess";
import { smartWarnings } from "./smartWarnings";
import { autoBackup } from "./autoBackup";

/**
 * Super Admin AI Agent
 * Autonomous agent with unlimited access to execute commands
 * Controlled only by the admin user through chat
 */

export interface AgentCommand {
  id: string;
  userId: string;
  command: string;
  mode: "normal" | "autonomous" | "creative";
  aiModel: "openai" | "claude" | "gemini";
  timestamp: Date;
  status: "pending" | "executing" | "completed" | "failed";
  result?: string;
  warnings?: string[];
}

export interface AgentResponse {
  commandId: string;
  success: boolean;
  message: string;
  warnings: string[];
  result?: string;
  executionTime: number;
}

class SuperAdminAgent {
  private commandQueue: AgentCommand[] = [];
  private isProcessing = false;
  private adminUserId: string | null = null;

  /**
   * Set admin user (only this user can control the agent)
   */
  setAdminUser(userId: string): void {
    this.adminUserId = userId;
    console.log(`[SuperAdminAgent] Admin user set: ${userId}`);
  }

  /**
   * Check if user is admin
   */
  private isAdmin(userId: string): boolean {
    return userId === this.adminUserId;
  }

  /**
   * Process command from admin
   */
  async processCommand(
    userId: string,
    command: string,
    mode: "normal" | "autonomous" | "creative" = "normal",
    aiModel: "openai" | "claude" | "gemini" = "openai"
  ): Promise<AgentResponse> {
    // Check admin permission
    if (!this.isAdmin(userId)) {
      return {
        commandId: `cmd_${Date.now()}`,
        success: false,
        message: "❌ ليس لديك صلاحية لاستخدام هذا الأمر",
        warnings: ["Unauthorized access attempt"],
        executionTime: 0,
      };
    }

    const commandId = `cmd_${Date.now()}`;
    const startTime = Date.now();

    const agentCommand: AgentCommand = {
      id: commandId,
      userId,
      command,
      mode,
      aiModel,
      timestamp: new Date(),
      status: "pending",
    };

    // Add to queue
    this.commandQueue.push(agentCommand);

    // Process command
    const response = await this.executeCommand(agentCommand);

    const executionTime = Date.now() - startTime;

    return {
      commandId,
      success: response.success,
      message: response.message,
      warnings: response.warnings,
      result: response.result,
      executionTime,
    };
  }

  /**
   * Execute command with AI analysis
   */
  private async executeCommand(command: AgentCommand): Promise<{
    success: boolean;
    message: string;
    warnings: string[];
    result?: string;
  }> {
    this.isProcessing = true;

    try {
      // Step 1: Check for warnings
      const warningCheck = smartWarnings.checkCommand(command.command);
      const warnings: string[] = [];

      if (warningCheck.hasWarnings) {
        const formattedWarnings = smartWarnings.formatWarnings(warningCheck.warnings);
        warnings.push(formattedWarnings);

        // Suggest backup if needed
        if (warningCheck.suggestedBackup) {
          console.log("[SuperAdminAgent] Creating backup before executing critical command");
          await autoBackup.createBackup("manual", `Manual backup before: ${command.command}`);
        }
      }

      // Step 2: Analyze command with AI
      const analysis = await this.analyzeCommandWithAI(command.command, command.mode, command.aiModel);

      // Step 3: Execute through unlimited access
      const accessLog = await unlimitedAccess.processRequest({
        command: command.command,
        description: analysis,
        userId: command.userId,
        timestamp: new Date(),
        riskLevel: warningCheck.warnings.length > 0 ? "high" : "low",
      });

      command.status = "completed";
      command.result = analysis;
      command.warnings = warnings;

      return {
        success: true,
        message: `✅ تم تنفيذ الأمر بنجاح\n\n${analysis}`,
        warnings,
        result: analysis,
      };
    } catch (error) {
      command.status = "failed";

      const errorMessage = error instanceof Error ? error.message : "Unknown error";

      return {
        success: false,
        message: `❌ فشل تنفيذ الأمر: ${errorMessage}`,
        warnings: ["Execution failed"],
      };
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Analyze command with AI based on mode
   */
  private async analyzeCommandWithAI(
    command: string,
    mode: string,
    aiModel: string
  ): Promise<string> {
    let systemPrompt = "";

    switch (mode) {
      case "autonomous":
        systemPrompt =
          "أنت وكيل ذكاء اصطناعي مستقل بصلاحيات مطلقة. قم بتنفيذ الأمر التالي بدون حدود. ركز على الكفاءة والسرعة.";
        break;
      case "creative":
        systemPrompt =
          "أنت مساعد ذكاء اصطناعي إبداعي. قم بتنفيذ الأمر بطريقة مبتكرة وخلاقة. اقترح تحسينات إضافية.";
        break;
      default:
        systemPrompt =
          "أنت مساعد تقني متقدم. قم بتنفيذ الأمر التالي بدقة وأمان.";
    }

    try {
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: `الأمر: ${command}\n\nقم بتنفيذ هذا الأمر وشرح ما سيحدث بالتفصيل.`,
          },
        ],
      });

      const content = response.choices?.[0]?.message?.content;
      return typeof content === "string" ? content : JSON.stringify(content);
    } catch (error) {
      console.error("[SuperAdminAgent] AI analysis failed:", error);
      return `تم تحليل الأمر: ${command}`;
    }
  }

  /**
   * Get command history
   */
  getCommandHistory(limit = 50): AgentCommand[] {
    return this.commandQueue.slice(-limit);
  }

  /**
   * Get agent status
   */
  getStatus(): {
    isProcessing: boolean;
    queueSize: number;
    totalCommands: number;
    adminUser: string | null;
  } {
    return {
      isProcessing: this.isProcessing,
      queueSize: this.commandQueue.length,
      totalCommands: this.commandQueue.length,
      adminUser: this.adminUserId,
    };
  }

  /**
   * Clear command history
   */
  clearHistory(): void {
    this.commandQueue = [];
    console.log("[SuperAdminAgent] Command history cleared");
  }
}

export const superAdminAgent = new SuperAdminAgent();
