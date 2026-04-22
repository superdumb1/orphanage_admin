import { MyFinancesDashboard } from "@/components/organisms/staffs/MyfinancesDashBoard";
import dbConnect from "@/lib/db";
import Staff from "@/models/Staff";
import Transaction from "@/models/Transaction";
import "@/models/AccountHead";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function MyFinancesPage() {
    await dbConnect();

    // 1. Authenticate Identity
    const session = await getServerSession();
    if (!session?.user) redirect("/");

    const userId = session.user.id;

    // 2. Fetch their HR Profile (for limits and designation)
    const staffProfile = await Staff.findOne({ userId }).lean();

    // 3. Fetch their entire transaction history
    const rawTransactions = await Transaction.find({ createdBy: userId })
        .populate("accountHead", "name code")
        .sort({ date: -1 })
        .lean();

    // 4. Accurately calculate their Current Net Balance (Matching Admin Settlement Logic)
    let netBalance = 0;

    rawTransactions.forEach((tx: any) => {
        if (tx.status === "VERIFIED" && !tx.isSettled) {
            if (tx.paymentMethod === "CASH" && tx.type === "INCOME") {
                netBalance += tx.amount; // They received cash (Donation or Advance)
            } else if (tx.paymentMethod === "CASH" && tx.type === "EXPENSE") {
                netBalance -= tx.amount; // They spent the orphanage cash they were holding
            } else if (tx.paymentMethod === "OUT_OF_POCKET" && tx.type === "EXPENSE") {
                netBalance -= tx.amount; // They spent their own personal money
            }
        }
    });

    // 5. Serialize for the Client Component (Indestructible Version)
    // 5. Serialize for the Client Component (Next.js Network-Safe Version)
    const sanitizedTx = JSON.parse(JSON.stringify(rawTransactions.map((tx: any) => {
        let safeAccountHead = null;

        if (tx.accountHead) {
            // Check if it populated into a full object with an _id
            if (typeof tx.accountHead === 'object' && tx.accountHead._id) {
                safeAccountHead = {
                    ...tx.accountHead,
                    _id: String(tx.accountHead._id)
                };
            } else {
                // It's a raw orphaned ID
                safeAccountHead = String(tx.accountHead);
            }
        }

        return {
            ...tx,
            _id: tx._id ? String(tx._id) : "unknown_id",
            accountHead: safeAccountHead,
            createdBy: tx.createdBy ? String(tx.createdBy) : String(userId),

            // ✨ THE FIX: Explicitly convert Date objects to plain strings
            date: tx.date ? new Date(tx.date).toISOString() : null,
            createdAt: tx.createdAt ? new Date(tx.createdAt).toISOString() : null,
            updatedAt: tx.updatedAt ? new Date(tx.updatedAt).toISOString() : null,
        };
    })));

    const sanitizedProfile = staffProfile ? JSON.parse(JSON.stringify(staffProfile)) : null;

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8">
            <MyFinancesDashboard
                transactions={sanitizedTx}
                netBalance={netBalance}
                profile={sanitizedProfile}
                userName={session.user.name || "Personnel"}
            />
        </div>
    );
}