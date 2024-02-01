import { getServerSession } from 'next-auth'
import { FC } from 'react'
import { authOptions } from '../../lib/auth';


const page: FC = async ({}) => {
  const session = await getServerSession(authOptions);
  return <div>
    <h1>Dashboard</h1>
    <p>Hi, {session?.user.name}</p>
  </div>
}

export default page