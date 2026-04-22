export interface StaffFormInputs {
  _id?: string;        // Added this for update operations
  userId?: string;     // The bridge to the User model
  
  // BASIC INFO
  fullName: string;
  nepaliName?: string;
  phone: string;
  email: string;
  address?: string;
  gender?: string;
  maritalStatus?: string;
  citizenshipNo?: string;
  panNumber?: string;
  applyTDS?: boolean;
  profileImageUrl?: string;

  // EMPLOYMENT
  department?: string;
  designation?: string;
  employmentType?: string;
  joinDate?: string | Date;

  // FINANCIALS
  salary?: {
    basicSalary?: number;
    grade?: number;
    dearnessAllowance?: number;
    allowances?: {
      houseRent?: number;
      medical?: number;
      transport?: number;
      food?: number;
      communication?: number;
      other?: number;
    };
    festivalBonusMonths?: number;
    insurancePremium?: number;
  };

  // CONTRIBUTIONS
  ssf?: {
    type?: string;
    idNumber?: string;
    employeeContribution?: number;
    employerContribution?: number;
  };

  // BANKING
  bank?: {
    bankName?: string;
    branch?: string;
    accountNumber?: string;
    accountName?: string;
  };
}