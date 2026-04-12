import dbConnect from "@/lib/db";
import Child from "@/models/Child";
import Link from "next/link";
import { Button } from "@/components/atoms/Button";
import { ChildForm } from "@/components/organisms/child/ChildForm";
import { notFound } from "next/navigation";

export default async function EditChildPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await dbConnect();
  
  const child = await Child.findById(id.trim()).lean() as any;
  if (!child) return notFound();

  // THE BULLETPROOF FIX: Manually convert the special MongoDB types to pure strings
  const safeChild = {
    ...child,
    _id: child._id.toString(), // Forces the Buffer into a normal string
    dateOfBirth: child.dateOfBirth ? new Date(child.dateOfBirth).toISOString() : null,
    admissionDate: child.admissionDate ? new Date(child.admissionDate).toISOString() : null,
    createdAt: child.createdAt ? new Date(child.createdAt).toISOString() : null,
    updatedAt: child.updatedAt ? new Date(child.updatedAt).toISOString() : null,
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <div className="flex items-center gap-4">
        <Link href={`/children/${id}`}>
          <Button variant="ghost" className="px-2 border border-zinc-300">← Cancel</Button>
        </Link>
        <h1 className="text-2xl font-bold text-zinc-900">Edit Record: {safeChild.firstName}</h1>
      </div>

      {/* Pass the fully sanitized data */}
      <ChildForm initialData={safeChild} />
    </div>
  );
}