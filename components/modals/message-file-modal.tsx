'use client';
import * as z from 'zod';
import axios from 'axios';
import queryString from 'query-string';
import {zodResolver} from '@hookform/resolvers/zod';
import { useForm } from "react-hook-form";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';

import {Input} from '@/components/ui/input';

import {Button} from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { FileUpload } from '../file-upload';
import { useRouter } from 'next/navigation';
import { useModal } from '@/hooks/user-modal-store';

const formSchema = z.object({
    fileUrl: z.string().min(1, {
        message: 'attechment is required'
    })
})
export const runtime = 'edge' ;
export const MessageFileModal = () => {
    const {isOpen, onClose, type, data} = useModal();
    const router = useRouter();

    const isModalOpen = isOpen && type === 'messageFile';
    const {apiUrl, query} = data;

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fileUrl: "https://utfs.io/f/f5e8e9b9-43e1-4f2d-9d68-8ee834906e5c-1x9cqw.jpeg",
        }
    });

    const handlerClose = () => {
        form.reset();
        onClose();
    }

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try{
            //TODO need to fix
            const url = queryString.stringifyUrl({
                url: apiUrl  || "",
                query
            });

            await axios.post(apiUrl || "", {
                ...values,

            });

            form.reset();
            router.refresh();
            handlerClose();


        }catch(error){
            console.log(error)
        }
    }
    return (
        <Dialog open={isModalOpen} onOpenChange={handlerClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Add an attachment
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Send a file as a message
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-8'
                    >
                        <div className='space-y-8 px-6'>
                            <div className='flex items-center justify-center text-center'>
                                <FormField
                                    control={form.control}
                                    name='fileUrl'
                                    render={({field}) => (
                                        <FormItem>
                                            <FormControl>
                                                <FileUpload 
                                                    endpoint="messageFile"
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                           
                        </div>
                        <DialogFooter className='bg-gray-100 px-6 py-4'>
                            <Button type="submit" variant="primary" disabled={isLoading}>
                                fuck Send
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
};

