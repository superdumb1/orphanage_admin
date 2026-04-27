import React from 'react'
import ArrivalCategory from './ArrivalCategory'
import { AlertCircle, History, ShieldCheck } from 'lucide-react'
import { FormField } from '@/components/molecules/FormField'
import { Section } from './ChildForm'

const ArrivalProtocol = ({initialData,arrivalType,setArrivalType,}:any) => {
    return (
        < Section icon={< History size={18} />} title="03. Arrival Protocol" >
            <div className="flex flex-col gap-8">
                <ArrivalCategory
                    defaultValue={arrivalType}
                    onChange={(val) => setArrivalType(val)}
                />

                {/* FIELD A: GENERAL CONTEXT (Shown for everyone) */}
                <FormField
                    label="Location / Referral Source Details"
                    name="arrivalDetails"
                    defaultValue={initialData?.arrivalDetails}
                    placeholder={
                        arrivalType === 'POLICE_RESCUE' ? "Which Police Station / Case No?" :
                            arrivalType === 'HOSPITAL_REFERRAL' ? "Hospital Name & Ward?" :
                                "Where was the child found?"
                    }
                />

                {/* CASE 1: FAMILY SURRENDER (The High-Detail Block) */}
                {arrivalType === 'FAMILY_SURRENDER' && (
                    <div className="p-8 bg-amber-50/50 border border-amber-100 rounded-[2rem] animate-in slide-in-from-top-4 duration-500 space-y-6">
                        <div className="flex items-center gap-3 border-b border-amber-100 pb-4">
                            <ShieldCheck className="text-amber-600" size={20} />
                            <h4 className="text-xs font-black text-amber-800 uppercase tracking-widest">Guardian Documentation</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField label="Guardian Name" name="guardianName" required defaultValue={initialData?.guardianName} />
                            <FormField label="Relationship" name="guardianRelation" required defaultValue={initialData?.guardianRelation} />
                            <FormField label="Contact Number" name="guardianContact" required defaultValue={initialData?.guardianContact} />
                            <FormField label="Govt ID Number" name="guardianId" defaultValue={initialData?.guardianId} />
                            <div className="md:col-span-2">
                                <FormField label="Reason for Surrender" name="surrenderReason" required defaultValue={initialData?.surrenderReason} />
                            </div>
                        </div>
                    </div>
                )}

                {/* CASE 2: HOSPITAL / POLICE (The Document-Heavy Block) */}
                {(arrivalType === 'HOSPITAL_REFERRAL' || arrivalType === 'POLICE_RESCUE') && (
                    <div className="p-6 bg-blue-50/30 border border-blue-100 rounded-[2rem] animate-in fade-in duration-500">
                        <div className="flex items-center gap-3 mb-4">
                            <AlertCircle className="text-blue-600" size={18} />
                            <p className="text-[10px] font-black text-blue-800 uppercase tracking-widest">Verification Required</p>
                        </div>
                        <p className="text-xs text-blue-700 leading-relaxed mb-0">
                            Please ensure the **Official {arrivalType === 'POLICE_RESCUE' ? 'Police Report' : 'Medical Referral'}** is scanned and uploaded to the **Digital Vault** below for legal compliance.
                        </p>
                    </div>
                )}
            </div>
        </Section >
    )
}

export default ArrivalProtocol