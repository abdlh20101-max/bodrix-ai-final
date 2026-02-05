/**
 * Feature System Types
 * نظام أنواع الميزات
 */

export type FeatureCategory = 
  | 'analytics'
  | 'security'
  | 'payments'
  | 'communications'
  | 'automation'
  | 'users'
  | 'marketing'
  | 'settings'
  | 'integrations'
  | 'design';

export type FeatureStatus = 'active' | 'inactive' | 'beta' | 'deprecated' | 'coming_soon';

export interface Feature {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  category: FeatureCategory;
  status: FeatureStatus;
  icon: string;
  component?: React.ComponentType<any>;
  enabled: boolean;
  beta?: boolean;
  requiredPermissions?: string[];
  dependencies?: string[];
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface FeatureConfig {
  id: string;
  enabled: boolean;
  settings?: Record<string, any>;
  permissions?: string[];
}

export interface FeatureRegistry {
  features: Map<string, Feature>;
  configs: Map<string, FeatureConfig>;
  categories: FeatureCategory[];
}

export interface FeatureLoadResult {
  success: boolean;
  feature?: Feature;
  error?: string;
  warnings?: string[];
}

export interface FeatureToggleEvent {
  featureId: string;
  enabled: boolean;
  timestamp: Date;
  userId: string;
  reason?: string;
}

export interface FeatureAnalytics {
  featureId: string;
  usageCount: number;
  lastUsed: Date;
  errorCount: number;
  averageLoadTime: number;
  userCount: number;
}
