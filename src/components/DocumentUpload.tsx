import React, { useState, useCallback } from "react";
import { Upload, FileX, FileCheck, AlertCircle, Info } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DocumentUploadProps {
  onUploadComplete?: (file: File, documentType: "invoice" | "po") => void;
  maxFileSize?: number; // in MB
  allowedFileTypes?: string[];
}

const DocumentUpload = ({
  onUploadComplete = () => {},
  maxFileSize = 10, // Default 10MB
  allowedFileTypes = [".pdf"],
}: DocumentUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<"invoice" | "po">("invoice");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const validateFile = (file: File): boolean => {
    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      setErrorMessage(
        `File size exceeds the maximum limit of ${maxFileSize}MB`,
      );
      return false;
    }

    // Check file type
    const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`;
    if (!allowedFileTypes.includes(fileExtension)) {
      setErrorMessage(
        `Invalid file type. Allowed types: ${allowedFileTypes.join(", ")}`,
      );
      return false;
    }

    return true;
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const droppedFile = e.dataTransfer.files[0];
      if (!droppedFile) return;

      if (validateFile(droppedFile)) {
        setFile(droppedFile);
        setErrorMessage("");
        simulateUpload(droppedFile);
      } else {
        setUploadStatus("error");
      }
    },
    [maxFileSize, allowedFileTypes],
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (validateFile(selectedFile)) {
      setFile(selectedFile);
      setErrorMessage("");
      simulateUpload(selectedFile);
    } else {
      setUploadStatus("error");
    }
  };

  const simulateUpload = (file: File) => {
    setUploadStatus("uploading");
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploadStatus("success");
          onUploadComplete(file, documentType);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const resetUpload = () => {
    setFile(null);
    setUploadProgress(0);
    setUploadStatus("idle");
    setErrorMessage("");
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-background">
      <Card className="border-2 border-dashed rounded-xl">
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Document Type Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Select Document Type</h3>
              <RadioGroup
                value={documentType}
                onValueChange={(value) =>
                  setDocumentType(value as "invoice" | "po")
                }
                className="flex space-x-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="invoice" id="invoice" />
                  <Label htmlFor="invoice">Invoice</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="po" id="po" />
                  <Label htmlFor="po">Purchase Order</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Upload Area */}
            <div
              className={`relative flex flex-col items-center justify-center h-64 border-2 rounded-lg transition-colors ${isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/20"} ${uploadStatus === "error" ? "border-destructive bg-destructive/5" : ""}`}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {uploadStatus === "idle" && (
                <motion.div
                  className="flex flex-col items-center justify-center space-y-4 p-6 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">
                      Drag & Drop your{" "}
                      {documentType === "invoice"
                        ? "Invoice"
                        : "Purchase Order"}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      or click to browse files
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Supported formats: {allowedFileTypes.join(", ")} (Max:{" "}
                    {maxFileSize}MB)
                  </p>
                  <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                    accept={allowedFileTypes.join(",")}
                  />
                </motion.div>
              )}

              {uploadStatus === "uploading" && (
                <motion.div
                  className="flex flex-col items-center justify-center space-y-4 p-6 w-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-lg font-medium">
                    Uploading {file?.name}
                  </h3>
                  <Progress
                    value={uploadProgress}
                    className="w-full max-w-md"
                  />
                  <p className="text-sm text-muted-foreground">
                    {uploadProgress}% complete
                  </p>
                </motion.div>
              )}

              {uploadStatus === "success" && (
                <motion.div
                  className="flex flex-col items-center justify-center space-y-4 p-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                    <FileCheck className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-medium text-green-600">
                    Upload Complete
                  </h3>
                  <p className="text-sm text-muted-foreground">{file?.name}</p>
                  <Button variant="outline" size="sm" onClick={resetUpload}>
                    Upload Another Document
                  </Button>
                </motion.div>
              )}

              {uploadStatus === "error" && (
                <motion.div
                  className="flex flex-col items-center justify-center space-y-4 p-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                    <FileX className="h-8 w-8 text-destructive" />
                  </div>
                  <h3 className="text-lg font-medium text-destructive">
                    Upload Failed
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {errorMessage}
                  </p>
                  <Button variant="outline" size="sm" onClick={resetUpload}>
                    Try Again
                  </Button>
                </motion.div>
              )}
            </div>

            {/* Help Text */}
            <div className="mt-4">
              <Alert
                variant="default"
                className="bg-primary/5 border-primary/20"
              >
                <div className="flex items-start">
                  <Info className="h-4 w-4 text-primary mt-0.5 mr-2" />
                  <AlertDescription className="text-xs text-muted-foreground">
                    For best results, ensure your document is clearly scanned
                    and all text is legible. The system will extract GST, HSN,
                    and MSME numbers (if available) for verification.
                  </AlertDescription>
                </div>
              </Alert>
            </div>

            {/* Tips */}
            <div className="flex justify-between text-xs text-muted-foreground mt-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="flex items-center underline cursor-help">
                    <AlertCircle className="h-3 w-3 mr-1" /> Tips for better
                    results
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Use high-quality scans (300 DPI or higher)</li>
                      <li>Ensure the document is properly aligned</li>
                      <li>All text should be clearly visible and not blurry</li>
                      <li>
                        Avoid shadows or folds across important information
                      </li>
                    </ul>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentUpload;
