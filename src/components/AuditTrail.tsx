import React, { useState } from "react";
import {
  Search,
  Download,
  Filter,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

interface AuditRecord {
  id: string;
  date: Date;
  documentType: "Invoice" | "PO";
  documentId: string;
  vendorName: string;
  status: "Verified" | "Rejected" | "Pending Correction";
  verifiedBy: string;
  amount: number;
}

const AuditTrail = ({
  records = defaultRecords,
}: {
  records?: AuditRecord[];
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [documentTypeFilter, setDocumentTypeFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  // Filter records based on search term and filters
  const filteredRecords = records.filter((record) => {
    const matchesSearch =
      record.documentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.vendorName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || record.status === statusFilter;
    const matchesDocType =
      documentTypeFilter === "all" ||
      record.documentType === documentTypeFilter;
    const matchesDate =
      !dateFilter ||
      (record.date.getDate() === dateFilter.getDate() &&
        record.date.getMonth() === dateFilter.getMonth() &&
        record.date.getFullYear() === dateFilter.getFullYear());

    return matchesSearch && matchesStatus && matchesDocType && matchesDate;
  });

  // Pagination
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRecords.slice(
    indexOfFirstRecord,
    indexOfLastRecord,
  );
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

  const handleExport = () => {
    // In a real implementation, this would generate and download a CSV/PDF report
    console.log("Exporting audit trail report");
    alert("Audit trail report exported successfully!");
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Verified":
        return "default";
      case "Rejected":
        return "destructive";
      case "Pending Correction":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <Card className="w-full bg-white shadow-sm border-0">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold text-[#0e5aa7]">
            Verification Audit Trail
          </CardTitle>
          <Button
            onClick={handleExport}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download size={16} />
            Export Report
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-3 mb-4 justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by document ID or vendor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Verified">Verified</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
                <SelectItem value="Pending Correction">
                  Pending Correction
                </SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={documentTypeFilter}
              onValueChange={setDocumentTypeFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Documents</SelectItem>
                <SelectItem value="Invoice">Invoice</SelectItem>
                <SelectItem value="PO">Purchase Order</SelectItem>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-[180px] justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateFilter ? (
                    format(dateFilter, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateFilter}
                  onSelect={setDateFilter}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Date</TableHead>
                <TableHead>Document Type</TableHead>
                <TableHead>Document ID</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Verified By</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentRecords.length > 0 ? (
                currentRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">
                      {format(record.date, "dd/MM/yyyy")}
                    </TableCell>
                    <TableCell>{record.documentType}</TableCell>
                    <TableCell>{record.documentId}</TableCell>
                    <TableCell>{record.vendorName}</TableCell>
                    <TableCell>
                      ₹{record.amount.toLocaleString("en-IN")}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(record.status)}>
                        {record.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{record.verifiedBy}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {filteredRecords.length > 0 && (
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-medium">{indexOfFirstRecord + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(indexOfLastRecord, filteredRecords.length)}
              </span>{" "}
              of <span className="font-medium">{filteredRecords.length}</span>{" "}
              results
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Sample data for demonstration
const defaultRecords: AuditRecord[] = [
  {
    id: "1",
    date: new Date("2023-06-15"),
    documentType: "Invoice",
    documentId: "INV-2023-001",
    vendorName: "ABC Electronics Ltd.",
    status: "Verified",
    verifiedBy: "John Smith",
    amount: 125000,
  },
  {
    id: "2",
    date: new Date("2023-06-14"),
    documentType: "PO",
    documentId: "PO-2023-042",
    vendorName: "Tech Solutions Inc.",
    status: "Rejected",
    verifiedBy: "Sarah Johnson",
    amount: 78500,
  },
  {
    id: "3",
    date: new Date("2023-06-12"),
    documentType: "Invoice",
    documentId: "INV-2023-089",
    vendorName: "Global Supplies Co.",
    status: "Pending Correction",
    verifiedBy: "Michael Brown",
    amount: 45000,
  },
  {
    id: "4",
    date: new Date("2023-06-10"),
    documentType: "Invoice",
    documentId: "INV-2023-076",
    vendorName: "Precision Parts Ltd.",
    status: "Verified",
    verifiedBy: "Emily Davis",
    amount: 92750,
  },
  {
    id: "5",
    date: new Date("2023-06-08"),
    documentType: "PO",
    documentId: "PO-2023-031",
    vendorName: "ABC Electronics Ltd.",
    status: "Verified",
    verifiedBy: "John Smith",
    amount: 135000,
  },
  {
    id: "6",
    date: new Date("2023-06-05"),
    documentType: "Invoice",
    documentId: "INV-2023-062",
    vendorName: "Medical Supplies Inc.",
    status: "Rejected",
    verifiedBy: "Sarah Johnson",
    amount: 67800,
  },
  {
    id: "7",
    date: new Date("2023-06-03"),
    documentType: "PO",
    documentId: "PO-2023-027",
    vendorName: "Tech Solutions Inc.",
    status: "Pending Correction",
    verifiedBy: "Michael Brown",
    amount: 54200,
  },
  {
    id: "8",
    date: new Date("2023-06-01"),
    documentType: "Invoice",
    documentId: "INV-2023-055",
    vendorName: "Global Supplies Co.",
    status: "Verified",
    verifiedBy: "Emily Davis",
    amount: 112500,
  },
];

export default AuditTrail;
