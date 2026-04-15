import { Button } from "@/components/atoms/Button";
import Link from "next/link";

export const ProfileHeader = ({
  child,
  id
}: {
  child: any;
  id: string;
}) => (
  <div className="
    flex items-center gap-4
    bg-white dark:bg-zinc-950
    p-4 rounded-xl shadow-sm border
    border-zinc-200 dark:border-zinc-800
  ">
    
    <Link href="/children">
      <Button
        variant="ghost"
        className="px-2 border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300"
      >
        ← Back
      </Button>
    </Link>

    <Link href={`/children/${id}/edit`}>
      <Button
        variant="secondary"
        className="px-5 border border-zinc-300 dark:border-zinc-700"
      >
        Edit Profile
      </Button>
    </Link>

    {child.profileImageUrl ? (
      <img
        src={child.profileImageUrl}
        alt="Profile"
        className="
          w-14 h-14 rounded-full object-cover
          border-2 border-indigo-200 dark:border-indigo-900
          ml-2 shadow-sm
        "
      />
    ) : (
      <div className="
        w-14 h-14 rounded-full
        bg-indigo-50 dark:bg-indigo-950
        border-2 border-indigo-200 dark:border-indigo-900
        ml-2 flex items-center justify-center
        text-indigo-600 dark:text-indigo-300
        font-black text-xl shadow-sm
      ">
        {child.firstName?.[0]}
      </div>
    )}

    <div>
      <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
        {child.firstName} {child.lastName}
      </h1>

      <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
        Admitted: {new Date(child.admissionDate).toLocaleDateString()}
      </p>
    </div>

    <span className="
      ml-auto px-4 py-1.5 rounded-full text-sm font-black tracking-wide border shadow-sm
      bg-emerald-100 dark:bg-emerald-950
      text-emerald-800 dark:text-emerald-300
      border-emerald-200 dark:border-emerald-900
    ">
      {child.status.replace("_", " ")}
    </span>
  </div>
);