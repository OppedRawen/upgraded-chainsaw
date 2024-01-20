import { fetchRedis } from '@/app/helper/redis'
import { authOptions } from '@/app/lib/auth'
import { db } from '@/app/lib/db'
import { messageArrayValidator } from '@/app/lib/validations/message'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'
import { FC } from 'react'

interface pageProps {
  params:{
    chatId:string
  }
}
async function getChatMessages(chatId:string){
  try {
    const result: string[] = await  fetchRedis(`zrange`,`chat:${chatId}:messages`,0,-1);
    const dbMessages = result.map((message)=>JSON.parse(message) as Message);

    const reversedDbMessages = dbMessages.reverse();
    const messages= messageArrayValidator.parse(reversedDbMessages);
    return messages;

  } catch (error) {
    notFound();
  }
}
const page: FC<pageProps> = async ({params}) => {
  const {chatId} = params
  const session =await getServerSession(authOptions);
  if(!session) notFound();

  const {user} = session;

  const [userId1,userId2] = chatId.split('--')
  if(user.id!==userId1&&user.id!==userId2) {
    notFound();
  }
  const chartPartnerId = user.id === userId1 ? userId2:userId1;
  const chatPartner = (await db.get(`user:${chartPartnerId}`)) as User;
  const initialMessages = await getChatMessages(chatId);
  return <div>page</div>
}

export default page