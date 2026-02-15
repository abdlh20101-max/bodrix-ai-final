/**
 * Feature Flags
 * أعلام الميزات - التحكم في تفعيل/تعطيل الميزات
 */

import featureRegistry from '@shared/utils/featureRegistry';

interface FeatureFlagContext {
  userId?: string;
  userRole?: string;
  userPermissions?: string[];
  environment?: 'development' | 'staging' | 'production';
  customAttributes?: Record<string, any>;
}

class FeatureFlagsManager {
  private context: FeatureFlagContext = {};
  private overrides = new Map<string, boolean>();
  private listeners = new Map<string, Set<(enabled: boolean) => void>>();

  /**
   * Initialize feature flags
   * تهيئة أعلام الميزات
   */
  initialize(context: FeatureFlagContext): void {
    this.context = context;
  }

  /**
   * Check if feature is enabled
   * التحقق من تفعيل الميزة
   */
  isEnabled(featureId: string): boolean {
    // Check override first
    if (this.overrides.has(featureId)) {
      return this.overrides.get(featureId)!;
    }

    // Check registry
    const feature = featureRegistry.getFeature(featureId);
    if (!feature) return false;

    // Check if enabled in registry
    if (!feature.enabled) return false;

    // Check permissions
    if (feature.requiredPermissions && this.context.userPermissions) {
      const hasPermission = feature.requiredPermissions.every(perm =>
        this.context.userPermissions!.includes(perm)
      );
      if (!hasPermission) return false;
    }

    // Check beta flag
    if (feature.beta && this.context.environment === 'production') {
      return false;
    }

    return true;
  }

  /**
   * Set feature flag override
   * تعيين تجاوز علم الميزة
   */
  setOverride(featureId: string, enabled: boolean): void {
    this.overrides.set(featureId, enabled);
    this.notifyListeners(featureId, enabled);
  }

  /**
   * Remove feature flag override
   * إزالة تجاوز علم الميزة
   */
  removeOverride(featureId: string): void {
    this.overrides.delete(featureId);
    const enabled = this.isEnabled(featureId);
    this.notifyListeners(featureId, enabled);
  }

  /**
   * Get all overrides
   * الحصول على جميع التجاوزات
   */
  getOverrides(): Record<string, boolean> {
    return Object.fromEntries(this.overrides);
  }

  /**
   * Clear all overrides
   * مسح جميع التجاوزات
   */
  clearOverrides(): void {
    this.overrides.clear();
  }

  /**
   * Subscribe to feature flag changes
   * الاشتراك في تغييرات أعلام الميزات
   */
  subscribe(featureId: string, callback: (enabled: boolean) => void): () => void {
    if (!this.listeners.has(featureId)) {
      this.listeners.set(featureId, new Set());
    }
    
    this.listeners.get(featureId)!.add(callback);

    // Return unsubscribe function
    return () => {
      this.listeners.get(featureId)?.delete(callback);
    };
  }

  /**
   * Notify listeners of changes
   * إخطار المستمعين بالتغييرات
   */
  private notifyListeners(featureId: string, enabled: boolean): void {
    const callbacks = this.listeners.get(featureId);
    if (callbacks) {
      callbacks.forEach(callback => callback(enabled));
    }
  }

  /**
   * Get feature status
   * الحصول على حالة الميزة
   */
  getStatus(featureId: string) {
    const feature = featureRegistry.getFeature(featureId);
    return {
      id: featureId,
      enabled: this.isEnabled(featureId),
      registryEnabled: feature?.enabled ?? false,
      overridden: this.overrides.has(featureId),
      override: this.overrides.get(featureId),
      beta: feature?.beta ?? false,
      status: feature?.status,
      permissions: feature?.requiredPermissions
    };
  }

  /**
   * Get all feature statuses
   * الحصول على حالات جميع الميزات
   */
  getAllStatuses() {
    return featureRegistry.getAllFeatures().map(feature =>
      this.getStatus(feature.id)
    );
  }

  /**
   * Bulk set overrides
   * تعيين تجاوزات جماعية
   */
  bulkSetOverrides(overrides: Record<string, boolean>): void {
    Object.entries(overrides).forEach(([featureId, enabled]) => {
      this.setOverride(featureId, enabled);
    });
  }

  /**
   * Export flags configuration
   * تصدير إعدادات الأعلام
   */
  export(): Record<string, any> {
    return {
      context: this.context,
      overrides: Object.fromEntries(this.overrides),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Import flags configuration
   * استيراد إعدادات الأعلام
   */
  import(config: Record<string, any>): void {
    if (config.context) {
      this.context = config.context;
    }
    if (config.overrides) {
      this.overrides = new Map(Object.entries(config.overrides));
    }
  }
}

// Singleton instance
export const featureFlags = new FeatureFlagsManager();

export default featureFlags;
