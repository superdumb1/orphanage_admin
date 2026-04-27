import dbConnect from "@/lib/db";
import PaymentCategory from "@/models/paymentCategory";

import { Button } from "@/components/atoms/Button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { PaymentCategoryTable } from "@/components/organisms/Accounting/payementCategoryTable/PaymentCategoryTable";

export default async function PaymentCategoriesPage() {
    await dbConnect();
    const categories = await PaymentCategory.find().sort({ isSystem: -1, name: 1 });

    return (
        <div className="flex flex-col gap-8 p-8 max-w-6xl mx-auto animate-in fade-in duration-700">
            
            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-8">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter text-text">
                        Payment Categories
                    </h1>
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-2">
                        Manage financial sources, bank accounts, and staff ledgers
                    </p>
                </div>
                {/* For simplicity, we'll use a link to a sub-route or a modal */}
                <Button className="btn-primary flex items-center gap-2 h-12 px-8 font-black uppercase tracking-widest text-[10px]">
                    <Plus size={16} /> New Category
                </Button>
            </div>

            {/* INFO CALLOUT */}
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl">
                <p className="text-[9px] font-black text-primary uppercase tracking-[0.2em] leading-relaxed">
                    Security Protocol: System categories marked with a shield icon are essential for 
                    the OrphanAdmin ledger and cannot be deleted.
                </p>
            </div>

            {/* TABLE COMPONENT */}
            <div className="bg-card rounded-[2rem] border border-border shadow-sm overflow-hidden">
                <PaymentCategoryTable initialData={JSON.parse(JSON.stringify(categories))} />
            </div>
        </div>
    );
}

