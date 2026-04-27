import { Button } from "@/components/atoms/Button";
import { FormField } from "@/components/molecules/FormField";
import { SelectField } from "@/components/molecules/selects/SelectField";

// components/organisms/admin/UserRegistry.tsx
export const UserRegistry = () => {
    const createUserProtocol=()=>{}
    return (
        <form action={createUserProtocol} className="max-w-2xl">
            <div className="flex flex-col gap-6 bg-card p-8 rounded-dashboard border border-border shadow-glow">
                <div className="flex items-center gap-3 border-l-4 border-primary pl-4 mb-2">
                    <h3 className="text-[10px] font-black text-text-muted uppercase tracking-[0.4em]">User Access Protocol</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField label="Full Name" name="name" required />
                    <FormField label="Email / Username" name="email" type="email" required />
                    
                    <SelectField 
                        label="Assigned Role" 
                        name="role" 
                        required
                        options={[
                            { label: 'Samity Member (Data Entry)', value: 'SAMITY' },
                            { label: 'Staff (Field Operations)', value: 'STAFF' },
                            { label: 'Super Admin (Full Access)', value: 'ADMIN' }
                        ]} 
                    />

                    <FormField label="Temporary Access Key" name="password" type="password" required />
                </div>

                <div className="bg-shaded/50 p-4 rounded-xl border border-border/50">
                    <p className="text-[9px] font-bold text-text-muted uppercase leading-relaxed">
                        Note: Samity & Staff accounts are restricted from the Approval Vault and System Configuration modules.
                    </p>
                </div>

                <Button type="submit" className="w-full h-14">Initialize Account</Button>
            </div>
        </form>
    );
};