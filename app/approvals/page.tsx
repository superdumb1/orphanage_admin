import { VerificationDashboard } from "@/components/organisms/Admin/VerificationDashboard";
import dbConnect from "@/lib/db";
import Transaction from "@/models/Transaction";
import AccountHead from "@/models/AccountHead"; // ✨ Ensure this is imported so Mongoose registers it

export default async function ApprovalsPage() {
    await dbConnect();
    
    // ✨ Fetch PENDING transactions and populate BOTH the user and the account head
    const pendingData = await Transaction.find({ status: "PENDING" })
        .populate("createdBy", "name email role") 
        .populate("accountHead", "name code") // ✨ NEW: Fetch the category details
        .sort({ date: -1 })
        .lean();

    // Convert MongoDB _ids to strings for Client Components
    const sanitizedData = pendingData.map((tx: any) => ({
        ...tx,
        _id: tx._id.toString(),
        createdBy: tx.createdBy ? { ...tx.createdBy, _id: tx.createdBy._id.toString() } : null,
        // ✨ Safely serialize the populated account head
        accountHead: tx.accountHead ? { ...tx.accountHead, _id: tx.accountHead._id.toString() } : "Unknown Category",
    }));

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-8">
            <VerificationDashboard pendingTransactions={sanitizedData} />
        </div>
    );
}