import { FC } from 'react'

interface MessagesProps {
  
}

const Messages: FC<MessagesProps> = ({}) => {
  return <div id='messages'className='flex h-full flex-1 flex-col-reverse gap-4 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-tough'>Messages</div>
}

export default Messages