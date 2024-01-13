import Friendrequests from '@/app/components/ui/Friendrequests';
import { fetchRedis } from '@/app/helper/redis';
import { authOptions } from '@/app/lib/auth';
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation';
import { FC } from 'react'


const page: FC = async ({}) => {
    const session = await getServerSession(authOptions);
    if(!session) notFound();

    // ids of people who sent current logged in user a freiend request
    const incomingSenderIds = (await fetchRedis('smembers',`user:${session.user.id}:incoming_friend_requests`) )as string[];

    const incomingFriendRequests = await Promise.all(incomingSenderIds.map(async(senderId)=>{
    //   because this is a json string, we need to parse it instead of just getting it
        const sender = await fetchRedis('get',`user:${senderId}`) as string;
        const senderParsed = JSON.parse(sender) as User;
        console.log('sender',sender);
        return {
            senderId,
            senderEmail:senderParsed.email,
        }
    }))
    // console log incomingFriendRequests email
    console.log(incomingFriendRequests.map((request)=>request.senderEmail),incomingFriendRequests)
  return <main className='pt-8'>
  <h1 className='font-bold text-5xl mb-8'>Add a friend</h1>
    <div className='flex flex-col gap-4'>
        <Friendrequests incomingFriendRequests={incomingFriendRequests} sessionId={session.user.id} />
    </div>
</main>
}

export default page