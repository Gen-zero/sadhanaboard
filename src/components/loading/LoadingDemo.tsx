import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import {
  LoadingSpinner,
  Skeleton,
  CardSkeleton,
  ListSkeleton,
  TableSkeleton,
  LoadingOverlay,
  LoadingButton,
  UploadingIndicator,
  DownloadingIndicator,
  SyncingIndicator,
  PageSkeleton,
  LoadingInput,
  LoadingTextarea,
  LoadingFileUpload,
  LoadingForm,
  FormField,
  useLoadingState,
  LOADING_KEYS
} from './index';

const LoadingDemo: React.FC = () => {
  const { toast } = useToast();
  const { setLoading, isLoading } = useLoadingState();
  const [showOverlay, setShowOverlay] = useState(false);
  const [showPageSkeleton, setShowPageSkeleton] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Demo functions
  const simulateLoading = async (key: string, duration: number = 2000) => {
    setLoading(key, true);
    await new Promise(resolve => setTimeout(resolve, duration));
    setLoading(key, false);
    toast({
      title: "Loading Complete",
      description: `${key} operation finished successfully`
    });
  };

  const simulateUpload = async (files: File[]) => {
    setUploadProgress(0);
    for (let i = 0; i <= 100; i += 10) {
      setUploadProgress(i);
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    toast({
      title: "Upload Complete",
      description: `${files.length} file(s) uploaded successfully`
    });
  };

  const simulateValidation = async (value: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return value.length > 3;
  };

  const handleFormSubmit = async (data: any) => {
    await simulateLoading(LOADING_KEYS.FORM_SUBMIT, 3000);
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Loading States Demo</h1>
        <p className="text-muted-foreground">
          Comprehensive demonstration of all loading components and states
        </p>
      </div>

      <Tabs defaultValue="spinners" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="spinners">Spinners</TabsTrigger>
          <TabsTrigger value="skeletons">Skeletons</TabsTrigger>
          <TabsTrigger value="buttons">Buttons</TabsTrigger>
          <TabsTrigger value="overlays">Overlays</TabsTrigger>
          <TabsTrigger value="forms">Forms</TabsTrigger>
          <TabsTrigger value="indicators">Indicators</TabsTrigger>
        </TabsList>

        {/* Spinners Tab */}
        <TabsContent value="spinners" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Loading Spinners</CardTitle>
              <CardDescription>
                Various loading spinner variants and sizes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Sizes */}
              <div>
                <h3 className="text-lg font-medium mb-4">Sizes</h3>
                <div className="flex items-center space-x-6">
                  <div className="text-center space-y-2">
                    <LoadingSpinner size="sm" />
                    <p className="text-sm text-muted-foreground">Small</p>
                  </div>
                  <div className="text-center space-y-2">
                    <LoadingSpinner size="md" />
                    <p className="text-sm text-muted-foreground">Medium</p>
                  </div>
                  <div className="text-center space-y-2">
                    <LoadingSpinner size="lg" />
                    <p className="text-sm text-muted-foreground">Large</p>
                  </div>
                  <div className="text-center space-y-2">
                    <LoadingSpinner size="xl" />
                    <p className="text-sm text-muted-foreground">Extra Large</p>
                  </div>
                </div>
              </div>

              {/* Variants */}
              <div>
                <h3 className="text-lg font-medium mb-4">Variants</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="text-center space-y-2">
                    <LoadingSpinner variant="default" />
                    <p className="text-sm text-muted-foreground">Default</p>
                  </div>
                  <div className="text-center space-y-2">
                    <LoadingSpinner variant="spiritual" />
                    <p className="text-sm text-muted-foreground">Spiritual</p>
                  </div>
                  <div className="text-center space-y-2">
                    <LoadingSpinner variant="cosmic" />
                    <p className="text-sm text-muted-foreground">Cosmic</p>
                  </div>
                  <div className="text-center space-y-2">
                    <LoadingSpinner variant="dots" />
                    <p className="text-sm text-muted-foreground">Dots</p>
                  </div>
                  <div className="text-center space-y-2">
                    <LoadingSpinner variant="pulse" />
                    <p className="text-sm text-muted-foreground">Pulse</p>
                  </div>
                  <div className="text-center space-y-2">
                    <LoadingSpinner variant="bars" />
                    <p className="text-sm text-muted-foreground">Bars</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Skeletons Tab */}
        <TabsContent value="skeletons" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Skeletons</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Single Line</p>
                  <Skeleton />
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Multiple Lines</p>
                  <Skeleton lines={3} />
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Circular</p>
                  <Skeleton variant="circular" width={40} height={40} />
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Rounded</p>
                  <Skeleton variant="rounded" height="3rem" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Complex Skeletons</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Card Skeleton</p>
                  <CardSkeleton />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>List Skeleton</CardTitle>
            </CardHeader>
            <CardContent>
              <ListSkeleton items={4} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Table Skeleton</CardTitle>
            </CardHeader>
            <CardContent>
              <TableSkeleton rows={5} columns={4} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Page Skeleton</CardTitle>
              <CardDescription>
                Full page loading skeleton for initial page loads
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => {
                  setShowPageSkeleton(true);
                  setTimeout(() => setShowPageSkeleton(false), 3000);
                }}
              >
                Show Page Skeleton (3s)
              </Button>
              {showPageSkeleton && (
                <div className="mt-4 border rounded-lg">
                  <PageSkeleton />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Buttons Tab */}
        <TabsContent value="buttons" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Loading Buttons</CardTitle>
              <CardDescription>
                Buttons with integrated loading states
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-4">
                <LoadingButton
                  loading={isLoading(LOADING_KEYS.SADHANA_SAVE)}
                  loadingText="Saving..."
                  onClick={() => simulateLoading(LOADING_KEYS.SADHANA_SAVE)}
                >
                  Save Sadhana
                </LoadingButton>

                <LoadingButton
                  loading={isLoading(LOADING_KEYS.DATA_SYNC)}
                  loadingText="Syncing..."
                  variant="outline"
                  onClick={() => simulateLoading(LOADING_KEYS.DATA_SYNC)}
                >
                  Sync Data
                </LoadingButton>

                <LoadingButton
                  loading={isLoading(LOADING_KEYS.EXPORT)}
                  loadingText="Exporting..."
                  variant="secondary"
                  onClick={() => simulateLoading(LOADING_KEYS.EXPORT)}
                >
                  Export Data
                </LoadingButton>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Overlays Tab */}
        <TabsContent value="overlays" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Loading Overlays</CardTitle>
              <CardDescription>
                Full-screen and modal loading overlays
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={() => {
                    setShowOverlay(true);
                    setTimeout(() => setShowOverlay(false), 3000);
                  }}
                >
                  Show Loading Overlay (3s)
                </Button>
              </div>
            </CardContent>
          </Card>

          <LoadingOverlay
            isVisible={showOverlay}
            message="Processing your spiritual journey data..."
            variant="spiritual"
          />
        </TabsContent>

        {/* Forms Tab */}
        <TabsContent value="forms" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Loading Form Components</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <LoadingInput
                  label="Email"
                  placeholder="Enter your email"
                  onValidate={simulateValidation}
                />

                <LoadingInput
                  label="Username"
                  placeholder="Enter username"
                  loading={isLoading('username-check')}
                  loadingText="Checking availability..."
                />

                <LoadingTextarea
                  label="Description"
                  placeholder="Enter description"
                  maxLength={200}
                  showCharCount
                />

                <LoadingFileUpload
                  label="Upload Files"
                  accept="image/*"
                  multiple
                  maxSize={5 * 1024 * 1024} // 5MB
                  onUpload={simulateUpload}
                  progress={uploadProgress}
                />
              </CardContent>
            </Card>

            <LoadingForm
              title="Complete Form Example"
              description="A complete form with loading states"
              submitText="Submit Form"
              onSubmit={handleFormSubmit}
            >
              <FormField label="Name" required>
                <LoadingInput name="name" placeholder="Your name" />
              </FormField>

              <FormField label="Email" required>
                <LoadingInput
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  onValidate={simulateValidation}
                />
              </FormField>

              <FormField label="Message">
                <LoadingTextarea
                  name="message"
                  placeholder="Your message"
                  maxLength={500}
                  showCharCount
                />
              </FormField>
            </LoadingForm>
          </div>
        </TabsContent>

        {/* Indicators Tab */}
        <TabsContent value="indicators" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload Indicator</CardTitle>
              </CardHeader>
              <CardContent>
                <UploadingIndicator message="Uploading files..." />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Download Indicator</CardTitle>
              </CardHeader>
              <CardContent>
                <DownloadingIndicator message="Downloading data..." />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sync Indicator</CardTitle>
              </CardHeader>
              <CardContent>
                <SyncingIndicator message="Syncing with server..." />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Global Loading States</CardTitle>
              <CardDescription>
                Test global loading state management
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={() => simulateLoading(LOADING_KEYS.DASHBOARD_LOAD)}
                  disabled={isLoading(LOADING_KEYS.DASHBOARD_LOAD)}
                >
                  {isLoading(LOADING_KEYS.DASHBOARD_LOAD) ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Loading Dashboard...
                    </>
                  ) : (
                    'Load Dashboard'
                  )}
                </Button>

                <Button
                  onClick={() => simulateLoading(LOADING_KEYS.LIBRARY_LOAD)}
                  disabled={isLoading(LOADING_KEYS.LIBRARY_LOAD)}
                >
                  {isLoading(LOADING_KEYS.LIBRARY_LOAD) ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Loading Library...
                    </>
                  ) : (
                    'Load Library'
                  )}
                </Button>

                <Button
                  onClick={() => simulateLoading(LOADING_KEYS.SETTINGS_SAVE)}
                  disabled={isLoading(LOADING_KEYS.SETTINGS_SAVE)}
                >
                  {isLoading(LOADING_KEYS.SETTINGS_SAVE) ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Saving Settings...
                    </>
                  ) : (
                    'Save Settings'
                  )}
                </Button>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-2">Active Loading States:</p>
                <div className="text-sm text-muted-foreground">
                  {Object.entries({
                    [LOADING_KEYS.DASHBOARD_LOAD]: isLoading(LOADING_KEYS.DASHBOARD_LOAD),
                    [LOADING_KEYS.LIBRARY_LOAD]: isLoading(LOADING_KEYS.LIBRARY_LOAD),
                    [LOADING_KEYS.SETTINGS_SAVE]: isLoading(LOADING_KEYS.SETTINGS_SAVE),
                    [LOADING_KEYS.SADHANA_SAVE]: isLoading(LOADING_KEYS.SADHANA_SAVE),
                    [LOADING_KEYS.DATA_SYNC]: isLoading(LOADING_KEYS.DATA_SYNC),
                    [LOADING_KEYS.EXPORT]: isLoading(LOADING_KEYS.EXPORT)
                  })
                    .filter(([_, loading]) => loading)
                    .map(([key]) => key)
                    .join(', ') || 'None'}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LoadingDemo;