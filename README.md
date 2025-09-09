07/09/2025, 17:10

Fiz mudanças nos relacionamentos do banco de dados e agora tô tendo problemas no cadastro de ordem de serviço, por causa da tabela funcionário. Arrumei a disposição de dados na tela detalhes, aparentemente está funcionando (Com exceção de endereço que não tá aparecendo). Os botões ainda não são funcionais, então não tem mudança de status nem nada, tô pensando ainda em como ficaria melhor na hora de expor isso (pendente pra concluído tem que colocar valor final e data de entrega; pendente pra cancelado tô pensando se coloco alguma mensagem de "Tem certeza?" ou algo do tipo).

PARTES DO DESENVOLVIMENTO:

Cadastro, Login e Logout: funcionando;
Tela Inicial: Todos os botões funcionando. Ainda não foi colocada a função de listar pendentes na tela inicial;
Novo Conserto (Etapa 1/Cliente): Funcionando adequadamente nos testes;
Novo Conserto (Etapa 2/Aparelho): Funcionando adequadamente nos testes;
Novo Conserto (Etapa 3/Registro): Funcionando adequadamente nos testes, precisando dos ajustes mencionados anteriormente (trocar alguns campos de páginas e adicionar o timestamp);
Consertos Pendentes: Funcionando adequadamente nos testes;
  Detalhes: Exibição de dados nos campos funcionando exceto endereço, botões "Cancelar" e "Concluir" ainda não funcionais; 
Consertos Concluídos: faltam pequenos ajustes no front e a lógica ainda não deu de ver sendo posta em prática, mas imagino que não vá dar problemas.
Consertos Cancelados: a lógica ainda não deu de ver sendo posta em prática, mas imagino que não vá dar problemas.
