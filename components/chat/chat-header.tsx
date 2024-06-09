import { db } from "@/lib/db";
import { Hash, Menu } from "lucide-react";
import { MobileToggle } from "../mobile-toggle";

interface ChatHeaderProps {
    serverId: string;
    name: string;
    type: 'channel' | 'conversation';
    imageUrl?: string
}

export const ChatHeader = ({
    serverId,
    name,
    type,
    imageUrl
}: ChatHeaderProps) => {
    return (
        <div className="text-md font-semibold items-center px-3 flex h-12 border-neutral-200 dark:border-neutral-800 border-b-2">
            <MobileToggle serverId={serverId}/>
            {
                type === 'channel' && (
                    <Hash className="w-5 h-5 text-zinc-500 dark:text-zinc-100 mr-2" />
                )
            }
            <p className="font-semibold text-md text-black dark:text-white">
                {name}
            </p>
        </div>
    )
}