import dbConnect from "@/lib/db";
import AccountHead from "@/models/AccountHead";
import Transaction from "@/models/Transaction";
import InventoryItem from "@/models/InventoryItem"; 
import '@/models/AccountHead';
import '@/models/InventoryLog';
import PageHeader from "@/components/organisms/Transactions/PageHeader";
import FinanceLedger from "@/components/organisms/Transactions/LedgerTable/FinanceLedger";

export default async function FinancePage() {
    await dbConnect();

    const rawAccounts = await AccountHead.find({}).lean();
    const accounts = JSON.parse(JSON.stringify(rawAccounts));

    const rawInventory = await InventoryItem.find({}).lean();
    const inventory = JSON.parse(JSON.stringify(rawInventory));

    const rawTransactions = await Transaction.find({})
        .populate('accountHead', 'name code')
        .populate('logId')
        .sort({ date: -1 })
        .lean();
    
    const safeTransactions = JSON.parse(JSON.stringify(rawTransactions));

    let totalIncome = 0;
    let totalExpense = 0;

    const transactions = safeTransactions.map((txn: any) => {
        if (txn.type === 'INCOME') totalIncome += txn.amount;
        if (txn.type === 'EXPENSE') totalExpense += txn.amount;
        return txn;
    });

    const netBalance = totalIncome - totalExpense;

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <PageHeader accounts={accounts} />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SummaryCard label="Available Balance" value={netBalance} variant={netBalance >= 0 ? 'default' : 'danger'} />
                <SummaryCard label="Total Inflow" value={totalIncome} variant="success" prefix="+ " />
                <SummaryCard label="Total Outflow" value={totalExpense} variant="warning" prefix="- " />
            </div>
            
            <FinanceLedger
                transactions={transactions}
                accounts={accounts}
                inventory={inventory}
            />
        </div>
    );
}


function SummaryCard({ label, value, variant = 'default', prefix = '' }: any) {
    const styles: any = {
        default: "bg-white border-zinc-200 text-zinc-900",
        success: "bg-emerald-50/50 border-emerald-100 text-emerald-700",
        warning: "bg-rose-50/50 border-rose-100 text-rose-700",
        danger: "bg-rose-600 border-rose-700 text-white"
    };

    return (
        <div className={`p-2  px-4 rounded-3xl border shadow-sm flex flex-col gap-2 ${styles[variant]}`}>
            <p className={`text-[11px] font-black uppercase tracking-widest ${variant === 'danger' ? 'text-rose-100' : 'text-zinc-400'}`}>
                {label}
            </p>
            <p className="text-xl font-black font-mono tracking-tighter">
                {prefix}NPR {value.toLocaleString()}
            </p>
        </div>
    );
}