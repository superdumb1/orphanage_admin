import { FormField } from '@/components/molecules/FormField'
import React from 'react'
import { StaffFormInputs } from "@/types/StaffFormInputs";

const BankDetails = ({ initialData }: { initialData?: StaffFormInputs }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Bank Name (बैंकको नाम)" name="bank.bankName" required defaultValue={initialData?.bank?.bankName} />
            <FormField label="Branch (शाखा)" name="bank.branch" required defaultValue={initialData?.bank?.branch} />
            <FormField label="Account Number (खाता नम्बर)" name="bank.accountNumber" required pattern="[0-9]{8,25}" defaultValue={initialData?.bank?.accountNumber} />
            <FormField label="Account Name (खाता नाम)" name="bank.accountName" required defaultValue={initialData?.bank?.accountName} />
        </div>
    )
}
export default BankDetails;