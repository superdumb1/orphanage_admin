import dbConnect from "@/lib/db";
import AccountHead from "@/models/AccountHead";
import ChartOfAccounts from "@/components/organisms/Accounting/AccountsHead/ChartOfAccounts";

export default async function FinancePage() {
    await dbConnect();
    const rawAccounts = await AccountHead.find({}).lean();

    const accounts = rawAccounts.map((acc: any) => ({
        ...acc,
        _id: acc._id.toString(),
        subType: Array.isArray(acc.subType) ? acc.subType : [acc.subType]
    }));

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-zinc-900 tracking-tighter">Finance & Ledger</h1>
                <p className="text-sm text-zinc-500 font-medium">Manage your Chart of Accounts and organizational account heads.</p>
            </div>

            <ChartOfAccounts initialAccounts={accounts} />
        </div>
    );
}