const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());

app.use(cors({
  origin: 'https://www.indca.com.br',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // só se você usa cookies/autenticação via sessão
}));

// (opcional) responder preflight manualmente, embora o cors já faça
app.options('*', cors());


const usuarioRoutes = require('./src/routes/usuarioRoutes');
const servicoRoutes = require('./src/routes/servicoRoutes');
const authRoutes = require('./src/routes/authRoutes');
const empresaRoutes = require('./src/routes/empresaRoutes');
const uploadRoute = require('./routes/uploadRoute');


app.use("/api", require("./routes/s3"));
app.use('/api', uploadRoute);
app.use('/usuarios', usuarioRoutes);
app.use('/servicos', servicoRoutes);
app.use('/', authRoutes);
app.use('/empresas', empresaRoutes);
app.get('/', (req, res) => {
  res.send('API Marketplace online ✅');
});

const port = process.env.PORT || 3000;
console.log(`Porta do servidor: ${port}`);
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});