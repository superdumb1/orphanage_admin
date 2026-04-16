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
            placeholder:text-text-muted/40
            border border-border/60
            rounded-xl outline-none
            focus:ring-1 focus:ring-primary focus:border-primary
            transition-all shadow-inner
          "
        />

        <Button
          type="button"
          onClick={handleAdd}
          className="
            bg-primary/10 !text-primary 
            border border-primary/30
            hover:bg-primary hover:!text-text-invert
            px-6 rounded-xl text-[10px] font-black uppercase tracking-widest
            transition-all duration-300 active:scale-95 shadow-[0_0_15px_rgba(59,130,246,0.1)]
          "
        >
          + Add
        </Button>
      </div>

      {/* LIST AREA */}
      <div className="flex flex-col gap-1.5 max-h-[160px] overflow-y-auto pr-1 custom-scrollbar">
        {subTypes.map((tag) => (
          <div
            key={tag}
            className="
              flex items-center justify-between
              px-4 py-2.5 rounded-xl
              bg-bg/50 border border-border/40
              hover:border-primary/40 hover:bg-primary/5
              transition-all group
            "
          >
            <span className="text-xs font-bold text-text group-hover:text-primary transition-colors">
              {tag}
            </span>

            <button
              type="button"
              onClick={() => setSubTypes(subTypes.filter((t) => t !== tag))}
              className="w-7 h-7 flex items-center justify-center text-danger/60 hover:text-danger hover:bg-danger/10 border border-transparent hover:border-danger/20 rounded-lg transition-all"
            >
              <span className="text-[10px] font-black">✕</span>
            </button>
          </div>
        ))}

        {subTypes.length === 0 && (
          <p className="text-[10px] text-text-muted/50 uppercase font-black tracking-[0.2em] italic py-4 text-center border border-dashed border-border/50 rounded-xl bg-bg/20">
            NO_DATA_ENTRIES
          </p>
        )}
      </div>
    </div>
  );
};

export default AddSubType;