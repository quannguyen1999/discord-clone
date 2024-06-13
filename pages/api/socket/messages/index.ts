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
        const {serverId, channelId} = req.query;

        if(!profile){
            return new NextResponse("Unauthorized", {status: 401});
        }

        if(!serverId){
            return new NextResponse("server id is missing" , {status : 400})
        }

        if(!channelId){
            return new NextResponse("Channel id is missing" , {status : 400})
       
        }

        if(!content){
            return new NextResponse("content id is missing" , {status : 400})
       
        }

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
            return res.status(404).json({message: 'server not found'})
        }

        const channel = await db.channel.findFirst({
            where: {
                id: channelId as string,
                serverId: serverId as string,
            
            }
        })

        if(!channel){
            return res.status(404).json({message: 'channel not found'})
        }

        const member = server.members.find((member) => member.profileId === profile.id);

        if(!member){
            return res.status(404).json({message: 'member not found'})
     


        }

        const message = await db.message.create({
            data: {
                content,
                fileUrl,
                channelId: channelId as string,
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

        const channelKey = `chat:${channelId}:messages`;

        res?.socket?.server?.io?.emit(channelKey, message);

        return res.status(200).json(message);

    } catch (error){
        console.log("[MESSAGES_POST]", error);
        return res.status(500).json({message: "Internal server errror"});
    }
}