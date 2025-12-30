import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ComplianceService } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { KPICard } from '@/components/dashboard/KPICard';
import {
  ShieldCheck,
  AlertTriangle,
  Globe,
  FileText,
  Eye,
  Ban,
  CheckCircle,
  Loader2
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function CompliancePage() {
  const { toast } = useToast();
  const [stats, setStats] = useState({
    pending: 0,
    amlFlags: 0,
    verificationRate: '0%',
    geoBlocked: 0
  });

  const [selectedKyb, setSelectedKyb] = useState<any>(null);

  const { data: pendingKybs, isLoading, refetch } = useQuery({
    queryKey: ['pendingKyb'],
    queryFn: ComplianceService.getPendingKyb
  });

  const approveMutation = useMutation({
    mutationFn: ComplianceService.approveKyb,
    onSuccess: () => {
      toast({
        title: "Business Approved",
        description: "The business has been fully verified and notified.",
        variant: 'default',
        className: 'bg-green-500 text-white'
      });
      refetch();
    },
    onError: (error: any) => {
      toast({
        title: "Approval Failed",
        description: error.response?.data?.message || "Something went wrong",
        variant: "destructive"
      });
    }
  });

  const rejectMutation = useMutation({
    mutationFn: ComplianceService.rejectKyb,
    onSuccess: () => {
      toast({
        title: "Business Rejected",
        description: "The business application has been rejected.",
        variant: 'destructive',
      });
      refetch();
    },
    onError: (error: any) => {
      toast({
        title: "Action Failed",
        description: error.response?.data?.message || "Something went wrong",
        variant: "destructive"
      });
    }
  });

  // Update stats when data loads
  if (pendingKybs && pendingKybs.length !== stats.pending) {
    setStats(prev => ({ ...prev, pending: pendingKybs.length }));
  }

  const handleApprove = (id: string) => {
    if (confirm('Are you sure you want to approve this business? This will create a virtual account.')) {
      approveMutation.mutate(id);
    }
  };

  const handleReject = (id: string) => {
    if (confirm('Are you sure you want to reject this application?')) {
      rejectMutation.mutate(id);
    }
  };

  const handleOpenReview = (item: any) => {
    setSelectedKyb(item);
  };

  const renderDocumentPreview = (url: string) => {
    const API_URL = 'https://api.afblock.dartsia.app';
    // Prefix with API URL if it's a relative path
    const fullUrl = url.startsWith('http') ? url : `${API_URL}${url}`;
    const isPdf = fullUrl.toLowerCase().endsWith('.pdf');
    return (
      <div className="border rounded-lg p-4 bg-muted/20">
        <div className="mb-2 flex justify-between items-center">
          <span className="text-sm font-medium">Document Preview</span>
          <a href={fullUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
            Open in New Tab
          </a>
        </div>
        {isPdf ? (
          <iframe src={fullUrl} className="w-full h-[400px] rounded border" title="PDF Preview" />
        ) : (
          <img src={fullUrl} alt="Document" className="max-w-full max-h-[400px] object-contain rounded border" />
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Compliance & Risk</h1>
        <p className="text-muted-foreground">KYC verification, AML monitoring, and risk management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard
          title="KYC Pending"
          value={stats.pending}
          subtitle="Documents to review"
          icon={<FileText className="h-6 w-6" />}
          variant="warning"
        />
        <KPICard
          title="AML Flags"
          value={stats.amlFlags}
          subtitle="Active alerts"
          icon={<AlertTriangle className="h-6 w-6" />}
          variant="destructive"
        />
        <KPICard
          title="Verification Rate"
          value={stats.verificationRate}
          subtitle="Users verified"
          icon={<ShieldCheck className="h-6 w-6" />}
          variant="success"
        />
        <KPICard
          title="Geo Blocked"
          value={stats.geoBlocked}
          subtitle="Restricted regions"
          icon={<Globe className="h-6 w-6" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* KYC Pending */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Pending KYB Reviews (Business)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Company</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Submitted By</TableHead>
                    <TableHead>Documents</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">Loading...</TableCell>
                    </TableRow>
                  ) : pendingKybs?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No pending reviews</TableCell>
                    </TableRow>
                  ) : (
                    pendingKybs?.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {item.company_name}
                          <span className="block text-xs text-muted-foreground">ID: {item.id.substring(0, 8)}...</span>
                        </TableCell>
                        <TableCell>{item.country}</TableCell>
                        <TableCell>
                          {item.users?.[0]?.email || 'N/A'}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {item.kyb_data?.documents ? (
                              <Badge variant="outline">{Object.keys(item.kyb_data.documents).length} Files</Badge>
                            ) : (
                              <Badge variant="secondary">0 Files</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {new Date(item.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1"
                              onClick={() => handleOpenReview(item)}
                            >
                              <Eye className="h-3 w-3" />
                              Review
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1 text-green-600 border-green-200 hover:bg-green-50"
                              onClick={() => handleApprove(item.id)}
                              disabled={approveMutation.isPending}
                            >
                              <CheckCircle className="h-3 w-3" />
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1 text-red-600 border-red-200 hover:bg-red-50"
                              onClick={() => handleReject(item.id)}
                              disabled={rejectMutation.isPending}
                            >
                              <Ban className="h-3 w-3" />
                              Reject
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Review Dialog */}
      <Dialog open={!!selectedKyb} onOpenChange={(open) => !open && setSelectedKyb(null)}>
        <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b">
            <DialogTitle>KYB Review: {selectedKyb?.company_name}</DialogTitle>
            <DialogDescription>
              Review business details and uploaded documents.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-2 sticky top-0 bg-background z-10 my-4">
                <TabsTrigger value="details">Business Details</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground font-medium uppercase">Company Name</label>
                    <p className="font-medium">{selectedKyb?.company_name}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground font-medium uppercase">Country</label>
                    <p className="font-medium">{selectedKyb?.country}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground font-medium uppercase">Registration Number</label>
                    <p className="font-medium">{selectedKyb?.kyb_data?.registrationNumber || 'N/A'}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground font-medium uppercase">Tax ID / VAT</label>
                    <p className="font-medium">{selectedKyb?.kyb_data?.taxId || selectedKyb?.kyb_data?.vatNumber || 'N/A'}</p>
                  </div>
                  <div className="col-span-2 space-y-1">
                    <label className="text-xs text-muted-foreground font-medium uppercase">Address</label>
                    <p className="font-medium">
                      {selectedKyb?.kyb_data?.registeredAddress}, {selectedKyb?.kyb_data?.city}, {selectedKyb?.kyb_data?.postalCode}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <h4 className="font-semibold text-sm">Directors</h4>
                  {selectedKyb?.kyb_data?.directors?.map((d: any, i: number) => (
                    <div key={i} className="bg-muted/30 p-3 rounded-lg text-sm grid grid-cols-2 gap-2">
                      <div><span className="text-muted-foreground">Name:</span> {d.name}</div>
                      <div><span className="text-muted-foreground">Role:</span> {d.role}</div>
                      <div><span className="text-muted-foreground">Email:</span> {d.email}</div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <h4 className="font-semibold text-sm">Shareholders</h4>
                  {selectedKyb?.kyb_data?.shareholders?.map((s: any, i: number) => (
                    <div key={i} className="bg-muted/30 p-3 rounded-lg text-sm flex justify-between">
                      <div>{s.name} ({s.type})</div>
                      <div className="font-bold">{s.ownership}%</div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="documents" className="space-y-6 py-4">
                <div className="space-y-4">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Certificate of Incorporation
                  </h4>
                  {selectedKyb?.kyb_data?.documents?.certificate ? (
                    renderDocumentPreview(selectedKyb.kyb_data.documents.certificate)
                  ) : (
                    <div className="p-8 border border-dashed rounded text-center text-muted-foreground">No certificate uploaded</div>
                  )}
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Articles of Association
                  </h4>
                  {selectedKyb?.kyb_data?.documents?.articles ? (
                    renderDocumentPreview(selectedKyb.kyb_data.documents.articles)
                  ) : (
                    <div className="p-8 border border-dashed rounded text-center text-muted-foreground">No articles uploaded</div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <DialogFooter className="border-t px-6 py-4 gap-2">
            <Button variant="outline" onClick={() => setSelectedKyb(null)}>Close</Button>
            <Button
              variant="destructive"
              onClick={() => { handleReject(selectedKyb.id); setSelectedKyb(null); }}
              disabled={rejectMutation.isPending}
            >
              Reject Application
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => { handleApprove(selectedKyb.id); setSelectedKyb(null); }}
              disabled={approveMutation.isPending}
            >
              Approve Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
