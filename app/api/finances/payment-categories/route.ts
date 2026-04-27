import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import paymentCategories from "@/models/paymentCategory";

export async function GET() {
    await dbConnect();
    console.log("hit")
    const payment_categories = await paymentCategories.find({ isActive: true }).sort({ name: 1 });
    return NextResponse.json(payment_categories);
}