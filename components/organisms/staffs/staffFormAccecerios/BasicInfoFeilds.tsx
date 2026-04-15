"use client";
import React from "react";
import { FormField } from "@/components/molecules/FormField";
import { SelectField } from "@/components/molecules/SelectField";
import { StaffFormInputs } from "@/types/StaffFormInputs";

const BasicInfoFields = ({ initialData }: { initialData?: StaffFormInputs }) => {
    return (
        // Updated: bg-zinc-50 -> bg-shaded, border-zinc-100 -> border-border
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-shaded/30 rounded-dashboard border border-border animate-in fade-in duration-300 transition-colors duration-500">

            {/* PROFILE IMAGE */}
            <div className="md:col-span-2">
                <label className="block text-sm font-bold text-text mb-2">
                    Profile Image
                </label>

                <input
                    type="file"
                    name="profileImage"
                    accept="image/jpeg,image/png,image/webp"
                    className="
                        w-full text-sm text-text-muted
                        file:mr-4 file:py-2.5 file:px-5
                        file:rounded-xl file:border-0
                        file:text-sm file:font-black
                        file:bg-primary file:text-text-invert
                        hover:file:opacity-90
                        file:cursor-pointer transition-all
                    "
                />
            </div>

            <FormField
                label="Full Name (पूरा नाम)"
                name="fullName"
                required
                minLength={2}
                defaultValue={initialData?.fullName || ""}
                className="text-text"
            />

            <FormField
                label="Nepali Name (नेपाली नाम)"
                name="nepaliName"
                defaultValue={initialData?.nepaliName || ""}
                className="text-text"
            />

            <FormField
                label="Phone (फोन)"
                name="phone"
                type="tel"
                required
                pattern="^[0-9]{10}$"
                defaultValue={initialData?.phone || ""}
                className="text-text"
            />

            <FormField
                label="Email (इमेल)"
                name="email"
                type="email"
                required
                defaultValue={initialData?.email || ""}
                className="text-text"
            />

            <FormField
                label="Address (ठेगाना)"
                name="address"
                className="md:col-span-2 text-text"
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
                className="text-text"
            />

            {/* PAN */}
            <div className="flex flex-col md:col-span-2 gap-1">
                <FormField
                    label="PAN Number (स्थायी लेखा नम्बर)"
                    name="panNumber"
                    pattern="^[0-9]{9}$"
                    maxLength={9}
                    defaultValue={initialData?.panNumber || ""}
                    className="text-text"
                />

                {/* Updated: text-rose-600 -> text-danger */}
                <span className="text-[10px] text-danger font-bold uppercase tracking-wider ml-1">
                    Required for tax calculation (Must be exactly 9 digits)
                </span>
            </div>

            {/* TDS - Updated: bg-white -> bg-card, border-zinc-200 -> border-border */}
            <div className="md:col-span-2 flex items-center gap-4 bg-card border border-border p-4 rounded-xl transition-all hover:border-primary/30">
                <input
                    type="checkbox"
                    name="applyTDS"
                    // Updated: accent-zinc-900 -> accent-primary
                    className="w-5 h-5 accent-primary cursor-pointer"
                    defaultChecked={initialData?.applyTDS || false}
                />
                <span className="text-sm font-bold text-text">
                    Apply TDS (कर कट्टी लागू)
                </span>
            </div>
        </div>
    );
};

export default BasicInfoFields;