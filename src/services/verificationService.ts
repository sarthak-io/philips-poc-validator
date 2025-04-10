import { GSTVerificationResponse } from "@/types/verification";

// Extract data from documents using OCR simulation
export const extractDataFromDocument = async (
  file: File,
  documentType: "invoice" | "po",
) => {
  return new Promise<Record<string, string>>((resolve) => {
    // In a real implementation, this would send the file to an OCR service
    // For now, we'll simulate the extraction based on the file name and content
    const reader = new FileReader();

    reader.onload = (event) => {
      // Generate truly unique data based on the file name, size, and last modified time
      const fileName = file.name.toLowerCase();
      const fileSize = file.size;
      const lastModified = file.lastModified;
      const uniqueId = fileName + fileSize.toString() + lastModified.toString();
      const randomSeed = Array.from(uniqueId).reduce(
        (acc, char) => acc + char.charCodeAt(0),
        0,
      );

      console.log(
        `Generating data for ${documentType} file: ${fileName} with seed: ${randomSeed}`,
      );

      // Generate a GST number with some variations
      const gstBase = "27AABCP";
      const gstMiddle = Math.floor(1000 + (randomSeed % 9000)).toString();
      const gstEnd = "N1ZO";
      const gstNumber = gstBase + gstMiddle + gstEnd;

      // Generate HSN code with variations
      const hsnBase = "8513";
      const hsnEnd = (10 + (randomSeed % 90)).toString();
      const hsnCode = hsnBase + hsnEnd;

      // Generate MSME number with more realistic format
      const msmeNumber = `UDYAM-HR-${20 + (randomSeed % 10)}-${(10000 + (randomSeed % 90000)).toString()}`;

      // Generate invoice/PO numbers with more realistic format
      const currentYear = new Date().getFullYear();
      const invoiceNumber = `INV-${currentYear}-${1000 + (randomSeed % 9000)}`;
      const poNumber = `PO-${currentYear}-${100 + (randomSeed % 900)}`;

      // Generate amount with variations that create meaningful differences
      const baseAmount = 80000 + ((randomSeed * 100) % 50000);
      const formattedAmount = `₹ ${baseAmount.toLocaleString("en-IN")}.00`;

      // Generate dates with meaningful differences
      const today = new Date();
      const invoiceDate = new Date(today);
      invoiceDate.setDate(today.getDate() - (randomSeed % 15));
      const poDate = new Date(invoiceDate);
      poDate.setDate(invoiceDate.getDate() - (5 + (randomSeed % 10)));

      const formatDate = (date: Date) => {
        const day = date.getDate().toString().padStart(2, "0");
        const month = date.toLocaleString("en-US", { month: "short" });
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
      };

      // Create intentional mismatches based on file properties
      // This ensures different files will have different comparison results
      const shouldCreateMismatch = randomSeed % 3 === 0; // 1/3 chance of mismatch
      const shouldCreatePartialMatch = randomSeed % 5 === 0; // 1/5 chance of partial match

      // Generate contact person names for more realistic data
      const contactPersons = [
        "Rahul Sharma",
        "Amit Patel",
        "Priya Singh",
        "Vikram Mehta",
        "Neha Gupta",
        "Sanjay Kumar",
        "Ananya Desai",
        "Rajesh Khanna",
      ];
      const invoiceContactIndex = randomSeed % contactPersons.length;
      const poContactIndex = shouldCreateMismatch
        ? (invoiceContactIndex + 1) % contactPersons.length
        : invoiceContactIndex;

      if (documentType === "invoice") {
        const data = {
          gst: gstNumber,
          hsn: hsnCode,
          msme: msmeNumber,
          companyName: "Philips India Limited",
          totalAmount: formattedAmount,
          invoiceNumber: invoiceNumber,
          poNumber: poNumber,
          date: formatDate(invoiceDate),
          contactPerson: contactPersons[invoiceContactIndex],
        };
        console.log(`Invoice data generated for ${fileName}:`, data);
        resolve(data);
      } else {
        // For PO, we'll create some intentional mismatches for demo purposes
        // The mismatches will be different for different files
        const poHsnCode = shouldCreateMismatch
          ? hsnBase + (parseInt(hsnEnd) + 10).toString()
          : hsnCode;

        const poMsmeNumber = shouldCreatePartialMatch
          ? msmeNumber.substring(0, msmeNumber.length - 1) +
            (
              (parseInt(msmeNumber.charAt(msmeNumber.length - 1)) + 1) %
              10
            ).toString()
          : msmeNumber;

        // Create a different amount for PO if mismatch is needed
        const poAmount = shouldCreateMismatch
          ? `₹ ${(baseAmount - 5000).toLocaleString("en-IN")}.00`
          : formattedAmount;

        const data = {
          gst: gstNumber, // Same GST
          hsn: poHsnCode, // Potentially different HSN for demo
          msme: poMsmeNumber, // Potentially different MSME for demo
          companyName: "Philips India Limited",
          totalAmount: poAmount,
          invoiceNumber: "",
          poNumber: poNumber,
          date: formatDate(poDate),
          contactPerson: contactPersons[poContactIndex],
        };
        console.log(`PO data generated for ${fileName}:`, data);
        resolve(data);
      }
    };

    reader.onerror = () => {
      // Fallback if file reading fails
      const fallbackData = {
        gst: "27AABCP9782N1ZO",
        hsn: documentType === "invoice" ? "85131090" : "85131010",
        msme: `UDYAM-HR-28-${10000 + Math.floor(Math.random() * 90000)}`,
        companyName: "Philips India Limited",
        totalAmount: `₹ ${(120000 + Math.floor(Math.random() * 50000)).toLocaleString("en-IN")}.00`,
        invoiceNumber:
          documentType === "invoice"
            ? `INV-${new Date().getFullYear()}-${1000 + Math.floor(Math.random() * 9000)}`
            : "",
        poNumber: `PO-${new Date().getFullYear()}-${100 + Math.floor(Math.random() * 900)}`,
        date: documentType === "invoice" ? "15-Jun-2023" : "10-Jun-2023",
        contactPerson:
          documentType === "invoice" ? "Rahul Sharma" : "Amit Patel",
      };
      console.log(
        `Error reading file ${file.name}, using fallback data:`,
        fallbackData,
      );
      resolve(fallbackData);
    };

    // Start reading the file
    reader.readAsText(file);
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
      let status: string;

      if (invoiceData[key] === poData[key]) {
        status = "match";
      } else {
        // More sophisticated comparison logic based on field type
        if (
          key === "msme" &&
          invoiceData[key].substring(0, invoiceData[key].length - 5) ===
            poData[key].substring(0, poData[key].length - 5)
        ) {
          // If most of the MSME number matches except the last few digits
          status = "partial";
        } else if (
          key === "hsn" &&
          invoiceData[key].substring(0, 4) === poData[key].substring(0, 4)
        ) {
          // If the HSN code category matches but not the full code
          status = "partial";
        } else if (key === "totalAmount") {
          // Extract numeric values for amount comparison
          const invoiceAmount = parseFloat(
            invoiceData[key].replace(/[^0-9.]/g, ""),
          );
          const poAmount = parseFloat(poData[key].replace(/[^0-9.]/g, ""));

          if (invoiceAmount === poAmount) {
            status = "match";
          } else if (Math.abs(invoiceAmount - poAmount) / poAmount < 0.05) {
            // If the difference is less than 5%
            status = "partial";
          } else {
            status = "mismatch";
          }
        } else if (key === "date") {
          // For dates, check if they're within a reasonable range
          try {
            const invoiceDateParts = invoiceData[key].split("-");
            const poDateParts = poData[key].split("-");

            // If the month and year match, consider it a partial match
            if (
              invoiceDateParts[1] === poDateParts[1] &&
              invoiceDateParts[2] === poDateParts[2]
            ) {
              status = "partial";
            } else {
              status = "mismatch";
            }
          } catch (e) {
            status = "mismatch";
          }
        } else if (key === "contactPerson") {
          // Always mark different contact persons as a mismatch
          status = "mismatch";
        } else {
          status = "mismatch";
        }
      }

      comparisonResults[key] = {
        status,
        invoiceValue: invoiceData[key],
        poValue: poData[key],
      };

      console.log(
        `Comparing ${key}: ${invoiceData[key]} vs ${poData[key]} => ${status}`,
      );
    }
  }

  return comparisonResults;
};

// Main verification function that orchestrates the process
export const verifyDocuments = async (invoiceFile: File, poFile: File) => {
  try {
    console.log(
      "Starting verification process for files:",
      invoiceFile.name,
      poFile.name,
    );

    // 1. Extract data from both documents using OCR
    const invoiceData = await extractDataFromDocument(invoiceFile, "invoice");
    const poData = await extractDataFromDocument(poFile, "po");
    const filesDataResponse = await getDataFromDocuments(invoiceFile, poFile);
    const filesData = await filesDataResponse.json();

    console.log("Extracted data:", filesData);
    console.log("invoiceData", invoiceData);
    console.log("poData", poData);
    
    const gst = filesData.extracted_invoice['GSTIN'];

    // 2. Verify GST number with government API
    const gstVerificationResult = await verifyGST(gst);

    // 3. Compare documents
    const comparisonResults = compareDocuments(invoiceData, poData);

    console.log("Initial comparison results:", comparisonResults);

    // 4. Add government verification data
    if (gstVerificationResult.success && comparisonResults.gst) {
      comparisonResults.gst.govtValue = gstVerificationResult.data.gstin;
      comparisonResults.gst.status =
        invoiceData.gst === gstVerificationResult.data.gstin
          ? "match"
          : "mismatch";
    }

    // Ensure we have the right status values for UI display
    for (const key in comparisonResults) {
      if (comparisonResults[key]) {
        // Convert status values to match what the UI expects
        if (comparisonResults[key].status === "match") {
          comparisonResults[key].status = "match";
        } else if (comparisonResults[key].status === "mismatch") {
          comparisonResults[key].status = "mismatch";
        } else {
          comparisonResults[key].status = "partial";
        }
      }
    }

    console.log("Final comparison results:", comparisonResults);

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

export const getDataFromDocuments = async (invoiceData, poData) => {
  const formData = new FormData();
  formData.append("invoice_file", invoiceData);
  formData.append("po_file", poData);

  const res = await fetch('http://localhost:8000/extract',{
    method: "POST",
    body: formData,
  })

  return res;
}
