import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { adminApi } from '@/services/adminApi';

export default function IntegrationManager({ advanced }: any) {
  const [newIntegration, setNewIntegration] = useState({
    name: '',
    provider: 'google-sheets',
    credentials: '',
    spreadsheetId: '',
    enabled: true
  });
  const [exportConfig, setExportConfig] = useState({
    integrationId: '',
    spreadsheetId: '',
    createNew: true,
    title: 'SadhanaBoard Books Export'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  // Waitlist state
  const [waitlist, setWaitlist] = useState<any[]>([]);
  const [waitlistLoading, setWaitlistLoading] = useState(false);
  const [waitlistFilters, setWaitlistFilters] = useState({
    q: '',
    status: 'all',
    limit: 20,
    offset: 0
  });
  const [waitlistTotal, setWaitlistTotal] = useState(0);

  const handleCreateIntegration = async () => {
    setLoading(true);
    setMessage('');
    try {
      // Parse credentials if it's JSON
      let credentials = {};
      if (newIntegration.credentials) {
        try {
          credentials = JSON.parse(newIntegration.credentials);
        } catch (e) {
          throw new Error('Invalid JSON in credentials field');
        }
      }

      const integrationData = {
        name: newIntegration.name,
        provider: newIntegration.provider,
        credentials,
        enabled: newIntegration.enabled,
        metadata: {
          spreadsheetId: newIntegration.spreadsheetId
        }
      };

      await advanced.api.createIntegration(integrationData);
      setMessage('Integration created successfully!');
      // Reset form
      setNewIntegration({
        name: '',
        provider: 'google-sheets',
        credentials: '',
        spreadsheetId: '',
        enabled: true
      });
      // Reload integrations
      advanced.reload();
    } catch (error: any) {
      setMessage(`Error: ${error.message || 'Failed to create integration'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleExportBooks = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch('/api/admin/google-sheets/export-books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          integrationId: exportConfig.integrationId,
          spreadsheetId: exportConfig.spreadsheetId,
          createNew: exportConfig.createNew,
          title: exportConfig.title
        })
      });

      const result = await response.json();
      
      if (response.ok) {
        setMessage(`Success: ${result.message}`);
      } else {
        setMessage(`Error: ${result.error || 'Failed to export books'}`);
      }
    } catch (error: any) {
      setMessage(`Error: ${error.message || 'Failed to export books'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCSVExport = async () => {
    try {
      // Create a temporary link to trigger the download
      const link = document.createElement('a');
      link.href = '/api/admin/csv-export/books';
      link.download = 'sadhana-books-export.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setMessage('CSV export started successfully!');
    } catch (error: any) {
      setMessage(`Error: ${error.message || 'Failed to export books as CSV'}`);
    }
  };
  
  // Waitlist functions
  const loadWaitlist = async () => {
    setWaitlistLoading(true);
    try {
      const result = await adminApi.listWaitlist(
        waitlistFilters.q,
        waitlistFilters.limit,
        waitlistFilters.offset,
        waitlistFilters.status
      );
      setWaitlist(result.waitlist);
      setWaitlistTotal(result.total);
    } catch (error: any) {
      console.error('Failed to load waitlist', error);
    } finally {
      setWaitlistLoading(false);
    }
  };
  
  const updateWaitlistStatus = async (id: string, status: string) => {
    try {
      await adminApi.updateWaitlistEntry(id, { status });
      // Refresh the waitlist
      loadWaitlist();
    } catch (error: any) {
      console.error('Failed to update waitlist entry', error);
    }
  };
  
  const handleWaitlistCSVExport = async () => {
    try {
      // Create a temporary link to trigger the download
      const link = document.createElement('a');
      link.href = adminApi.waitlistCsvUrl();
      link.download = 'sadhana-waitlist-export.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setMessage('Waitlist CSV export started successfully!');
    } catch (error: any) {
      setMessage(`Error: ${error.message || 'Failed to export waitlist as CSV'}`);
    }
  };
  
  // Load waitlist on component mount
  useEffect(() => {
    loadWaitlist();
  }, [waitlistFilters]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Integrations</h2>
        <p className="text-muted-foreground">
          Connect SadhanaBoard with external services or export data
        </p>
      </div>

      {message && (
        <div className={`p-4 rounded ${message.startsWith('Success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message}
        </div>
      )}

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Current Integrations</TabsTrigger>
          <TabsTrigger value="create">Create Integration</TabsTrigger>
          <TabsTrigger value="export">Export to Google Sheets</TabsTrigger>
          <TabsTrigger value="csv">Export as CSV</TabsTrigger>
          <TabsTrigger value="waitlist">Waitlist Management</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Integrations</CardTitle>
              <CardDescription>
                Manage your connected services
              </CardDescription>
            </CardHeader>
            <CardContent>
              {advanced.loading ? (
                <div>Loading...</div>
              ) : advanced.integrations.length === 0 ? (
                <div className="text-muted-foreground">No integrations configured yet</div>
              ) : (
                <div className="grid gap-4">
                  {advanced.integrations.map((i: any) => (
                    <div key={i.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium">{i.name}</h3>
                          <p className="text-sm text-muted-foreground">Provider: {i.provider}</p>
                          <p className="text-sm text-muted-foreground">
                            Status: {i.enabled ? 'Enabled' : 'Disabled'}
                          </p>
                          {i.metadata?.spreadsheetId && (
                            <p className="text-sm text-muted-foreground">
                              Spreadsheet ID: {i.metadata.spreadsheetId}
                            </p>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={async () => {
                              try {
                                await advanced.api.updateIntegration(i.id, { enabled: !i.enabled });
                                advanced.reload();
                              } catch (error) {
                                console.error('Failed to update integration', error);
                              }
                            }}
                          >
                            {i.enabled ? 'Disable' : 'Enable'}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={async () => {
                              try {
                                await advanced.api.deleteIntegration(i.id);
                                advanced.reload();
                              } catch (error) {
                                console.error('Failed to delete integration', error);
                              }
                            }}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create Google Sheets Integration</CardTitle>
              <CardDescription>
                Connect your Google Sheets account to export book data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Integration Name</Label>
                <Input
                  id="name"
                  value={newIntegration.name}
                  onChange={(e) => setNewIntegration({...newIntegration, name: e.target.value})}
                  placeholder="e.g., My Google Sheets Integration"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="credentials">Google Service Account Credentials (JSON)</Label>
                <Textarea
                  id="credentials"
                  value={newIntegration.credentials}
                  onChange={(e) => setNewIntegration({...newIntegration, credentials: e.target.value})}
                  placeholder='{"type": "service_account", "project_id": "...", "private_key_id": "...", "private_key": "...", "client_email": "...", "client_id": "...", "auth_uri": "...", "token_uri": "...", "auth_provider_x509_cert_url": "...", "client_x509_cert_url": "..."}'
                  rows={6}
                />
                <p className="text-sm text-muted-foreground">
                  Paste your Google Service Account JSON credentials here
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="spreadsheetId">Spreadsheet ID (Optional)</Label>
                <Input
                  id="spreadsheetId"
                  value={newIntegration.spreadsheetId}
                  onChange={(e) => setNewIntegration({...newIntegration, spreadsheetId: e.target.value})}
                  placeholder="Google Spreadsheet ID (leave empty to create new)"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="enabled"
                  checked={newIntegration.enabled}
                  onChange={(e) => setNewIntegration({...newIntegration, enabled: e.target.checked})}
                />
                <Label htmlFor="enabled">Enable this integration</Label>
              </div>

              <Button 
                onClick={handleCreateIntegration} 
                disabled={loading || !newIntegration.name || !newIntegration.credentials}
              >
                {loading ? 'Creating...' : 'Create Integration'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Export Books to Google Sheets</CardTitle>
              <CardDescription>
                Export your book library to a Google Spreadsheet
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="integrationId">Integration</Label>
                <select
                  id="integrationId"
                  className="w-full p-2 border rounded"
                  value={exportConfig.integrationId}
                  onChange={(e) => setExportConfig({...exportConfig, integrationId: e.target.value})}
                >
                  <option value="">Select an integration</option>
                  {advanced.integrations
                    .filter((i: any) => i.provider === 'google-sheets' && i.enabled)
                    .map((i: any) => (
                      <option key={i.id} value={i.id}>
                        {i.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="createNew"
                  checked={exportConfig.createNew}
                  onChange={(e) => setExportConfig({...exportConfig, createNew: e.target.checked})}
                />
                <Label htmlFor="createNew">Create new spreadsheet</Label>
              </div>

              {exportConfig.createNew ? (
                <div className="space-y-2">
                  <Label htmlFor="title">Spreadsheet Title</Label>
                  <Input
                    id="title"
                    value={exportConfig.title}
                    onChange={(e) => setExportConfig({...exportConfig, title: e.target.value})}
                    placeholder="SadhanaBoard Books Export"
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="existingSpreadsheetId">Existing Spreadsheet ID</Label>
                  <Input
                    id="existingSpreadsheetId"
                    value={exportConfig.spreadsheetId}
                    onChange={(e) => setExportConfig({...exportConfig, spreadsheetId: e.target.value})}
                    placeholder="Google Spreadsheet ID"
                  />
                </div>
              )}

              <Button 
                onClick={handleExportBooks} 
                disabled={loading || !exportConfig.integrationId || 
                  (!exportConfig.createNew && !exportConfig.spreadsheetId)}
              >
                {loading ? 'Exporting...' : 'Export Books'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="csv" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Export Books as CSV</CardTitle>
              <CardDescription>
                Export your book library as a CSV file that you can manually import into Google Sheets or other applications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-800">Free Alternative</h3>
                <p className="text-sm text-blue-700">
                  This option doesn't require any Google Cloud setup. Simply click the button below to download a CSV file 
                  that you can manually upload to Google Sheets or open in Excel.
                </p>
              </div>
              
              <Button onClick={handleCSVExport}>
                Export All Books as CSV
              </Button>
              
              <div className="text-sm text-muted-foreground">
                <h4 className="font-medium">How to use the CSV file:</h4>
                <ol className="list-decimal list-inside space-y-1 mt-2">
                  <li>Click the "Export All Books as CSV" button above</li>
                  <li>Save the downloaded file to your computer</li>
                  <li>Open Google Sheets</li>
                  <li>Go to File &gt; Import &gt; Upload</li>
                  <li>Select the downloaded CSV file</li>
                  <li>Choose "Replace spreadsheet" and click "Import data"</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="waitlist" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Waitlist Management</CardTitle>
              <CardDescription>
                Manage users who have joined the waitlist
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h3 className="font-medium text-green-800">n8n Integration Active</h3>
                <p className="text-sm text-green-700">
                  New waitlist entries are automatically sent to the n8n webhook for processing.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-4 items-end">
                <div className="flex-1 min-w-[200px]">
                  <Label htmlFor="waitlist-search">Search</Label>
                  <Input
                    id="waitlist-search"
                    placeholder="Search by name or email"
                    value={waitlistFilters.q}
                    onChange={(e) => setWaitlistFilters({...waitlistFilters, q: e.target.value, offset: 0})}
                  />
                </div>
                <div className="flex-1 min-w-[150px]">
                  <Label htmlFor="waitlist-status">Status</Label>
                  <Select 
                    value={waitlistFilters.status} 
                    onValueChange={(value) => setWaitlistFilters({...waitlistFilters, status: value, offset: 0})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={() => loadWaitlist()}>Filter</Button>
                <Button onClick={handleWaitlistCSVExport} variant="outline">Export as CSV</Button>
              </div>
              
              {waitlistLoading ? (
                <div>Loading waitlist...</div>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {waitlist.map((entry) => (
                        <TableRow key={entry.id}>
                          <TableCell>{entry.name}</TableCell>
                          <TableCell>{entry.email}</TableCell>
                          <TableCell>{entry.reason || '-'}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                entry.status === 'approved' ? 'default' : 
                                entry.status === 'rejected' ? 'destructive' : 'secondary'
                              }
                            >
                              {entry.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(entry.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              {entry.status !== 'approved' && (
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => updateWaitlistStatus(entry.id, 'approved')}
                                >
                                  Approve
                                </Button>
                              )}
                              {entry.status !== 'rejected' && (
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => updateWaitlistStatus(entry.id, 'rejected')}
                                >
                                  Reject
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  {waitlist.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No waitlist entries found
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      Showing {waitlist.length} of {waitlistTotal} entries
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        disabled={waitlistFilters.offset === 0}
                        onClick={() => setWaitlistFilters({
                          ...waitlistFilters, 
                          offset: Math.max(0, waitlistFilters.offset - waitlistFilters.limit)
                        })}
                      >
                        Previous
                      </Button>
                      <Button 
                        variant="outline" 
                        disabled={waitlistFilters.offset + waitlist.length >= waitlistTotal}
                        onClick={() => setWaitlistFilters({
                          ...waitlistFilters, 
                          offset: waitlistFilters.offset + waitlistFilters.limit
                        })}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}