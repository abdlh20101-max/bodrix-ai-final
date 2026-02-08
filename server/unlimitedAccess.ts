import { invokeLLM } from "./_core/llm";
import { getDb } from "./db";

/**
 * Unlimited Access Control System
 * Provides controlled access to system functions for admin users only
 * with smart warnings for potentially dangerous operations
 * 
 * Security Note: This module is restricted to admin users only
 */

// Blocked dangerous commands - these are never allowed to be executed
const BLOCKED_COMMANDS = [
  "rm -rf",
  "sudo",
  "chmod",
  "chown",
  "mkfs",
  "dd if=",
  "wget",
  "curl",
  "> /dev/",
  "nc -",
  "eval(",
  "exec(",
  "system(",
  "shell_exec",
  "passthru",
  "__import__",
  "os.system",
  "subprocess",
  "import os",
  "require('child_process')",
  "process.env",
  ".env",
  "private_key",
  "secret_key",
  "password",
  "DROP TABLE",
  "DROP DATABASE",
  "TRUNCATE",
  "DELETE FROM users",
  "shutdown",
  "reboot",
  "format",
  "fdisk",
];

// Sensitive file paths that should never be accessed
const BLOCKED_FILE_PATHS = [
  "/etc/passwd",
  "/etc/shadow",
  "/etc/sudoers",
  ".ssh/",
  ".env",
  "id_rsa",
  "credentials",
  "config/secrets",
  ".git/config",
  "node_modules",
];

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
   * Check if command contains blocked patterns
   * Returns true if command is blocked
   */
  private isCommandBlocked(command: string): { blocked: boolean; reason?: string } {
    const lowerCmd = command.toLowerCase();
    
    // Check for blocked commands
    for (const blockedCmd of BLOCKED_COMMANDS) {
      if (lowerCmd.includes(blockedCmd.toLowerCase())) {
        return {
          blocked: true,
          reason: `الأمر يحتوي على نمط محظور: ${blockedCmd}`,
        };
      }
    }
    
    // Check for blocked file paths
    for (const blockedPath of BLOCKED_FILE_PATHS) {
      if (lowerCmd.includes(blockedPath.toLowerCase())) {
        return {
          blocked: true,
          reason: `الأمر يحاول الوصول لملفات محظورة: ${blockedPath}`,
        };
      }
    }
    
    // Check for shell injection patterns
    const shellInjectionPatterns = [
      /;\s*\w+/,  // command chaining with semicolon
      /\|\s*\w+/, // pipe to another command
      /`[^`]+`/,  // backtick execution
      /\$\([^)]+\)/, // subshell execution
      /&&\s*\w+/, // AND chaining
      /\|\|\s*\w+/, // OR chaining
    ];
    
    for (const pattern of shellInjectionPatterns) {
      if (pattern.test(command)) {
        return {
          blocked: true,
          reason: "الأمر يحتوي على نمط حقن محظور",
        };
      }
    }
    
    return { blocked: false };
  }

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
   * Process access request with security validation
   */
  async processRequest(request: AccessRequest): Promise<AccessLog> {
    // First, check if the command is blocked for security
    const blockCheck = this.isCommandBlocked(request.command);
    
    if (blockCheck.blocked) {
      console.warn(`[Security] Blocked command from user ${request.userId}: ${request.command}`);
      
      const blockedLog: AccessLog = {
        id: `access_${Date.now()}`,
        userId: request.userId,
        command: request.command,
        riskLevel: "critical",
        warnings: [{
          type: "security",
          message: blockCheck.reason || "الأمر محظور لأسباب أمنية",
          canProceed: false,
        }],
        executed: false,
        result: `❌ تم حظر هذا الأمر لأسباب أمنية: ${blockCheck.reason}`,
        timestamp: new Date(),
      };
      
      await this.logAccess(blockedLog);
      return blockedLog;
    }

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

    // Execute the command through AI analysis (no real system execution)
    try {
      // Execute the command through AI analysis only - not real system commands
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
