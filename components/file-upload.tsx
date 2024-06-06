'use client';

import { UploadButton } from "@/lib/uploadthing";
import {X} from 'lucide-react';

// import axios from 'axios';

import Image from 'next/image';
interface FileUploadProps {
    onChange: (url?: string) => void;
    value: string;
    endpoint: 'messageFile' | 'serverImage'
}

export const FileUpload = ({
    onChange,
    value,
    endpoint
}: FileUploadProps) => {
    const fileType = value?.split(".").pop();

    if(value && fileType !== 'pdf'){
        return (
            <div className="relative h-20 w-20">
                <Image 
                    fill
                    src={value}
                    alt="Upload"
                    className="rounded-full"
                />
                <button onClick={() => onChange("")} className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm">
                    <X className="h-4 w-4" />
                </button>
            </div>
        )
    }

    return (
        <UploadButton
            endpoint={endpoint}
            onClientUploadComplete={(res) => {
                onChange(res?.[0].url)
            }}
            onUploadError={(error: Error) => {
                console.log(error)
            }}
        />
    )
}