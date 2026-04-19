import dbConnect from "@/lib/db";
import InventoryItem from "@/models/InventoryItem";
import InventoryDashboard from "@/components/organisms/Accounting/Inventory/InventoryDashboard";
import AccountHead from "@/models/AccountHead";

export default async function InventoryPage() {
    await dbConnect();

    // Fetch all items and sort them by category, then by name
    const rawItems = await InventoryItem.find({}).sort({ category: 1, name: 1 }).lean();
    const rawAccounts = await AccountHead.find({ type: 'EXPENSE' }).lean();
    
    const accounts = rawAccounts.map((acc: any) => ({
        ...acc,
        _id: acc._id.toString()
    }));
    
    const items = rawItems.map((item: any) => ({
        ...item,
        _id: item._id.toString(),
        createdAt: item.createdAt?.toISOString() || new Date().toISOString(),
        updatedAt: item.updatedAt?.toISOString() || new Date().toISOString(),
    }));

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-text tracking-tighter">
                    Inventory
                </h1>
                <p className="text-sm text-text-muted font-medium">
                    Track stock levels for food, medical supplies, and more.
                </p>
            </div>

            <InventoryDashboard items={items} />
        </div>
    );
}