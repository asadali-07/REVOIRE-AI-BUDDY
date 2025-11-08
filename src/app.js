import express from 'express';
import cors from 'cors';


const app = express();

app.use(cors({
  origin: 'https://revoire.netlify.app',
  methods: ['GET', 'POST'],
  credentials: true
}));



export default app;