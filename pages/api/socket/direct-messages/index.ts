import {  currentProfilePage } from "@/lib/current-profile-pages";
import { NextApiResponseServerIo } from "@/type";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponseServerIo
) {
    if(req.method !== 'POST'){
        return res.status(405).json({error: 'method not allowrd'})
    }

    try{
        const profile = await currentProfilePage(req);
        const {content, fileUrl} = req.body;
        const {conversationId} = req.query;

        if(!profile){
            return new NextResponse("Unauthorized", {status: 401});
        }

        if(!conversationId){
            return new NextResponse("conversation id is missing" , {status : 400})
        }

       

        if(!content){
            return new NextResponse("content id is missing" , {status : 400})
       
        }

        const conversation = await db.conversation.findFirst({
            where: {
                id: conversationId as string,
                OR: [
                    {
                        memberOne: {
                            profileId: profile.id
                        }
                    },
                    {
                        memberTwo: {
                            profileId: profile.id
                        }
                    }
                ]
            },
            include: {
                memberOne: {
                    include: {
                        profile: true
                    }

                },
                memberTwo: {
                    include: {
                        profile: true
                    }
                }
            }
        })

        if(!conversation){
            return res.status(404).json({message: 'conversation not found'})
     

        }



        const member = conversation.memberOne.profileId === profile.id ? conversation.memberOne : conversation.memberTwo;
        if(!member){
            return res.status(404).json({message: 'member not found'})
     


        }

        const message = await db.directMessage.create({
            data: {
                content,
                fileUrl,
                conversationId: conversationId as string,
                memberId: member.id
            },
            include: {
                member: {
                    include: {
                        profile: true
                    }
                }
            }
        })

        const channelKey = `chat:${conversationId}:messages`;

        res?.socket?.server?.io?.emit(channelKey, message);

        return res.status(200).json(message);

    } catch (error){
        console.log("[DIRECT_MESSAGES_POST]", error);
        return res.status(500).json({message: "Internal server errror"});
    }
}