import dbConnect from "@/lib/db";
import InventoryItem from "@/models/InventoryItem";
import { Button } from "@/components/atoms/Button";
import Link from "next/link";
import { StatBox } from "@/components/atoms/StatBox";

export const dynamic = 'force-dynamic';

export default async function InventoryPage() {
    await dbConnect();
    
    // Fetch all items and sort them alphabetically
    const items = await InventoryItem.find({}).sort({ itemName: 1 }).lean() as any[];

    // Calculate Dashboard Stats
    const totalItems = items.length;
    const lowStockItems = items.filter(item => item.currentQuantity <= item.minQuantityAlert);

    return (
        <div className="flex flex-col gap-8 pb-10">
            {/* --- PAGE HEADER --- */}
            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-zinc-200">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900">Jinsi Khata (जिन्सी खाता)</h1>
                    <p className="text-sm text-zinc-500">Physical Inventory & Storeroom</p>
                </div>
                <div className="flex gap-3">
                    <Link href="/inventory/movement/new">
                        <Button variant="secondary" className="shadow-sm border-zinc-300 text-zinc-700">
                            ⇌ Update Stock (In/Out)
                        </Button>
                    </Link>
                    <Link href="/inventory/new">
                        <Button variant="primary" className="shadow-sm bg-indigo-600 hover:bg-indigo-700 border-indigo-700">
                            + Add New Item
                        </Button>
                    </Link>
                </div>
            </div>

            {/* --- STAT DASHBOARD --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <StatBox 
                    label="Total Catalog Items" 
                    subLabel="कुल सामान प्रकार" 
                    value={totalItems} 
                    icon={<span className="text-2xl">📦</span>} 
                    color="text-indigo-600" 
                />
                
                {/* Dynamic Alert Box */}
                <div className={`p-6 rounded-xl border flex items-center justify-between shadow-sm ${lowStockItems.length > 0 ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'}`}>
                    <div>
                        <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${lowStockItems.length > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                            Low Stock Alerts
                        </p>
                        <p className={`text-[10px] ${lowStockItems.length > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                            न्यून स्टक चेतावनी
                        </p>
                    </div>
                    <div className="text-right flex items-center gap-3">
                        <span className="text-2xl font-black text-zinc-900">{lowStockItems.length}</span>
                        <span className="text-2xl">{lowStockItems.length > 0 ? '⚠️' : '✅'}</span>
                    </div>
                </div>
            </div>

            {/* --- INVENTORY CATALOG TABLE --- */}
            <div className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-zinc-600 whitespace-nowrap">
                        <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-900">
                            <tr>
                                <th className="p-4 font-bold tracking-wide">Item Name</th>
                                <th className="p-4 font-bold tracking-wide">Category</th>
                                <th className="p-4 font-bold tracking-wide">Location</th>
                                <th className="p-4 font-bold tracking-wide text-right">Current Stock</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {items.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-zinc-500">
                                        <p className="text-lg mb-1">Your storeroom is empty.</p>
                                        <p className="text-sm">Click "Add New Item" to start building your catalog.</p>
                                    </td>
                                </tr>
                            ) : (
                                items.map((item) => {
                                    const isLowStock = item.currentQuantity <= item.minQuantityAlert;
                                    
                                    return (
                                        <tr key={item._id.toString()} className="hover:bg-zinc-50/80 transition-colors">
                                            <td className="p-4">
                                                <span className={`font-bold ${isLowStock ? 'text-red-600' : 'text-zinc-900'}`}>
                                                    {item.itemName}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700 text-[10px] font-bold uppercase tracking-wider border border-zinc-200">
                                                    {item.category}
                                                </span>
                                            </td>
                                            <td className="p-4 text-zinc-500">
                                                {item.location}
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex flex-col items-end">
                                                    <span className={`font-black text-lg ${isLowStock ? 'text-red-600' : 'text-indigo-600'}`}>
                                                        {item.currentQuantity} <span className="text-sm font-medium text-zinc-500">{item.unit}</span>
                                                    </span>
                                                    {isLowStock && (
                                                        <span className="text-[10px] font-bold text-red-500 bg-red-100 px-1 rounded">
                                                            Order more (Min: {item.minQuantityAlert})
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}