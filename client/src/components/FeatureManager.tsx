/**
 * Feature Manager Component
 * مكون مدير الميزات - إدارة وتفعيل/تعطيل الميزات
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter, Download, Upload } from 'lucide-react';
import featureRegistry from '@shared/utils/featureRegistry';
import { featureFlags } from '@/lib/featureFlags';
import { Feature, FeatureCategory } from '@shared/types/features';

const CATEGORIES: FeatureCategory[] = [
  'analytics',
  'security',
  'payments',
  'communications',
  'automation',
  'users',
  'marketing',
  'settings',
  'integrations',
  'design'
];

const CATEGORY_LABELS: Record<FeatureCategory, string> = {
  analytics: 'التحليلات',
  security: 'الأمان',
  payments: 'الدفع',
  communications: 'التواصل',
  automation: 'الأتمتة',
  users: 'المستخدمين',
  marketing: 'التسويق',
  settings: 'الإعدادات',
  integrations: 'التكاملات',
  design: 'التصميم'
};

interface FeatureManagerProps {
  onFeatureToggle?: (featureId: string, enabled: boolean) => void;
}

export function FeatureManager({ onFeatureToggle }: FeatureManagerProps) {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [filteredFeatures, setFilteredFeatures] = useState<Feature[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<FeatureCategory>('analytics');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    enabled: 0,
    disabled: 0,
    beta: 0
  });

  useEffect(() => {
    // Load features
    const allFeatures = featureRegistry.getAllFeatures();
    setFeatures(allFeatures);

    // Calculate stats
    const total = allFeatures.length;
    const enabled = allFeatures.filter(f => f.enabled).length;
    const disabled = total - enabled;
    const beta = allFeatures.filter(f => f.beta).length;

    setStats({ total, enabled, disabled, beta });
  }, []);

  useEffect(() => {
    // Filter features
    let filtered = features.filter(f => f.category === selectedCategory);

    if (searchTerm) {
      filtered = filtered.filter(f =>
        f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.nameAr.includes(searchTerm)
      );
    }

    setFilteredFeatures(filtered);
  }, [features, selectedCategory, searchTerm]);

  const handleToggle = (featureId: string) => {
    const feature = featureRegistry.getFeature(featureId);
    if (!feature) return;

    if (feature.enabled) {
      featureRegistry.disableFeature(featureId);
      featureFlags.setOverride(featureId, false);
    } else {
      featureRegistry.enableFeature(featureId);
      featureFlags.setOverride(featureId, true);
    }

    // Update UI
    const updated = features.map(f =>
      f.id === featureId ? { ...f, enabled: !f.enabled } : f
    );
    setFeatures(updated);

    onFeatureToggle?.(featureId, !feature.enabled);
  };

  const handleExport = () => {
    const config = featureFlags.export();
    const dataStr = JSON.stringify(config, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `features-config-${new Date().toISOString()}.json`;
    link.click();
  };

  const getStatusBadge = (feature: Feature) => {
    if (feature.status === 'beta') {
      return <Badge variant="outline" className="bg-blue-500/10">Beta</Badge>;
    }
    if (feature.status === 'coming_soon') {
      return <Badge variant="outline" className="bg-yellow-500/10">Coming Soon</Badge>;
    }
    if (feature.status === 'deprecated') {
      return <Badge variant="outline" className="bg-red-500/10">Deprecated</Badge>;
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الميزات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">مفعلة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{stats.enabled}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">معطلة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{stats.disabled}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Beta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{stats.beta}</div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle>إدارة الميزات</CardTitle>
          <CardDescription>تفعيل وتعطيل الميزات حسب احتياجاتك</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ابحث عن ميزة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={handleExport} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              تصدير
            </Button>
          </div>

          <Tabs defaultValue="analytics" value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as FeatureCategory)}>
            <TabsList className="grid grid-cols-5 lg:grid-cols-10 w-full">
              {CATEGORIES.map(cat => (
                <TabsTrigger key={cat} value={cat} className="text-xs">
                  {CATEGORY_LABELS[cat]}
                </TabsTrigger>
              ))}
            </TabsList>

            {CATEGORIES.map(category => (
              <TabsContent key={category} value={category} className="space-y-4">
                {filteredFeatures.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    لا توجد ميزات في هذه الفئة
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredFeatures.map(feature => (
                      <div
                        key={feature.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{feature.name}</h4>
                            <span className="text-xs text-muted-foreground">({feature.nameAr})</span>
                            {getStatusBadge(feature)}
                          </div>
                          <p className="text-sm text-muted-foreground">{feature.description}</p>
                          {feature.requiredPermissions && feature.requiredPermissions.length > 0 && (
                            <div className="mt-2 flex gap-1 flex-wrap">
                              {feature.requiredPermissions.map(perm => (
                                <Badge key={perm} variant="secondary" className="text-xs">
                                  {perm}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-4">
                          <Switch
                            checked={feature.enabled}
                            onCheckedChange={() => handleToggle(feature.id)}
                            disabled={feature.status === 'deprecated'}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default FeatureManager;
