// app/my-finances/page.tsx
import { MyFinancesDashboard } from "@/components/organisms/staffs/MyfinancesDashBoard";
import dbConnect from "@/lib/db";
import Staff from "@/models/Staff";
import Transaction from "@/models/Transaction";
import "@/models/AccountHead";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import  {authOptions}  from "@/app/api/auth/[...nextauth]/route";
// ✨ IMPORTANT: Update this path to where your authOptions are exported

export const dynamic = 'force-dynamic';

export default async function MyFinancesPage() {
    await dbConnect();

    // 1. Authenticate Identity with authOptions
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        console.log("DEBUG: No User ID found. Session data:", session?.user);
        redirect("/");
    }

    const userId = session.user.id;

    // 2. Fetch Data
    const staffProfile = await Staff.findOne({ userId }).lean();
    const rawTransactions = await Transaction.find({ createdBy: userId })
        .populate("accountHead", "name code")
        .sort({ date: -1 })
        .lean();

    // 3. Balance Calculations
    let netBalance = 0;
    let pendingReimbursement = 0;

    rawTransactions.forEach((tx: any) => {
        const isExpense = tx.type === "EXPENSE";
        const isOutOfPocket = tx.paymentMethod === "OUT_OF_POCKET";
        const isCash = tx.paymentMethod === "CASH";

        if (tx.status === "VERIFIED" && !tx.isSettled) {
            if (isOutOfPocket && isExpense) netBalance += tx.amount;
            if (isCash && isExpense) netBalance -= tx.amount;
            if (isCash && tx.type === "INCOME") netBalance -= tx.amount;
        }

        if (tx.status === "PENDING") {
            if (isOutOfPocket && isExpense) pendingReimbursement += tx.amount;
        }
    });

    // 4. Serialize for Client
    const sanitizedTx = JSON.parse(JSON.stringify(rawTransactions)).map((tx: any) => ({
        ...tx,
        _id: String(tx._id),
        date: tx.date ? new Date(tx.date).toISOString() : null,
        accountHead: tx.accountHead ? {
            ...tx.accountHead,
            _id: String(tx.accountHead._id)
        } : null
    }));

    const sanitizedProfile = staffProfile ? JSON.parse(JSON.stringify({
        ...staffProfile,
        _id: String(staffProfile._id),
        userId: String(staffProfile.userId)
    })) : null;

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8">
            <MyFinancesDashboard
                transactions={sanitizedTx}
                netBalance={netBalance}
                pendingAmount={pendingReimbursement}
                profile={sanitizedProfile}
                userName={session.user.name || "Personnel"}
            />
        </div>
    );
} 