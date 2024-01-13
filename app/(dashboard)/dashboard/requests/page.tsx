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
    const incomingSenderIds = (await fetchRedis('smembers',`user:${session.user.id}:incoming_friend_reqests`) )as string[];

    const incomingFriendRequests = await Promise.all(incomingSenderIds.map(async(senderId)=>{
        const sender = await fetchRedis('get',`user:${senderId}`) as User;
        return {
            senderId,
            senderEmail:sender.email,
        }
    }))
  return <main className='pt-8'>
  <h1 className='font-bold text-5xl mb-8'>Add a friend</h1>
    <div className='flex flex-col gap-4'>
        <Friendrequests incomingFriendRequests={incomingFriendRequests} sessionId={session.user.id} />
    </div>
</main>
}

export default page