// 1) Carregar variáveis de ambiente antes de qualquer require que use process.env
require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());

// 2) CORS ANTES das rotas — use allowlist (produção + dev)
const allowlist = [
  'https://www.indca.com.br',
  'https://indca.com.br',
  // dev (se precisar)
  'http://localhost:3000',
  'http://127.0.0.1:5500',
];

const corsOptions = {
  origin(origin, callback) {
    // requisições sem Origin (curl/healthchecks) devem ser aceitas
    if (!origin) return callback(null, true);
    if (allowlist.includes(origin)) return callback(null, true);
    return callback(new Error('Origin não permitido: ' + origin));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // use true apenas se enviar cookies/sessão
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // preflight

// 3) Rotas de diagnóstico rápidas
app.get('/health', (req, res) => res.status(200).send('ok'));
app.get('/test-cors', (req, res) => res.json({ message: 'CORS ok' }));

// 4) Imports de rotas
const usuarioRoutes = require('./src/routes/usuarioRoutes');
const servicoRoutes = require('./src/routes/servicoRoutes');
const authRoutes = require('./src/routes/authRoutes');
const empresaRoutes = require('./src/routes/empresaRoutes');

// Presigned POST (S3)
app.use('/api', require('./routes/s3'));

// 5) (OPCIONAL) Multer-S3 — só monte se as ENVs existirem
//    Se você já migrou para Presigned POST, comente estas duas linhas.
if (process.env.AWS_BUCKET_NAME && process.env.AWS_REGION) {
  const uploadRoute = require('./routes/uploadRoute');
  app.use('/api', uploadRoute);
  console.log('uploadRoute habilitada (multer-s3).');
} else {
  console.log('uploadRoute desabilitada (faltam ENVs do S3 ou você está usando Presigned POST).');
}

// 6) Suas rotas principais
app.use('/usuarios', usuarioRoutes);
app.use('/servicos', servicoRoutes);
app.use('/empresas', empresaRoutes);
app.use('/', authRoutes);

// 7) Raiz
app.get('/', (req, res) => {
  res.send('API Marketplace online ✅');
});

// 8) Porta — em PaaS (Railway) use EXACTAMENTE process.env.PORT
const port = process.env.PORT; // sem fallback
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
