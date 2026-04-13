import { QuickMediaUpload } from "@/components/molecules/QuickUploadMedia";
import { DataRow, DetailCard } from "@/components/organisms/child/child-profile/DetailCard";
import { ProfileHeader } from "@/components/organisms/child/child-profile/ProfileHeader";
import dbConnect from "@/lib/db";
import Child from "@/models/Child";
import ActionPlan from "@/models/ActionPlan"; 
import { notFound } from "next/navigation";
import { ActionPlanSection } from "@/components/organisms/child/child-profile/ActionPlanSection";

export default async function ChildProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const cleanId = id.trim();

    await dbConnect();

    const child = await Child.findById(cleanId).lean() as any;
    if (!child) return notFound();

    const actionPlans = await ActionPlan.find({ childId: cleanId }).sort({ createdAt: -1 }).lean();

    const serializedActionPlans = actionPlans.map(task => ({
        ...task,
        _id: task._id.toString(),
        childId: task.childId.toString(),
        dueDate: task.dueDate ? task.dueDate.toISOString() : null
    }));

    const age = new Date().getFullYear() - new Date(child.dateOfBirth).getFullYear();

    return (
        <div className="flex flex-col gap-6 max-w-5xl pb-10">
            <ProfileHeader child={child} id={cleanId} />

            <ActionPlanSection
                childId={cleanId}
                serializedTasks={serializedActionPlans}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DetailCard title="Basic Info & Education">
                    <DataRow label="Age" value={`${age} years`} />
                    <DataRow label="DOB" value={new Date(child.dateOfBirth).toLocaleDateString()} />
                    <DataRow label="Gender" value={child.gender} />
                    <div className="mt-4 pt-4 border-t border-zinc-50">
                        <DataRow label="School" value={child.schoolName || 'N/A'} />
                        <DataRow label="Grade" value={child.gradeLevel || 'N/A'} />
                    </div>
                </DetailCard>

                <DetailCard title="Health & Background">
                    <DataRow label="Blood Type" value={child.bloodType || 'Unknown'} color="text-rose-600 font-bold" />
                    <DataRow label="Allergies" value={child.allergies || 'None'} />
                    <p className="text-sm text-zinc-600 mt-2"><strong>Medical Notes:</strong> {child.medicalNotes || 'None'}</p>
                    <div className="mt-4 pt-4 border-t border-zinc-50">
                        <DataRow label="Arrival" value={child.arrivalCategory?.replace("_", " ")} />
                        <p className="text-sm mt-2 bg-zinc-50 p-3 rounded-lg border border-zinc-100 italic">"{child.arrivalDetails}"</p>
                    </div>
                </DetailCard>
            </div>

            {/* --- MEDIA SECTIONS --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Vault */}
                <div className="bg-amber-50/40 p-6 rounded-xl shadow-sm border border-amber-200 flex flex-col h-full">
                    <h2 className="text-lg font-black text-amber-900 mb-4 flex items-center gap-2 border-b border-amber-200 pb-2">📄 Document Vault</h2>
                    <div className="flex flex-col gap-3 mb-4 overflow-y-auto max-h-60">
                        {child.documents?.map((url: string, i: number) => (
                            <a key={i} href={url} target="_blank" className="flex items-center gap-3 text-sm font-bold text-amber-800 bg-white p-3 rounded-lg border border-amber-200 hover:shadow-sm">
                                📎 Document {i + 1} <span className="ml-auto text-[10px] text-amber-400">VIEW</span>
                            </a>
                        )) || <p className="text-xs text-amber-600">No documents yet.</p>}
                    </div>
                    <QuickMediaUpload accept="application/pdf/images" childId={cleanId} type="documents" themeColor="amber" />
                </div>

                <div className="bg-indigo-50/40 p-6 rounded-xl shadow-sm border border-indigo-200 flex flex-col h-full">
                    <h2 className="text-lg font-black text-indigo-900 mb-4 flex items-center gap-2 border-b border-indigo-200 pb-2">🖼️ Photo Gallery</h2>
                    <div className="grid grid-cols-3 gap-3 mb-4 overflow-y-auto max-h-60">
                        {child.gallery?.map((url: string, i: number) => (
                            <a key={i} href={url} target="_blank" className="aspect-square rounded-lg border border-indigo-200 overflow-hidden bg-white group">
                                <img src={url} alt="Gallery" className="object-cover w-full h-full group-hover:scale-110 transition-transform" />
                            </a>
                        )) || <p className="text-xs text-indigo-600">No photos yet.</p>}
                    </div>
                    <QuickMediaUpload childId={cleanId} accept="image" type="gallery" themeColor="indigo" />
                </div>
            </div>
        </div>
    );
}