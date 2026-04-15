"use client";
import { Button } from '@/components/atoms/Button';
import React, { useState } from 'react';

const AddSubType: React.FC<{
  subTypes: string[];
  setSubTypes: React.Dispatch<React.SetStateAction<string[]>>;
}> = ({ subTypes, setSubTypes }) => {
  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    const value = inputValue.trim();
    if (value && !subTypes.includes(value)) {
      setSubTypes([...subTypes, value]);
      setInputValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="flex flex-col gap-3 transition-colors duration-500">
      
      {/* LABEL: Swapped to text-text-muted with tracking-[0.15em] */}
      <label className="text-[10px] uppercase font-black text-text-muted tracking-[0.15em]">
        Account Sub-Groups (Categories)
      </label>

      {/* INPUT ROW */}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. Living, Education..."
          className="
            flex-1 p-3 text-sm
            bg-bg text-text
            placeholder:text-text-muted/50
            border border-border
            rounded-xl outline-none
            focus:ring-2 focus:ring-primary
            transition-all
          "
        />

        <Button
          type="button"
          onClick={handleAdd}
          // Button: Replaced hardcoded zinc with shaded background and primary tint on hover
          className="
            bg-shaded text-text
            border border-border
            hover:bg-primary/10 hover:border-primary/30
            px-5 rounded-xl text-xs font-bold
            transition-all active:scale-95
          "
        >
          + Add
        </Button>
      </div>

      {/* Hidden input for form submission */}
      <input type="hidden" name="subType" value={subTypes.join(",")} />

      {/* LIST: bg-white -> transparent, items -> shaded */}
      <div className="flex flex-col gap-1.5 max-h-[160px] overflow-y-auto pr-1 custom-scrollbar">
        {subTypes.map((tag) => (
          <div
            key={tag}
            className="
              flex items-center justify-between
              px-4 py-2.5 rounded-xl
              bg-shaded/50 border border-border
              hover:border-primary/30 hover:bg-shaded
              transition-all group
            "
          >
            <span className="text-xs font-bold text-text group-hover:text-primary transition-colors">
              {tag}
            </span>

            <button
              type="button"
              onClick={() => setSubTypes(subTypes.filter((t) => t !== tag))}
              // Delete Action: text-zinc -> text-text-muted, hover -> text-danger
              className="w-6 h-6 flex items-center justify-center text-text-muted hover:text-danger hover:bg-danger/10 rounded-lg transition-all"
            >
              <span className="text-xs">✕</span>
            </button>
          </div>
        ))}

        {subTypes.length === 0 && (
          <p className="text-[10px] text-text-muted/60 uppercase font-black tracking-widest italic py-3 text-center border border-dashed border-border rounded-xl">
            No sub-groups added yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default AddSubType;