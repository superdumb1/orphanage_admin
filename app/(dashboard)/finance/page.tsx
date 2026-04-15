import dbConnect from "@/lib/db";
import AccountHead from "@/models/AccountHead";
import Transaction from "@/models/Transaction";
import InventoryItem from "@/models/InventoryItem";
import "@/models/AccountHead";
import "@/models/InventoryLog";
import "@/models/InventoryItem";

import PageHeader from "@/components/organisms/Accounting/Transactions/PageHeader";
import FinanceLedger from "@/components/organisms/Accounting/Transactions/LedgerTable/FinanceLedger";

type Variant = "default" | "success" | "warning" | "danger";

const styles: Record<Variant, string> = {
    default: "bg-white border-zinc-200 text-zinc-900",
    success: "bg-emerald-50 border-emerald-100 text-emerald-900",
    warning: "bg-amber-50 border-amber-100 text-amber-900",
    danger: "bg-rose-50 border-rose-100 text-rose-900",
};

const iconStyles: Record<Variant, string> = {
    default: "text-zinc-500",
    success: "text-emerald-600",
    warning: "text-amber-600",
    danger: "text-rose-600",
};

export default async function FinancePage() {
    await dbConnect();

    const rawAccounts = await AccountHead.find({}).lean();
    const accounts = JSON.parse(JSON.stringify(rawAccounts));

    const rawInventory = await InventoryItem.find({}).lean();
    const inventory = JSON.parse(JSON.stringify(rawInventory));

    const rawTransactions = await Transaction.find({})
        .populate("accountHead", "name code")
        .populate({
            path: "logId",
            populate: { path: "item" },
        })
        .sort({ date: -1 })
        .lean();

    const safeTransactions = JSON.parse(JSON.stringify(rawTransactions));

    let totalIncome = 0;
    let totalExpense = 0;

    const transactions = safeTransactions.map((txn: any) => {
        if (txn.type === "INCOME") totalIncome += txn.amount;
        if (txn.type === "EXPENSE") totalExpense += txn.amount;
        return txn;
    });

    const netBalance = totalIncome - totalExpense;

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 bg-zinc-50 min-h-screen">
            <PageHeader accounts={accounts} />

            {/* SUMMARY GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SummaryCard
                    label="Available Balance"
                    value={netBalance}
                    variant={netBalance >= 0 ? "default" : "danger"}
                />
                <SummaryCard
                    label="Total Inflow"
                    value={totalIncome}
                    variant="success"
                    prefix="+ "
                />
                <SummaryCard
                    label="Total Outflow"
                    value={totalExpense}
                    variant="warning"
                    prefix="- "
                />
            </div>

            <FinanceLedger
                transactions={transactions}
                accounts={accounts}
                inventory={inventory}
            />
        </div>
    );
}

/* =========================
   SUMMARY CARD COMPONENT
========================= */

function SummaryCard({
    label,
    value,
    variant = "default",
    prefix = "",
}: {
    label: string;
    value: number;
    variant?: Variant;
    prefix?: string;
}) {
    return (
        <div
            className={`p-4 rounded-2xl border shadow-sm flex flex-col gap-2 transition-all ${styles[variant]}`}
        >
            {/* LABEL */}
            <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-500">
                {label}
            </p>

            {/* VALUE */}
            <p className="text-2xl font-bold tracking-tight">
                <span className={iconStyles[variant]}>{prefix}</span>
                NPR {Number(value).toLocaleString("en-IN")}
            </p>
        </div>
    );
}