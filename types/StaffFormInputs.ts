// types/StaffFormInputs.ts

export interface StaffFormInputs {
  _id?: string;
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

  department?: string;
  designation?: string;
  employmentType?: string;
  joinDate?: string | Date;

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

  ssf?: {
    type?: string;
    idNumber?: string;
    employeeContribution?: number;
    employerContribution?: number;
  };

  bank?: {
    bankName?: string;
    branch?: string;
    accountNumber?: string;
    accountName?: string;
  };
}