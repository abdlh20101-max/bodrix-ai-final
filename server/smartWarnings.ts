/**
 * Smart Warning System
 * Provides intelligent warnings for potentially dangerous operations
 * while still allowing execution (unlimited access)
 */

export interface WarningRule {
  pattern: RegExp;
  severity: "info" | "warning" | "critical";
  message: string;
  suggestedAction?: string;
  requiresConfirmation: boolean;
}

export interface WarningResponse {
  hasWarnings: boolean;
  warnings: WarningRule[];
  canProceed: boolean;
  suggestedBackup: boolean;
}

class SmartWarningSystem {
  private warningRules: WarningRule[] = [
    // Database deletion warnings
    {
      pattern: /DELETE\s+FROM|DROP\s+TABLE|TRUNCATE\s+TABLE/i,
      severity: "critical",
      message: "⚠️ تحذير حرج: هذا الأمر سيحذف بيانات من قاعدة البيانات",
      suggestedAction: "تأكد من وجود نسخة احتياطية قبل المتابعة",
      requiresConfirmation: true,
    },
    // Database structure changes
    {
      pattern: /ALTER\s+TABLE|DROP\s+COLUMN|MODIFY\s+COLUMN/i,
      severity: "critical",
      message: "⚠️ تحذير حرج: هذا الأمر سيغير بنية قاعدة البيانات",
      suggestedAction: "قد تفقد البيانات الموجودة",
      requiresConfirmation: true,
    },
    // File system operations
    {
      pattern: /rm\s+-rf|DELETE.*\*/i,
      severity: "critical",
      message: "⚠️ تحذير حرج: هذا الأمر سيحذف ملفات من النظام",
      suggestedAction: "تأكد من المسار قبل المتابعة",
      requiresConfirmation: true,
    },
    // User data modifications
    {
      pattern: /UPDATE.*users|UPDATE.*passwords|UPDATE.*tokens/i,
      severity: "critical",
      message: "🔒 تحذير أمني: هذا الأمر سيعدل بيانات المستخدمين الحساسة",
      suggestedAction: "تأكد من الأمان قبل المتابعة",
      requiresConfirmation: true,
    },
    // System configuration changes
    {
      pattern: /UPDATE.*config|UPDATE.*settings|UPDATE.*env/i,
      severity: "warning",
      message: "⚙️ تحذير: هذا الأمر سيغير إعدادات النظام",
      suggestedAction: "قد يؤثر على أداء الموقع",
      requiresConfirmation: true,
    },
    // Large batch operations
    {
      pattern: /UPDATE.*WHERE\s+1=1|DELETE.*WHERE\s+1=1/i,
      severity: "critical",
      message: "⚠️ تحذير حرج: هذا الأمر سيؤثر على جميع السجلات",
      suggestedAction: "تأكد من أنك تريد هذا الإجراء",
      requiresConfirmation: true,
    },
  ];

  /**
   * Check command for warnings
   */
  checkCommand(command: string): WarningResponse {
    const warnings: WarningRule[] = [];
    let maxSeverity: "info" | "warning" | "critical" = "info";

    for (const rule of this.warningRules) {
      if (rule.pattern.test(command)) {
        warnings.push(rule);

        // Update max severity
        if (rule.severity === "critical") {
          maxSeverity = "critical";
        } else if (rule.severity === "warning" && maxSeverity !== "critical") {
          maxSeverity = "warning";
        }
      }
    }

    return {
      hasWarnings: warnings.length > 0,
      warnings,
      canProceed: true, // Always allow (unlimited access)
      suggestedBackup: maxSeverity === "critical",
    };
  }

  /**
   * Format warnings for display
   */
  formatWarnings(warnings: WarningRule[]): string {
    let formatted = "";

    for (const warning of warnings) {
      const icon =
        warning.severity === "critical"
          ? "🔴"
          : warning.severity === "warning"
            ? "🟡"
            : "🔵";

      formatted += `${icon} ${warning.message}\n`;

      if (warning.suggestedAction) {
        formatted += `   💡 ${warning.suggestedAction}\n`;
      }
    }

    return formatted;
  }

  /**
   * Get backup recommendation
   */
  getBackupRecommendation(command: string): boolean {
    const response = this.checkCommand(command);
    return response.suggestedBackup;
  }

  /**
   * Analyze command safety
   */
  analyzeSafety(command: string): {
    isSafe: boolean;
    riskLevel: "low" | "medium" | "high" | "critical";
    recommendations: string[];
  } {
    const response = this.checkCommand(command);

    let riskLevel: "low" | "medium" | "high" | "critical" = "low";
    const recommendations: string[] = [];

    if (response.warnings.length === 0) {
      riskLevel = "low";
      recommendations.push("✅ هذا الأمر آمن نسبياً");
    } else {
      // Determine risk level from warnings
      const hasCritical = response.warnings.some((w) => w.severity === "critical");
      const hasWarning = response.warnings.some((w) => w.severity === "warning");

      if (hasCritical) {
        riskLevel = "critical";
        recommendations.push("🔴 خطر حرج: تأكد من النسخة الاحتياطية");
        recommendations.push("🔴 قد تفقد بيانات مهمة");
      } else if (hasWarning) {
        riskLevel = "high";
        recommendations.push("🟡 خطر عالي: تابع بحذر");
      } else {
        riskLevel = "medium";
        recommendations.push("🟠 خطر متوسط: تأكد من الأمر");
      }

      // Add specific recommendations
      for (const warning of response.warnings) {
        if (warning.suggestedAction) {
          recommendations.push(`💡 ${warning.suggestedAction}`);
        }
      }
    }

    return {
      isSafe: riskLevel === "low",
      riskLevel,
      recommendations,
    };
  }
}

export const smartWarnings = new SmartWarningSystem();
