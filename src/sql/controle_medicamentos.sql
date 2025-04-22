CREATE DATABASE controle_medicamentos;

CREATE TABLE pacientes (
    id SERIAL PRIMARY KEY, -- ID único para cada paciente
    nome VARCHAR(100) NOT NULL, -- Nome do paciente
    idade INT NOT NULL, -- Idade do paciente
    quarto VARCHAR(10) NOT NULL -- Quarto do paciente
);

CREATE TABLE medicamentos (
    id SERIAL PRIMARY KEY, -- ID único para cada medicamento
    nome VARCHAR(100) NOT NULL, -- Nome do medicamento
    frequencia VARCHAR(50) NOT NULL, -- Frequência do medicamento (ex: Diário)
    dosagem VARCHAR(50) NOT NULL, -- Dosagem do medicamento (ex: 50mg)
    horarios TEXT[] NOT NULL, -- Horários do medicamento (array de horários)
    instrucoes TEXT NOT NULL, -- Instruções para o medicamento
    paciente_id INT NOT NULL, -- ID do paciente associado
    CONSTRAINT fk_paciente FOREIGN KEY (paciente_id) REFERENCES pacientes (id) ON DELETE CASCADE
);

CREATE TABLE paciente_medicamentos (
    paciente_id INT NOT NULL, -- ID do paciente
    medicamento_id INT NOT NULL, -- ID do medicamento
    PRIMARY KEY (paciente_id, medicamento_id), -- Chave primária composta
    CONSTRAINT fk_paciente FOREIGN KEY (paciente_id) REFERENCES pacientes (id) ON DELETE CASCADE,
    CONSTRAINT fk_medicamento FOREIGN KEY (medicamento_id) REFERENCES medicamentos (id) ON DELETE CASCADE
);

CREATE TABLE alarmes (
    id SERIAL PRIMARY KEY, -- ID único para cada alarme
    medicamento_id INT NOT NULL, -- ID do medicamento associado
    paciente_id INT NOT NULL, -- ID do paciente associado
    horario TIME NOT NULL, -- Horário do alarme
    status BOOLEAN DEFAULT FALSE, -- Status do alarme (TRUE = confirmado, FALSE = pendente)
    CONSTRAINT fk_medicamento FOREIGN KEY (medicamento_id) REFERENCES medicamentos (id) ON DELETE CASCADE,
    CONSTRAINT fk_paciente_alarme FOREIGN KEY (paciente_id) REFERENCES pacientes (id) ON DELETE CASCADE
);

CREATE TABLE historico_medicamentos (
    id SERIAL PRIMARY KEY, -- ID único para cada registro no histórico
    horario_tomado TIMESTAMP NOT NULL, -- Horário em que o medicamento foi tomado
    medicamento_id INT NOT NULL, -- ID do medicamento tomado
    paciente_id INT NOT NULL, -- ID do paciente associado
    CONSTRAINT fk_medicamento_historico FOREIGN KEY (medicamento_id) REFERENCES medicamentos (id) ON DELETE CASCADE,
    CONSTRAINT fk_paciente_historico FOREIGN KEY (paciente_id) REFERENCES pacientes (id) ON DELETE CASCADE
);
