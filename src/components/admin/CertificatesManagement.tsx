import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Edit,
  Trash2,
  Upload,
  Loader2,
  Download,
  QrCode,
  Image as ImageIcon,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useImageUpload } from "@/hooks/useImageUpload";

interface Certificate {
  id: string;
  certificate_number: string;
  full_name: string | null;
  program: string | null;
  training_period: string | null;
  passport_url: string | null;
  issuing_organization: string | null;
  status: string | null;
  issued_at: string;
  user_id: string | null;
  course_id: string | null;
}

interface CertificatesManagementProps {
  certificates: Certificate[];
  onRefresh: () => void;
  loading: boolean;
}

export const CertificatesManagement = ({
  certificates,
  onRefresh,
  loading,
}: CertificatesManagementProps) => {
  const { toast } = useToast();
  const passportInputRef = useRef<HTMLInputElement>(null);
  const qrCodeRef = useRef<HTMLDivElement>(null);
  const { uploadImage, uploading } = useImageUpload({
    bucket: "certificate-images",
    folder: "passports",
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null);
  const [saving, setSaving] = useState(false);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [selectedCertForQR, setSelectedCertForQR] = useState<Certificate | null>(null);

  const [form, setForm] = useState({
    certificate_number: "",
    full_name: "",
    program: "",
    training_period: "",
    passport_url: "",
    issuing_organization: "JE Tech Hub",
    status: "verified",
  });

  const resetForm = () => {
    setForm({
      certificate_number: "",
      full_name: "",
      program: "",
      training_period: "",
      passport_url: "",
      issuing_organization: "JE Tech Hub",
      status: "verified",
    });
    setEditingCertificate(null);
  };

  const openAddDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEditDialog = (cert: Certificate) => {
    setEditingCertificate(cert);
    setForm({
      certificate_number: cert.certificate_number,
      full_name: cert.full_name || "",
      program: cert.program || "",
      training_period: cert.training_period || "",
      passport_url: cert.passport_url || "",
      issuing_organization: cert.issuing_organization || "JE Tech Hub",
      status: cert.status || "verified",
    });
    setDialogOpen(true);
  };

  const handlePassportUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const publicUrl = await uploadImage(file);
    if (publicUrl) {
      setForm((prev) => ({ ...prev, passport_url: publicUrl }));
      toast({ title: "Uploaded", description: "Passport photo uploaded successfully" });
    }
    e.target.value = "";
  };

  const handleSave = async () => {
    if (!form.certificate_number.trim() || !form.full_name.trim()) {
      toast({
        title: "Validation Error",
        description: "Certificate ID and Full Name are required",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);

    try {
      const certData = {
        certificate_number: form.certificate_number.trim().toUpperCase(),
        full_name: form.full_name.trim(),
        program: form.program.trim() || null,
        training_period: form.training_period.trim() || null,
        passport_url: form.passport_url.trim() || null,
        issuing_organization: form.issuing_organization.trim() || "JE Tech Hub",
        status: form.status,
      };

      if (editingCertificate) {
        const { error } = await supabase
          .from("certificates")
          .update(certData)
          .eq("id", editingCertificate.id);

        if (error) {
          toast({
            title: "Error",
            description: error.message || "Failed to update certificate",
            variant: "destructive",
          });
        } else {
          toast({ title: "Success", description: "Certificate updated successfully" });
          setDialogOpen(false);
          resetForm();
          onRefresh();
        }
      } else {
        const { error } = await supabase.from("certificates").insert([certData]);

        if (error) {
          if (error.code === "23505") {
            toast({
              title: "Duplicate Error",
              description: "A certificate with this ID already exists",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Error",
              description: error.message || "Failed to add certificate",
              variant: "destructive",
            });
          }
        } else {
          toast({ title: "Success", description: "Certificate added successfully" });
          setDialogOpen(false);
          resetForm();
          onRefresh();
        }
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (certId: string) => {
    const { error } = await supabase.from("certificates").delete().eq("id", certId);

    if (error) {
      toast({ title: "Error", description: "Failed to delete certificate", variant: "destructive" });
    } else {
      toast({ title: "Deleted", description: "Certificate deleted successfully" });
      onRefresh();
    }
  };

  const openQRDialog = (cert: Certificate) => {
    setSelectedCertForQR(cert);
    setQrDialogOpen(true);
  };

  const downloadQRCode = () => {
    if (!selectedCertForQR || !qrCodeRef.current) return;

    const svg = qrCodeRef.current.querySelector("svg");
    if (!svg) return;

    // Create a canvas and draw the SVG
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();

    canvas.width = 300;
    canvas.height = 300;

    img.onload = () => {
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, 300, 300);

        const link = document.createElement("a");
        link.download = `QR-${selectedCertForQR.certificate_number}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      }
    };

    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  const getVerificationUrl = (certNumber: string) => {
    return `${window.location.origin}/verify/${encodeURIComponent(certNumber)}`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Certificates Management</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onRefresh} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button size="sm" onClick={openAddDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Add Certificate
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Certificate ID</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>Program</TableHead>
                <TableHead>Training Period</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Issued</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {certificates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No certificates found. Click "Add Certificate" to create one.
                  </TableCell>
                </TableRow>
              ) : (
                certificates.map((cert) => (
                  <TableRow key={cert.id}>
                    <TableCell className="font-mono font-medium">
                      {cert.certificate_number}
                    </TableCell>
                    <TableCell>{cert.full_name || "N/A"}</TableCell>
                    <TableCell>{cert.program || "N/A"}</TableCell>
                    <TableCell>{cert.training_period || "N/A"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={cert.status === "verified" ? "default" : "secondary"}
                        className={cert.status === "verified" ? "bg-green-600" : ""}
                      >
                        {cert.status || "verified"}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(cert.issued_at)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openQRDialog(cert)}
                          title="Download QR Code"
                        >
                          <QrCode className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => window.open(`/verify/${cert.certificate_number}`, "_blank")}
                          title="View Certificate"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(cert)}
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" title="Delete">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Certificate?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete the certificate for{" "}
                                <strong>{cert.full_name}</strong> ({cert.certificate_number}).
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(cert.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCertificate ? "Edit Certificate" : "Add New Certificate"}
            </DialogTitle>
            <DialogDescription>
              {editingCertificate
                ? "Update the certificate details below."
                : "Fill in the details to create a new certificate."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="certificate_number">Certificate ID *</Label>
              <Input
                id="certificate_number"
                placeholder="e.g., SD-2022-AMT-001"
                value={form.certificate_number}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, certificate_number: e.target.value.toUpperCase() }))
                }
                disabled={!!editingCertificate}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name *</Label>
              <Input
                id="full_name"
                placeholder="Student's full name"
                value={form.full_name}
                onChange={(e) => setForm((prev) => ({ ...prev, full_name: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="program">Program</Label>
              <Input
                id="program"
                placeholder="e.g., Software Development | Responsive Design"
                value={form.program}
                onChange={(e) => setForm((prev) => ({ ...prev, program: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="training_period">Training Period</Label>
              <Input
                id="training_period"
                placeholder="e.g., January 2022 – June 2022"
                value={form.training_period}
                onChange={(e) => setForm((prev) => ({ ...prev, training_period: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="issuing_organization">Issuing Organization</Label>
              <Input
                id="issuing_organization"
                placeholder="JE Tech Hub"
                value={form.issuing_organization}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, issuing_organization: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={form.status}
                onValueChange={(value) => setForm((prev) => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="revoked">Revoked</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Passport Photo</Label>
              <div className="flex items-center gap-4">
                {form.passport_url ? (
                  <img
                    src={form.passport_url}
                    alt="Passport preview"
                    className="w-20 h-24 object-cover rounded-lg border"
                  />
                ) : (
                  <div className="w-20 h-24 bg-muted rounded-lg border flex items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1">
                  <input
                    type="file"
                    ref={passportInputRef}
                    accept="image/*"
                    onChange={handlePassportUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => passportInputRef.current?.click()}
                    disabled={uploading}
                    className="w-full"
                  >
                    {uploading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4 mr-2" />
                    )}
                    {uploading ? "Uploading..." : "Upload Photo"}
                  </Button>
                  {form.passport_url && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setForm((prev) => ({ ...prev, passport_url: "" }))}
                      className="w-full mt-2 text-destructive"
                    >
                      Remove Photo
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingCertificate ? "Update" : "Create"} Certificate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* QR Code Dialog */}
      <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Certificate QR Code</DialogTitle>
            <DialogDescription>
              Share this QR code with the student to verify their certificate.
            </DialogDescription>
          </DialogHeader>

          {selectedCertForQR && (
            <div className="flex flex-col items-center gap-4 py-4">
              <div ref={qrCodeRef} className="p-4 bg-white rounded-xl shadow-md border">
                <QRCodeSVG
                  value={getVerificationUrl(selectedCertForQR.certificate_number)}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <div className="text-center space-y-1">
                <p className="font-semibold">{selectedCertForQR.full_name}</p>
                <p className="text-sm text-muted-foreground font-mono">
                  {selectedCertForQR.certificate_number}
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setQrDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={downloadQRCode}>
              <Download className="h-4 w-4 mr-2" />
              Download QR Code
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
