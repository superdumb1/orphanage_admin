export const normalizeStaff = (formData: FormData) => {
  const raw = Object.fromEntries(formData.entries());

  return {
    fullName: raw.fullName,
    nepaliName: raw.nepaliName,
    phone: raw.phone,
    email: raw.email,
    address: raw.address,
    gender: raw.gender,
    maritalStatus: raw.maritalStatus,
    citizenshipNo: raw.citizenshipNo,
    panNumber: raw.panNumber,
    applyTDS: raw.applyTDS === "on",

    designation: raw.designation,
    department: raw.department,
    employmentType: raw.employmentType,
    joinDate: raw.joinDate ? new Date(raw.joinDate as string) : null,

    salary: {
      basicSalary: Number(raw.basicSalary || 0),
      grade: Number(raw.grade || 0),
      dearnessAllowance: Number(raw.dearnessAllowance || 0),
      allowances: {
        houseRent: Number(raw.houseRent || 0),
        medical: Number(raw.medical || 0),
        transport: Number(raw.transport || 0),
        food: Number(raw.food || 0),
        communication: Number(raw.communication || 0),
        other: Number(raw.other || 0),
      },
      festivalBonusMonths: Number(raw.festivalBonusMonths || 1),
      insurancePremium: Number(raw.insurancePremium || 0),
    },

    ssf: {
      type: raw["ssf.type"],
      idNumber: raw["ssf.idNumber"],
      employeeContribution: Number(raw["ssf.employeeContribution"] || 0),
      employerContribution: Number(raw["ssf.employerContribution"] || 0),
    },

    bank: {
      bankName: raw["bank.bankName"],
      branch: raw["bank.branch"],
      accountNumber: raw["bank.accountNumber"],
      accountName: raw["bank.accountName"],
    },
  };
};