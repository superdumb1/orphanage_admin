"use client";
import React, { useActionState, useEffect } from "react";
import { FormField } from "@/components/molecules/FormField";
import { SelectField } from "@/components/molecules/SelectField";
import { Button } from "@/components/atoms/Button";
import { addInventoryItem, updateInventoryItem } from "@/app/actions/inventory";
import { Archive, MapPin, ShieldCheck, ClipboardCheck } from "lucide-react";
import { SelectAssetCategory } from "@/components/molecules/SelectInventoryAssetsCategory";

export const FixedAssetItemForm = ({ item, closeModal }: { item?: any; closeModal: () => void; }) => {
    const action = item ? updateInventoryItem : addInventoryItem;
    const [state, formAction, isPending] = useActionState(action as any, { error: null, success: false });

    useEffect(() => { if (state?.success) closeModal(); }, [state?.success, closeModal]);

    return (
        <form action={formAction} className="flex flex-col h-full w-full animate-in slide-in-from-right-4 duration-500">
            {item?._id && <input type="hidden" name="id" value={item._id} />}
            <input type="hidden" name="type" value="ASSET" />
            <input type="hidden" name="unit" value="pcs" /> {/* Assets usually pcs */}

            <div className="flex-1 overflow-y-auto px-4 pb-8 space-y-8 custom-scrollbar">
                {/* ASSET HEADER */}
                <div className="flex items-center gap-4 bg-secondary/5 p-6 rounded-[2.5rem] border border-secondary/20 mt-2 shadow-sm">
                    <div className="w-14 h-14 bg-secondary text-text-invert rounded-2xl flex items-center justify-center shadow-glow-secondary">
                        <Archive size={28} />
                    </div>
                    <div>
                        <h2 className="text-[10px] font-black text-secondary uppercase tracking-[0.4em]">Asset Registry</h2>
                        <p className="text-sm font-black text-text">Fixed Infrastructure & Equipment</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Identity */}
                    <div className="lg:col-span-6 bg-card p-8 rounded-[2rem] border border-border space-y-6">
                        <h3 className="text-[10px] font-black text-secondary uppercase tracking-[0.3em] flex items-center gap-2"><ClipboardCheck size={14}/> Asset Info</h3>
                        <FormField label="Asset Name *" name="name" required placeholder="e.g. Study Table" defaultValue={item?.name} />
                        <SelectAssetCategory name="category" defaultValue={item?.category} required />
                    </div>

                    {/* Stewardship */}
                    <div className="lg:col-span-6 bg-secondary/5 p-8 rounded-[2rem] border border-secondary/20 space-y-6">
                        <h3 className="text-[10px] font-black text-secondary uppercase tracking-[0.3em] flex items-center gap-2"><MapPin size={14}/> Placement</h3>
                        <FormField label="Room / Area" name="location" placeholder="e.g. Boys Dorm, Library" defaultValue={item?.location} />
                        <SelectField label="Initial Condition" name="condition" defaultValue={item?.condition || "NEW"} 
                            options={[
                                { label: "Brand New / Sealed", value: "NEW" },
                                { label: "Functional / Used", value: "GOOD" },
                                { label: "Needs Maintenance", value: "REPAIR" }
                            ]} 
                        />
                    </div>
                </div>

                <div className="bg-card p-6 rounded-3xl border border-border">
                    <FormField label="Audit Description" name="description" placeholder="Serial numbers or specifics..." defaultValue={item?.description} />
                </div>
            </div>

            <div className="shrink-0 flex justify-end gap-5 p-6 border-t border-border bg-card/80 backdrop-blur-md rounded-t-[2.5rem]">
                <button type="button" onClick={closeModal} className="text-[10px] font-black uppercase text-text-muted hover:text-text tracking-widest">Cancel</button>
                <Button type="submit" disabled={isPending} className="px-14 h-14 font-black text-xs uppercase tracking-[0.2em] text-text-invert bg-secondary shadow-glow-secondary transition-all active:scale-95">
                    {isPending ? "REGISTERING..." : "COMMIT_ASSET"}
                </Button>
            </div>
        </form>
    );
};