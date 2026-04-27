"use client";

import React, { useEffect, useState } from 'react';
import { SelectField } from './SelectField';
import { useUIModals } from "@/hooks/useUIModal";

interface CategoryOption {
    label: string;
    value: string;
}

const SelectPaymentCategory = ({ defaultValue = "", ...props }) => {
    const [options, setOptions] = useState<CategoryOption[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { openAddCateGoryForm } = useUIModals();
    
    // ✨ This key will act as our "manual trigger"
    const [refreshKey, setRefreshKey] = useState(0);

    const handleCategoryAdded = () => {
        setRefreshKey(prev => prev + 1); 
    };

    useEffect(() => {
        const fetchCategories = async () => {
            setIsLoading(true); // Show loading state during re-fetch
            try {
                const response = await fetch('/api/finances/payment-categories');
                const data = await response.json();

                const formatted = data.map((cat: any) => ({
                    label: `${cat.name} (${cat.identifier})`,
                    value: cat._id,
                }));

                setOptions(formatted);
            } catch (error) {
                console.error("Failed to fetch payment categories:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategories();
    }, [refreshKey]); // ✨ IMPORTANT: Adding refreshKey here makes it re-fetch on change

    return (
        <SelectField
            {...props}
            label={isLoading ? 'Updating List...' : 'Payment Source'}
            options={options}
            disabled={isLoading}
            defaultValue={defaultValue}
            onAddItem={() => openAddCateGoryForm({ onSaved: handleCategoryAdded })} 
        />
    );
};

export default SelectPaymentCategory;