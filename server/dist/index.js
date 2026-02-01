"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
// Environment configurations
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// --- SECURITY MIDDLEWARE ---
// 1. Helmet: Secure HTTP headers
app.use((0, helmet_1.default)());
// 2. CORS: Allow requests from frontend (adjust origin in production)
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173', // Vite default port
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
// 3. Rate Limiting: Prevent brute-force
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);
// Body parser
app.use(express_1.default.json());
// --- API ROUTES ---
// Root route
app.get('/', (req, res) => {
    res.send('Secure Backend is Running');
});
// Example: Moving business logic to backend
// Instead of hardcoding data in HTML/JS, fetch it from here
app.get('/api/stats', (req, res) => {
    // Simulate secure database retrieval
    const stats = {
        users: 1500,
        downloads: 4500,
        active: 300
    };
    res.json(stats);
});
app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date() });
});
// Start Server
app.listen(PORT, () => {
    console.log(`Server running securely on http://localhost:${PORT}`);
});
