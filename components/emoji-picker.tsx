'use client'
import data from '@emoji-mart/data'
import { Smile } from "lucide-react";
import Picker from '@emoji-mart/react';
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useModal } from "@/hooks/user-modal-store";

interface EmojiPickerProps {
    onChange: (value: string) => void;
}
export const EmojiPicker = ({
    onChange
}: EmojiPickerProps) => {
    return (
        <Popover>
            <PopoverTrigger>
                <Smile className="text-zinc-500 dark:Text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition"/>

            </PopoverTrigger>
            <PopoverContent side="right" sideOffset={40}
                className="bg-transparent border-none shadow-non drop-shadow-none mb-16"
            >
                <Picker 
                    data={data}
                    onEmojiSelect={(emoji: any) => onChange(emoji.native)}
                />

            </PopoverContent>
        </Popover>
    )
}

