"use client";
import React, { useState } from "react";
import { FormField } from "@/components/molecules/FormField";
import { SelectField } from "@/components/molecules/SelectField";
import { Button } from "@/components/atoms/Button";
import { recordStockTransaction } from "@/app/actions/inventory";

export const InventoryMovementForm = ({ catalog }: { catalog: any[] }) => {
    const [type, setType] = useState("STOCK_OUT");
    const [selectedItemId, setSelectedItemId] = useState("");
    
    // ✨ NEW: State to track if the incoming stock was bought or gifted ✨
    const [acquisition, setAcquisition] = useState("DONATED");

    const isOut = type === "STOCK_OUT";
    const activeItem = catalog.find(item => item._id === selectedItemId);

    return (
        <form action={recordStockTransaction} className={`bg-white rounded-xl shadow-sm border overflow-hidden transition-colors ${isOut ? 'border-orange-200' : 'border-emerald-200'}`}>
            
            {/* TYPE TOGGLE */}
            <div className="p-6 border-b border-zinc-200 bg-zinc-50 flex justify-center">
                <div className="flex bg-zinc-200/50 p-1 rounded-lg w-full max-w-sm">
                    <button type="button" onClick={() => setType("STOCK_OUT")}
                        className={`flex-1 py-2 rounded-md font-bold text-sm transition-all ${isOut ? 'bg-white shadow-sm text-orange-700 border border-orange-200' : 'text-zinc-500 hover:text-zinc-700'}`}>
                        - Consume / Use (खर्च)
                    </button>
                    <button type="button" onClick={() => setType("STOCK_IN")}
                        className={`flex-1 py-2 rounded-md font-bold text-sm transition-all ${!isOut ? 'bg-white shadow-sm text-emerald-700 border border-emerald-200' : 'text-zinc-500 hover:text-zinc-700'}`}>
                        + Add Stock (आम्दानी)
                    </button>
                </div>
                <input type="hidden" name="transactionType" value={type} />
            </div>

            <div className="p-6 grid grid-cols-1 gap-6">
                
                {/* CATALOG DROPDOWN */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-zinc-700">Select Item (सामान छान्नुहोस्)</label>
                    <select 
                        name="itemId" 
                        required 
                        className="w-full border px-3 py-2 border-zinc-300 rounded-md bg-white text-sm"
                        value={selectedItemId}
                        onChange={(e) => setSelectedItemId(e.target.value)}
                    >
                        <option value="">-- Choose an item --</option>
                        {catalog.map(item => (
                            <option key={item._id} value={item._id}>
                                {item.itemName} (In Stock: {item.currentQuantity} {item.unit})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* QUANTITY */}
                    <div className="flex flex-col gap-1">
                        <FormField 
                            label={`Quantity (${activeItem ? activeItem.unit : '...'})`} 
                            name="quantity" 
                            type="number" 
                            required 
                            min={0.1} 
                            step="any"
                            max={isOut && activeItem ? activeItem.currentQuantity : undefined}
                            title={isOut && activeItem ? `Max available is ${activeItem.currentQuantity}` : ""}
                        />
                        {isOut && activeItem && (
                            <span className="text-[10px] text-orange-600 font-bold">
                                * Cannot exceed current stock of {activeItem.currentQuantity} {activeItem.unit}
                            </span>
                        )}
                    </div>
                    <FormField label="Date (मिति)" name="date" type="date" required />
                </div>

                {/* ✨ CONDITIONAL STOCK-IN FIELDS ✨ */}
                {!isOut && (
                    <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100 flex flex-col gap-4 animate-in fade-in">
                        <SelectField 
                            label="How was this acquired?" 
                            name="acquisitionType" 
                            value={acquisition}
                            onChange={(e) => setAcquisition(e.target.value)}
                            options={[
                                { label: "Donated / Gifted (उपहार/चन्दा)", value: "DONATED" },
                                { label: "Purchased (खरिद गरिएको)", value: "PURCHASED" }
                            ]} 
                        />

                        {acquisition === "PURCHASED" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                        {acquisition === "DONATED" && (
                            <FormField 
                                label="Donor Name (स्रोत)" 
                                name="purposeOrSource" 
                                placeholder="e.g. Donated by Ram" 
                                required
                            />
                        )}
                    </div>
                )}

                {/* ✨ CONDITIONAL STOCK-OUT FIELD ✨ */}
                {isOut && (
                    <div className="animate-in fade-in">
                        <FormField 
                            label="Purpose / Used For (के को लागि प्रयोग भयो?)" 
                            name="purposeOrSource" 
                            required 
                            placeholder="e.g. Used for Monday Dinner"
                        />
                    </div>
                )}

            </div>

            <div className="p-4 bg-zinc-50 border-t border-zinc-200 flex justify-end">
                <Button type="submit" className={`text-white px-8 ${isOut ? 'bg-orange-600 hover:bg-orange-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}>
                    {isOut ? 'Record Consumption' : 'Add to Stock'}
                </Button>
            </div>
        </form>
    );
};