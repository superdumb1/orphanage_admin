import React from 'react'
import Child from '@/models/Child'
import { AssignedChildrenClient } from './AssignedChildrenClient'

const AssignedChildren = async ({ guardian }: { guardian: any }) => {
    const rawChildren = await Child.find({ status: "IN_CARE" })
        .select("firstName lastName profileImageUrl dateOfBirth")
        .lean();

    const serializedChildren = rawChildren.map(child => ({
        ...child,
        _id: child._id.toString(),
        dateOfBirth: child.dateOfBirth instanceof Date 
            ? child.dateOfBirth.toISOString() 
            : child.dateOfBirth
    }));

    const serializedGuardian = {
        ...guardian,
        _id: guardian._id.toString(),
        assignedChildren: guardian.assignedChildren?.map((c: any) => ({
            ...c,
            _id: c._id.toString()
        })) || []
    };

    return (
        <AssignedChildrenClient 
            guardian={serializedGuardian} 
            children={serializedChildren} 
        />
    );
}

export default AssignedChildren;