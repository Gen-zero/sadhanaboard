import React from 'react';
import AssetManager from '@/components/cms/AssetManager';
import ThemeStudio from '@/components/cms/ThemeStudio';
import TemplateBuilder from '@/components/cms/TemplateBuilder';
import SpiritualLibraryManager from '@/components/cms/SpiritualLibraryManager';
import ContentWorkflow from '@/components/cms/ContentWorkflow';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AdminContentPage() {
  return (
    <div className="space-y-4">
      <Tabs defaultValue="assets">
        <TabsList>
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="themes">Themes</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="library">Library</TabsTrigger>
          <TabsTrigger value="workflow">Workflow</TabsTrigger>
        </TabsList>
        <TabsContent value="assets">
          <AssetManager />
        </TabsContent>
        <TabsContent value="themes">
          <ThemeStudio />
        </TabsContent>
        <TabsContent value="templates">
          <TemplateBuilder />
        </TabsContent>
        <TabsContent value="library">
          <SpiritualLibraryManager />
        </TabsContent>
        <TabsContent value="workflow">
          <ContentWorkflow />
        </TabsContent>
      </Tabs>
    </div>
  );
}
