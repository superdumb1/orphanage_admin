"use client";
import React, { useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "../atoms/Button";

interface DatePickerFieldProps {
  label: string;
  name: string;
  id: string;
  required?: boolean;
  defaultValue?: string;
}

export const DatePickerField: React.FC<DatePickerFieldProps> = ({ 
  label, name, id, required, defaultValue 
}) => {
  const [date, setDate] = useState<Date | null>(defaultValue ? new Date(defaultValue) : null);
  const calendarRef = useRef<any>(null);

  const handleOkClick = (e: React.MouseEvent) => {
    e.preventDefault(); 
    calendarRef.current?.setOpen(false); 
  };

  return (
    <div className="flex flex-col gap-1 w-full relative">
      <label htmlFor={id} className="text-sm font-medium text-zinc-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <input type="hidden" name={name} value={date ? date.toISOString().split("T")[0] : ""} />

      <DatePicker
        ref={calendarRef}
        selected={date}
        onChange={(d: Date | null) => setDate(d)}
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        shouldCloseOnSelect={false} 
        // ADDED text-zinc-900 right here! 👇
        className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-sm bg-white text-zinc-900"
        dateFormat="yyyy-MM-dd"
      >
        <div className="p-2 border-t border-zinc-200 mt-2 flex justify-end bg-zinc-50 rounded-b-md">
          <Button variant="primary" className="py-1 px-3 text-xs" onClick={handleOkClick}>
            OK
          </Button>
        </div>
      </DatePicker>
    </div>
  );
};

