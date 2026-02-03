import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Award, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  User, 
  GraduationCap, 
  Building2,
  QrCode,
  Shield,
  Loader2
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { SEOHead } from "@/components/seo/SEOHead";

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
}

export default function CertificateVerify() {
  const { certificateId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const certIdFromUrl = certificateId || searchParams.get("id");

  useEffect(() => {
    if (certIdFromUrl) {
      verifyCertificate(certIdFromUrl);
    }
  }, [certIdFromUrl]);

  const verifyCertificate = async (certNumber: string) => {
    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const { data, error: fetchError } = await supabase
        .from("certificates")
        .select("*")
        .eq("certificate_number", certNumber.trim().toUpperCase())
        .maybeSingle();

      if (fetchError) {
        console.error("Error fetching certificate:", fetchError);
        setError("An error occurred while verifying the certificate.");
        setCertificate(null);
      } else {
        setCertificate(data);
      }
    } catch (err) {
      console.error("Verification error:", err);
      setError("An unexpected error occurred.");
      setCertificate(null);
    } finally {
      setLoading(false);
    }
  };

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/verify/${encodeURIComponent(searchInput.trim().toUpperCase())}`);
    }
  };

  const getVerificationUrl = (certNumber: string) => {
    return `${window.location.origin}/verify/${encodeURIComponent(certNumber)}`;
  };

  return (
    <>
      <SEOHead
        title="Certificate Verification"
        description="Verify the authenticity of certificates issued by Joe Express Tech Hub Gwagwalada. Enter a Certificate ID to check validity."
        keywords="certificate verification, verify certificate, Joe Express Tech Hub, Gwagwalada, tech training certificate"
        canonical={`https://www.joexpresstechhub.com/verify${certIdFromUrl ? `/${certIdFromUrl}` : ""}`}
      />

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        {/* Header */}
        <header className="bg-primary text-primary-foreground py-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Shield className="h-8 w-8" />
              <h1 className="text-2xl md:text-3xl font-bold">Certificate Verification Portal</h1>
            </div>
            <p className="text-center text-primary-foreground/80">
              Joe Express Tech Hub Gwagwalada
            </p>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Search Form */}
          <Card className="mb-8 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Search className="h-5 w-5 text-primary" />
                Verify a Certificate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleManualSearch} className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="text"
                  placeholder="Enter Certificate ID (e.g., SD-2022-AMT-001)"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" disabled={loading || !searchInput.trim()}>
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Search className="h-4 w-4 mr-2" />
                  )}
                  Verify
                </Button>
              </form>
              <p className="text-sm text-muted-foreground mt-3">
                Enter the Certificate ID exactly as it appears on the certificate document.
              </p>
            </CardContent>
          </Card>

          {/* Loading State */}
          {loading && (
            <Card className="shadow-lg">
              <CardContent className="py-12 text-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Verifying certificate...</p>
              </CardContent>
            </Card>
          )}

          {/* Error State */}
          {error && !loading && (
            <Card className="shadow-lg border-destructive/50">
              <CardContent className="py-12 text-center">
                <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-destructive mb-2">Verification Error</h2>
                <p className="text-muted-foreground">{error}</p>
              </CardContent>
            </Card>
          )}

          {/* Certificate Not Found */}
          {searched && !loading && !error && !certificate && (
            <Card className="shadow-lg border-destructive/50">
              <CardContent className="py-12 text-center">
                <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
                <Badge variant="destructive" className="mb-4 text-base px-4 py-1">
                  Not Found
                </Badge>
                <h2 className="text-xl font-semibold mb-2">Certificate Not Found</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  The certificate ID "{certIdFromUrl}" could not be found in our database. 
                  Please check the ID and try again, or contact us if you believe this is an error.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Certificate Found */}
          {certificate && !loading && (
            <Card className="shadow-lg border-green-500/50">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-t-lg">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-10 w-10 text-green-600" />
                    <div>
                      <Badge className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1">
                        ✓ Verified
                      </Badge>
                    </div>
                  </div>
                  <div className="text-center sm:text-left">
                    <CardTitle className="text-xl text-green-800 dark:text-green-400">
                      Certificate Authenticated
                    </CardTitle>
                    <p className="text-sm text-green-700/80 dark:text-green-500/80">
                      This certificate has been verified as authentic
                    </p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Certificate Details */}
                  <div className="md:col-span-2 space-y-4">
                    {/* Full Name */}
                    <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                      <User className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Full Name</p>
                        <p className="font-semibold text-lg">{certificate.full_name || "N/A"}</p>
                      </div>
                    </div>

                    {/* Program */}
                    <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                      <GraduationCap className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Program</p>
                        <p className="font-semibold">{certificate.program || "N/A"}</p>
                      </div>
                    </div>

                    {/* Training Period */}
                    <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                      <Calendar className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Training Period</p>
                        <p className="font-semibold">{certificate.training_period || "N/A"}</p>
                      </div>
                    </div>

                    {/* Certificate ID */}
                    <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                      <Award className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Certificate ID</p>
                        <p className="font-mono font-semibold">{certificate.certificate_number}</p>
                      </div>
                    </div>

                    {/* Issuing Organization */}
                    <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                      <Building2 className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Issuing Organization</p>
                        <p className="font-semibold">{certificate.issuing_organization || "Joe Express Tech Hub"}</p>
                      </div>
                    </div>

                    {/* Passport Photo */}
                    {certificate.passport_url && (
                      <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                        <User className="h-5 w-5 text-primary mt-0.5" />
                        <div className="w-full">
                          <p className="text-sm text-muted-foreground mb-2">Passport Photo</p>
                          <img 
                            src={certificate.passport_url} 
                            alt={`Passport photo of ${certificate.full_name}`}
                            className="w-32 h-40 object-cover rounded-lg border shadow-sm"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* QR Code Section */}
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-4 bg-white rounded-xl shadow-md border">
                      <QRCodeSVG
                        value={getVerificationUrl(certificate.certificate_number)}
                        size={150}
                        level="H"
                        includeMargin={true}
                      />
                    </div>
                    <div className="text-center">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <QrCode className="h-4 w-4" />
                        <span>Scan to Verify</span>
                      </div>
                      <p className="text-xs text-muted-foreground max-w-[180px]">
                        Scan this QR code to instantly verify this certificate
                      </p>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="text-center text-sm text-muted-foreground">
                  <p>
                    Issued on: {new Date(certificate.issued_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Info Section */}
          {!searched && !loading && (
            <Card className="bg-muted/30 border-dashed">
              <CardContent className="py-8 text-center">
                <Award className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">How to Verify</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Enter the Certificate ID found on your certificate document, or scan the QR code 
                  printed on the certificate to verify its authenticity.
                </p>
              </CardContent>
            </Card>
          )}
        </main>

        {/* Footer */}
        <footer className="mt-auto py-6 border-t bg-muted/30">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Joe Express Tech Hub Gwagwalada. All rights reserved.</p>
            <p className="mt-1">
              For inquiries, contact us at{" "}
              <a href="mailto:info@joexpresstechhub.com" className="text-primary hover:underline">
                info@joexpresstechhub.com
              </a>
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
