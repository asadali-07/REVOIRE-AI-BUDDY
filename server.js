import app from './src/app.js';
import { config } from 'dotenv';
import http from 'http';
import { initSocketServer } from './src/socket/socket.server.js';

config();

const server = http.createServer(app);
initSocketServer(server);



server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});