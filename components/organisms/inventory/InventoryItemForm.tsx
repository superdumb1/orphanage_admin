"use client";
import React, { useActionState, useState } from "react"; 
import { FormField } from "@/components/molecules/FormField";
import { SelectField } from "@/components/molecules/SelectField";
import { Button } from "@/components/atoms/Button";
import { createInventoryItem } from "@/app/actions/inventory";

const initialState = { error: null as string | null };

export const InventoryItemForm = () => {
    const [state, formAction, isPending] = useActionState(createInventoryItem, initialState);
    
    // ✨ NEW: State to track if the item was bought or gifted ✨
    const [acquisition, setAcquisition] = useState("EXISTING_STOCK");

    return (
        <form action={formAction} className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden">
            <div className="bg-indigo-50 p-4 border-b border-indigo-100 flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xl">📦</div>
                <div>
                    <h2 className="font-bold text-indigo-900 text-lg">Add to Catalog (नयाँ सामान)</h2>
                    <p className="text-xs text-indigo-700">Define a new physical item for the storeroom</p>
                </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {state?.error && (
                    <div className="col-span-1 md:col-span-2 p-4 bg-red-50 text-red-700 font-medium rounded-lg border border-red-200 flex items-center gap-2">
                        <span>⚠️</span> {state.error}
                    </div>
                )}

                <FormField label="Item Name (सामानको नाम)" name="itemName" required placeholder="e.g. Jeera Masino Rice, Dettol Soap" />
                
                <SelectField 
                    label="Category (वर्ग)" name="category" required 
                    options={[
                        { label: "Groceries & Pantry (राशन)", value: "GROCERY" },
                        { label: "Clothing & Bedding (कपडा)", value: "CLOTHING" },
                        { label: "Education & Stationery (शिक्षा)", value: "EDUCATION" },
                        { label: "Medical Supplies (औषधि)", value: "MEDICAL" },
                        { label: "Fixed Assets (सम्पत्ति)", value: "ASSET" },
                        { label: "Other (अन्य)", value: "OTHER" }
                    ]} 
                />

                <SelectField 
                    label="Measurement Unit (इकाई)" name="unit" required 
                    options={[
                        { label: "Kilograms (kg)", value: "kg" },
                        { label: "Liters (L)", value: "liters" },
                        { label: "Pieces (pcs)", value: "pieces" },
                        { label: "Packets (pkt)", value: "packets" },
                        { label: "Boxes", value: "boxes" },
                        { label: "Pairs", value: "pairs" }
                    ]} 
                />

                <div className="flex flex-col gap-1">
                    <FormField label="Low Stock Alert Level (न्यून स्टक चेतावनी)" name="minQuantityAlert" type="number" required defaultValue={10} min={1} />
                    <span className="text-[10px] text-zinc-500">System will warn you when stock drops below this number</span>
                </div>

                <FormField label="Storage Location (स्थान)" name="location" defaultValue="Main Storeroom" />

                {/* --- INITIAL STOCK SECTION --- */}
                <div className="col-span-1 md:col-span-2 p-5 bg-emerald-50 rounded-lg border border-emerald-100 flex flex-col gap-4 mt-2 transition-all">
                    <div>
                        <h3 className="font-bold text-emerald-900 text-sm border-b border-emerald-200 pb-2">Initial Stock (सुरुवाती स्टक)</h3>
                        <p className="text-xs text-emerald-700 mt-1">If you already have this item in the storeroom, enter the amount below. Otherwise, leave it as 0.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField label="Initial Quantity (परिमाण)" name="initialQuantity" type="number" defaultValue={0} min={0} step="any" />
                        
                        {/* Dynamic Dropdown for Bought vs Gifted */}
                        <SelectField 
                            label="How was this acquired?" 
                            name="acquisitionType" 
                            value={acquisition}
                            onChange={(e) => setAcquisition(e.target.value)}
                            options={[
                                { label: "Already in Storeroom (पहिले नै भएको)", value: "EXISTING_STOCK" },
                                { label: "Donated / Gifted (उपहार/चन्दा)", value: "DONATED" },
                                { label: "Purchased (खरिद गरिएको)", value: "PURCHASED" }
                            ]} 
                        />
                    </div>

                    {/* ✨ CONDITIONAL COST FIELD: Only shows if "Purchased" is selected ✨ */}
                    {acquisition === "PURCHASED" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-emerald-200/50 animate-in fade-in zoom-in-95">
                            <FormField 
                                label="Total Cost (NPR) (कुल खर्च)" 
                                name="totalCost" 
                                type="number" 
                                required 
                                min={0} 
                                placeholder="e.g. 5000"
                            />
                            <FormField 
                                label="Supplier / Shop Name (पसलको नाम)" 
                                name="purposeOrSource" 
                                placeholder="e.g. Bhatbhateni Supermarket" 
                                required
                            />
                        </div>
                    )}

                    {/* Alternate Source field if NOT purchased */}
                    {acquisition !== "PURCHASED" && (
                        <FormField 
                            label="Donor Name / Source (स्रोत)" 
                            name="purposeOrSource" 
                            placeholder={acquisition === "DONATED" ? "e.g. Donated by Ram" : "e.g. Existing Inventory"} 
                        />
                    )}
                </div>
            </div>

            <div className="p-4 bg-zinc-50 border-t border-zinc-200 flex justify-end">
                <Button type="submit" disabled={isPending} className="text-white px-8 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50">
                    {isPending ? "Adding..." : "Add to Catalog"}
                </Button>
            </div>
        </form>
    );
};