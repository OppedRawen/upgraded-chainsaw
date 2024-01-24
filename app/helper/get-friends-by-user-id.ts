import { fetchRedis } from "./redis"

export const getFriendsByuserId = async(userId:string)=>{
    // retrieve friends for current user
    const friendIds = await fetchRedis('smembers',`user:${userId}:friends`) as string[];
    // all the promises are executed in parallel
    const friends = await Promise.all(friendIds.map(async (friendId)=>{
        const friend = await fetchRedis('get',`user:${friendId}`) as string;
        const parsedFriend = JSON.parse(friend) as User
        return parsedFriend
    }))

    return friends
}