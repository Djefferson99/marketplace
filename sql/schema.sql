-- Tabela de usuários
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    tipo_usuario VARCHAR(20) CHECK (tipo_usuario IN ('cliente', 'prestador')) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de empresas
CREATE TABLE empresas (
    id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES usuarios(id) ON DELETE CASCADE,
    nome_empresa VARCHAR(100) NOT NULL,
    apresentacao TEXT,
    descricao TEXT,
    site VARCHAR(255),
    instagram VARCHAR(255),
    facebook VARCHAR(255),
    youtube VARCHAR(255),
    foto_perfil VARCHAR(255)
);

-- Tabela de serviços
CREATE TABLE servicos (
    id SERIAL PRIMARY KEY,
    empresa_id INT REFERENCES empresas(id) ON DELETE CASCADE,
    titulo VARCHAR(100) NOT NULL,
    descricao_servico TEXT,
    valor NUMERIC(10, 2),
    prazo INTEGER -- prazo em dias, por exemplo
);

-- Tabela de agendamentos
CREATE TABLE agendamentos (
    id SERIAL PRIMARY KEY,
    cliente_id INT REFERENCES usuarios(id) ON DELETE CASCADE,
    prestador_id INT REFERENCES usuarios(id) ON DELETE CASCADE,
    servico_id INT REFERENCES servicos(id) ON DELETE CASCADE,
    data_agendada TIMESTAMP NOT NULL,
    status VARCHAR(20) DEFAULT 'pendente' CHECK (status IN ('pendente', 'confirmado', 'cancelado')),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
