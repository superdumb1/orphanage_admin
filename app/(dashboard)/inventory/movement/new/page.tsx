import { InventoryMovementForm } from "@/components/organisms/inventory/InventoryMovementForm";
import Link from "next/link";
import { Button } from "@/components/atoms/Button";
import dbConnect from "@/lib/db";
import InventoryItem from "@/models/InventoryItem";

export const dynamic = 'force-dynamic';

export default async function NewInventoryMovementPage() {
    await dbConnect();
    
    // Fetch only the necessary data to keep the payload light
    const rawItems = await InventoryItem.find({})
        .select('_id itemName currentQuantity unit')
        .sort({ itemName: 1 })
        .lean() as any[];

    // Serialize object IDs so Next.js can pass them to the client component safely
    const catalog = rawItems.map(item => ({
        ...item,
        _id: item._id.toString()
    }));

    return (
        <div className="flex flex-col gap-6 max-w-2xl pb-10">
            <div className="flex items-center gap-4">
                <Link href="/inventory"><Button variant="ghost" className="px-2">← Back</Button></Link>
                <h1 className="text-2xl font-bold text-zinc-900">Update Stock</h1>
            </div>
            
            {/* Pass the catalog into the form! */}
            <InventoryMovementForm catalog={catalog} />
        </div>
    );
}