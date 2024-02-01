'use client'
import { pusherClient } from '@/app/lib/pusher'
import { toPusherKey } from '@/app/lib/utils'
import axios from 'axios'
import { Check, UserPlus, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FC, useEffect, useState } from 'react'

interface FriendrequestsProps {
  incomingFriendRequests:IncomingFriendRequests[]
  sessionId:string
}

const Friendrequests: FC<FriendrequestsProps> = ({incomingFriendRequests,sessionId}) => {
    // doing types in a d.ts file does not require import
    const [friendRequests,setFriendRequests] = useState<IncomingFriendRequests[]>(incomingFriendRequests);
    const router = useRouter()
 
    useEffect(()=>{
      pusherClient.subscribe(toPusherKey(`user:${sessionId}:incoming_friend_requests`))
      console.log('subscribed to friend requests',toPusherKey(`user:${sessionId}:incoming_friend_requests`))
      const friendRequestHandler=({senderId,senderEmail}:IncomingFriendRequests)=>{
        setFriendRequests((prev)=>[...prev,{
          senderId,
          senderEmail
        }])
      }
      pusherClient.bind('incoming_friend_requests',friendRequestHandler)
      return ()=>{
        pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:incoming_friend_requests`))
        pusherClient.unbind('incoming_friend_requests',friendRequestHandler)

      }
    },[])
    const acceptFriend =async(senderId:string)=>{
        await axios.post('/api/friends/accept',{id:senderId})
        // after accepting a friend requests, remove it from the list and refresh the page
        // which means filter out the request that has the same senderId as the one we just accepted
        setFriendRequests((prev)=>prev.filter((request)=>request.senderId!==senderId))
        router.refresh();
    }
    const denyFriend =async(senderId:string)=>{
      await axios.post('/api/friends/deny',{id:senderId})
      // after accepting a friend requests, remove it from the list and refresh the page
      // which means filter out the request that has the same senderId as the one we just accepted
      setFriendRequests((prev)=>prev.filter((request)=>request.senderId!==senderId))
      router.refresh();
  }


  return <>


    {friendRequests.length===0?(<p className='text-sm text-zinc-500'>Nothing to show here.</p>):(friendRequests.map((request)=>(
        <div key={request.senderId} className='flex gpa-4 items-center'>
            <UserPlus className='text-black'  />
            <p className='font-medium text-lg'>{request.senderEmail}</p>
            <button aria-label="aceept friend" onClick={()=>acceptFriend(request.senderId)} className='w-8 h-8 bg-indigo-600 hover:bg-indigo-700 grid place-items-center rounded-full transition hover:shadow-md'>
            <Check className='font-semibold text-white w-3/4 h-3/4'/>    
            </button>

            <button aria-label="deny friend"onClick={()=>denyFriend(request.senderId)}  className='w-8 h-8 bg-red-600 hover:bg-red-700 grid place-items-center rounded-full transition hover:shadow-md'>
            <X className='font-semibold text-white w-3/4 h-3/4'/>    
            </button>
        </div>
    )))}
  </>
}

export default Friendrequests