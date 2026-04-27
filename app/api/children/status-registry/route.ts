import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ChildCurrentStatus from "@/models/ChildCurrentStatus";

export async function GET() {
    await dbConnect();
    console.log("hit")
    const payment_categories = await ChildCurrentStatus.find({ isActive: true }).sort({ name: 1 });
    return NextResponse.json(payment_categories);
}