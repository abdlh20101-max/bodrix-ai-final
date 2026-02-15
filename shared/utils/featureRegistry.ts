/**
 * Feature Registry
 * سجل الميزات - إدارة جميع الميزات المتاحة
 */

import { Feature, FeatureCategory, FeatureConfig, FeatureRegistry } from '../types/features';

class FeatureRegistryManager {
  private registry: FeatureRegistry = {
    features: new Map(),
    configs: new Map(),
    categories: ['analytics', 'security', 'payments', 'communications', 'automation', 'users', 'marketing', 'settings', 'integrations', 'design']
  };

  /**
   * Register a new feature
   * تسجيل ميزة جديدة
   */
  registerFeature(feature: Feature): void {
    if (this.registry.features.has(feature.id)) {
      console.warn(`Feature ${feature.id} already registered`);
      return;
    }
    this.registry.features.set(feature.id, feature);
  }

  /**
   * Register multiple features
   * تسجيل عدة ميزات
   */
  registerFeatures(features: Feature[]): void {
    features.forEach(feature => this.registerFeature(feature));
  }

  /**
   * Get feature by ID
   * الحصول على ميزة بواسطة المعرف
   */
  getFeature(featureId: string): Feature | undefined {
    return this.registry.features.get(featureId);
  }

  /**
   * Get all features
   * الحصول على جميع الميزات
   */
  getAllFeatures(): Feature[] {
    return Array.from(this.registry.features.values());
  }

  /**
   * Get features by category
   * الحصول على الميزات حسب الفئة
   */
  getFeaturesByCategory(category: FeatureCategory): Feature[] {
    return Array.from(this.registry.features.values()).filter(
      feature => feature.category === category
    );
  }

  /**
   * Get enabled features
   * الحصول على الميزات المفعلة
   */
  getEnabledFeatures(): Feature[] {
    return Array.from(this.registry.features.values()).filter(
      feature => feature.enabled
    );
  }

  /**
   * Get features by status
   * الحصول على الميزات حسب الحالة
   */
  getFeaturesByStatus(status: string): Feature[] {
    return Array.from(this.registry.features.values()).filter(
      feature => feature.status === status
    );
  }

  /**
   * Enable feature
   * تفعيل ميزة
   */
  enableFeature(featureId: string): boolean {
    const feature = this.registry.features.get(featureId);
    if (!feature) return false;
    
    feature.enabled = true;
    feature.updatedAt = new Date();
    
    // Update config
    const config = this.registry.configs.get(featureId) || {
      id: featureId,
      enabled: true
    };
    config.enabled = true;
    this.registry.configs.set(featureId, config);
    
    return true;
  }

  /**
   * Disable feature
   * تعطيل ميزة
   */
  disableFeature(featureId: string): boolean {
    const feature = this.registry.features.get(featureId);
    if (!feature) return false;
    
    feature.enabled = false;
    feature.updatedAt = new Date();
    
    // Update config
    const config = this.registry.configs.get(featureId) || {
      id: featureId,
      enabled: false
    };
    config.enabled = false;
    this.registry.configs.set(featureId, config);
    
    return true;
  }

  /**
   * Check if feature is enabled
   * التحقق من تفعيل الميزة
   */
  isFeatureEnabled(featureId: string): boolean {
    const feature = this.registry.features.get(featureId);
    return feature?.enabled ?? false;
  }

  /**
   * Check if user has permission for feature
   * التحقق من صلاحيات المستخدم
   */
  hasPermission(featureId: string, userPermissions: string[]): boolean {
    const feature = this.registry.features.get(featureId);
    if (!feature || !feature.requiredPermissions) return true;
    
    return feature.requiredPermissions.every(perm =>
      userPermissions.includes(perm)
    );
  }

  /**
   * Get feature dependencies
   * الحصول على تبعيات الميزة
   */
  getDependencies(featureId: string): Feature[] {
    const feature = this.registry.features.get(featureId);
    if (!feature || !feature.dependencies) return [];
    
    return feature.dependencies
      .map(depId => this.registry.features.get(depId))
      .filter((f): f is Feature => f !== undefined);
  }

  /**
   * Check if all dependencies are enabled
   * التحقق من تفعيل جميع التبعيات
   */
  areDependenciesEnabled(featureId: string): boolean {
    const dependencies = this.getDependencies(featureId);
    return dependencies.every(dep => dep.enabled);
  }

  /**
   * Get feature config
   * الحصول على إعدادات الميزة
   */
  getFeatureConfig(featureId: string): FeatureConfig | undefined {
    return this.registry.configs.get(featureId);
  }

  /**
   * Update feature config
   * تحديث إعدادات الميزة
   */
  updateFeatureConfig(featureId: string, config: Partial<FeatureConfig>): void {
    const existing = this.registry.configs.get(featureId) || {
      id: featureId,
      enabled: true
    };
    
    this.registry.configs.set(featureId, {
      ...existing,
      ...config
    });
  }

  /**
   * Get all categories
   * الحصول على جميع الفئات
   */
  getCategories(): FeatureCategory[] {
    return this.registry.categories;
  }

  /**
   * Get registry stats
   * الحصول على إحصائيات السجل
   */
  getStats() {
    const allFeatures = this.getAllFeatures();
    return {
      total: allFeatures.length,
      enabled: allFeatures.filter(f => f.enabled).length,
      disabled: allFeatures.filter(f => !f.enabled).length,
      beta: allFeatures.filter(f => f.beta).length,
      byCategory: this.registry.categories.reduce((acc, cat) => {
        acc[cat] = this.getFeaturesByCategory(cat).length;
        return acc;
      }, {} as Record<FeatureCategory, number>)
    };
  }

  /**
   * Clear registry
   * مسح السجل
   */
  clear(): void {
    this.registry.features.clear();
    this.registry.configs.clear();
  }
}

// Singleton instance
export const featureRegistry = new FeatureRegistryManager();

export default featureRegistry;
