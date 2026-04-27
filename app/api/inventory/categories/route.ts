import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import InventoryCategory from "@/models/InventoryCategory";

export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        // ✨ Get the 'type' from the query parameters
        const { searchParams } = new URL(request.url);
        const type = searchParams.get("type");

        // Prepare the filter
        const filter: any = { isActive: true };
        if (type) {
            filter.type = type.toUpperCase(); // Ensure it matches 'CONSUMABLE' or 'ASSET'
        }

        // Fetch categories sorted alphabetically
        const categories = await InventoryCategory.find(filter)
            .sort({ name: 1 })
            .lean();

        return NextResponse.json(categories);
    } catch (error: any) {
        console.error("API_REGISTRY_ERROR:", error);
        return NextResponse.json(
            { error: "Failed to sync registry categories." },
            { status: 500 }
        );
    }
}