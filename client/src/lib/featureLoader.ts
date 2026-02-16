/**
 * Feature Loader
 * محمل الميزات - تحميل المكونات بشكل ديناميكي
 */

import { Feature, FeatureLoadResult } from '@shared/types/features';
import featureRegistry from '@shared/utils/featureRegistry';

interface LoadedFeature {
  feature: Feature;
  component: React.ComponentType<any>;
  loadTime: number;
}

const loadedFeatures = new Map<string, LoadedFeature>();
const loadingPromises = new Map<string, Promise<FeatureLoadResult>>();

/**
 * Load feature component
 * تحميل مكون الميزة
 */
export async function loadFeature(featureId: string): Promise<FeatureLoadResult> {
  // Return cached result if already loaded
  if (loadedFeatures.has(featureId)) {
    return {
      success: true,
      feature: loadedFeatures.get(featureId)!.feature
    };
  }

  // Return pending promise if already loading
  if (loadingPromises.has(featureId)) {
    return loadingPromises.get(featureId)!;
  }

  // Create new loading promise
  const loadPromise = (async () => {
    const startTime = performance.now();
    
    try {
      const feature = featureRegistry.getFeature(featureId);
      
      if (!feature) {
        return {
          success: false,
          error: `Feature ${featureId} not found`
        };
      }

      if (!feature.enabled) {
        return {
          success: false,
          error: `Feature ${featureId} is disabled`
        };
      }

      // Check dependencies
      if (!featureRegistry.areDependenciesEnabled(featureId)) {
        const deps = featureRegistry.getDependencies(featureId);
        const disabledDeps = deps.filter(d => !d.enabled).map(d => d.id);
        return {
          success: false,
          error: `Feature dependencies not met: ${disabledDeps.join(', ')}`
        };
      }

      // Lazy load component if available
      let component = feature.component;
      if (!component && feature.metadata?.componentPath) {
        try {
          const module = await import(feature.metadata.componentPath);
          component = module.default || module[feature.id];
        } catch (err) {
          console.warn(`Failed to lazy load component for ${featureId}:`, err);
        }
      }

      const loadTime = performance.now() - startTime;

      const loadedFeature: LoadedFeature = {
        feature,
        component: component || (() => null),
        loadTime
      };

      loadedFeatures.set(featureId, loadedFeature);

      return {
        success: true,
        feature,
        warnings: component ? [] : ['Component not found, using empty component']
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to load feature ${featureId}: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    } finally {
      loadingPromises.delete(featureId);
    }
  })();

  loadingPromises.set(featureId, loadPromise);
  return loadPromise;
}

/**
 * Load multiple features
 * تحميل عدة ميزات
 */
export async function loadFeatures(featureIds: string[]): Promise<FeatureLoadResult[]> {
  return Promise.all(featureIds.map(id => loadFeature(id)));
}

/**
 * Get loaded feature component
 * الحصول على مكون الميزة المحملة
 */
export function getLoadedFeature(featureId: string): LoadedFeature | undefined {
  return loadedFeatures.get(featureId);
}

/**
 * Preload features
 * تحميل مسبق للميزات
 */
export async function preloadFeatures(featureIds: string[]): Promise<void> {
  await Promise.all(featureIds.map(id => loadFeature(id)));
}

/**
 * Clear loaded features
 * مسح الميزات المحملة
 */
export function clearLoadedFeatures(): void {
  loadedFeatures.clear();
  loadingPromises.clear();
}

/**
 * Get loading stats
 * الحصول على إحصائيات التحميل
 */
export function getLoadingStats() {
  const loaded = Array.from(loadedFeatures.values());
  return {
    totalLoaded: loaded.length,
    totalLoadTime: loaded.reduce((sum, f) => sum + f.loadTime, 0),
    averageLoadTime: loaded.length > 0 ? loaded.reduce((sum, f) => sum + f.loadTime, 0) / loaded.length : 0,
    slowestFeatures: loaded
      .sort((a, b) => b.loadTime - a.loadTime)
      .slice(0, 5)
      .map(f => ({ id: f.feature.id, loadTime: f.loadTime }))
  };
}

export default {
  loadFeature,
  loadFeatures,
  getLoadedFeature,
  preloadFeatures,
  clearLoadedFeatures,
  getLoadingStats
};
