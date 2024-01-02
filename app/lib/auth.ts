// document this
import { NextAuthOptions } from "next-auth";
import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter";
import { db } from "./db";
import GoogleProvider from 'next-auth/providers/google';
import { fetchRedis } from "../helper/redis";

function getGoogleCredentials() {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    console.log("Google credentials", { clientId, clientSecret });
    if (!clientId || clientId.length === 0) {
        throw new Error('Missing GOOGLE_CLIENT_ID')
      }
    
      if (!clientSecret || clientSecret.length === 0) {
        throw new Error('Missing GOOGLE_CLIENT_SECRET')
      }
    
      return { clientId, clientSecret }
}

export const authOptions: NextAuthOptions = {
    adapter: UpstashRedisAdapter(db),
    session:{
        strategy: "jwt",
    },
    pages:{
        signIn:'/login'

    },
    providers:[
        GoogleProvider({
            clientId:getGoogleCredentials().clientId,
            clientSecret:getGoogleCredentials().clientSecret,
        })
    ],
    callbacks:{
        async jwt({token, user}){
            // check if user exists in Redis
            const dbUserResult = (await fetchRedis('get', `user:${token.id}`)) as string | null;


            if(!dbUserResult){
                // user doesn't exist, so store them in Redis
                if(user){
                    token.id = user!.id;
                }
               
                return token;
            }
            const dbUser = JSON.parse(dbUserResult) as User;
            console.log('dbUser',dbUser);
            return{
                id:dbUser.id,
                name:dbUser.name,
                email:dbUser.email,
                picture:dbUser.image,
            }
        },
        // async jwt({ token, user, account }) {
        //     // This callback is only called on sign-in
        //     if (user) {
        //         // Check if user already exists in Redis
        //         const dbUser = (await db.get(`user:${user.id}`)) as User | null;
        
        //         if (!dbUser) {
        //             // User doesn't exist, so store them in Redis
        //             const userData = {
        //                 id: user.id,
        //                 name: user.name,
        //                 email: user.email,
        //                 picture: user.image,
        //             };
        //             await db.set(`user:${user.id}`, JSON.stringify(userData));
        //         }
        
        //         token.id = user.id;
        //     }
        
        //     return token;
        // },
        async session({session, token}){
            if(token){
                session.user.id = token.id
                session.user.name = token.name
                session.user.email = token.email
                session.user.image = token.picture

            }
            return session
        },
        redirect(){
            return '/dashboard'
        }
    }
}