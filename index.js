const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());

const usuarioRoutes = require('./src/routes/usuarioRoutes');
const servicoRoutes = require('./src/routes/servicoRoutes');
const authRoutes = require('./src/routes/authRoutes');
const empresaRoutes = require('./src/routes/empresaRoutes');
const agendamentoRoutes = require('./src/routes/agendamentoRoutes');
const horarioRoutes = require('./src/routes/horarioRoutes');
app.use(cors({
  origin: ['https://www.indca.com.br', 'http://127.0.0.1:5501'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use('/usuarios', usuarioRoutes);
app.use('/servicos', servicoRoutes);
app.use('/', authRoutes);
app.use('/empresas', empresaRoutes);
app.use('/agendamentos', agendamentoRoutes);
app.use('/horarios', horarioRoutes);

app.get('/', (req, res) => {
  res.send('API Marketplace online ✅');
});

const port = process.env.PORT || 3000;
console.log(`Porta do servidor: ${port}`);
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
