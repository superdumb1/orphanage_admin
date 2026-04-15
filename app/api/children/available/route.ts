import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Child from "@/models/Child";

export async function GET() {
    await dbConnect();
    
    // Fetch only children currently in care/available
    const children = await Child.find({ status: "IN_CARE" })
        .select("firstName lastName profileImageUrl status")
        .sort({ firstName: 1 })
        .lean();

    return NextResponse.json(children);
}