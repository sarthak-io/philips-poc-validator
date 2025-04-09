import React, { useState } from "react";
import {
  Check,
  X,
  AlertTriangle,
  FileText,
  Download,
  RefreshCw,
  ChevronRight,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import DetailedComparison from "./DetailedComparison";

interface VerificationItem {
  field: string;
  poValue: string;
  invoiceValue: string;
  status: "match" | "mismatch" | "partial" | "pending";
  source?: string;
}

interface VerificationData {
  gst: VerificationItem;
  hsn: VerificationItem;
  msme: VerificationItem;
  companyName: VerificationItem;
  totalAmount: VerificationItem;
  invoiceNumber: VerificationItem;
  poNumber: VerificationItem;
  date: VerificationItem;
}

interface VerificationDashboardProps {
  poDocument?: File;
  invoiceDocument?: File;
  onRequestCorrection?: () => void;
  onAccept?: () => void;
  onReject?: () => void;
  onViewAuditTrail?: () => void;
}

const VerificationDashboard: React.FC<VerificationDashboardProps> = ({
  poDocument = null,
  invoiceDocument = null,
  onRequestCorrection = () => {},
  onAccept = () => {},
  onReject = () => {},
  onViewAuditTrail = () => {},
}) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationProgress, setVerificationProgress] = useState(0);
  const [showDetailedView, setShowDetailedView] = useState(false);
  const [activeTab, setActiveTab] = useState("summary");

  // Mock verification data - in a real app, this would come from API calls
  const [verificationData, setVerificationData] = useState<VerificationData>({
    gst: {
      field: "GST Number",
      poValue: "27AABCP9441L1ZT",
      invoiceValue: "27AABCP9441L1ZT",
      status: "match",
      source: "Government GST Portal",
    },
    hsn: {
      field: "HSN Code",
      poValue: "85371000",
      invoiceValue: "85371000",
      status: "match",
      source: "HSN Database",
    },
    msme: {
      field: "MSME Registration",
      poValue: "UDYAM-MH-33-0012345",
      invoiceValue: "UDYAM-MH-33-0012346",
      status: "mismatch",
      source: "MSME Portal",
    },
    companyName: {
      field: "Company Name",
      poValue: "Philips India Limited",
      invoiceValue: "Philips India Limited",
      status: "match",
    },
    totalAmount: {
      field: "Total Amount",
      poValue: "₹ 245,600.00",
      invoiceValue: "₹ 245,600.00",
      status: "match",
    },
    invoiceNumber: {
      field: "Invoice Number",
      poValue: "N/A",
      invoiceValue: "INV-2023-4567",
      status: "pending",
    },
    poNumber: {
      field: "PO Number",
      poValue: "PO-2023-1234",
      invoiceValue: "PO-2023-1234",
      status: "match",
    },
    date: {
      field: "Date",
      poValue: "15-May-2023",
      invoiceValue: "18-May-2023",
      status: "partial",
    },
  });

  // Calculate overall verification status
  const getOverallStatus = () => {
    const statuses = Object.values(verificationData).map((item) => item.status);
    if (statuses.includes("mismatch")) return "mismatch";
    if (statuses.includes("partial")) return "partial";
    if (statuses.includes("pending")) return "pending";
    return "match";
  };

  const overallStatus = getOverallStatus();

  // Simulate verification process
  const startVerification = () => {
    setIsVerifying(true);
    setVerificationProgress(0);

    const interval = setInterval(() => {
      setVerificationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsVerifying(false);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  // Status indicator component
  const StatusIndicator = ({ status }: { status: string }) => {
    switch (status) {
      case "match":
        return (
          <Badge className="bg-green-500">
            <Check className="h-3 w-3 mr-1" /> Match
          </Badge>
        );
      case "mismatch":
        return (
          <Badge variant="destructive">
            <X className="h-3 w-3 mr-1" /> Mismatch
          </Badge>
        );
      case "partial":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-100 text-yellow-800 border-yellow-300"
          >
            <AlertTriangle className="h-3 w-3 mr-1" /> Partial Match
          </Badge>
        );
      case "pending":
      default:
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-500">
            Pending
          </Badge>
        );
    }
  };

  // Generate summary counts
  const summaryCounts = {
    match: Object.values(verificationData).filter(
      (item) => item.status === "match",
    ).length,
    mismatch: Object.values(verificationData).filter(
      (item) => item.status === "mismatch",
    ).length,
    partial: Object.values(verificationData).filter(
      (item) => item.status === "partial",
    ).length,
    pending: Object.values(verificationData).filter(
      (item) => item.status === "pending",
    ).length,
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-gray-100">
      {/* Header with document info */}
      <div className="p-6 bg-blue-50 rounded-t-lg border-b border-blue-100">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold text-blue-900">
              Verification Dashboard
            </h2>
            <p className="text-blue-700 mt-1">
              Document verification status and results
            </p>
          </div>

          <div className="flex space-x-2">
            {isVerifying ? (
              <div className="flex items-center">
                <Progress value={verificationProgress} className="w-40 mr-3" />
                <span className="text-sm text-blue-700">
                  {verificationProgress}%
                </span>
              </div>
            ) : (
              <Button
                variant="outline"
                className="bg-white border-blue-200 text-blue-700 hover:bg-blue-50"
                onClick={startVerification}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Verify Again
              </Button>
            )}

            <Button
              variant="outline"
              className="bg-white border-blue-200 text-blue-700 hover:bg-blue-50"
              onClick={onViewAuditTrail}
            >
              <FileText className="h-4 w-4 mr-2" />
              Audit Trail
            </Button>
          </div>
        </div>

        {/* Document info */}
        <div className="mt-4 flex space-x-6">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <FileText className="h-5 w-5 text-blue-700" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-900">PO Document</p>
              <p className="text-xs text-blue-700">
                {poDocument ? poDocument.name : "PO-2023-1234.pdf"}
              </p>
            </div>
          </div>

          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <FileText className="h-5 w-5 text-blue-700" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-900">
                Invoice Document
              </p>
              <p className="text-xs text-blue-700">
                {invoiceDocument ? invoiceDocument.name : "INV-2023-4567.pdf"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="p-6">
        <Tabs
          defaultValue="summary"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="mb-4">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="details">Detailed Results</TabsTrigger>
          </TabsList>

          <TabsContent value="summary">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Overall status card */}
              <Card className="border-gray-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">
                    Overall Verification Status
                  </CardTitle>
                  <CardDescription>
                    Summary of document verification
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center py-6">
                    <div
                      className={`h-32 w-32 rounded-full flex items-center justify-center ${overallStatus === "match" ? "bg-green-100" : overallStatus === "mismatch" ? "bg-red-100" : overallStatus === "partial" ? "bg-yellow-100" : "bg-gray-100"}`}
                    >
                      {overallStatus === "match" && (
                        <Check className="h-16 w-16 text-green-600" />
                      )}
                      {overallStatus === "mismatch" && (
                        <X className="h-16 w-16 text-red-600" />
                      )}
                      {overallStatus === "partial" && (
                        <AlertTriangle className="h-16 w-16 text-yellow-600" />
                      )}
                      {overallStatus === "pending" && (
                        <RefreshCw className="h-16 w-16 text-gray-400" />
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="bg-green-50 p-3 rounded-md">
                      <p className="text-sm font-medium text-green-800">
                        Matches
                      </p>
                      <p className="text-2xl font-bold text-green-700">
                        {summaryCounts.match}
                      </p>
                    </div>
                    <div className="bg-red-50 p-3 rounded-md">
                      <p className="text-sm font-medium text-red-800">
                        Mismatches
                      </p>
                      <p className="text-2xl font-bold text-red-700">
                        {summaryCounts.mismatch}
                      </p>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-md">
                      <p className="text-sm font-medium text-yellow-800">
                        Partial
                      </p>
                      <p className="text-2xl font-bold text-yellow-700">
                        {summaryCounts.partial}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="text-sm font-medium text-gray-800">
                        Pending
                      </p>
                      <p className="text-2xl font-bold text-gray-700">
                        {summaryCounts.pending}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Critical fields card */}
              <Card className="border-gray-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">
                    Critical Fields Verification
                  </CardTitle>
                  <CardDescription>
                    Government-verified information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">GST Number</p>
                        <p className="text-xs text-gray-500">
                          {verificationData.gst.source}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <p className="text-sm mr-2">
                          {verificationData.gst.invoiceValue}
                        </p>
                        <StatusIndicator status={verificationData.gst.status} />
                      </div>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">HSN Code</p>
                        <p className="text-xs text-gray-500">
                          {verificationData.hsn.source}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <p className="text-sm mr-2">
                          {verificationData.hsn.invoiceValue}
                        </p>
                        <StatusIndicator status={verificationData.hsn.status} />
                      </div>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">MSME Registration</p>
                        <p className="text-xs text-gray-500">
                          {verificationData.msme.source}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <p className="text-sm mr-2">
                          {verificationData.msme.invoiceValue}
                        </p>
                        <StatusIndicator
                          status={verificationData.msme.status}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button
                    variant="outline"
                    className="w-full text-blue-700 border-blue-200 hover:bg-blue-50"
                    onClick={() => setActiveTab("details")}
                  >
                    View All Fields
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="details">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle>Detailed Verification Results</CardTitle>
                <CardDescription>
                  Comparison of all extracted fields from PO and Invoice
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-left">
                        <th className="p-3 text-sm font-medium text-gray-700">
                          Field
                        </th>
                        <th className="p-3 text-sm font-medium text-gray-700">
                          PO Value
                        </th>
                        <th className="p-3 text-sm font-medium text-gray-700">
                          Invoice Value
                        </th>
                        <th className="p-3 text-sm font-medium text-gray-700">
                          Status
                        </th>
                        <th className="p-3 text-sm font-medium text-gray-700">
                          Source
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.values(verificationData).map((item, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="p-3 text-sm font-medium">
                            {item.field}
                          </td>
                          <td className="p-3 text-sm">{item.poValue}</td>
                          <td className="p-3 text-sm">{item.invoiceValue}</td>
                          <td className="p-3">
                            <StatusIndicator status={item.status} />
                          </td>
                          <td className="p-3 text-sm text-gray-500">
                            {item.source || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  className="text-blue-700 border-blue-200 hover:bg-blue-50"
                  onClick={() => setActiveTab("summary")}
                >
                  Back to Summary
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="text-blue-700 border-blue-200 hover:bg-blue-50"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export Report
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Export Verification Report</DialogTitle>
                      <DialogDescription>
                        Choose the format for your verification report.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4 py-4">
                      <Button
                        variant="outline"
                        className="h-24 flex flex-col items-center justify-center"
                      >
                        <FileText className="h-8 w-8 mb-2" />
                        PDF Format
                      </Button>
                      <Button
                        variant="outline"
                        className="h-24 flex flex-col items-center justify-center"
                      >
                        <FileText className="h-8 w-8 mb-2" />
                        Excel Format
                      </Button>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" className="w-full">
                        Cancel
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Action footer */}
      <div className="p-6 bg-gray-50 rounded-b-lg border-t border-gray-100">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Verification Decision
            </h3>
            <p className="text-sm text-gray-500">
              Take action based on verification results
            </p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              className="border-yellow-200 text-yellow-700 hover:bg-yellow-50"
              onClick={onRequestCorrection}
            >
              Request Correction
            </Button>
            <Button
              variant="outline"
              className="border-red-200 text-red-700 hover:bg-red-50"
              onClick={onReject}
            >
              Reject
            </Button>
            <Button
              className="bg-blue-700 hover:bg-blue-800 text-white"
              onClick={onAccept}
            >
              Accept & Proceed
            </Button>
          </div>
        </div>
      </div>

      {/* Detailed comparison dialog */}
      <Dialog open={showDetailedView} onOpenChange={setShowDetailedView}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Detailed Comparison</DialogTitle>
            <DialogDescription>
              Side-by-side comparison of PO and Invoice data
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <DetailedComparison
              poData={Object.values(verificationData).reduce(
                (acc, item) => {
                  acc[item.field] = item.poValue;
                  return acc;
                },
                {} as Record<string, string>,
              )}
              invoiceData={Object.values(verificationData).reduce(
                (acc, item) => {
                  acc[item.field] = item.invoiceValue;
                  return acc;
                },
                {} as Record<string, string>,
              )}
            />
          </div>
          <DialogFooter>
            <Button onClick={() => setShowDetailedView(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VerificationDashboard;
