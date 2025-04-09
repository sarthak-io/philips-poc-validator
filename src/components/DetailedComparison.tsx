import React from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Download,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ComparisonItem {
  field: string;
  poValue: string;
  invoiceValue: string;
  status: "match" | "mismatch" | "warning";
}

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  hsn: string;
  status: "match" | "mismatch" | "warning";
}

interface DetailedComparisonProps {
  poNumber?: string;
  invoiceNumber?: string;
  companyDetails?: ComparisonItem[];
  taxInformation?: ComparisonItem[];
  lineItems?: {
    po: LineItem[];
    invoice: LineItem[];
  };
  totals?: ComparisonItem[];
  onBack?: () => void;
  onExport?: () => void;
}

const DetailedComparison: React.FC<DetailedComparisonProps> = ({
  poNumber = "PO-2023-0042",
  invoiceNumber = "INV-2023-0067",
  companyDetails = [
    {
      field: "Company Name",
      poValue: "Philips India Ltd.",
      invoiceValue: "Philips India Ltd.",
      status: "match",
    },
    {
      field: "GST Number",
      poValue: "27AABCP9782N1ZO",
      invoiceValue: "27AABCP9782N1ZO",
      status: "match",
    },
    {
      field: "Address",
      poValue: "8th Floor, 9B Cyber City, DLF Phase 2, Gurugram",
      invoiceValue: "8th Floor, 9B Cyber City, DLF Phase 2, Gurugram",
      status: "match",
    },
    {
      field: "Contact Person",
      poValue: "Rahul Sharma",
      invoiceValue: "Amit Patel",
      status: "mismatch",
    },
  ],
  taxInformation = [
    { field: "GST Rate", poValue: "18%", invoiceValue: "18%", status: "match" },
    {
      field: "HSN Code",
      poValue: "85131090",
      invoiceValue: "85131090",
      status: "match",
    },
    {
      field: "MSME Number",
      poValue: "UDYAM-HR-28-0012345",
      invoiceValue: "UDYAM-HR-28-0012345",
      status: "match",
    },
    {
      field: "Tax Registration Date",
      poValue: "12/04/2018",
      invoiceValue: "14/04/2018",
      status: "warning",
    },
  ],
  lineItems = {
    po: [
      {
        id: "1",
        description: "Philips LED Bulb 9W",
        quantity: 100,
        unitPrice: 120,
        totalPrice: 12000,
        hsn: "85131090",
        status: "match",
      },
      {
        id: "2",
        description: "Philips Air Purifier AC1217",
        quantity: 5,
        unitPrice: 15000,
        totalPrice: 75000,
        hsn: "84213920",
        status: "match",
      },
      {
        id: "3",
        description: "Philips Hair Dryer HP8100",
        quantity: 10,
        unitPrice: 1200,
        totalPrice: 12000,
        hsn: "85163100",
        status: "match",
      },
    ],
    invoice: [
      {
        id: "1",
        description: "Philips LED Bulb 9W",
        quantity: 100,
        unitPrice: 120,
        totalPrice: 12000,
        hsn: "85131090",
        status: "match",
      },
      {
        id: "2",
        description: "Philips Air Purifier AC1217",
        quantity: 5,
        unitPrice: 16000,
        totalPrice: 80000,
        hsn: "84213920",
        status: "mismatch",
      },
      {
        id: "3",
        description: "Philips Hair Dryer HP8100",
        quantity: 10,
        unitPrice: 1200,
        totalPrice: 12000,
        hsn: "85163100",
        status: "match",
      },
    ],
  },
  totals = [
    {
      field: "Subtotal",
      poValue: "99000",
      invoiceValue: "104000",
      status: "mismatch",
    },
    {
      field: "GST (18%)",
      poValue: "17820",
      invoiceValue: "18720",
      status: "mismatch",
    },
    {
      field: "Total",
      poValue: "116820",
      invoiceValue: "122720",
      status: "mismatch",
    },
  ],
  onBack = () => console.log("Back clicked"),
  onExport = () => console.log("Export clicked"),
}) => {
  const getStatusIcon = (status: "match" | "mismatch" | "warning") => {
    switch (status) {
      case "match":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "mismatch":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
    }
  };

  const getStatusColor = (status: "match" | "mismatch" | "warning") => {
    switch (status) {
      case "match":
        return "bg-green-50 border-green-200";
      case "mismatch":
        return "bg-red-50 border-red-200";
      case "warning":
        return "bg-amber-50 border-amber-200";
    }
  };

  const getStatusBadge = (status: "match" | "mismatch" | "warning") => {
    switch (status) {
      case "match":
        return (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800 hover:bg-green-100"
          >
            Match
          </Badge>
        );
      case "mismatch":
        return (
          <Badge
            variant="outline"
            className="bg-red-100 text-red-800 hover:bg-red-100"
          >
            Mismatch
          </Badge>
        );
      case "warning":
        return (
          <Badge
            variant="outline"
            className="bg-amber-100 text-amber-800 hover:bg-amber-100"
          >
            Warning
          </Badge>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full bg-white p-6 rounded-lg shadow-sm"
    >
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
        <Button
          onClick={onExport}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Detailed Comparison
        </h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-gray-600">PO:</span>
            <Badge variant="outline" className="bg-blue-50 text-blue-800">
              {poNumber}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Invoice:</span>
            <Badge variant="outline" className="bg-purple-50 text-purple-800">
              {invoiceNumber}
            </Badge>
          </div>
        </div>
      </div>

      <Tabs defaultValue="company" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="company">Company Details</TabsTrigger>
          <TabsTrigger value="tax">Tax Information</TabsTrigger>
          <TabsTrigger value="items">Line Items</TabsTrigger>
          <TabsTrigger value="totals">Totals</TabsTrigger>
        </TabsList>

        <TabsContent value="company" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Company Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Field</TableHead>
                    <TableHead>PO Value</TableHead>
                    <TableHead>Invoice Value</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {companyDetails.map((item, index) => (
                    <TableRow
                      key={index}
                      className={getStatusColor(item.status)}
                    >
                      <TableCell className="font-medium">
                        {item.field}
                      </TableCell>
                      <TableCell>{item.poValue}</TableCell>
                      <TableCell>{item.invoiceValue}</TableCell>
                      <TableCell className="text-right">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="inline-flex">
                                {getStatusIcon(item.status)}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                {item.status === "match"
                                  ? "Values match"
                                  : item.status === "warning"
                                    ? "Potential issue"
                                    : "Values do not match"}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tax" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Tax Information</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Field</TableHead>
                    <TableHead>PO Value</TableHead>
                    <TableHead>Invoice Value</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {taxInformation.map((item, index) => (
                    <TableRow
                      key={index}
                      className={getStatusColor(item.status)}
                    >
                      <TableCell className="font-medium">
                        {item.field}
                      </TableCell>
                      <TableCell>{item.poValue}</TableCell>
                      <TableCell>{item.invoiceValue}</TableCell>
                      <TableCell className="text-right">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="inline-flex">
                                {getStatusIcon(item.status)}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                {item.status === "match"
                                  ? "Values match"
                                  : item.status === "warning"
                                    ? "Potential issue"
                                    : "Values do not match"}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="items" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Line Items Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">PO Line Items</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Qty</TableHead>
                        <TableHead>Unit Price</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>HSN</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {lineItems.po.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">
                            {item.description}
                          </TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>
                            ₹{item.unitPrice.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            ₹{item.totalPrice.toLocaleString()}
                          </TableCell>
                          <TableCell>{item.hsn}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">
                    Invoice Line Items
                  </h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Qty</TableHead>
                        <TableHead>Unit Price</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>HSN</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {lineItems.invoice.map((item) => (
                        <TableRow
                          key={item.id}
                          className={
                            item.status !== "match"
                              ? getStatusColor(item.status)
                              : ""
                          }
                        >
                          <TableCell className="font-medium">
                            {item.description}
                          </TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell
                            className={
                              item.status !== "match"
                                ? "font-semibold text-red-600"
                                : ""
                            }
                          >
                            ₹{item.unitPrice.toLocaleString()}
                          </TableCell>
                          <TableCell
                            className={
                              item.status !== "match"
                                ? "font-semibold text-red-600"
                                : ""
                            }
                          >
                            ₹{item.totalPrice.toLocaleString()}
                          </TableCell>
                          <TableCell>{item.hsn}</TableCell>
                          <TableCell>
                            {item.status !== "match" &&
                              getStatusBadge(item.status)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="totals" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Totals Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Field</TableHead>
                    <TableHead>PO Value</TableHead>
                    <TableHead>Invoice Value</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {totals.map((item, index) => (
                    <TableRow
                      key={index}
                      className={getStatusColor(item.status)}
                    >
                      <TableCell className="font-medium">
                        {item.field}
                      </TableCell>
                      <TableCell>₹{item.poValue}</TableCell>
                      <TableCell>₹{item.invoiceValue}</TableCell>
                      <TableCell className="text-right">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="inline-flex">
                                {getStatusIcon(item.status)}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                {item.status === "match"
                                  ? "Values match"
                                  : item.status === "warning"
                                    ? "Potential issue"
                                    : "Values do not match"}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-md">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-800">
                      Discrepancy Summary
                    </h4>
                    <p className="text-amber-700 mt-1">
                      The invoice total is ₹5,900 higher than the PO total. This
                      is due to a price difference in the Philips Air Purifier
                      AC1217 line item.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8 flex justify-between items-center">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
        <Button
          onClick={onExport}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>
    </motion.div>
  );
};

export default DetailedComparison;
