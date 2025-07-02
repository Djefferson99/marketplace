const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(express.json());

const usuarioRoutes = require('./src/routes/usuarioRoutes');
const servicoRoutes = require('./src/routes/servicoRoutes');
const agendamentoRoutes = require('./src/routes/agendamentoRoutes');
const authRoutes = require('./src/routes/authRoutes');
const empresaRoutes = require('./src/routes/empresaRoutes');

app.use(cors({
  origin: ['https://temp-indica.vercel.app'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use('/usuarios', usuarioRoutes);
app.use('/servicos', servicoRoutes);
app.use('/agendamentos', agendamentoRoutes);
app.use('/', authRoutes);
app.use('/empresas', empresaRoutes);
app.use('/uploads', express.static(path.resolve(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.send('API Marketplace online ✅');
});

const port = process.env.PORT || 3000;
console.log(`Porta do servidor: ${port}`);
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
