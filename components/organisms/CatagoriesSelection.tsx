"use client";
import React from 'react';
import { SelectField } from '../molecules/SelectField';
import { AddCategoryModal } from './AddCatagories';

interface CategoriesSelectionProps {
    options: { label: string; value: string }[];
    name?: string;
    required?: boolean;
    defaultValue?: string;
}

export const CategoriesSelection: React.FC<CategoriesSelectionProps> = ({
    options,
    name = "categoryId",
    required = false,
    defaultValue,

}) => {
    const [isModalOpen, setModalOpen] = React.useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (e.target.value === "ADD_NEW") {
            e.preventDefault();
            setModalOpen(true);
            e.target.value = defaultValue || "";
        }
    };

    return (
        <>
            <AddCategoryModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
            <SelectField
                label="Category"
                name={name}
                required={required}
                defaultValue={defaultValue}
                onChange={handleChange} 
                options={[
                    ...options,
                    { label: "+ Add New Category", value: "ADD_NEW" }
                ]}
            />
        </>
    );
}