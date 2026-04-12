import { Button } from '@/components/atoms/Button';
import React, { useState } from 'react'

const AddSubType: React.FC<{ subTypes: string[], setSubTypes: React.Dispatch<React.SetStateAction<string[]>> }> = ({ subTypes, setSubTypes }) => {
    const [inputValue, setInputValue] = useState("");

    const handleAdd = () => {
        if (inputValue.trim() && !subTypes.includes(inputValue.trim())) {
            setSubTypes([...subTypes, inputValue.trim()]);
            setInputValue("");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAdd();
        }
    };

    return (
        <div className="flex flex-col gap-3">
            <label className="text-[10px] uppercase font-black text-zinc-400 tracking-widest">
                Account Sub-Groups (Categories)
            </label>
            
            <div className="flex gap-2">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="e.g. Living, Education..."
                    className="flex-1 p-2 text-sm text-black border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-zinc-900 transition-all"
                />
                <Button
                    type="button" 
                    onClick={handleAdd}
                    className="bg-zinc-100 text-zinc-900 border border-zinc-200 hover:bg-zinc-200 px-4 py-2 rounded-xl text-xs font-bold"
                >
                    + Add
                </Button>
            </div>

            {/* Hidden input for Form Submission */}
            <input type="hidden" name="subType" value={subTypes.join(',')} />

            {/* Vertical List of Added Sub-Types */}
            <div className="flex flex-col gap-1 max-h-[150px] overflow-y-auto pr-1">
                {subTypes.map(tag => (
                    <div 
                        key={tag} 
                        className="flex items-center justify-between px-3 py-2 bg-zinc-50 border border-zinc-100 rounded-xl group hover:border-zinc-300 transition-colors"
                    >
                        <span className="text-xs font-bold text-zinc-700">{tag}</span>
                        <button 
                            type="button" 
                            onClick={() => setSubTypes(subTypes.filter(t => t !== tag))} 
                            className="text-zinc-400 hover:text-red-500 transition-colors p-1"
                        >
                            <span className="text-xs">✕</span>
                        </button>
                    </div>
                ))}
                {subTypes.length === 0 && (
                    <p className="text-[10px] text-zinc-400 italic py-2">No sub-groups added yet.</p>
                )}
            </div>
        </div>
    )
}
export default AddSubType;