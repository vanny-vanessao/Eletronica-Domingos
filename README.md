06/09/2025, 17:17

O erro de exibir a foto continua, tanto em pendentes quanto em detalhes, não mexi nisso hoje. Arrumei a disposição de dados na tela detalhes, aparentemente está funcionando, exceto pela foto não aparecer e nem o obs do registro, que vai como nulo mesmo estando com dados inseridos no cadastro (monitorando no console). Os botões ainda não são funcionais, então não tem mudança de status nem nada, tô pensando ainda em como ficaria melhor na hora de expor isso (pendente pra concluído tem que colocar valor final e data de entrega; pendente pra cancelado tô pensando se coloco alguma mensagem de "Tem certeza?" ou algo do tipo).

PARTES DO DESENVOLVIMENTO:

Cadastro, Login e Logout: funcionando;
Tela Inicial: Todos os botões funcionando. Ainda não foi colocada a função de listar pendentes na tela inicial;
Novo Conserto (Etapa 1/Cliente): Funcionando adequadamente nos testes;
Novo Conserto (Etapa 2/Aparelho): Funcionando adequadamente nos testes;
Novo Conserto (Etapa 3/Registro): Funcionando adequadamente nos testes, precisando dos ajustes mencionados anteriormente (trocar alguns campos de páginas e adicionar o timestamp);
Consertos Pendentes: Funcionando adequadamente nos testes;
  Detalhes: maioria dos campos funcionando (exceto fotos e observações de registro), botões "Cancelar" e "Concluir" ainda não funcionais; 
Consertos Concluídos: faltam pequenos ajustes no front e a lógica ainda não deu de ver sendo posta em prática, mas imagino que não vá dar problemas.
Consertos Cancelados: a lógica ainda não deu de ver sendo posta em prática, mas imagino que não vá dar problemas.
