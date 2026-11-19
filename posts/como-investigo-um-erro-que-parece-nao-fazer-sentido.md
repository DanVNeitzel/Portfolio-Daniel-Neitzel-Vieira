# Como investigo um erro que parece não fazer sentido

Você olha para o código, confere a lógica e pensa: “Isso deveria funcionar”.

Executa de novo. O mesmo erro.

Já passei por esse tipo de situação e uma pergunta ajuda a organizar a investigação: qual parte do que estou assumindo ainda não foi comprovada?

Para mostrar como esse raciocínio funciona, vou usar um exemplo hipotético: uma tela que continua exibindo o nome antigo de um usuário mesmo depois de salvar a alteração.

## Primeiro, descrevo o que está acontecendo

“O cadastro está com problema” é uma descrição ampla demais para orientar uma investigação.

Prefiro algo específico:

> Ao alterar o nome e clicar em salvar, a aplicação confirma a operação, mas a tela continua mostrando o nome anterior.

Agora tenho um comportamento para reproduzir. Também posso fazer perguntas mais úteis: acontece sempre? Com qualquer usuário? O nome continua antigo depois de atualizar a página?

Nesse exemplo, atualizar a página faz o nome novo aparecer. Essa observação já muda o rumo da investigação.

## Sigo o caminho dos dados

Antes de alterar o código, tento acompanhar o percurso da informação:

1. Qual valor saiu do formulário?
2. O que foi enviado na requisição?
3. Qual resposta o servidor devolveu?
4. Qual valor a tela está usando para renderizar?

Abro a aba de rede do navegador e encontro o nome novo na requisição. A resposta também contém o valor atualizado.

Isso indica que a gravação funcionou naquele teste. Como atualizar a página exibe o nome correto, minha próxima hipótese é que a tela esteja usando algum dado antigo.

Ainda é uma hipótese. Preciso descobrir de onde esse dado vem.

## Procuro uma explicação que eu consiga testar

Ao examinar o componente, encontro duas fontes de informação: o formulário mantém seus próprios valores, enquanto o cabeçalho mostra o nome recebido quando o perfil foi carregado.

Depois de salvar, a aplicação exibe uma mensagem de sucesso, mas não atualiza os dados usados pelo cabeçalho.

A sequência fica clara:

- O formulário envia o nome novo.
- O servidor salva e devolve o perfil atualizado.
- A tela continua renderizando o perfil carregado anteriormente.

O erro parecia contraditório porque eu tratava “o dado foi salvo” e “a tela foi atualizada” como se fossem a mesma operação.

## Faço uma mudança por vez

Nesse ponto, posso atualizar os dados locais com a resposta do servidor ou buscar novamente o perfil. A escolha depende de como a aplicação organiza essas informações.

Faço uma alteração e repito o teste.

Mudar várias coisas ao mesmo tempo pode até fazer o erro desaparecer, mas dificulta entender qual delas resolveu o problema. Também aumenta a chance de deixar uma alteração desnecessária pelo caminho.

Quero conseguir explicar a relação entre a causa encontrada e a correção aplicada.

## Verifico além do primeiro resultado

Ver o nome mudar uma vez é um bom sinal. Ainda preciso conferir outros comportamentos relevantes:

- Uma segunda alteração também aparece?
- Ao recarregar a página, o valor continua correto?
- Se a gravação falhar, a tela informa o erro sem mostrar uma confirmação indevida?

Essa última pergunta merece atenção. Uma correção no caminho de sucesso pode criar uma inconsistência quando a requisição falha.

## Registro o que aprendi

Uma anotação curta já ajuda:

> O perfil era salvo corretamente, mas o cabeçalho usava dados antigos. A correção atualiza os dados exibidos após a confirmação do servidor.

Esse registro facilita uma revisão e pode poupar tempo quando um comportamento parecido aparecer em outra tela.

## Quando travo, volto às evidências

Durante uma investigação, tento separar três coisas: o que observei, o que suponho e o que vou testar.

“Depois de recarregar, o nome aparece atualizado” é uma observação.

“A tela está usando dados antigos” é uma hipótese.

“Vou conferir a origem do valor renderizado” é o próximo teste.

Essa separação me ajuda a sair das tentativas aleatórias. Cada teste deve reduzir alguma dúvida, mesmo quando a hipótese inicial está errada.

Quando um erro parece não fazer sentido, procuro a menor pergunta que consigo responder com evidência. Muitas vezes, é ela que começa a destravar o problema.
