// app/finance/settlements/page.tsx
import dbConnect from "@/lib/db";
import Transaction from "@/models/Transaction";
import AccountHead from "@/models/AccountHead";
import { SettlementDashboard } from "@/components/organisms/Admin/AdminSettlementDashboard";

export default async function SettlementsPage() {
    await dbConnect();

    // 1. Get all Bank Accounts for the dropdown
    const bankAccounts = await AccountHead.find({ type: "ASSET", subType: "Bank" }).lean();

    // 2. Aggregate the unsettled cash held by each staff member
    const aggregatedBalances = await Transaction.aggregate([
        {
            $match: {
                status: "VERIFIED",
                isSettled: false,
                $or: [
                    // Scenario A: They collected physical cash (They owe the orphanage)
                    { paymentMethod: "CASH", type: "INCOME" },
                    // Scenario B: They paid with their own money (Orphanage owes them)
                    { paymentMethod: "OUT_OF_POCKET", type: "EXPENSE" }
                ]
            }
        },
        {
            $group: {
                _id: "$createdBy",
                // Add Cash Incomes, Subtract Out-of-Pocket Expenses
                netBalance: {
                    $sum: {
                        $cond: [{ $eq: ["$paymentMethod", "CASH"] }, "$amount", { $multiply: ["$amount", -1] }]
                    }
                },
                totalOutOfPocket: {
                    $sum: {
                        $cond: [{ $eq: ["$paymentMethod", "OUT_OF_POCKET"] }, "$amount", 0]
                    }
                }
            }
        },
        {
            $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "staffDetails" }
        },
        { $unwind: "$staffDetails" },
        {
            $project: {
                _id: { $toString: "$_id" },
                name: "$staffDetails.name",
                role: "$staffDetails.role",
                netBalance: 1,
                totalOutOfPocket: 1
            }
        }
    ]);

    // Sanitize Bank Accounts for Client
    const sanitizedBanks = bankAccounts.map(b => ({ ...b, _id: b._id.toString() }));

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8">
            <SettlementDashboard
                staffBalances={aggregatedBalances}
                bankAccounts={sanitizedBanks}
            />
        </div>
    );
}