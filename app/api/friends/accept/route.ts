// naming is important

import { fetchRedis } from "@/app/helper/redis";
import { authOptions } from "@/app/lib/auth";
import { getServerSession } from "next-auth";
import { z } from "zod";

// http method is required
export async function POST(req:Request){
try {
    const body = await req.json();
    // validate if string
    const{id:idToAdd} = z.object({id:z.string()}).parse(body);

    const session = await getServerSession(authOptions)
    if(!session){
        return new Response('Unauthorized', {status:401})
    }
    // verify both users are not already friends
    const isAlreadyFriends = await fetchRedis('sismember',`user:${session.user.id}:friends`)
    if(isAlreadyFriends){
        return new Response(`Already friends`, {status:400})
    }
    // verify if the person have an incoming request
    const hasFriendRequest = await fetchRedis('sismember',`user:${session.user.id}:incoming_friend_requests`,idToAdd)

    console.log('hasFriendRequest',hasFriendRequest)
} catch (error) {
    
}
}