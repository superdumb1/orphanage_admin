import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Child from "@/models/Child";
import Staff from "@/models/Staff";
import InventoryItem from "@/models/InventoryItem";
import Transaction from "@/models/Transaction";
import Guardian from "@/models/Guardian"; // Import the new model

export async function GET() {
    await dbConnect();

    try {
        // 🚨 CLEAN SLATE - Now including Guardians
        await Staff.deleteMany({});
        await Child.deleteMany({});
        await InventoryItem.deleteMany({});
        await Transaction.deleteMany({});
        await Guardian.deleteMany({});

        // --- 1. SEED STAFF ---
        const staffData = [
            { fullName: "Arjun Thapa", email: "arjun@orphanage.org", phone: "9851011111", designation: "Administrator", status: "ACTIVE", gender: "MALE", profileImageUrl: "https://xsgames.co/randomusers/assets/avatars/male/1.jpg" },
            { fullName: "Sita Kumari", email: "sita@orphanage.org", phone: "9851022222", designation: "Head Caregiver", status: "ACTIVE", gender: "FEMALE", profileImageUrl: "https://xsgames.co/randomusers/assets/avatars/female/1.jpg" },
        ];
        const insertedStaff = await Staff.insertMany(staffData);

        // --- 2. SEED CHILDREN ---
        const childData = Array.from({ length: 10 }).map((_, i) => ({
            firstName: `Child`,
            lastName: `${i + 101}`,
            dateOfBirth: new Date(new Date().setFullYear(new Date().getFullYear() - (4 + (i % 5)))),
            admissionDate: new Date(),
            gender: i % 2 === 0 ? "FEMALE" : "MALE",
            status: "IN_CARE",
            bloodType: "O+",
            arrivalCategory: "ABANDONED",
            profileImageUrl: `https://images.unsplash.com/photo-${['1502444330042-d1a1ddf9bb5c', '1519238263530-99bdd11df2ea'][i % 2]}?auto=format&fit=crop&q=80&w=150&h=150`,
        }));
        const insertedChildren = await Child.insertMany(childData);

        // --- 3. SEED GUARDIANS (The Foster Pipeline) ---
        const guardianData = [
            {
                primaryName: "Ram & Shanti Poudel",
                secondaryName: "Shanti Poudel",
                email: "poudel.family@gmail.com",
                phone: "9841223344",
                address: "Maharajgunj, Kathmandu",
                occupation: "Business Owners",
                annualIncome: 1800000,
                type: "ADOPTIVE",
                vettingStatus: "APPROVED",
                backgroundCheckDocs: ["https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"],
                // Let's assign the first child to this approved family
                assignedChildren: [insertedChildren[0]._id]
            },
            {
                primaryName: "Dr. Sameer KC",
                email: "sameer.kc@health.org",
                phone: "9801998877",
                address: "Lalitpur, Nepal",
                occupation: "Surgeon",
                annualIncome: 2500000,
                type: "FOSTER",
                vettingStatus: "VETTING",
                backgroundCheckDocs: []
            },
            {
                primaryName: "Bishal & Rekha Thapa",
                secondaryName: "Rekha Thapa",
                email: "thapa.foster@outlook.com",
                phone: "9811556677",
                address: "Pokhara, Kaski",
                occupation: "Teachers",
                annualIncome: 1200000,
                type: "FOSTER",
                vettingStatus: "INQUIRY",
                backgroundCheckDocs: []
            },
            {
                primaryName: "Unknown Applicant (Flagged)",
                email: "flagged@spam.com",
                phone: "014455667",
                address: "Unknown",
                type: "ADOPTIVE",
                vettingStatus: "BLACKLISTED",
            }
        ];
        await Guardian.insertMany(guardianData);

        // --- 4. UPDATE CHILD STATUS FOR ASSIGNED KIDS ---
        // Since we assigned children[0] to the Poudel family, update the child's status
        await Child.findByIdAndUpdate(insertedChildren[0]._id, { 
            status: "ADOPTED",
            guardian: (await Guardian.findOne({ email: "poudel.family@gmail.com" }))._id
        });

        // --- 5. SEED INVENTORY & FINANCE (Simplified) ---
        await InventoryItem.create({ itemName: "Sona Mansuli Rice", category: "GROCERY", unit: "kg", currentQuantity: 25, minQuantityAlert: 50 });
        await Transaction.create({ type: "INCOME", amount: 50000, date: new Date(), category: "DONATION", paymentMethod: "BANK", remarks: "Seed Support" });

        return NextResponse.json({ 
            message: "✅ ERP Seeded with Guardians!", 
            counts: {
                staff: 2,
                children: 10,
                guardians: 4,
                inventory: 1,
                finance: 1
            }
        });

    } catch (error: any) {
        console.error("Seed error:", error);
        return NextResponse.json({ error: "Seed failed", details: error.message }, { status: 500 });
    }
}