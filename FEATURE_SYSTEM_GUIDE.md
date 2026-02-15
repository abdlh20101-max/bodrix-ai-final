# Feature System Guide
# دليل نظام الميزات

## Overview / نظرة عامة

The Feature System is a scalable, extensible architecture that supports managing 1000+ features with dynamic loading, feature flags, and plugin capabilities.

نظام الميزات هو معمارية قابلة للتوسع وقابلة للتمديد تدعم إدارة 1000+ ميزة مع التحميل الديناميكي وأعلام الميزات وقدرات الإضافات.

---

## Architecture / المعمارية

```
┌─────────────────────────────────────────┐
│     Feature Manager UI                  │
│  (Admin Dashboard - إدارة الميزات)      │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│     Feature Flags System                │
│  (أعلام الميزات - التحكم الديناميكي)   │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│     Feature Registry                    │
│  (سجل الميزات - إدارة مركزية)          │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│     Feature Loader                      │
│  (محمل الميزات - تحميل ديناميكي)      │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│     React Hooks & Components            │
│  (خطافات React والمكونات)              │
└─────────────────────────────────────────┘
```

---

## Core Components / المكونات الأساسية

### 1. Feature Registry (`shared/utils/featureRegistry.ts`)
**Purpose:** Central registry for all features
**الغرض:** سجل مركزي لجميع الميزات

```typescript
import featureRegistry from '@shared/utils/featureRegistry';

// Register a feature
featureRegistry.registerFeature({
  id: 'my-feature',
  name: 'My Feature',
  nameAr: 'ميزتي',
  description: 'Feature description',
  descriptionAr: 'وصف الميزة',
  category: 'analytics',
  status: 'active',
  icon: 'Star',
  enabled: true
});

// Get feature
const feature = featureRegistry.getFeature('my-feature');

// Get all features
const allFeatures = featureRegistry.getAllFeatures();

// Get features by category
const analytics = featureRegistry.getFeaturesByCategory('analytics');

// Toggle feature
featureRegistry.enableFeature('my-feature');
featureRegistry.disableFeature('my-feature');
```

### 2. Feature Flags (`client/src/lib/featureFlags.ts`)
**Purpose:** Runtime control of feature availability
**الغرض:** التحكم في توفر الميزات أثناء التشغيل

```typescript
import { featureFlags } from '@/lib/featureFlags';

// Initialize with context
featureFlags.initialize({
  userId: 'user123',
  userRole: 'admin',
  userPermissions: ['manage_features'],
  environment: 'production'
});

// Check if enabled
const enabled = featureFlags.isEnabled('my-feature');

// Set override
featureFlags.setOverride('my-feature', true);

// Subscribe to changes
const unsubscribe = featureFlags.subscribe('my-feature', (enabled) => {
  console.log('Feature enabled:', enabled);
});

// Get status
const status = featureFlags.getStatus('my-feature');
```

### 3. Feature Loader (`client/src/lib/featureLoader.ts`)
**Purpose:** Lazy load feature components
**الغرض:** تحميل مكونات الميزات بشكل كسول

```typescript
import { loadFeature, preloadFeatures } from '@/lib/featureLoader';

// Load single feature
const result = await loadFeature('my-feature');
if (result.success) {
  console.log('Feature loaded:', result.feature);
}

// Preload multiple features
await preloadFeatures(['feature1', 'feature2', 'feature3']);

// Get loading stats
const stats = getLoadingStats();
console.log('Average load time:', stats.averageLoadTime);
```

### 4. React Hooks (`client/src/hooks/useFeatures.ts`)
**Purpose:** React integration for feature system
**الغرض:** دمج React مع نظام الميزات

```typescript
import {
  useFeatureEnabled,
  useFeature,
  useLoadFeature,
  useFeaturesByCategory,
  useToggleFeature,
  useFeatureStatus,
  useAllFeatures
} from '@/hooks/useFeatures';

// Check if enabled
const enabled = useFeatureEnabled('my-feature');

// Get feature
const feature = useFeature('my-feature');

// Load feature component
const { loading, error, component } = useLoadFeature('my-feature');

// Get features by category
const analytics = useFeaturesByCategory('analytics');

// Toggle feature
const { enabled, toggle } = useToggleFeature('my-feature');

// Get status
const status = useFeatureStatus('my-feature');

// Get all features
const allFeatures = useAllFeatures();
```

---

## Adding New Features / إضافة ميزات جديدة

### Step 1: Define Feature Type
```typescript
// shared/types/features.ts
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
```

### Step 2: Add to Feature Data
```json
// shared/data/features.json
{
  "id": "new-feature",
  "name": "New Feature",
  "nameAr": "ميزة جديدة",
  "description": "Feature description",
  "descriptionAr": "وصف الميزة",
  "category": "analytics",
  "status": "active",
  "icon": "Star",
  "enabled": true,
  "requiredPermissions": ["view_analytics"],
  "dependencies": ["base-feature"],
  "beta": false
}
```

### Step 3: Create Feature Component (Optional)
```typescript
// client/src/components/features/NewFeature.tsx
export function NewFeature() {
  const enabled = useFeatureEnabled('new-feature');
  
  if (!enabled) return null;
  
  return (
    <div>
      <h2>New Feature</h2>
      {/* Feature content */}
    </div>
  );
}
```

### Step 4: Register Feature
```typescript
// In your app initialization
import { NewFeature } from '@/components/features/NewFeature';
import featureRegistry from '@shared/utils/featureRegistry';

featureRegistry.registerFeature({
  id: 'new-feature',
  name: 'New Feature',
  nameAr: 'ميزة جديدة',
  description: 'Feature description',
  descriptionAr: 'وصف الميزة',
  category: 'analytics',
  status: 'active',
  icon: 'Star',
  enabled: true,
  component: NewFeature
});
```

---

## Feature Categories / فئات الميزات

| Category | Arabic | Purpose |
|----------|--------|---------|
| analytics | التحليلات | Data analysis and reporting |
| security | الأمان | Authentication and authorization |
| payments | الدفع | Payment processing |
| communications | التواصل | Email, SMS, notifications |
| automation | الأتمتة | Workflow automation and AI |
| users | المستخدمين | User management |
| marketing | التسويق | Marketing campaigns |
| settings | الإعدادات | System configuration |
| integrations | التكاملات | Third-party integrations |
| design | التصميم | UI/UX customization |

---

## Feature Status / حالات الميزات

| Status | Arabic | Meaning |
|--------|--------|---------|
| active | نشط | Feature is available |
| inactive | غير نشط | Feature is disabled |
| beta | تجريبي | Feature is in beta |
| deprecated | مهجور | Feature is deprecated |
| coming_soon | قريباً | Feature coming soon |

---

## Permissions / الصلاحيات

Features can require specific permissions:

```typescript
const feature: Feature = {
  // ... other properties
  requiredPermissions: ['admin', 'manage_features'],
};

// Check permission
const hasPermission = featureRegistry.hasPermission(
  'my-feature',
  ['admin', 'manage_features']
);
```

---

## Dependencies / التبعيات

Features can depend on other features:

```typescript
const feature: Feature = {
  // ... other properties
  dependencies: ['base-feature', 'analytics-dashboard'],
};

// Get dependencies
const deps = featureRegistry.getDependencies('my-feature');

// Check if dependencies are enabled
const enabled = featureRegistry.areDependenciesEnabled('my-feature');
```

---

## Feature Manager UI / واجهة إدارة الميزات

Access via Admin Dashboard → إدارة الميزات tab

**Features:**
- ✅ View all features by category
- ✅ Toggle features on/off
- ✅ Search features
- ✅ View feature status and permissions
- ✅ Export/import configuration

---

## Best Practices / أفضل الممارسات

### 1. Use Meaningful IDs
```typescript
// ✅ Good
featureRegistry.registerFeature({
  id: 'analytics-dashboard-v2',
  // ...
});

// ❌ Bad
featureRegistry.registerFeature({
  id: 'feature1',
  // ...
});
```

### 2. Provide Bilingual Content
```typescript
// ✅ Good
{
  name: 'Analytics Dashboard',
  nameAr: 'لوحة التحليلات',
  description: 'View analytics data',
  descriptionAr: 'عرض بيانات التحليلات'
}

// ❌ Bad
{
  name: 'Analytics Dashboard'
}
```

### 3. Use Feature Flags in Components
```typescript
// ✅ Good
export function MyComponent() {
  const enabled = useFeatureEnabled('my-feature');
  
  if (!enabled) return null;
  
  return <div>Feature content</div>;
}

// ❌ Bad
export function MyComponent() {
  return <div>Feature content</div>;
}
```

### 4. Handle Dependencies
```typescript
// ✅ Good
const deps = featureRegistry.getDependencies('my-feature');
if (!featureRegistry.areDependenciesEnabled('my-feature')) {
  console.warn('Dependencies not met');
  return;
}

// ❌ Bad
// Ignoring dependencies
```

### 5. Use Proper Categories
```typescript
// ✅ Good
{
  category: 'analytics'
}

// ❌ Bad
{
  category: 'other'
}
```

---

## API Reference / مرجع API

### FeatureRegistry Methods

| Method | Description |
|--------|-------------|
| `registerFeature(feature)` | Register a single feature |
| `registerFeatures(features)` | Register multiple features |
| `getFeature(id)` | Get feature by ID |
| `getAllFeatures()` | Get all features |
| `getFeaturesByCategory(category)` | Get features by category |
| `getEnabledFeatures()` | Get enabled features |
| `getFeaturesByStatus(status)` | Get features by status |
| `enableFeature(id)` | Enable a feature |
| `disableFeature(id)` | Disable a feature |
| `isFeatureEnabled(id)` | Check if feature is enabled |
| `hasPermission(id, permissions)` | Check permissions |
| `getDependencies(id)` | Get feature dependencies |
| `areDependenciesEnabled(id)` | Check if dependencies are enabled |
| `getFeatureConfig(id)` | Get feature configuration |
| `updateFeatureConfig(id, config)` | Update feature configuration |
| `getStats()` | Get registry statistics |
| `clear()` | Clear registry |

### FeatureFlags Methods

| Method | Description |
|--------|-------------|
| `initialize(context)` | Initialize with context |
| `isEnabled(id)` | Check if feature is enabled |
| `setOverride(id, enabled)` | Set feature override |
| `removeOverride(id)` | Remove feature override |
| `subscribe(id, callback)` | Subscribe to changes |
| `getStatus(id)` | Get feature status |
| `getAllStatuses()` | Get all feature statuses |
| `export()` | Export configuration |
| `import(config)` | Import configuration |

---

## Examples / أمثلة

### Example 1: Conditional Rendering
```typescript
export function Dashboard() {
  const analyticsEnabled = useFeatureEnabled('analytics-dashboard');
  const marketingEnabled = useFeatureEnabled('marketing-campaigns');
  
  return (
    <div>
      {analyticsEnabled && <AnalyticsDashboard />}
      {marketingEnabled && <MarketingCampaigns />}
    </div>
  );
}
```

### Example 2: Feature-Based Routing
```typescript
export function App() {
  const features = useAllFeatures();
  
  return (
    <Routes>
      {features
        .filter(f => f.enabled)
        .map(f => (
          <Route key={f.id} path={`/${f.id}`} component={f.component} />
        ))}
    </Routes>
  );
}
```

### Example 3: Admin Controls
```typescript
export function AdminPanel() {
  const features = useAllFeatures();
  
  return (
    <div>
      {features.map(feature => (
        <FeatureToggle key={feature.id} feature={feature} />
      ))}
    </div>
  );
}
```

---

## Performance Tips / نصائح الأداء

1. **Preload Critical Features**
   ```typescript
   useEffect(() => {
     preloadFeatures(['analytics-dashboard', 'user-management']);
   }, []);
   ```

2. **Use Lazy Loading**
   ```typescript
   const { loading, component } = useLoadFeature('heavy-feature');
   if (loading) return <Spinner />;
   ```

3. **Cache Feature Configs**
   ```typescript
   const config = useMemo(
     () => featureRegistry.getFeatureConfig('my-feature'),
     ['my-feature']
   );
   ```

4. **Monitor Load Times**
   ```typescript
   const stats = getLoadingStats();
   console.log('Slowest features:', stats.slowestFeatures);
   ```

---

## Troubleshooting / استكشاف الأخطاء

### Feature Not Showing
- Check if feature is enabled: `featureRegistry.isFeatureEnabled('id')`
- Check permissions: `featureRegistry.hasPermission('id', userPerms)`
- Check dependencies: `featureRegistry.areDependenciesEnabled('id')`

### Slow Loading
- Check load times: `getLoadingStats()`
- Preload critical features
- Use lazy loading for heavy components

### Permission Denied
- Verify user permissions
- Check feature requirements
- Update user role if needed

---

## Version History / سجل الإصدارات

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-02-05 | Initial release |

---

## Support / الدعم

For issues or questions:
1. Check the troubleshooting section
2. Review the examples
3. Check the API reference
4. Contact the development team

للمشاكل أو الأسئلة:
1. تحقق من قسم استكشاف الأخطاء
2. راجع الأمثلة
3. تحقق من مرجع API
4. اتصل بفريق التطوير
