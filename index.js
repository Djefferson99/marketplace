const express = require('express');
const app = express();
const usuarioRoutes = require('./src/routes/usuarioRoutes');
const servicoRoutes = require('./src/routes/servicoRoutes');
const agendamentoRoutes = require('./src/routes/agendamentoRoutes');

app.use(express.json());
app.use('/usuarios', usuarioRoutes);
app.use('/servicos', servicoRoutes);
app.use('/agendamentos', agendamentoRoutes);

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});
