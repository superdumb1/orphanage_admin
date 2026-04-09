import dbConnect from "@/lib/db";
import Transaction from "@/models/Transaction";
import { Button } from "@/components/atoms/Button";
import Link from "next/link";
import { StatBox } from "@/components/atoms/StatBox";

export const dynamic = 'force-dynamic';

export default async function FinancePage() {
    await dbConnect();
    
    // Fetch all transactions, newest first
    const transactions = await Transaction.find({}).sort({ date: -1 }).lean() as any[];

    // Calculate Financial Stats
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(t => {
        if (t.type === "INCOME") totalIncome += t.amount;
        if (t.type === "EXPENSE") totalExpense += t.amount;
    });

    const netBalance = totalIncome - totalExpense;

    return (
        <div className="flex flex-col gap-8 pb-10">
            {/* --- PAGE HEADER --- */}
            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-zinc-200">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900">Rato Khata (रेड बुक)</h1>
                    <p className="text-sm text-zinc-500">Master Financial Ledger</p>
                </div>
                <div className="flex gap-3">
                    <Link href="/finance/expense/new">
                        <Button variant="secondary" className="shadow-sm border-red-200 text-red-700 hover:bg-red-50">
                            - Record Expense
                        </Button>
                    </Link>
                    <Link href="/finance/income/new">
                        <Button variant="primary" className="shadow-sm bg-emerald-600 hover:bg-emerald-700">
                            + Record Income
                        </Button>
                    </Link>
                </div>
            </div>

            {/* --- STAT DASHBOARD --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatBox 
                    label="Total Income" 
                    subLabel="कुल आम्दानी" 
                    value={`Rs. ${totalIncome.toLocaleString()}`} 
                    icon={<span className="text-2xl">📥</span>} 
                    color="text-emerald-600" 
                />
                <StatBox 
                    label="Total Expenses" 
                    subLabel="कुल खर्च" 
                    value={`Rs. ${totalExpense.toLocaleString()}`} 
                    icon={<span className="text-2xl">📤</span>} 
                    color="text-red-600" 
                />
                <div className={`p-6 rounded-xl border flex items-center justify-between shadow-sm ${netBalance >= 0 ? 'bg-zinc-900 border-zinc-800' : 'bg-red-900 border-red-800'}`}>
                    <div>
                        <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1">Current Balance</p>
                        <p className="text-zinc-500 text-[10px]">बाँकी रकम</p>
                    </div>
                    <div className="text-right">
                        <span className="text-2xl font-black text-white">Rs. {netBalance.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* --- LEDGER TABLE --- */}
            <div className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-zinc-600 whitespace-nowrap">
                        <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-900">
                            <tr>
                                <th className="p-4 font-bold tracking-wide">Date</th>
                                <th className="p-4 font-bold tracking-wide">Details</th>
                                <th className="p-4 font-bold tracking-wide">Category / Method</th>
                                <th className="p-4 font-bold tracking-wide text-right">Amount (NPR)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {transactions.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-zinc-500">
                                        <p className="text-lg mb-1">No transactions recorded yet.</p>
                                        <p className="text-sm">Record an income or expense to start the ledger.</p>
                                    </td>
                                </tr>
                            ) : (
                                transactions.map((t) => (
                                    <tr key={t._id.toString()} className="hover:bg-zinc-50/80 transition-colors">
                                        
                                        {/* Date */}
                                        <td className="p-4">
                                            <span className="font-medium text-zinc-900">
                                                {new Date(t.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </span>
                                        </td>

                                        {/* Details (Donor/Remarks) */}
                                        <td className="p-4">
                                            <div className="flex flex-col">
                                                {t.type === "INCOME" ? (
                                                    <span className="font-bold text-zinc-900">
                                                        {t.isAnonymous ? "Anonymous Donor" : (t.donorName || "General Donation")}
                                                    </span>
                                                ) : (
                                                    <span className="font-bold text-zinc-900">Expense Record</span>
                                                )}
                                                <span className="text-xs text-zinc-500 truncate max-w-[250px]">
                                                    {t.paymentMethod === "KIND" ? `Items: ${t.itemDescription}` : t.remarks || '-'}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Category & Method */}
                                        <td className="p-4">
                                            <div className="flex flex-col gap-1 items-start">
                                                <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700 text-[10px] font-bold uppercase tracking-wider border border-zinc-200">
                                                    {t.category}
                                                </span>
                                                <span className="text-xs text-zinc-400 font-medium">via {t.paymentMethod}</span>
                                            </div>
                                        </td>

                                        {/* Amount (Color Coded) */}
                                        <td className="p-4 text-right">
                                            {t.type === "INCOME" ? (
                                                <span className="font-bold text-emerald-600">+ {t.amount.toLocaleString()}</span>
                                            ) : (
                                                <span className="font-bold text-red-600">- {t.amount.toLocaleString()}</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}