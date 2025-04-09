import React, { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  FileText,
  FileCheck,
  History,
  RefreshCw,
} from "lucide-react";
import DocumentUpload from "./DocumentUpload";
import VerificationDashboard from "./VerificationDashboard";
import AuditTrail from "./AuditTrail";
import { verifyDocuments } from "@/services/verificationService";
import { DocumentData, VerificationResult } from "@/types/verification";

const Home = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationComplete, setVerificationComplete] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState<DocumentData>({
    invoice: null,
    po: null,
  });

  // Verification results state
  const [verificationResults, setVerificationResults] = useState<{
    status: "success" | "error" | "partial";
    gst: {
      status: string;
      invoiceValue: string;
      poValue: string;
      govtValue: string;
    };
    hsn: {
      status: string;
      invoiceValue: string;
      poValue: string;
      govtValue: string;
    };
    msme: {
      status: string;
      invoiceValue: string;
      poValue: string;
      govtValue: string;
    };
  }>({
    status: "partial",
    gst: {
      status: "success",
      invoiceValue: "27AABCP9441L1ZP",
      poValue: "27AABCP9441L1ZP",
      govtValue: "27AABCP9441L1ZP",
    },
    hsn: {
      status: "error",
      invoiceValue: "85044090",
      poValue: "85044010",
      govtValue: "85044090",
    },
    msme: {
      status: "warning",
      invoiceValue: "UDYAM-MH-33-0012345",
      poValue: "UDYAM-MH-33-0012345",
      govtValue: "Verification pending",
    },
  });

  const handleDocumentUpload = (type: "invoice" | "po", file: File) => {
    setUploadedDocuments((prev) => ({
      ...prev,
      [type]: file,
    }));
  };

  const handleVerification = async () => {
    if (!uploadedDocuments.invoice || !uploadedDocuments.po) {
      return;
    }

    setIsVerifying(true);

    try {
      // Call the verification service
      const result = await verifyDocuments(
        uploadedDocuments.invoice,
        uploadedDocuments.po,
      );

      if (result.success && result.comparisonResults) {
        // Determine overall status
        const statuses = Object.values(result.comparisonResults).map(
          (item) => item.status,
        );
        let overallStatus: "success" | "error" | "partial" = "success";

        if (statuses.includes("mismatch")) {
          overallStatus = "error";
        } else if (statuses.includes("partial")) {
          overallStatus = "partial";
        }

        // Update verification results
        setVerificationResults({
          status: overallStatus,
          gst: {
            status: result.comparisonResults.gst?.status || "pending",
            invoiceValue: result.comparisonResults.gst?.invoiceValue || "",
            poValue: result.comparisonResults.gst?.poValue || "",
            govtValue: result.comparisonResults.gst?.govtValue || "",
          },
          hsn: {
            status: result.comparisonResults.hsn?.status || "pending",
            invoiceValue: result.comparisonResults.hsn?.invoiceValue || "",
            poValue: result.comparisonResults.hsn?.poValue || "",
            govtValue: result.comparisonResults.hsn?.govtValue || "",
          },
          msme: {
            status: result.comparisonResults.msme?.status || "pending",
            invoiceValue: result.comparisonResults.msme?.invoiceValue || "",
            poValue: result.comparisonResults.msme?.poValue || "",
            govtValue: result.comparisonResults.msme?.govtValue || "",
          },
        });
      }

      setVerificationComplete(true);
      setActiveTab("verification");
    } catch (error) {
      console.error("Verification failed:", error);
    } finally {
      setIsVerifying(false);
    }
  };

  const resetVerification = () => {
    setUploadedDocuments({ invoice: null, po: null });
    setVerificationComplete(false);
    setActiveTab("dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-[#0E5AA7] text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 0C8.954 0 0 8.954 0 20C0 31.046 8.954 40 20 40C31.046 40 40 31.046 40 20C40 8.954 31.046 0 20 0ZM20 36.923C10.651 36.923 3.077 29.349 3.077 20C3.077 10.651 10.651 3.077 20 3.077C29.349 3.077 36.923 10.651 36.923 20C36.923 29.349 29.349 36.923 20 36.923Z"
                fill="white"
              />
              <path
                d="M30 20C30 25.523 25.523 30 20 30C14.477 30 10 25.523 10 20C10 14.477 14.477 10 20 10C25.523 10 30 14.477 30 20Z"
                fill="white"
              />
            </svg>
            <h1 className="text-xl font-bold">
              AlphaByte Invoice & PO Verification System
            </h1>
          </div>
          <div>
            <Button
              variant="outline"
              className="text-white border-white hover:bg-blue-700"
            >
              <History className="mr-2 h-4 w-4" /> View Audit Log
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-8 px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between items-center mb-6">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="dashboard" disabled={isVerifying}>
                <FileText className="mr-2 h-4 w-4" /> Upload
              </TabsTrigger>
              <TabsTrigger
                value="verification"
                disabled={!verificationComplete && !isVerifying}
              >
                <FileCheck className="mr-2 h-4 w-4" /> Verification
              </TabsTrigger>
              <TabsTrigger value="audit">
                <History className="mr-2 h-4 w-4" /> Audit Trail
              </TabsTrigger>
            </TabsList>

            {verificationComplete && (
              <Button variant="outline" onClick={resetVerification}>
                <RefreshCw className="mr-2 h-4 w-4" /> New Verification
              </Button>
            )}
          </div>

          <TabsContent value="dashboard" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Document Upload</CardTitle>
                  <CardDescription>
                    Upload your invoice and purchase order documents for
                    verification.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">
                        Invoice Document
                      </h3>
                      <DocumentUpload
                        onUploadComplete={(file) =>
                          handleDocumentUpload("invoice", file)
                        }
                        documentType="invoice"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">
                        Purchase Order Document
                      </h3>
                      <DocumentUpload
                        onUploadComplete={(file) =>
                          handleDocumentUpload("po", file)
                        }
                        documentType="po"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-center">
                    <Button
                      size="lg"
                      className="bg-[#0E5AA7] hover:bg-[#0A4785] w-full max-w-md"
                      disabled={
                        !uploadedDocuments.invoice ||
                        !uploadedDocuments.po ||
                        isVerifying
                      }
                      onClick={handleVerification}
                    >
                      {isVerifying ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />{" "}
                          Verifying Documents...
                        </>
                      ) : (
                        "Verify Documents"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Verification Process</CardTitle>
                  <CardDescription>
                    How our automated verification system works
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col items-center text-center p-4 border rounded-lg">
                      <div className="bg-blue-100 p-3 rounded-full mb-3">
                        <FileText className="h-6 w-6 text-[#0E5AA7]" />
                      </div>
                      <h3 className="font-medium mb-2">1. Document Upload</h3>
                      <p className="text-sm text-gray-600">
                        Upload your invoice and purchase order documents in PDF
                        format.
                      </p>
                    </div>
                    <div className="flex flex-col items-center text-center p-4 border rounded-lg">
                      <div className="bg-blue-100 p-3 rounded-full mb-3">
                        <RefreshCw className="h-6 w-6 text-[#0E5AA7]" />
                      </div>
                      <h3 className="font-medium mb-2">
                        2. Automated Verification
                      </h3>
                      <p className="text-sm text-gray-600">
                        Our system extracts and verifies GST, HSN, and MSME
                        numbers against government records.
                      </p>
                    </div>
                    <div className="flex flex-col items-center text-center p-4 border rounded-lg">
                      <div className="bg-blue-100 p-3 rounded-full mb-3">
                        <CheckCircle className="h-6 w-6 text-[#0E5AA7]" />
                      </div>
                      <h3 className="font-medium mb-2">3. Results & Action</h3>
                      <p className="text-sm text-gray-600">
                        Review verification results with highlighted
                        discrepancies and take appropriate action.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="verification">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <VerificationDashboard
                results={verificationResults}
                documents={uploadedDocuments}
              />
            </motion.div>
          </TabsContent>

          <TabsContent value="audit">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <AuditTrail />
            </motion.div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 border-t py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-600">
                © {new Date().getFullYear()} AlphaByte Invoice & PO
                Verification System
              </p>
            </div>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-sm text-gray-600 hover:text-[#0E5AA7]"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-sm text-gray-600 hover:text-[#0E5AA7]"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-sm text-gray-600 hover:text-[#0E5AA7]"
              >
                Help & Support
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Status Indicators Legend */}
      <div className="fixed bottom-4 right-4 bg-white p-3 rounded-lg shadow-lg border">
        <div className="text-xs font-medium mb-2">Status Indicators</div>
        <div className="space-y-1">
          <div className="flex items-center">
            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
            <span className="text-xs">Match</span>
          </div>
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
            <span className="text-xs">Mismatch</span>
          </div>
          <div className="flex items-center">
            <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
            <span className="text-xs">Partial/Pending</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
