import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import therapistRoutes from './routes/therapistRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import scheduleRoutes from './routes/scheduleRoutes.js';
import patientRoutes from './routes/patientRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import leaveRoutes from './routes/leaveRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

app.set('io', io);

io.on('connection', (socket) => {
  console.log('A user connected via WebSocket', socket.id);
  socket.on('disconnect', () => {
    console.log('User disconnected', socket.id);
  });
});

app.use(cors({ origin: true, credentials: true }));
// Raised limit so profile photos (base64 data URLs) fit in the request body.
app.use(express.json({ limit: '5mb' }));

app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/therapists', therapistRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/feedback', feedbackRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  httpServer.listen(PORT, () => {
    console.log(`SRCC backend running on http://localhost:${PORT}`);
  });
};

start();