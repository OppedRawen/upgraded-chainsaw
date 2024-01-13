const upstashRedisRESTUrl = process.env.UPSTASH_REDIS_REST_URL
const authToken = process.env.UPSTASH_REDIS_REST_TOKEN

type Commands = 'set' | 'zrange' | 'sismember' | 'get' | 'smembers'

export async function fetchRedis(
    command: Commands,
    ...args:(string|number)[

    ]
){
    const commandUrl = `${upstashRedisRESTUrl}/${command}/${args.join('/')}`
    console.log(`Executing Redis command: ${commandUrl}`); // Log the command
    const method = command === 'set' ? 'POST' : 'GET';
    const body = command === 'set' ? JSON.stringify(args) : null;
    const response = await fetch(commandUrl,{
        method,
        headers:{
            Authorization: 'Bearer ' + authToken,
        },
        body,
        cache:'no-cache'
    })

    if(!response.ok){
        throw new Error(`Error executing Redis command: ${response.statusText}`)


    }
    const data = await response.json();
    return data.result;
}