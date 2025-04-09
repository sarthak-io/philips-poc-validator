import { GSTVerificationResponse } from "@/types/verification";

// Mock OCR function to simulate extracting data from documents
export const extractDataFromDocument = async (
  file: File,
  documentType: "invoice" | "po",
) => {
  return new Promise<Record<string, string>>((resolve) => {
    // In a real implementation, this would send the file to an OCR service
    // For now, we'll simulate the extraction with mock data
    setTimeout(() => {
      if (documentType === "invoice") {
        resolve({
          gst: "27AABCP9441L1ZP",
          hsn: "85044090",
          msme: "UDYAM-MH-33-0012345",
          companyName: "Philips India Limited",
          totalAmount: "₹ 245,600.00",
          invoiceNumber: "INV-2023-4567",
          poNumber: "PO-2023-1234",
          date: "18-May-2023",
        });
      } else {
        resolve({
          gst: "27AABCP9441L1ZP",
          hsn: "85044010", // Intentional mismatch for demo
          msme: "UDYAM-MH-33-0012345",
          companyName: "Philips India Limited",
          totalAmount: "₹ 245,600.00",
          invoiceNumber: "",
          poNumber: "PO-2023-1234",
          date: "15-May-2023",
        });
      }
    }, 1000);
  });
};

// Verify GST number against government API
export const verifyGST = async (
  gstNumber: string,
): Promise<GSTVerificationResponse> => {
  try {
    const url = "https://appyflow.in/api/verifyGST";
    const headers = {
      "Content-Type": "application/json",
      "x-api-key": "FXuvT19zRCQmTCcjmrws5Hdwq4K3",
    };
    const payload = { gstin: gstNumber };

    // In a real implementation, this would be an actual API call
    // For now, we'll simulate the API response
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            gstin: gstNumber,
            tradeName: "PHILIPS INDIA LIMITED",
            legalName: "PHILIPS INDIA LIMITED",
            status: "Active",
            address: {
              address1: "UNIT NO. 601-602, 6TH FLOOR, BOOMERANG",
              address2: "CHANDIVALI FARM ROAD, POWAI",
              city: "MUMBAI",
              state: "Maharashtra",
              pincode: "400072",
            },
          },
        });
      }, 800);
    });
  } catch (error) {
    console.error("Error verifying GST:", error);
    return {
      success: false,
      error: "Failed to verify GST number",
    };
  }
};

// Compare extracted data between invoice and PO
export const compareDocuments = (
  invoiceData: Record<string, string>,
  poData: Record<string, string>,
) => {
  const comparisonResults: Record<
    string,
    {
      status: string;
      invoiceValue: string;
      poValue: string;
      govtValue?: string;
    }
  > = {};

  // Compare each field
  for (const key in invoiceData) {
    if (key in poData) {
      const status = invoiceData[key] === poData[key] ? "match" : "mismatch";
      comparisonResults[key] = {
        status,
        invoiceValue: invoiceData[key],
        poValue: poData[key],
      };
    }
  }

  return comparisonResults;
};

// Main verification function that orchestrates the process
export const verifyDocuments = async (invoiceFile: File, poFile: File) => {
  try {
    // 1. Extract data from both documents using OCR
    const invoiceData = await extractDataFromDocument(invoiceFile, "invoice");
    const poData = await extractDataFromDocument(poFile, "po");

    // 2. Verify GST number with government API
    const gstVerificationResult = await verifyGST(invoiceData.gst);

    // 3. Compare documents
    const comparisonResults = compareDocuments(invoiceData, poData);

    // 4. Add government verification data
    if (gstVerificationResult.success && comparisonResults.gst) {
      comparisonResults.gst.govtValue = gstVerificationResult.data.gstin;
      comparisonResults.gst.status =
        invoiceData.gst === gstVerificationResult.data.gstin
          ? "match"
          : "mismatch";
    }

    // 5. Return comprehensive results
    return {
      success: true,
      comparisonResults,
      gstVerificationResult,
      invoiceData,
      poData,
    };
  } catch (error) {
    console.error("Error in document verification:", error);
    return {
      success: false,
      error: "Failed to complete verification process",
    };
  }
};
