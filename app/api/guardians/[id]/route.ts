import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Guardian from "@/models/Guardian";
import Child from "@/models/Child";

export async function GET(
    req: Request, 
    { params }: { params: Promise<{ id: string }> } // 1. Update Type to Promise
) {
    await dbConnect();

    const { id } = await params; 
    
    const guardian = await Guardian.findById(id)
        .populate("assignedChildren")
        .lean();

    if (!guardian) {
        return NextResponse.json({ error: "Guardian not found" }, { status: 404 });
    }

    const availableChildren = await Child.find({ status: "IN_CARE" })
        .select("firstName lastName profileImageUrl status")
        .lean();

    return NextResponse.json({
        guardian,
        availableChildren
    });
}