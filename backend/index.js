require('dotenv').config();
const express = require('express');
const http    = require('http');
const cors    = require('cors');
const connectDB = require('./config/db');
const { Server } = require('socket.io');

const authRoutes   = require('./routes/auth');
const tenantRoutes = require('./routes/tenants');
const userRoutes   = require('./routes/users');
const deviceRoutes = require('./routes/devices');
const trackRoutes  = require('./routes/track');
const alertRoutes  = require('./routes/alert');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

connectDB();
app.use(cors());
app.use(express.json());

// WebSocket: quando track chega, emito para canal imei
io.on('connection', socket => {
  socket.on('join', channel => socket.join(channel));
  socket.on('leave', channel => socket.leave(channel));
});

// Health
app.get('/health', (_,res) => res.sendStatus(200));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tenants', tenantRoutes);
app.use('/api/users', userRoutes);
app.use('/api/devices', deviceRoutes(io));
app.use('/api/track', trackRoutes(io));
app.use('/api/alert', alertRoutes(io));

// Bootstrap super-admin
app.post('/bootstrap', async (req,res) => {
  if (req.query.secret !== process.env.BOOTSTRAP_SECRET)
    return res.status(403).json({ error:'Forbidden' });
  // omitted: create super-admin logic...
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Backend na porta ${PORT}`));

