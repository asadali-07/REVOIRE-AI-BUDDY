import { Server } from 'socket.io';
import cookie from 'cookie';
import jwt from 'jsonwebtoken';
import agent  from '../agent/agent.js';

export const initSocketServer = async (server) => {
    const io = new Server(server, {
        cors: {
            origin: 'https://revoire.vercel.app',
            methods: ['GET', 'POST'],
            credentials: true,
        },
    });

    io.use((socket, next) => {
        const cookies = socket.handshake.headers.cookie;
        const { token } = cookies ? cookie.parse(cookies) : {};

        if (!token) {
            return next(new Error('Token not provided'));
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.user = decoded;
            socket.token = token;
            next();
        } catch (error) {
            next(new Error('Authentication error'));
        }
    });

    io.on('connection', (socket) => {

        socket.on('message', async (data) => {

            const agentResponse = await agent.invoke({
                messages: [
                    {
                        role: "user",
                        content: data
                    }
                ]
            }, {
                metadata: {
                    token: socket.token
                }
            })

            const lastMessage = agentResponse.messages[agentResponse.messages.length - 1]

            socket.emit('ai-message', lastMessage.content)

        })

    })

};