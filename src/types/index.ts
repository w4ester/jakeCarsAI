// Customer Types
export interface CustomerProfile {
  id?: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  
  // Financial Information
  income?: number
  creditScore?: number
  downPayment?: number
  monthlyBudget?: number
  employmentStatus?: string
  employmentYears?: number
  
  // Current Vehicle
  currentVehicle?: string
  tradeInValue?: number
  tradeInPayoff?: number
  
  // Preferences
  vehiclePreferences?: string
  notes?: string
}

// Vehicle Types
export interface VehicleInventory {
  id?: string
  stockNumber: string
  vin?: string
  year: number
  make: string
  model: string
  trim?: string
  mileage?: number
  
  // Pricing
  invoiceCost?: number
  retailValue?: number
  salePrice: number
  bookValue?: number
  
  // Details
  bodyStyle?: string
  transmission?: string
  drivetrain?: string
  fuelType?: string
  exteriorColor?: string
  interiorColor?: string
  features?: string[]
  
  status: 'available' | 'sold' | 'pending'
  location?: string
}

// Lender Types
export interface LenderProfile {
  id?: string
  name: string
  type: string
  isActive: boolean
  
  // Credit Requirements
  minCreditScore?: number
  maxCreditScore?: number
  minIncome?: number
  
  // Loan Terms
  minLoanAmount?: number
  maxLoanAmount?: number
  minTerm?: number
  maxTerm?: number
  maxLTV?: number
  maxPTI?: number
  
  // Vehicle Requirements
  maxVehicleAge?: number
  maxMileage?: number
  minVehicleValue?: number
  
  // Fees and Rates
  acquisitionFee?: number
  baseRate?: number
  rateMarkup?: number
  
  programs?: LenderProgram[]
}

export interface LenderProgram {
  id?: string
  lenderId: string
  name: string
  tier?: string
  ficoRange?: string
  maxLTV?: number
  maxTerm?: number
  vehicleAge?: string
  minStoreReq?: number
  isActive: boolean
}

// Quote Types
export interface QuoteDetails {
  id?: string
  customerId: string
  vehicleId: string
  
  // Financial Details
  vehiclePrice: number
  tradeValue?: number
  downPayment?: number
  amountFinanced: number
  interestRate?: number
  termMonths?: number
  monthlyPayment?: number
  
  // Fees
  salesTax?: number
  registrationFee?: number
  documentFee?: number
  warrantyPrice?: number
  otherFees?: number
  
  // Total Deal
  totalPrice: number
  totalCash?: number
  
  status: 'draft' | 'presented' | 'approved' | 'funded'
  
  // AI Analysis
  aiRecommendation?: string
  confidenceScore?: number
}

// AI Analysis Types
export interface AIAnalysisRequest {
  type: 'customer_profile' | 'lender_match' | 'vehicle_recommendation'
  entityId: string
  data: any
}

export interface AIAnalysisResponse {
  id: string
  type: string
  entityId: string
  analysis: any
  confidence?: number
  recommendations?: any
  modelUsed?: string
  processingTime?: number
  createdAt: Date
}

// Lender Application Types
export interface LenderApplication {
  id?: string
  customerId: string
  lenderId: string
  applicationId?: string
  requestedAmount: number
  requestedTerm: number
  submittedAt?: Date
  
  // Response
  status: 'pending' | 'approved' | 'declined' | 'counter'
  approvedAmount?: number
  approvedRate?: number
  approvedTerm?: number
  declineReason?: string
  
  // Terms
  buyRate?: number
  sellRate?: number
  reserveSpread?: number
}

// MCP Server Types
export interface MCPPrompt {
  name: string
  description: string
  template: string
  variables: string[]
}

export interface MCPTool {
  name: string
  description: string
  inputSchema: any
  handler: Function
}

export interface MCPResource {
  name: string
  type: 'function' | 'database' | 'api'
  description: string
  endpoint?: string
  schema?: any
}

// Form Types
export interface CustomerFormData {
  firstName: string
  lastName: string
  email: string
  phone?: string
  income?: number
  creditScore?: number
  downPayment?: number
  currentVehicle?: string
  tradeInValue?: number
  vehiclePreferences?: string
}

export interface PaymentCalculation {
  vehiclePrice: number
  downPayment: number
  tradeValue: number
  amountFinanced: number
  interestRate: number
  termMonths: number
  monthlyPayment: number
  totalInterest: number
  totalCost: number
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Validation Schema Types
export interface ValidationRule {
  field: string
  type: 'required' | 'email' | 'number' | 'min' | 'max' | 'regex'
  value?: any
  message: string
}

export interface ValidationSchema {
  name: string
  rules: ValidationRule[]
}

// Error Types
export interface AppError {
  code: string
  message: string
  details?: any
  timestamp: Date
}