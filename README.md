20/08/2025, 17:15

Depois de uma tarde de testes e correção de erros (Especialmente em relação aos dados de sessão), o registro de ordem de serviço está funcionando em suas três etapas (Cadastro de cliente, aparelho e registro), mas ainda não está adequado. Algumas informações na terceira etapa devem ser realocadas em outra parte do sistema (Como por exemplo data de entrega e valor final) enquanto outras informações poderiam ser cadastradas automaticamente (Como data de registro), apesar de eu não ter certeza de como fazer isso, precisamos pesquisar melhor.
Na parte de pendentes, ainda não está funcionando a listagem de consertos de status "Pendente", na verdade ainda não foi feita a programação dessa parte, não tenho certeza de como puxar os dados do banco sem dar erro, já que é geralmente nessa parte que a maioria dos erros se alocam, fora os problemas com Rotas, que são infinitos, toda hora aparece algum de repente. além disso, ao clicar em detalhes (detalhes.ejs, sem estilização feita ainda) além da listagem de informações, também precisamos acrescentar um botão de mudar o status pra concluído, adicionando data de entrega e valor final, tirando a ordem de serviço da lista de pendentes e jogando na lista de concluídos. Também seria interessante um botão de cancelar ordem de serviço, mas não sei se seria mais adequado criar uma opção de status "Cancelado" e manter no sistema ou simplesmente excluir totalmente (A segunda opção parece mais eficiente, mas também vai do modo como o pai do Léo trabalha lá).
Uma das minhas preocupações é justamente essa, de cancelamento. Estive pensando, se o usuário decidir cancelar a ordem de serviço na segunda etapa, por exemplo, os dados de cliente da primeira etapa iriam continuar no banco de dados? Isso poderia gerar acúmulo de dados inúteis ou alguma espécie de engarrafamento? Certamente iria atrapalhar na hora de cadastrar, mas não sei pensar em uma solução adequada pra esse problema.

PARTES DO DESENVOLVIMENTO:

Cadastro e Login: funcionando na minha máquina, mas se comportando de maneira estranha na do professor, AINDA NÃO SUBSTITUI O NOME DO BANCO DE DADOS;
Tela Inicial: Botões de "Novo Conserto" e "Consertos Pendentes" funcionando. Botão de "Consertos Concluídos" com erro na rota (arquivo "concluidosRoutes" bem embrionário, pouca coisa dentro dele);
Novo Conserto (Etapa 1/Cliente): Funcionando adequadamente nos testes, precisando revisar as rotas do botão "<- Voltar";
Novo Conserto (Etapa 2/Aparelho): Funcionando adequadamente nos testes, precisando revisar as rotas do botão "<- Voltar";
Novo Conserto (Etapa 3/Registro): Funcionando adequadamente nos testes, precisando revisar as rotas do botão "<- Voltar" e os ajustes mencionados acima;
Consertos Pendentes: rotas funcionando bem, necessárias as alterações mencionadas acima;
  Detalhes: funciona ao clicar no card/bloco que mostra a ordem de serviço, ainda não foi mexido nesse arquivo; 
Consertos Concluídos: ainda não começamos a trabalhar nessa parte, mas é a mais fácil, apenas listagem de pedidos com status "Concluído", sem maiores interações;
