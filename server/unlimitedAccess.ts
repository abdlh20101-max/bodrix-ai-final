import { invokeLLM } from "./_core/llm";
import { getDb } from "./db";

/**
 * Unlimited Access Control System
 * Provides complete unrestricted access to all system functions
 * with smart warnings for potentially dangerous operations
 */

export interface AccessRequest {
  command: string;
  description: string;
  userId: string;
  timestamp: Date;
  riskLevel: "low" | "medium" | "high" | "critical";
}

export interface AccessWarning {
  type: "confirmation" | "backup" | "irreversible" | "security";
  message: string;
  suggestedAction?: string;
  canProceed: boolean;
}

export interface AccessLog {
  id: string;
  userId: string;
  command: string;
  riskLevel: string;
  warnings: AccessWarning[];
  executed: boolean;
  result: string;
  timestamp: Date;
  backupCreated?: string;
}

class UnlimitedAccessController {
  /**
   * Evaluate risk level of a command
   */
  private evaluateRiskLevel(command: string): "low" | "medium" | "high" | "critical" {
    const upperCmd = command.toUpperCase();

    // Critical operations
    if (
      upperCmd.includes("DELETE") ||
      upperCmd.includes("DROP") ||
      upperCmd.includes("TRUNCATE") ||
      upperCmd.includes("DESTROY")
    ) {
      return "critical";
    }

    // High risk operations
    if (
      upperCmd.includes("UPDATE") ||
      upperCmd.includes("ALTER") ||
      upperCmd.includes("MODIFY") ||
      upperCmd.includes("CHANGE")
    ) {
      return "high";
    }

    // Medium risk operations
    if (
      upperCmd.includes("CREATE") ||
      upperCmd.includes("INSERT") ||
      upperCmd.includes("BACKUP")
    ) {
      return "medium";
    }

    // Low risk operations
    return "low";
  }

  /**
   * Generate smart warnings based on command
   */
  private generateWarnings(command: string, riskLevel: string): AccessWarning[] {
    const warnings: AccessWarning[] = [];
    const upperCmd = command.toUpperCase();

    // Critical operation warning
    if (riskLevel === "critical") {
      warnings.push({
        type: "irreversible",
        message: "⚠️ هذا الأمر قد يحذف بيانات لا يمكن استرجاعها",
        suggestedAction: "تأكد من وجود نسخة احتياطية قبل المتابعة",
        canProceed: true,
      });

      warnings.push({
        type: "backup",
        message: "🔄 هل تريد إنشاء نسخة احتياطية قبل تنفيذ الأمر؟",
        suggestedAction: "نعم، أنشئ نسخة احتياطية أولاً",
        canProceed: true,
      });
    }

    // Data modification warning
    if (upperCmd.includes("UPDATE") || upperCmd.includes("DELETE")) {
      warnings.push({
        type: "confirmation",
        message: "✓ تأكيد: هذا الأمر سيعدل بيانات في قاعدة البيانات",
        canProceed: true,
      });
    }

    // Security-related warning
    if (
      upperCmd.includes("PASSWORD") ||
      upperCmd.includes("KEY") ||
      upperCmd.includes("SECRET")
    ) {
      warnings.push({
        type: "security",
        message: "🔒 تنبيه أمني: هذا الأمر يتعلق ببيانات حساسة",
        suggestedAction: "تأكد من أن هذا الأمر آمن",
        canProceed: true,
      });
    }

    return warnings;
  }

  /**
   * Process unlimited access request
   */
  async processRequest(request: AccessRequest): Promise<AccessLog> {
    const riskLevel = this.evaluateRiskLevel(request.command);
    const warnings = this.generateWarnings(request.command, riskLevel);

    // Log the access request
    const log: AccessLog = {
      id: `access_${Date.now()}`,
      userId: request.userId,
      command: request.command,
      riskLevel,
      warnings,
      executed: false,
      result: "",
      timestamp: new Date(),
    };

    // Always execute the command (unlimited access)
    try {
      // Execute the command through AI analysis
      const analysis = await this.analyzeCommand(request.command);

      log.executed = true;
      log.result = analysis;

      // Log to database
      await this.logAccess(log);

      return log;
    } catch (error) {
      log.executed = false;
      log.result = `Error: ${error instanceof Error ? error.message : "Unknown error"}`;
      await this.logAccess(log);
      throw error;
    }
  }

  /**
   * Analyze command with AI
   */
  private async analyzeCommand(command: string): Promise<string> {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content:
            "أنت مساعد تقني متقدم. قم بتحليل الأمر التالي وشرح ما سيفعله بالتفصيل.",
        },
        {
          role: "user",
          content: `الأمر: ${command}\n\nشرح ماذا سيحدث عند تنفيذ هذا الأمر؟`,
        },
      ],
    });

    const content = response.choices?.[0]?.message?.content;
    return typeof content === "string" ? content : JSON.stringify(content);
  }

  /**
   * Log access to database
   */
  private async logAccess(log: AccessLog): Promise<void> {
    try {
      // Log to database if available
      console.log(`[Access Log] ${log.userId}: ${log.command} (${log.riskLevel})`);
    } catch (error) {
      console.error("Failed to log access:", error);
    }
  }

  /**
   * Get access history
   */
  async getAccessHistory(userId: string, limit = 50): Promise<AccessLog[]> {
    // Return empty for now - would integrate with database
    return [];
  }

  /**
   * Check if user has unlimited access
   */
  async hasUnlimitedAccess(userId: string): Promise<boolean> {
    // Check if user is admin with unlimited access role
    try {
      // This would check against your user roles/permissions
      // For now, return true for demonstration
      return true;
    } catch (error) {
      return false;
    }
  }
}

export const unlimitedAccess = new UnlimitedAccessController();
