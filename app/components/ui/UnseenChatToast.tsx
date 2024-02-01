import { cn } from '@/app/lib/utils'
import { FC } from 'react'

interface UnseenChatToastProps {
  
}

const UnseenChatToast: FC<UnseenChatToastProps> = ({}) => {
  return <div className={cn('max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5')}>UnseenChatToast</div>
}

export default UnseenChatToast