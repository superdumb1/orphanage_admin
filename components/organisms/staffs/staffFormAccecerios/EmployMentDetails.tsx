"use client";

import React, { useMemo } from "react";
import { FormField } from "../../../molecules/FormField";
import { SelectField } from "../../../molecules/SelectField";
import { DatePickerField } from "@/components/molecules/DatePickerField";
import { StaffFormInputs } from "@/types/StaffFormInputs";

const departmentOptions = [
    { label: "Child Care (बाल हेरचाह)", value: "CHILD_CARE" },
    { label: "Administration & HR (प्रशासन र मानव संसाधन)", value: "ADMINISTRATION" },
    { label: "Education (शिक्षा)", value: "EDUCATION" },
    { label: "Healthcare & Medical (स्वास्थ्य)", value: "HEALTHCARE" },
    { label: "Kitchen & Nutrition (भान्सा र पोषण)", value: "KITCHEN" },
    { label: "Social Work & Counseling (सामाजिक कार्य)", value: "SOCIAL_WORK" },
    { label: "Security & Maintenance (सुरक्षा र मर्मत)", value: "SECURITY" },
    { label: "Logistics & Transport (रसद र यातायात)", value: "LOGISTICS" },
    { label: "Other (अन्य)", value: "OTHER" },
] ;

const employmentTypeOptions = [
    { label: "Full Time", value: "FULL_TIME" },
    { label: "Part Time", value: "PART_TIME" },
    { label: "Contract", value: "CONTRACT" },
] 

type Props = {
    initialData?: StaffFormInputs;
};

export const EmploymentDetails = ({ initialData }: Props) => {

    const formattedDate = useMemo(() => {
        if (!initialData?.joinDate) return "";
        return new Date(initialData.joinDate)
            .toISOString()
            .split("T")[0];
    }, [initialData?.joinDate]);

    return (
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">

            <SelectField
                label="Department (विभाग)"
                name="department"
                options={departmentOptions}
                defaultValue={initialData?.department}
            />

            <FormField
                label="Designation (पद)"
                name="designation"
                placeholder="e.g. Caregiver, Nurse, Cook"
                defaultValue={initialData?.designation}
            />

            <SelectField
                label="Employment Type (रोजगारी प्रकार)"
                name="employmentType"
                options={employmentTypeOptions}
                defaultValue={initialData?.employmentType}
            />

            <DatePickerField
                label="Date of Joining (कार्यग्रहण मिति)"
                name="joinDate"
                id="joinDate"
                required
                defaultValue={formattedDate}
            />

        </div>
    );
};