'use client'

import qs from 'query-string';
import { ActionTooltip } from '../ui/action-tooltip';
import { Icon, Video, VideoOff } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export const ChatVideoButton = () => {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const isVideo = searchParams?.get("video");
    
    const onClick =() => {
        const url = qs.stringifyUrl({
            url: pathname || "",
            query: {
                video: isVideo ? undefined : true
            }
        }, {skipNull: true})

        router.push(url);
    }

    const Icon = isVideo ? VideoOff : Video;
    const tooltipLabel = isVideo ? "End video call" : "Start video call"
    return (
        <ActionTooltip side='bottom' label={tooltipLabel}>
            <button onClick={onClick} className='hover:opacity-75 transition mr-4'>
                <Icon />
            </button>
        </ActionTooltip>
    )
}