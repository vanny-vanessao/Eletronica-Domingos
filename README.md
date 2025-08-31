31/08/2025, 20:30

Com a parte de registro de OS funcionando, agora o problema tá na hora de mostrar isso na tela. Eu mudei o formato do campo "fotos" do BD de blob pra varchar pra que guardasse apenas o endereço e a foto ficasse na pasta /public/aparelhos, mas acho que deve ter algum erro nesse caminho, porque na tela de pendentes deveria mostrar a foto do pedido, que não aparece, mesmo que eu insira uma foto no cadastro de aparelho. Só que ainda não parei pra procurar o erro. Não sei se é no formulário do front ou em algum direcionamento pra pasta no back, porque a foto não apareceu na pasta que deveria ir (/public/aparelhos). Na tela pendentes os botões estão ficando por cima dos registros, em vez de ficar na esquerda, mas imagino que seja tranquilo de arrumar, mas por enquanto to focando no back, vou ver se o léo arruma esses errinhos no front. Consertos concluídos tá dando a mesma coisa dos botões, mas a lógica aparentemente tá certa, ainda não chegamos lá. A tela de cancelados tá com uma tabela ao invés de um card, mas era só testando como ficava (ficou bem feio, mas essa semana eu ja tiro de lá e troco, só registrando).

PARTES DO DESENVOLVIMENTO:

Cadastro, Login e Logout: funcionando;
Tela Inicial: Todos os botões funcionando. Ainda não foi colocada a função de listar pendentes na tela inicial;
Novo Conserto (Etapa 1/Cliente): Funcionando adequadamente nos testes;
Novo Conserto (Etapa 2/Aparelho): Funcionando adequadamente nos testes;
Novo Conserto (Etapa 3/Registro): Funcionando adequadamente nos testes, precisando dos ajustes mencionados anteriormente (trocar alguns campos de páginas);
Consertos Pendentes: front-end desconfigurado, mas back-end funcionando;
  Detalhes: dando erro de rota, ainda sem tela pronta, não chegamos nela ainda; 
Consertos Concluídos: ainda não testamos pois precisa ter a troca de status, que ainda não foi programada, mas a tela já existe, apesar de ainda não ter certeza sobre a estilização (tabela ou card, card fica mais bonitinho mas tem que ir vendo, arrumando o back-end primeiro);
Consertos Cancelados: tá com uma tabéla lá que vai ser tirada, a lógica ainda não deu de ver sendo posta em prática, mas imagino que não vá dar problemas.
