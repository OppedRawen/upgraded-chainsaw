import { getServerSession } from 'next-auth'
import { FC } from 'react'
import { authOptions } from '../../lib/auth';

interface pageProps {
  session: any;
}

const page: FC<pageProps> = async ({}) => {
  const session = await getServerSession(authOptions);
  return <div>
    <h1>Dashboard</h1>
    <p>Hi, {session?.user.name}</p>
  </div>
}

export default page