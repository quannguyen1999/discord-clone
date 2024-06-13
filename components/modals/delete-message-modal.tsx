import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { useModal } from '../../hooks/user-modal-store';
import { Button } from "../ui/button";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import queryString from "query-string";

export const DeleteMessageModal = () => {
    const {isOpen, onClose, type, data} = useModal();
    
    const isModalOpen = isOpen && type === 'deleteMessage';
    const {apiUrl, query} = data;
    const [isLoading, setIsLoading] = useState(false);

    const onClick = async () => {
        try{
            setIsLoading(true);

            const url = queryString.stringifyUrl({
                url: apiUrl || "",
                query
            })

            await axios.delete(url);

            onClose();

        } catch(error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }


    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Delete Channel
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Are you sure want to do this <br/>
                        THe message will be permannent ly deelted
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="bg-gray-100 px-6 py-4">
                    <div className="flex items-center justify-between w-full">
                        <Button 
                            disabled={isLoading}
                            onClick={onClose}
                            variant="ghost"
                        >
                            Cancel
                        </Button>
                        <Button
                            disabled={isLoading}
                            variant="primary"
                            onClick={onClick}
                        >
                            Confirm
                        </Button>
                        
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
};

