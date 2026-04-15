"use client";
import React, { useState } from "react";
import { Button } from "@/components/atoms/Button";
import { ActionPlanList } from "./ActionPlanList";
import { AddActionItemModal } from "./AddActionModal";

export const ActionPlanSection = ({
  childId,
  serializedTasks
}: {
  childId: string;
  serializedTasks: any[];
}) => {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <div className="mt-8">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">

        <h3 className="text-lg font-black text-text tracking-tight">
          Needs & Action Plan
        </h3>

        <Button
          onClick={() => setModalOpen(true)}
          className="
            text-xs font-bold h-8 px-4 py-1
            bg-primary/10 text-text-muted
            border border-primary/20
            hover:bg-primary/20
          "
        >
          + Log Need
        </Button>

      </div>

      {/* LIST */}
      <ActionPlanList tasks={serializedTasks} />

      {/* MODAL */}
      <AddActionItemModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        childId={childId}
      />

    </div>
  );
};