/**
 * Feature System Tests
 * اختبارات نظام الميزات
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import featureRegistry from '@shared/utils/featureRegistry';
import { Feature } from '@shared/types/features';

describe('Feature Registry', () => {
  beforeEach(() => {
    featureRegistry.clear();
  });

  describe('Feature Registration', () => {
    it('should register a feature', () => {
      const feature: Feature = {
        id: 'test-feature',
        name: 'Test Feature',
        nameAr: 'ميزة اختبار',
        description: 'A test feature',
        descriptionAr: 'ميزة اختبار',
        category: 'analytics',
        status: 'active',
        icon: 'Test',
        enabled: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      featureRegistry.registerFeature(feature);
      const retrieved = featureRegistry.getFeature('test-feature');

      expect(retrieved).toBeDefined();
      expect(retrieved?.id).toBe('test-feature');
      expect(retrieved?.name).toBe('Test Feature');
    });

    it('should register multiple features', () => {
      const features: Feature[] = [
        {
          id: 'feature-1',
          name: 'Feature 1',
          nameAr: 'ميزة 1',
          description: 'Description 1',
          descriptionAr: 'الوصف 1',
          category: 'analytics',
          status: 'active',
          icon: 'Icon1',
          enabled: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'feature-2',
          name: 'Feature 2',
          nameAr: 'ميزة 2',
          description: 'Description 2',
          descriptionAr: 'الوصف 2',
          category: 'security',
          status: 'active',
          icon: 'Icon2',
          enabled: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      featureRegistry.registerFeatures(features);
      const all = featureRegistry.getAllFeatures();

      expect(all).toHaveLength(2);
      expect(all.map(f => f.id)).toContain('feature-1');
      expect(all.map(f => f.id)).toContain('feature-2');
    });

    it('should not register duplicate features', () => {
      const feature: Feature = {
        id: 'duplicate',
        name: 'Duplicate',
        nameAr: 'مكرر',
        description: 'Duplicate feature',
        descriptionAr: 'ميزة مكررة',
        category: 'analytics',
        status: 'active',
        icon: 'Dup',
        enabled: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      featureRegistry.registerFeature(feature);
      featureRegistry.registerFeature(feature);

      const all = featureRegistry.getAllFeatures();
      expect(all.filter(f => f.id === 'duplicate')).toHaveLength(1);
    });
  });

  describe('Feature Retrieval', () => {
    beforeEach(() => {
      const features: Feature[] = [
        {
          id: 'analytics-1',
          name: 'Analytics Dashboard',
          nameAr: 'لوحة التحليلات',
          description: 'Analytics dashboard',
          descriptionAr: 'لوحة التحليلات',
          category: 'analytics',
          status: 'active',
          icon: 'Chart',
          enabled: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'security-1',
          name: 'User Management',
          nameAr: 'إدارة المستخدمين',
          description: 'User management',
          descriptionAr: 'إدارة المستخدمين',
          category: 'security',
          status: 'active',
          icon: 'Users',
          enabled: false,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      featureRegistry.registerFeatures(features);
    });

    it('should get feature by ID', () => {
      const feature = featureRegistry.getFeature('analytics-1');
      expect(feature?.name).toBe('Analytics Dashboard');
    });

    it('should get all features', () => {
      const all = featureRegistry.getAllFeatures();
      expect(all).toHaveLength(2);
    });

    it('should get features by category', () => {
      const analytics = featureRegistry.getFeaturesByCategory('analytics');
      expect(analytics).toHaveLength(1);
      expect(analytics[0].id).toBe('analytics-1');

      const security = featureRegistry.getFeaturesByCategory('security');
      expect(security).toHaveLength(1);
      expect(security[0].id).toBe('security-1');
    });

    it('should get enabled features', () => {
      const enabled = featureRegistry.getEnabledFeatures();
      expect(enabled).toHaveLength(1);
      expect(enabled[0].id).toBe('analytics-1');
    });

    it('should get features by status', () => {
      const active = featureRegistry.getFeaturesByStatus('active');
      expect(active).toHaveLength(2);
    });
  });

  describe('Feature Control', () => {
    beforeEach(() => {
      const feature: Feature = {
        id: 'test-feature',
        name: 'Test Feature',
        nameAr: 'ميزة اختبار',
        description: 'Test',
        descriptionAr: 'اختبار',
        category: 'analytics',
        status: 'active',
        icon: 'Test',
        enabled: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      featureRegistry.registerFeature(feature);
    });

    it('should enable feature', () => {
      featureRegistry.disableFeature('test-feature');
      let feature = featureRegistry.getFeature('test-feature');
      expect(feature?.enabled).toBe(false);

      featureRegistry.enableFeature('test-feature');
      feature = featureRegistry.getFeature('test-feature');
      expect(feature?.enabled).toBe(true);
    });

    it('should disable feature', () => {
      featureRegistry.disableFeature('test-feature');
      const feature = featureRegistry.getFeature('test-feature');
      expect(feature?.enabled).toBe(false);
    });

    it('should check if feature is enabled', () => {
      expect(featureRegistry.isFeatureEnabled('test-feature')).toBe(true);
      featureRegistry.disableFeature('test-feature');
      expect(featureRegistry.isFeatureEnabled('test-feature')).toBe(false);
    });
  });

  describe('Permissions', () => {
    beforeEach(() => {
      const feature: Feature = {
        id: 'restricted-feature',
        name: 'Restricted Feature',
        nameAr: 'ميزة مقيدة',
        description: 'Restricted',
        descriptionAr: 'مقيد',
        category: 'security',
        status: 'active',
        icon: 'Lock',
        enabled: true,
        requiredPermissions: ['admin', 'manage_features'],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      featureRegistry.registerFeature(feature);
    });

    it('should check permissions', () => {
      const hasPermission = featureRegistry.hasPermission(
        'restricted-feature',
        ['admin', 'manage_features']
      );
      expect(hasPermission).toBe(true);
    });

    it('should deny permission when missing', () => {
      const hasPermission = featureRegistry.hasPermission(
        'restricted-feature',
        ['user']
      );
      expect(hasPermission).toBe(false);
    });

    it('should allow features without permissions', () => {
      const feature: Feature = {
        id: 'public-feature',
        name: 'Public Feature',
        nameAr: 'ميزة عامة',
        description: 'Public',
        descriptionAr: 'عام',
        category: 'analytics',
        status: 'active',
        icon: 'Globe',
        enabled: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      featureRegistry.registerFeature(feature);
      const hasPermission = featureRegistry.hasPermission('public-feature', []);
      expect(hasPermission).toBe(true);
    });
  });

  describe('Dependencies', () => {
    beforeEach(() => {
      const features: Feature[] = [
        {
          id: 'base-feature',
          name: 'Base Feature',
          nameAr: 'ميزة أساسية',
          description: 'Base',
          descriptionAr: 'أساسي',
          category: 'analytics',
          status: 'active',
          icon: 'Base',
          enabled: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'dependent-feature',
          name: 'Dependent Feature',
          nameAr: 'ميزة معتمدة',
          description: 'Dependent',
          descriptionAr: 'معتمد',
          category: 'analytics',
          status: 'active',
          icon: 'Dep',
          enabled: true,
          dependencies: ['base-feature'],
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      featureRegistry.registerFeatures(features);
    });

    it('should get feature dependencies', () => {
      const deps = featureRegistry.getDependencies('dependent-feature');
      expect(deps).toHaveLength(1);
      expect(deps[0].id).toBe('base-feature');
    });

    it('should check if dependencies are enabled', () => {
      const enabled = featureRegistry.areDependenciesEnabled('dependent-feature');
      expect(enabled).toBe(true);

      featureRegistry.disableFeature('base-feature');
      const disabled = featureRegistry.areDependenciesEnabled('dependent-feature');
      expect(disabled).toBe(false);
    });
  });

  describe('Configuration', () => {
    beforeEach(() => {
      const feature: Feature = {
        id: 'configurable-feature',
        name: 'Configurable Feature',
        nameAr: 'ميزة قابلة للتكوين',
        description: 'Config',
        descriptionAr: 'تكوين',
        category: 'settings',
        status: 'active',
        icon: 'Config',
        enabled: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      featureRegistry.registerFeature(feature);
    });

    it('should update feature config', () => {
      featureRegistry.updateFeatureConfig('configurable-feature', {
        enabled: true,
        settings: { theme: 'dark', language: 'ar' }
      });

      const config = featureRegistry.getFeatureConfig('configurable-feature');
      expect(config?.settings?.theme).toBe('dark');
      expect(config?.settings?.language).toBe('ar');
    });

    it('should get feature config', () => {
      featureRegistry.updateFeatureConfig('configurable-feature', {
        enabled: true,
        settings: { key: 'value' }
      });

      const config = featureRegistry.getFeatureConfig('configurable-feature');
      expect(config).toBeDefined();
      expect(config?.enabled).toBe(true);
    });
  });

  describe('Statistics', () => {
    beforeEach(() => {
      const features: Feature[] = [
        {
          id: 'f1',
          name: 'Feature 1',
          nameAr: 'ميزة 1',
          description: 'F1',
          descriptionAr: 'ف1',
          category: 'analytics',
          status: 'active',
          icon: 'F1',
          enabled: true,
          beta: false,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'f2',
          name: 'Feature 2',
          nameAr: 'ميزة 2',
          description: 'F2',
          descriptionAr: 'ف2',
          category: 'security',
          status: 'active',
          icon: 'F2',
          enabled: false,
          beta: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'f3',
          name: 'Feature 3',
          nameAr: 'ميزة 3',
          description: 'F3',
          descriptionAr: 'ف3',
          category: 'analytics',
          status: 'active',
          icon: 'F3',
          enabled: true,
          beta: false,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      featureRegistry.registerFeatures(features);
    });

    it('should get registry stats', () => {
      const stats = featureRegistry.getStats();
      expect(stats.total).toBe(3);
      expect(stats.enabled).toBe(2);
      expect(stats.disabled).toBe(1);
      expect(stats.beta).toBe(1);
      expect(stats.byCategory.analytics).toBe(2);
      expect(stats.byCategory.security).toBe(1);
    });
  });

  describe('Clear and Reset', () => {
    it('should clear registry', () => {
      const feature: Feature = {
        id: 'test',
        name: 'Test',
        nameAr: 'اختبار',
        description: 'Test',
        descriptionAr: 'اختبار',
        category: 'analytics',
        status: 'active',
        icon: 'T',
        enabled: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      featureRegistry.registerFeature(feature);
      expect(featureRegistry.getAllFeatures()).toHaveLength(1);

      featureRegistry.clear();
      expect(featureRegistry.getAllFeatures()).toHaveLength(0);
    });
  });
});
