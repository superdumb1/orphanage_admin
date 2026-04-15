"use server";
import dbConnect from "@/lib/db";
import ActionPlan from "@/models/ActionPlan"; // Adjust path if needed

export async function getChildActionPlans(childId: string) {
    await dbConnect();
    const actionPlans = await ActionPlan.find({ childId }).sort({ createdAt: -1 }).lean();
    
    return actionPlans.map((task: any) => ({
        ...task,
        _id: task._id.toString(),
        childId: task.childId.toString(),
        dueDate: task.dueDate ? task.dueDate.toISOString() : null
    }));
}