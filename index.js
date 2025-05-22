const express = require('express');
const app = express();

app.use(express.json());

const usuarioRoutes = require('./src/routes/usuarioRoutes');
const servicoRoutes = require('./src/routes/servicoRoutes');
const agendamentoRoutes = require('./src/routes/agendamentoRoutes');
const authRoutes = require('./src/routes/authRoutes');
const cors = require('cors');
const empresaRoutes = require('./src/routes/empresaRoutes');

app.use(cors({ origin: 'http://177.66.190.16:9001' }));
app.use('/usuarios', usuarioRoutes);
app.use('/servicos', servicoRoutes);
app.use('/agendamentos', agendamentoRoutes);
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
