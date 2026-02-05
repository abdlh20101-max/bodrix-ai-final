/**
 * useFeatures Hook
 * خطاف الميزات - دمج نظام الميزات مع React
 */

import { useEffect, useState, useCallback } from 'react';
import { Feature } from '@shared/types/features';
import featureRegistry from '@shared/utils/featureRegistry';
import { loadFeature, loadFeatures } from '@/lib/featureLoader';
import { featureFlags } from '@/lib/featureFlags';

/**
 * Hook to check if feature is enabled
 * خطاف للتحقق من تفعيل الميزة
 */
export function useFeatureEnabled(featureId: string): boolean {
  const [enabled, setEnabled] = useState(() => featureFlags.isEnabled(featureId));

  useEffect(() => {
    const unsubscribe = featureFlags.subscribe(featureId, setEnabled);
    return unsubscribe;
  }, [featureId]);

  return enabled;
}

/**
 * Hook to get feature
 * خطاف للحصول على الميزة
 */
export function useFeature(featureId: string): Feature | undefined {
  const [feature, setFeature] = useState<Feature | undefined>(() =>
    featureRegistry.getFeature(featureId)
  );

  useEffect(() => {
    const feature = featureRegistry.getFeature(featureId);
    setFeature(feature);
  }, [featureId]);

  return feature;
}

/**
 * Hook to load feature component
 * خطاف لتحميل مكون الميزة
 */
export function useLoadFeature(featureId: string) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [component, setComponent] = useState<React.ComponentType<any> | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    loadFeature(featureId).then(result => {
      if (result.success) {
        const loaded = require('@/lib/featureLoader').getLoadedFeature(featureId);
        setComponent(loaded?.component || null);
      } else {
        setError(result.error || 'Failed to load feature');
      }
      setLoading(false);
    });
  }, [featureId]);

  return { loading, error, component };
}

/**
 * Hook to get features by category
 * خطاف للحصول على الميزات حسب الفئة
 */
export function useFeaturesByCategory(category: string): Feature[] {
  const [features, setFeatures] = useState<Feature[]>(() =>
    featureRegistry.getFeaturesByCategory(category as any)
  );

  useEffect(() => {
    const features = featureRegistry.getFeaturesByCategory(category as any);
    setFeatures(features);
  }, [category]);

  return features;
}

/**
 * Hook to get enabled features
 * خطاف للحصول على الميزات المفعلة
 */
export function useEnabledFeatures(): Feature[] {
  const [features, setFeatures] = useState<Feature[]>(() =>
    featureRegistry.getEnabledFeatures()
  );

  useEffect(() => {
    const features = featureRegistry.getEnabledFeatures();
    setFeatures(features);
  }, []);

  return features;
}

/**
 * Hook to toggle feature
 * خطاف لتبديل الميزة
 */
export function useToggleFeature(featureId: string) {
  const enabled = useFeatureEnabled(featureId);

  const toggle = useCallback(() => {
    if (enabled) {
      featureRegistry.disableFeature(featureId);
      featureFlags.setOverride(featureId, false);
    } else {
      featureRegistry.enableFeature(featureId);
      featureFlags.setOverride(featureId, true);
    }
  }, [featureId, enabled]);

  return { enabled, toggle };
}

/**
 * Hook to check feature permission
 * خطاف للتحقق من صلاحيات الميزة
 */
export function useFeaturePermission(featureId: string, userPermissions: string[]): boolean {
  const [hasPermission, setHasPermission] = useState(() =>
    featureRegistry.hasPermission(featureId, userPermissions)
  );

  useEffect(() => {
    const permission = featureRegistry.hasPermission(featureId, userPermissions);
    setHasPermission(permission);
  }, [featureId, userPermissions]);

  return hasPermission;
}

/**
 * Hook to get feature status
 * خطاف للحصول على حالة الميزة
 */
export function useFeatureStatus(featureId: string) {
  const [status, setStatus] = useState(() => featureFlags.getStatus(featureId));

  useEffect(() => {
    const unsubscribe = featureFlags.subscribe(featureId, () => {
      setStatus(featureFlags.getStatus(featureId));
    });
    return unsubscribe;
  }, [featureId]);

  return status;
}

/**
 * Hook to get all features
 * خطاف للحصول على جميع الميزات
 */
export function useAllFeatures(): Feature[] {
  const [features, setFeatures] = useState<Feature[]>(() =>
    featureRegistry.getAllFeatures()
  );

  useEffect(() => {
    const features = featureRegistry.getAllFeatures();
    setFeatures(features);
  }, []);

  return features;
}

/**
 * Hook to preload features
 * خطاف لتحميل مسبق للميزات
 */
export function usePreloadFeatures(featureIds: string[]) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    loadFeatures(featureIds)
      .then(results => {
        const errors = results.filter(r => !r.success).map(r => r.error);
        if (errors.length > 0) {
          setError(errors.join(', '));
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [featureIds.join(',')]);

  return { loading, error };
}

export default {
  useFeatureEnabled,
  useFeature,
  useLoadFeature,
  useFeaturesByCategory,
  useEnabledFeatures,
  useToggleFeature,
  useFeaturePermission,
  useFeatureStatus,
  useAllFeatures,
  usePreloadFeatures
};
