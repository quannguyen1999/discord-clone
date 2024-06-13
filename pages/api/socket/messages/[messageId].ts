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
    console.log(req.method)
    if(req.method !== 'DELETE' && req.method !== 'PATCH'){
        return res.status(405).json({error: 'Method not allowrd'});
    }

    try{
        const profile = await currentProfilePage(req);
        const {messageId, serverId, channelId} = req.query;
        const {content} = req.body;

        if(!profile){
            return new NextResponse("Unauthorized", {status:401})
        }

        if(!serverId){
            return new NextResponse("server id is missing" , {status : 400})
        }

        if(!channelId){
            return new NextResponse("Channel id is missing'" , {status : 400})
        }

        console.log("calling")
        const server = await db.server.findFirst({
            where: {
                id: serverId as string,
                members: {
                    some: {
                        profileId: profile.id
                    }
                }
            },
            include: {
                members: true
            }
        })

        if(!server){
            return res.status(404).json({error: 'server not found'});
        }

        const channel = await db.channel.findFirst({
            where: {
                id: channelId as string,
                serverId: serverId as string
            }
        })

        if(!channel){
            return res.status(404).json({error: 'Channel not found'});
        }

        const member = server.members.find((member) => member.profileId === profile.id);

        if(!member){
            return res.status(404).json({error: 'Member not found'});
        }

        let message = await db.message.findFirst({
            where: {
                id: messageId as string,
                channelId: channelId as string
            },
            include: {
                member: {
                    include: {
                        profile: true
                    }
                }
            }
        })


        if(!message || message.deleted){
            return res.status(404).json({error: 'Message not found'});
        }

        const isMessageowner = message.memberId === member.id;
        const isAdmin = member.role === MemberRole.ADMIN;
        const isModerator =member.role === MemberRole.MODERATOR;
        const canModify = isMessageowner || isAdmin || isModerator;

        if(!canModify){
            return res.status(401).json({error: 'Unauthorizrd'});
        }

        if(req.method === 'DELETE'){
            message = await db.message.update({
                where : {
                    id : messageId as string 
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
            message = await db.message.update({
                where : {
                    id : messageId as string 
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

        const updateKey = `chat:${channelId}:messages:update`;

        res?.socket?.server?.io?.emit(updateKey, message);

        return res.status(200).json(message);




    }catch(error){
        console.log("[MESSAGE_ID]", error);
        return res.status(500).json({error: "Internal Error"});
    }
}