export interface GSTVerificationResponse {
  success: boolean;
  data?: {
    gstin: string;
    tradeName: string;
    legalName: string;
    status: string;
    address: {
      address1: string;
      address2: string;
      city: string;
      state: string;
      pincode: string;
    };
  };
  error?: string;
}

export interface VerificationResult {
  success: boolean;
  comparisonResults?: Record<
    string,
    {
      status: string;
      invoiceValue: string;
      poValue: string;
      govtValue?: string;
    }
  >;
  gstVerificationResult?: GSTVerificationResponse;
  invoiceData?: Record<string, string>;
  poData?: Record<string, string>;
  error?: string;
}

export interface DocumentData {
  invoice: File | null;
  po: File | null;
}
