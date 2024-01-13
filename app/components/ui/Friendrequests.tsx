'use client'
import { Check, UserPlus, X } from 'lucide-react'
import { FC, useState } from 'react'

interface FriendrequestsProps {
  incomingFriendRequests:IncomingFriendRequests[]
  sessionId:string
}

const Friendrequests: FC<FriendrequestsProps> = ({incomingFriendRequests,sessionId}) => {
    // doing types in a d.ts file does not require import
    const [friendRequests,setFriendRequests] = useState<IncomingFriendRequests[]>(incomingFriendRequests)
  return <>


    {friendRequests.length===0?(<p className='text-sm text-zinc-500'>Nothing to show here.</p>):(friendRequests.map((request)=>(
        <div key={request.senderId} className='flex gpa-4 items-center'>
            <UserPlus className='text-black'  />
            <p className='font-medium text-lg'>{request.senderEmail}</p>
            <button aria-label="aceept friend" className='w-8 h-8 bg-indigo-600 hover:bg-indigo-700 grid place-items-center rounded-full transition hover:shadow-md'>
            <Check className='font-semibold text-white w-3/4 h-3/4'/>    
            </button>

            <button aria-label="deny friend" className='w-8 h-8 bg-red-600 hover:bg-red-700 grid place-items-center rounded-full transition hover:shadow-md'>
            <X className='font-semibold text-white w-3/4 h-3/4'/>    
            </button>
        </div>
    )))}
  </>
}

export default Friendrequests