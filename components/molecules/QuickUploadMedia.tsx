"use client";
import React, { useActionState, useRef, useEffect } from "react";
import { quickUploadMedia } from "@/app/actions/child";

type ActionState =
  | { error: string; success: false }
  | { error: null; success: true }
  | { error: string | null; success: boolean };

const initialState: ActionState = {
  error: null,
  success: false
};

export const QuickMediaUpload = ({
  childId,
  type,
  accept,
}: {
  childId: string;
  type: "documents" | "gallery";
  accept: string;
}) => {
  const [state, formAction, isPending] = useActionState(
    quickUploadMedia as any,
    initialState
  );

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state?.success]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="mt-auto pt-4 border-t border-border flex flex-col gap-2"
    >
      {/* Error */}
      {state?.error && (
        <p className="text-[10px] bg-danger/10 text-danger p-1 px-2 rounded font-bold border border-danger/30">
          ⚠️ {state.error}
        </p>
      )}

      {/* Hidden fields */}
      <input type="hidden" name="childId" value={childId} />
      <input type="hidden" name="uploadType" value={type} />

      {/* Upload Row */}
      <div className="flex items-center gap-2 bg-shaded p-1.5 rounded-lg border border-border">

        {/* File Input */}
        <input
          type="file"
          name="files"
          multiple
          accept={accept}
          required
          className={`
            flex-1 text-xs text-text-muted
            cursor-pointer

            file:mr-2 file:py-1.5 file:px-3
            file:rounded-lg file:border-0
            file:text-xs file:font-bold

            file:bg-primary/10 file:text-primary
            hover:file:bg-primary/20

            transition-all
          `}
        />

        {/* Button */}
        <button
          type="submit"
          disabled={isPending}
          className="btn-primary text-xs px-4 py-1.5"
        >
          {isPending ? "Uploading..." : "Quick Upload"}
        </button>
      </div>
    </form>
  );
};