"use client";
import React from "react";
import { FormField } from "@/components/molecules/FormField";
import { SelectField } from "@/components/molecules/SelectField";
import { StaffFormInputs } from "@/types/StaffFormInputs";

const BasicInfoFields = ({ initialData }: { initialData?: StaffFormInputs }) => {
    return (
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4 bg-zinc-50 rounded-2xl border border-zinc-100 animate-in fade-in duration-300">

            {/* PROFILE IMAGE */}
            <div className="md:col-span-2">
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                    Profile Image
                </label>

                <input
                    type="file"
                    name="profileImage"
                    accept="image/jpeg,image/png,image/webp"
                    className="
                        w-full text-sm text-zinc-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-xl file:border-0
                        file:text-sm file:font-bold
                        file:bg-zinc-900 file:text-white
                        hover:file:bg-zinc-800
                        transition-all
                    "
                />
            </div>

            <FormField
                label="Full Name (पूरा नाम)"
                name="fullName"
                required
                minLength={2}
                defaultValue={initialData?.fullName || ""}
            />

            <FormField
                label="Nepali Name (नेपाली नाम)"
                name="nepaliName"
                defaultValue={initialData?.nepaliName || ""}
            />

            <FormField
                label="Phone (फोन)"
                name="phone"
                type="tel"
                required
                pattern="^[0-9]{10}$"
                defaultValue={initialData?.phone || ""}
            />

            <FormField
                label="Email (इमेल)"
                name="email"
                type="email"
                required
                defaultValue={initialData?.email || ""}
            />

            <FormField
                label="Address (ठेगाना)"
                name="address"
                className="md:col-span-2"
                defaultValue={initialData?.address || ""}
            />

            <SelectField
                label="Gender (लिङ्ग)"
                name="gender"
                required
                defaultValue={initialData?.gender || ""}
                options={[
                    { label: "Select Gender...", value: "" },
                    { label: "Male", value: "MALE" },
                    { label: "Female", value: "FEMALE" },
                    { label: "Other", value: "OTHER" },
                ]}
            />

            <SelectField
                label="Marital Status (वैवाहिक स्थिति)"
                name="maritalStatus"
                required
                defaultValue={initialData?.maritalStatus || ""}
                options={[
                    { label: "Select Status...", value: "" },
                    { label: "Single", value: "SINGLE" },
                    { label: "Married", value: "MARRIED" },
                ]}
            />

            {/* CITIZENSHIP */}
            <FormField
                label="Citizenship No. (नागरिकता नं.)"
                name="citizenshipNo"
                defaultValue={initialData?.citizenshipNo || ""}
            />

            {/* PAN */}
            <div className="flex flex-col md:col-span-2 gap-1">
                <FormField
                    label="PAN Number (स्थायी लेखा नम्बर)"
                    name="panNumber"
                    pattern="^[0-9]{9}$"
                    maxLength={9}
                    defaultValue={initialData?.panNumber || ""}
                />

                <span className="text-xs text-rose-600 font-medium">
                    Required for tax calculation (Must be exactly 9 digits)
                </span>
            </div>

            {/* TDS */}
            <div className="md:col-span-2 flex items-center gap-3 bg-white border border-zinc-200 p-3 rounded-xl">
                <input
                    type="checkbox"
                    name="applyTDS"
                    className="w-4 h-4 accent-zinc-900"
                    defaultChecked={initialData?.applyTDS || false}
                />
                <span className="text-sm font-medium text-zinc-700">
                    Apply TDS (कर कट्टी लागू)
                </span>
            </div>
        </div>
    );
};

export default BasicInfoFields;