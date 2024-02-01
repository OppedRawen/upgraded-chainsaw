// naming is important

import { fetchRedis } from "@/app/helper/redis";
import { authOptions } from "@/app/lib/auth";
import { db } from "@/app/lib/db";
import { pusherServer } from "@/app/lib/pusher";
import { toPusherKey } from "@/app/lib/utils";
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
    const isAlreadyFriends = await fetchRedis('sismember',`user:${session.user.id}:friends`,idToAdd)
    if(isAlreadyFriends){
        return new Response(`Already friends`, {status:400})
    }
    // verify if the person have an incoming request
    const hasFriendRequest = await fetchRedis('sismember',`user:${session.user.id}:incoming_friend_requests`,idToAdd)
    if(!hasFriendRequest){
        return new Response(`No friend request`, {status:400});
    }

    const [userRaw,friendRaw] = (await Promise.all(
        [fetchRedis(`get`, `user:${session.user.id}`),
        fetchRedis(`get`,`user:${idToAdd}`)]
    )) as [string,string];
    const user = JSON.parse(userRaw) as User;
    const friend = JSON.parse(friendRaw) as User;
    //notify added user
    await Promise.all([
        pusherServer.trigger(toPusherKey(`user:${idToAdd}:friends`),'new_friend',user),
        pusherServer.trigger(toPusherKey(`user:${session.user.id}:friends`),'new_friend',friend),
         db.sadd(`user:${session.user.id}:friends`,idToAdd),
         db.sadd(`user:${idToAdd}:friends`,session.user.id),
         db.srem(`user:${session.user.id}:incoming_friend_requests`,idToAdd)
    ])
    //  pusherServer.trigger(toPusherKey(`user:${idToAdd}:friends`),'new_friend',{})
    // // post request in redis is not a caching behavior
    // await db.sadd(`user:${session.user.id}:friends`,idToAdd)

    // await db.sadd(`user:${idToAdd}:friends`,session.user.id)

    // await db.srem(`user:${idToAdd}:incoming_friend_requests`,session.user.id)

    // await db.srem(`user:${session.user.id}:incoming_friend_requests`,idToAdd)
    // console.log('hasFriendRequest',hasFriendRequest)
    return new Response('ok')
} catch (error) {
    console.log(error)

    if(error instanceof z.ZodError){
        return new Response('Invalid Request payload',{status:422})
    }
    return new Response('Invalid request',{status:400})
}
}