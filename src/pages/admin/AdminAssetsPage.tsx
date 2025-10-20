import { useEffect, useState } from 'react';
import { adminApi } from '@/services/adminApi';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Upload, File, Image, Music, Video, Eye, Trash2, Edit } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface Asset {
  id: number;
  title: string;
  type: string;
  description?: string;
  tags?: string[];
  filePath: string;
  fileName: string;
  originalName: string;
  fileSize: number;
  mimeType: string;
  created_at: string;
}

const AdminAssetsPage = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('image');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [filter, setFilter] = useState({ type: 'all', search: '' });
  const [pagination, setPagination] = useState({ total: 0, limit: 12, offset: 0 });
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const { toast } = useToast();

  const load = async (offset = 0) => {
    setLoading(true);
    try {
      const data = await adminApi.listAssets();
      setAssets(data.items || []);
      setPagination(prev => ({ ...prev, total: data.total || 0, offset: ((data.page && data.limit) ? ((data.page - 1) * data.limit) : 0), limit: data.limit || prev.limit }));
    } catch (error) {
      toast({ title: 'Failed to load assets', description: String(error) });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [filter]);

  const upload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      await adminApi.uploadAsset(file, { title, type, description, tags });
      setFile(null);
      setTitle('');
      setDescription('');
      setTags('');
      setShowUploadDialog(false);
      load();
    } catch (error) {
      toast({ title: 'Upload failed', description: String(error) });
    } finally {
      setUploading(false);
    }
  };

  const updateAsset = async () => {
    if (!selectedAsset) return;
    try {
      await adminApi.updateAsset(selectedAsset.id, {
        title: selectedAsset.title,
        description: selectedAsset.description,
        tags: selectedAsset.tags?.join(', ') || ''
      });
      setShowEditDialog(false);
      setSelectedAsset(null);
      load(pagination.offset);
    } catch (error) {
      toast({ title: 'Update failed', description: String(error) });
    }
  };

  const remove = async (id: number) => {
    if (!confirm('Are you sure you want to delete this asset?')) return;
    try {
      await adminApi.deleteAsset(id);
      load(pagination.offset);
    } catch (error) {
      toast({ title: 'Delete failed', description: String(error) });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <Image className="h-5 w-5" />;
    if (mimeType.startsWith('audio/')) return <Music className="h-5 w-5" />;
    if (mimeType.startsWith('video/')) return <Video className="h-5 w-5" />;
    return <File className="h-5 w-5" />;
  };

  const nextPage = () => {
    const newOffset = pagination.offset + pagination.limit;
    if (newOffset < pagination.total) {
      setPagination(prev => ({ ...prev, offset: newOffset }));
      load(newOffset);
    }
  };

  const prevPage = () => {
    const newOffset = Math.max(0, pagination.offset - pagination.limit);
    setPagination(prev => ({ ...prev, offset: newOffset }));
    load(newOffset);
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <Card className="bg-background/60 backdrop-blur-md border-purple-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Asset Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium mb-1 block">Search Assets</label>
              <Input
                placeholder="Search by title or type..."
                value={filter.search}
                onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
              />
            </div>
            <div className="w-48">
              <label className="text-sm font-medium mb-1 block">Filter by Type</label>
              <Select value={filter.type} onValueChange={(value) => setFilter(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="image">Images</SelectItem>
                  <SelectItem value="audio">Audio</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="application">Documents</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Asset
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload New Asset</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">File</label>
                    <Input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Title</label>
                    <Input placeholder="Asset title" value={title} onChange={(e) => setTitle(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Type</label>
                    <Select value={type} onValueChange={setType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="image">Image</SelectItem>
                        <SelectItem value="audio">Audio</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="icon">Icon</SelectItem>
                        <SelectItem value="document">Document</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Description</label>
                    <Textarea placeholder="Asset description" value={description} onChange={(e) => setDescription(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Tags</label>
                    <Input placeholder="Comma-separated tags" value={tags} onChange={(e) => setTags(e.target.value)} />
                  </div>
                  <Button onClick={upload} disabled={!file || uploading} className="w-full">
                    {uploading ? 'Uploading...' : 'Upload Asset'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Assets Grid */}
      <Card className="bg-background/60 backdrop-blur-md border-purple-500/20">
        <CardHeader>
          <CardTitle>Assets ({pagination.total})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {assets.map(asset => (
                  <div key={asset.id} className="border border-border/30 rounded-lg p-4 hover:bg-background/50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getFileIcon(asset.mimeType)}
                        <Badge variant="secondary">{asset.type}</Badge>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedAsset(asset);
                            setShowEditDialog(true);
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(asset.id)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Asset Preview */}
                    <div className="mb-3">
                      {asset.mimeType.startsWith('image/') ? (
                        <img 
                          src={asset.filePath} 
                          alt={asset.title} 
                          className="w-full h-32 object-cover rounded-md"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : asset.mimeType.startsWith('audio/') ? (
                        <audio src={asset.filePath} controls className="w-full" />
                      ) : asset.mimeType.startsWith('video/') ? (
                        <video src={asset.filePath} controls className="w-full h-32" />
                      ) : (
                        <div className="w-full h-32 bg-background/50 rounded-md flex items-center justify-center">
                          {getFileIcon(asset.mimeType)}
                          <span className="ml-2 text-sm text-muted-foreground">Document</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Asset Info */}
                    <div className="space-y-2">
                      <h3 className="font-medium text-sm truncate" title={asset.title}>
                        {asset.title}
                      </h3>
                      {asset.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {asset.description}
                        </p>
                      )}
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{formatFileSize(asset.fileSize)}</span>
                        <span>{new Date(asset.created_at).toLocaleDateString()}</span>
                      </div>
                      {asset.tags && asset.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {asset.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {asset.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{asset.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Pagination */}
              {pagination.total > pagination.limit && (
                <div className="flex items-center justify-between mt-6">
                  <p className="text-sm text-muted-foreground">
                    Showing {pagination.offset + 1} to {Math.min(pagination.offset + pagination.limit, pagination.total)} of {pagination.total} assets
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={prevPage}
                      disabled={pagination.offset === 0}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={nextPage}
                      disabled={pagination.offset + pagination.limit >= pagination.total}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Edit Asset Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Asset</DialogTitle>
          </DialogHeader>
          {selectedAsset && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Title</label>
                <Input
                  value={selectedAsset.title}
                  onChange={(e) => setSelectedAsset({ ...selectedAsset, title: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Description</label>
                <Textarea
                  value={selectedAsset.description || ''}
                  onChange={(e) => setSelectedAsset({ ...selectedAsset, description: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Tags</label>
                <Input
                  value={selectedAsset.tags?.join(', ') || ''}
                  onChange={(e) => setSelectedAsset({ ...selectedAsset, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                  placeholder="Comma-separated tags"
                />
              </div>
              <Button onClick={updateAsset} className="w-full">
                Update Asset
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminAssetsPage;


