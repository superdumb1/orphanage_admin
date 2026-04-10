

import { Button } from '@/components/atoms/Button'
import Link from 'next/link'
import React from 'react'
import VettingStatusBadge from './VettingStatusBadge'

const TopHeaderBar = ({ guardian, id }: { guardian: any, id: string }) => {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
                <Link href="/guardians">
                    <Button variant="ghost" className="px-2 border border-zinc-300 text-zinc-600">← Back</Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-black text-zinc-900 tracking-tight">{guardian.primaryName}</h1>
                    <p className="text-xs text-zinc-500 font-medium">Member since {new Date(guardian.createdAt).toLocaleDateString()}</p>
                </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
                <VettingStatusBadge status={guardian.vettingStatus} />
                <Link href={`/guardians/${id}/edit`}>
                    <Button variant="secondary" className="px-6 border border-zinc-300 font-bold">Edit Profile</Button>
                </Link>
            </div>
        </div>)
}

export default TopHeaderBar