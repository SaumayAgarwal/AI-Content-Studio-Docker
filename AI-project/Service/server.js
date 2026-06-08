import express from "express";
import cors from "cors";
import 'dotenv/config.js';
import { clerkMiddleware, requireAuth } from '@clerk/express'
import aiRouter from "./routes/aiRoutes.js";
import connectCloudinary from './configs/cloudinary.js';
import userRouter from "./routes/userRoutes.js";

const app=express();
await connectCloudinary() // Connect to Cloudinary before starting the server

app.use(cors())
app.use(express.json())
app.use(clerkMiddleware())
app.get('/',(req,res)=>res.send('Server is live!'))
app.use(requireAuth())
app.use('/api/ai',aiRouter)
app.use('/api/ai',userRouter)

const PORT=process.env.PORT || 8080;

app.listen(PORT,()=>console.log(`Server is running on port `,PORT));
