CREATE DATABASE IF NOT EXISTS EleDom;
USE EleDom;

CREATE TABLE IF NOT EXISTS Endereco (
  id INTEGER PRIMARY KEY AUTO_INCREMENT NOT NULL,
  rua VARCHAR(40) NOT NULL,
  numero INTEGER,
  bairro VARCHAR(40) NOT NULL,
  complemento VARCHAR(20) NOT NULL,
  cidade VARCHAR(40) NOT NULL,
  UF VARCHAR(20) NOT NULL,
  CEP CHAR(9) NOT NULL
);

CREATE TABLE IF NOT EXISTS Cliente (
  id INTEGER PRIMARY KEY AUTO_INCREMENT NOT NULL,
  nome VARCHAR(50) NOT NULL,
  fone VARCHAR(15) NOT NULL,
  rg CHAR(12) NOT NULL,
  cpf CHAR(14) NOT NULL,
  obs VARCHAR(100),
  id_endereco INTEGER,
  FOREIGN KEY (id_endereco) REFERENCES Endereco (id)
);

CREATE TABLE IF NOT EXISTS Aparelho (
  id INTEGER PRIMARY KEY AUTO_INCREMENT NOT NULL,
  nome VARCHAR(50) NOT NULL,
  marca VARCHAR(25) NOT NULL,
  cor VARCHAR(20) NOT NULL,
  modelo VARCHAR(40) NOT NULL,
  problema VARCHAR(255) NOT NULL,
  garantia BOOLEAN,
  data_garantia DATE NULL,
  fotos VARCHAR(255) NULL,
  tipo VARCHAR(30) NOT NULL,
  acessorios VARCHAR(50),
  obs VARCHAR(100),
  id_cliente INTEGER NOT NULL,
  FOREIGN KEY (id_cliente) REFERENCES Cliente (id)
);

CREATE TABLE IF NOT EXISTS Funcionario (
  id INTEGER PRIMARY KEY AUTO_INCREMENT NOT NULL,
  nome VARCHAR(50) NOT NULL,
  email VARCHAR(50) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  usuario VARCHAR(40) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS Registro (
  id INTEGER PRIMARY KEY AUTO_INCREMENT NOT NULL,
  data_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  data_estimada DATE NOT NULL,
  data_entrega DATE,
  orcamento REAL NOT NULL,
  valor REAL,
  status_aparelho ENUM('Pendente','Concluído','Cancelado') NOT NULL DEFAULT 'Pendente',
  obs VARCHAR(100),
  id_cliente INTEGER NOT NULL,
  id_aparelho INTEGER NOT NULL,
  id_endereco INTEGER,
  id_funcionario INTEGER,                    
  FOREIGN KEY (id_cliente) REFERENCES Cliente (id),
  FOREIGN KEY (id_aparelho) REFERENCES Aparelho (id),
  FOREIGN KEY (id_endereco) REFERENCES Endereco (id),
  FOREIGN KEY (id_funcionario) REFERENCES Funcionario (id)
);
