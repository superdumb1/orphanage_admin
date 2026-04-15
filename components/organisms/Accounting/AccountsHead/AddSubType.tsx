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
    <div className="flex flex-col gap-3">
      
      <label className="text-[10px] uppercase font-black text-zinc-400 dark:text-zinc-500 tracking-widest">
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
            flex-1 p-2 text-sm
            bg-white dark:bg-zinc-900
            text-zinc-900 dark:text-zinc-100
            placeholder:text-zinc-400 dark:placeholder:text-zinc-500
            border border-zinc-200 dark:border-zinc-700
            rounded-xl outline-none
            focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-200
            transition-all
          "
        />

        <Button
          type="button"
          onClick={handleAdd}
          className="
            bg-zinc-100 dark:bg-zinc-800
            text-zinc-900 dark:text-zinc-100
            border border-zinc-200 dark:border-zinc-700
            hover:bg-zinc-200 dark:hover:bg-zinc-700
            px-4 py-2 rounded-xl text-xs font-bold
          "
        >
          + Add
        </Button>
      </div>

      {/* Hidden input */}
      <input type="hidden" name="subType" value={subTypes.join(",")} />

      {/* LIST */}
      <div className="flex flex-col gap-1 max-h-[150px] overflow-y-auto pr-1">
        {subTypes.map((tag) => (
          <div
            key={tag}
            className="
              flex items-center justify-between
              px-3 py-2 rounded-xl
              bg-zinc-50 dark:bg-zinc-900
              border border-zinc-100 dark:border-zinc-800
              hover:border-zinc-300 dark:hover:border-zinc-600
              transition-colors
            "
          >
            <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
              {tag}
            </span>

            <button
              type="button"
              onClick={() => setSubTypes(subTypes.filter((t) => t !== tag))}
              className="text-zinc-400 hover:text-red-500 transition-colors p-1"
            >
              <span className="text-xs">✕</span>
            </button>
          </div>
        ))}

        {subTypes.length === 0 && (
          <p className="text-[10px] text-zinc-400 dark:text-zinc-500 italic py-2">
            No sub-groups added yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default AddSubType;