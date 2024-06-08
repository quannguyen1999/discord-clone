'use client';

import { ChannelType, MemberRole } from ".prisma/client";
import { ServerWithMembersWithProfiles } from "@/types";
import { ActionTooltip } from "../ui/action-tooltip";
import { Plus, Settings } from "lucide-react";
import { useModal } from "@/hooks/user-modal-store";

interface ServerSelectionProps {
    label: string;
    role?: MemberRole;
    selectionType: 'channels' | 'members';
    channelType?: ChannelType;
    server?: ServerWithMembersWithProfiles
}
export const ServerSection = ({
    label,
    role,
    selectionType,
    channelType,
    server
} : ServerSelectionProps) => {
    const {onOpen} = useModal();

    return (
        <div className="flex items-center justify-between py-2">
            <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
                {label}
            </p>
            {role !== MemberRole.GUEST && selectionType === "channels" && (
                <ActionTooltip label="Create Channels" side="top">
                    <button onClick={() => onOpen("createChannel", {channelType})} className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition">
                        <Plus className="h-4 w-4" />
                    </button>
                </ActionTooltip>
            )}
            {role === MemberRole.ADMIN && selectionType === 'members' && (
                <ActionTooltip label="Manage Members" side="top">
                    <button onClick={() => onOpen("members")} className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition">
                        <Settings className="h-4 w-4" />
                    </button>
                </ActionTooltip>
            )}

        </div>
    )
}