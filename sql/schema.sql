DO $$ DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;
END $$;

-- Tabela de usuários
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
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
    linkedin VARCHAR(255),
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
CREATE TABLE horarios_de_agendamentos (
    id SERIAL PRIMARY KEY,
    empresa_id INT REFERENCES empresas(id) ON DELETE CASCADE,
    dia_semana VARCHAR(10) NOT NULL, -- Ex: 'segunda', 'terça'
    hora TIME NOT NULL,              -- Ex: '07:00', '07:30'
    disponivel BOOLEAN DEFAULT TRUE -- Pode ser útil para desabilitar sem deletar
);

CREATE TABLE agendamentos (
    id SERIAL PRIMARY KEY,
    empresa_id INT REFERENCES empresas(id) ON DELETE CASCADE,
    servico_id INT REFERENCES servicos(id) ON DELETE CASCADE,
    nome_cliente VARCHAR(100) NOT NULL,
    telefone_cliente VARCHAR(20) NOT NULL,
    data DATE NOT NULL,             -- Dia do agendamento
    hora TIME NOT NULL,             -- Hora do agendamento
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX idx_agendamento_unico
ON agendamentos (empresa_id, data, hora);