import { currentProfilePage } from "@/lib/current-profile-pages";
import { NextApiResponseServerIo } from "@/type";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponseServerIo,
) {
  
    if(req.method !== 'DELETE' && req.method !== 'PATCH'){
        return res.status(405).json({error: 'Method not allowrd'});
    }

    try{
        const profile = await currentProfilePage(req);
        const {directMessageId, conversationId} = req.query;
        const {content} = req.body;

        if(!profile){
            return new NextResponse("Unauthorized", {status:401})
        }

        if(!conversationId){
            return new NextResponse("conversation id is missing" , {status : 400})
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
            return res.status(404).json({error: 'conversation not found'});
        }

        const member = conversation.memberOne.profileId === profile.id ? conversation.memberOne : conversation.memberTwo;

        if(!member){
            return res.status(404).json({error: 'Member not found'});
        }

        let directMessage = await db.directMessage.findFirst({
            where: {
                id: directMessageId as string,
                conversationId: conversationId as string
            },
            include: {
                member: {
                    include: {
                        profile: true
                    }
                }
            }
        });


        if(!conversationId || directMessage?.deleted){
            return res.status(404).json({error: 'Message not found'});
        }

        const isMessageowner = directMessage?.memberId === member.id;
        const isAdmin = member.role === MemberRole.ADMIN;
        const isModerator =member.role === MemberRole.MODERATOR;
        const canModify = isMessageowner || isAdmin || isModerator;

        if(!canModify){
            return res.status(401).json({error: 'Unauthorizrd'});
        }

        if(req.method === 'DELETE'){
            directMessage = await db.directMessage.update({
                where : {
                    id : directMessageId as string 
                },
                data: {
                    fileUrl: null,
                    content: 'This message has been deleted',
                    deleted: true
                },
                include: {
                    member: {
                        include: {
                            profile: true
                        }
                    }
                }
            })
        }

        if(req.method === 'PATCH'){
            if(!isMessageowner){
                return res.status(401).json({error: "UnAuthorized"});
            }
            directMessage = await db.directMessage.update({
                where : {
                    id : directMessageId as string 
                },
                data: {
                    content
                },
                include: {
                    member: {
                        include: {
                            profile: true
                        }
                    }
                }
            })
        }

        const updateKey = `chat:${conversationId}:messages:update`;

        res?.socket?.server?.io?.emit(updateKey, directMessage);

        return res.status(200).json(directMessage);

    }catch(error){
        console.log("[MESSAGE_ID]", error);
        return res.status(500).json({error: "Internal Error"});
    }
}