'use client'
import { signOut } from 'next-auth/react'
import { ButtonHTMLAttributes, FC, useState } from 'react'
import toast from 'react-hot-toast'
import Button from './Button'
import { Loader2, LogOut } from 'lucide-react'

interface SignOutButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  
}

const SignOutButton: FC<SignOutButtonProps> = ({...props}) => {
    const [isSigningOut,setIsSigningOut] = useState<boolean>(false)
  return( <Button {...props} variant='ghost' onClick={async ()=>{
    try {
        await signOut();
    } catch (error) {
        toast.error('Something went wrong with your logout.');
    }finally{
        setIsSigningOut(false);
    }
  }}>{isSigningOut?(<Loader2 className='animate-spin h-4 w-4' />):( <LogOut className='w-4 h-4' />)}</Button>
  )
}

export default SignOutButton