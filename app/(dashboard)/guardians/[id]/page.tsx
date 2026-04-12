import dbConnect from "@/lib/db";
import Guardian from "@/models/Guardian";
import InfoRow from "@/components/organisms/guardian/InfoRow";
import TopHeaderBar from "@/components/organisms/guardian/TopHeaderBar";
import "@/models/Child";
import AssignedChildren from "@/components/organisms/guardian/AssignedChildren";


const GuardianProfilePage: React.FC<{ params: Promise<{ id: string }> }> = async ({ params }) => {
    const { id } = await params;
    await dbConnect();

    // Fetch Guardian and populate the children they are looking after
    const guardian = await Guardian.findById(id).populate('assignedChildren').lean() as any;



    return (
        <div className="flex flex-col gap-6 max-w-6xl pb-10">
            <TopHeaderBar guardian={guardian} id={id} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* --- LEFT COLUMN: PERSONAL & FINANCIAL --- */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                    {/* Contact Card */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200">
                        <h3 className="text-sm font-black text-zinc-900 uppercase tracking-widest mb-4 border-b border-zinc-50 pb-2">Contact Details</h3>
                        <div className="flex flex-col gap-4">
                            <InfoRow label="Email" value={guardian.email} />
                            <InfoRow label="Phone" value={guardian.phone} />
                            <InfoRow label="Address" value={guardian.address} />
                            <InfoRow label="Applicant Type" value={guardian.type} />
                        </div>
                    </div>

                    {/* Financial Vetting */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200">
                        <h3 className="text-sm font-black text-zinc-900 uppercase tracking-widest mb-4 border-b border-zinc-50 pb-2">Stability Check</h3>
                        <div className="flex flex-col gap-4">
                            <InfoRow label="Occupation" value={guardian.occupation || 'Not listed'} />
                            <InfoRow label="Annual Income" value={`NPR ${guardian.annualIncome?.toLocaleString()}`} isBold />
                        </div>
                    </div>
                </div>

                {/* --- RIGHT COLUMN: VETTING & CHILDREN --- */}
                <div className="lg:col-span-2 flex flex-col gap-6">

                    {/* Vetting Vault (Background Checks) */}
                    <div className="bg-blue-50/40 p-6 rounded-2xl shadow-sm border border-blue-100">
                        <div className="flex items-center justify-between mb-4 border-b border-blue-100 pb-3">
                            <div className="flex items-center gap-2">
                                <span className="text-xl">🛡️</span>
                                <h2 className="text-lg font-black text-blue-900">Background Verification Vault</h2>
                            </div>
                        </div>

                        {guardian.backgroundCheckDocs && guardian.backgroundCheckDocs.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {guardian.backgroundCheckDocs.map((url: string, i: number) => (
                                    <a key={i} href={url} target="_blank" className="flex items-center gap-3 bg-white p-3 rounded-xl border border-blue-200 hover:border-blue-400 hover:shadow-sm transition-all group">
                                        <span className="text-blue-500 group-hover:scale-110 transition-transform">📄</span>
                                        <span className="text-sm font-bold text-blue-800 uppercase tracking-tight">Verified Doc {i + 1}</span>
                                    </a>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center p-8 border-2 border-dashed border-blue-200 rounded-xl bg-blue-50/50">
                                <p className="text-sm text-blue-700 font-medium italic">No verification documents uploaded yet.</p>
                            </div>
                        )}
                    </div>

                    {/* Assigned Children (The Result of the Vetting) */}
                   
                        <AssignedChildren  guardian={guardian} />

                
                </div>

            </div>
        </div>
    );
}




export default GuardianProfilePage;