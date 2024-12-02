use eletronicaDomingos;
create table Endereco (
id integer primary key auto_increment not null,
rua varchar(40) not null,
numero integer,
bairro varchar(40) not null,
complemento varchar(20) not null,
cidade varchar(40) not null,
UF char(2) not null,
CEP char(9) not null
);
create table Cliente (
id integer primary key auto_increment not null,
nome varchar(50) not null,
email varchar (50) not null unique,
senha varchar (25) not null,
login varchar (40) not null,
fone varchar (15) not null,
rg integer not null unique,
cpf integer not null unique,
obs varchar (100),
id_endereco integer not null,
foreign key (id_endereco) references Endereco (id)
);
create table Registro (
id integer primary key auto_increment not null,
data_registro date not null,
data_estimada date not null,
data_entrega date not null,
orcamento real not null,
valor real not null,
obs varchar(100),
id_cliente integer not null,
foreign key (id_cliente) references Cliente (id)
);
create table Aparelho (
id integer primary key auto_increment not null,
nome varchar (50) not null,
marca varchar (25) not null,
cor varchar (20) not null,
modelo varchar (40) not null,
problema varchar (70) not null,
garantia boolean,
data_garantia date,
fotos blob,
tipo varchar (30) not null,
acessorios varchar (50),
obs varchar (100),
id_registro integer not null,
foreign key (id_registro) references Registro (id)
);



