import { NextResponse } from "next/server";

import Child from "@/models/Child";
import Staff from "@/models/Staff";
import InventoryItem from "@/models/InventoryItem";
import InventoryTransaction from "@/models/InventoryTransaction";
import Transaction from "@/models/Transaction";
import dbConnect from "@/lib/db";

export async function GET() {
  try {
    await dbConnect();

    // 🔒 SAFETY
    if (process.env.NODE_ENV !== "development") {
      return NextResponse.json({ error: "Seeding only allowed in development" });
    }

    // 🧹 CLEAR DATABASE
    await Promise.all([
      Child.deleteMany({}),
      Staff.deleteMany({}),
      InventoryItem.deleteMany({}),
      InventoryTransaction.deleteMany({}),
      Transaction.deleteMany({}),
    ]);

    // =========================
    // 👶 CHILDREN (FULL DATA)
    // =========================
    const children = await Child.insertMany([
      {
        firstName: "Aarav",
        lastName: "BK",
        dateOfBirth: new Date("2014-06-12"),
        gender: "MALE",
        schoolName: "Shree Janajyoti School",
        gradeLevel: "6",
        bloodType: "O+",
        allergies: "Dust",
        arrivalCategory: "ABANDONED",
        arrivalDetails: "Found near bus park, Kathmandu",
        medicalNotes: "Mild asthma",
        profileImageUrl: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9",
        gallery: [
          "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9",
          "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
        ],
        documents: [
          "https://example.com/docs/aarav-medical.pdf",
        ],
      },
      {
        firstName: "Sanjana",
        lastName: "Tamang",
        dateOfBirth: new Date("2012-09-20"),
        gender: "FEMALE",
        schoolName: "Bright Future Academy",
        gradeLevel: "8",
        bloodType: "A+",
        arrivalCategory: "ORPHAN",
        arrivalDetails: "Parents deceased in accident",
        profileImageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
        gallery: [
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
        ],
      },
    ]);

    // =========================
    // 👨‍🏫 STAFF (FULL)
    // =========================
    const staff = await Staff.insertMany([
      {
        fullName: "Hari Prasad Sharma",
        nepaliName: "हरि प्रसाद शर्मा",
        phone: "9800000001",
        email: "hari@orphanage.com",
        address: "Kathmandu",
        gender: "MALE",
        designation: "Administrator",
        department: "Management",
        employmentType: "FULL_TIME",
        joinDate: new Date("2021-01-01"),
        salary: {
          basicSalary: 45000,
          allowances: {
            houseRent: 8000,
            food: 3000,
            transport: 2000,
          },
        },
        ssf: {
          enrolled: true,
          ssfNumber: "SSF123456",
          employeeContribution: 10,
          employerContribution: 20,
        },
        bank: {
          bankName: "Nabil Bank",
          branch: "Putalisadak",
          accountNumber: "1234567890",
          accountName: "Hari Prasad Sharma",
        },
        profileImageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
      },
      {
        fullName: "Gita Kumari",
        nepaliName: "गीता कुमारी",
        phone: "9811111111",
        email: "gita@orphanage.com",
        gender: "FEMALE",
        designation: "Caretaker",
        department: "Child Care",
        employmentType: "FULL_TIME",
        joinDate: new Date("2022-05-10"),
        profileImageUrl: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c",
      },
    ]);

    // =========================
    // 📦 INVENTORY ITEMS
    // =========================
    const items = await InventoryItem.insertMany([
      {
        itemName: "Jeera Masino Rice",
        category: "GROCERY",
        unit: "kg",
        currentQuantity: 120,
        minQuantityAlert: 25,
      },
      {
        itemName: "Cooking Oil",
        category: "GROCERY",
        unit: "liters",
        currentQuantity: 40,
      },
      {
        itemName: "School Bags",
        category: "EDUCATION",
        unit: "pieces",
        currentQuantity: 20,
      },
    ]);

    // =========================
    // 💰 FINANCIAL TRANSACTIONS
    // =========================
    const finance = await Transaction.insertMany([
      {
        type: "INCOME",
        amount: 100000,
        category: "DONATION",
        paymentMethod: "CASH",
        donorName: "Local Businessman",
        remarks: "Monthly donation",
      },
      {
        type: "EXPENSE",
        amount: 15000,
        category: "GROCERY",
        paymentMethod: "BANK",
        remarks: "Rice purchase",
      },
    ]);

    // =========================
    // 🔄 INVENTORY TRANSACTIONS
    // =========================
    await InventoryTransaction.insertMany([
      {
        itemId: items[0]._id,
        transactionType: "STOCK_IN",
        quantity: 50,
        purposeOrSource: "Purchased rice",
        acquisitionType: "PURCHASED",
        totalCost: 15000,
        financeTransactionId: finance[1]._id,
      },
      {
        itemId: items[2]._id,
        transactionType: "STOCK_OUT",
        quantity: 5,
        purposeOrSource: "Distributed to children",
        acquisitionType: "CONSUMED",
      },
    ]);

    // =========================
    // 📊 RESPONSE
    // =========================
    return NextResponse.json({
      success: true,
      message: "🔥 Full system seeded with realistic data",
      stats: {
        children: children.length,
        staff: staff.length,
        inventoryItems: items.length,
      },
    });

  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}