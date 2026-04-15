import dbConnect from "@/lib/db";
import AccountHead from "@/models/AccountHead";
import Transaction from "@/models/Transaction";
import InventoryItem from "@/models/InventoryItem";
import "@/models/AccountHead";
import "@/models/InventoryLog";
import "@/models/InventoryItem";

import PageHeader from "@/components/organisms/Accounting/Transactions/PageHeader";
import FinanceLedger from "@/components/organisms/Accounting/Transactions/LedgerTable/FinanceLedger";

export const dynamic = 'force-dynamic';

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
        // Wrapper: Removed bg-zinc-50 (handled by global layout) and adjusted spacing
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 w-full transition-colors duration-500">
            <PageHeader accounts={accounts} />

            {/* SUMMARY GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

type Variant = "default" | "success" | "warning" | "danger";

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
    // 1. Map container backgrounds and borders to semantic tokens with opacity
    const containerStyles: Record<Variant, string> = {
        default: "bg-card border-border",
        success: "bg-success/10 border-success/20",
        warning: "bg-warning/10 border-warning/20",
        danger: "bg-danger/10 border-danger/20",
    };

    // 2. Map the main value text colors to matching semantic tokens
    const valueStyles: Record<Variant, string> = {
        default: "text-text",
        success: "text-success",
        warning: "text-warning",
        danger: "text-danger",
    };

    return (
        <div
            // 3. Upgraded structural classes: rounded-dashboard, shadow-glow
            className={`p-6 rounded-dashboard border shadow-glow flex flex-col justify-center gap-2 transition-colors duration-500 ${containerStyles[variant]}`}
        >
            {/* LABEL: Upgraded to Micro-caps aesthetic with text-text-muted */}
            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-text-muted">
                {label}
            </p>

            {/* VALUE: Tinted based on variant, bumped to text-3xl for impact */}
            <p className={`text-3xl font-black tracking-tight ${valueStyles[variant]}`}>
                <span className="opacity-80 pr-1">{prefix}</span>
                NPR {Number(value).toLocaleString("en-IN")}
            </p>
        </div>
    );
}