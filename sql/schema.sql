-- Tabela de usuários (clientes e prestadores)
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    senha TEXT NOT NULL,
    tipo_usuario VARCHAR(20) CHECK (tipo_usuario IN ('cliente', 'prestador')) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de serviços oferecidos pelos prestadores
CREATE TABLE servicos (
    id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES usuarios(id),
    titulo VARCHAR(100) NOT NULL,
    descricao TEXT,
    preco NUMERIC(10, 2),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de agendamentos
CREATE TABLE agendamentos (
    id SERIAL PRIMARY KEY,
    cliente_id INT REFERENCES usuarios(id),
    prestador_id INT REFERENCES usuarios(id),
    servico_id INT REFERENCES servicos(id),
    data_agendada TIMESTAMP NOT NULL,
    status VARCHAR(20) DEFAULT 'pendente' CHECK (status IN ('pendente', 'confirmado', 'cancelado')),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
