import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import AccountHead from "@/models/AccountHead";

export async function GET() {
    await dbConnect();

    const AccountHeads = await AccountHead.find()
        .sort({ firstName: 1 })
        .lean();

    return NextResponse.json(AccountHeads);
}