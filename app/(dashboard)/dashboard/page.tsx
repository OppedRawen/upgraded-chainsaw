import { getServerSession } from 'next-auth'
import { FC } from 'react'
import { authOptions } from '../../lib/auth';

interface pageProps {
  
}

const page: FC<pageProps> = async ({}) => {
  const session = await getServerSession(authOptions);
  return <div>page</div>
}

export default page