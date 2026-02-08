/*require("dotenv").config();

const http = require("http");
const { neon } = require("@neondatabase/serverless");

const sql = neon(process.env.DATABASE_URL);

const requestHandler = async (req, res) => {
  const result = await sql`SELECT version()`;
  const { version } = result[0];
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end(version);
};

http.createServer(requestHandler).listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});*/

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
//const errorHandler = require('./middleware/errorHandler');

// Swagger setup
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

// Import routes
const authRoutes = require('./routes/authRoutes');
const sysadminRoutes = require('./routes/sysadminRoutes');
const telemetryRoutes = require('./routes/telemetryRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Middleware
app.use(
  cors({
    origin: '*', // Allow all origins (for development)
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Device-Token', 'Accept'],
    credentials: false, // Must be false when origin is '*'
  })
);
// Handle preflight requests
//app.options('*', cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger UI route
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Orvio Backend API Documentation',
    swaggerOptions: {
      persistAuthorization: true,
      tryItOutEnabled: true,
    },
  })
);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Orvio Backend API', version: '1.0.0' });
});

// Routes
app.use('/auth', authRoutes); 
app.use('/sysadmin', sysadminRoutes);
app.use('/', telemetryRoutes);
app.use('/admin', adminRoutes);

// Error handler (must be last)
//app.use(errorHandler);

module.exports = app;
