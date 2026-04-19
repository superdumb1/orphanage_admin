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
            <ChartOfAccounts initialAccounts={accounts} />
    );
}