## Introdução

Faaaaaaala, dev! Parabéns por chegar até aqui! 💜
Agora é hora de reforçar os conceitos que você aprendeu até aqui colocando a mão na massa!

Este é o momento de transformar conhecimento em ação, desenvolvendo um projeto que vai consolidar suas habilidades e te preparar um pouco mais para os desafios reais!

Projetos exemplos: 

Frontend: https://github.com/rocketseat-education/ftr-pos-360-mindshare/tree/main/frontend

Backend: https://github.com/rocketseat-education/ftr-pos-360-mindshare/tree/main/backend


---

## Descrição do desafio

Vamos desenvolver uma aplicação FullStack de gerenciamento de finanças: o Financy! 

O objetivo é criar uma aplicação que permita a organização de finanças, com gestão de transações e categorias.

Para facilitar a leitura, a documentação com a descrição mais detalhada de cada área estão separadas nas subpáginas abaixo:

### Back-end

#### Funcionalidades e Regras

<aside>
Utilize o banco de dados Postgres
</aside>

- [X]  O usuário pode criar uma conta e fazer login
- [X]  O usuário pode ver e gerenciar apenas as transações e categorias criadas por ele
- [X]  Deve ser possível criar uma transação
- [X]  Deve ser possível deletar uma transação
- [X]  Deve ser possível editar uma transação
- [X]  Deve ser possível listar todas as transações
- [X]  Deve ser possível criar uma categoria
- [X]  Deve ser possível deletar uma categoria
- [X]  Deve ser possível editar uma categoria
- [X]  Deve ser possível listar todas as categorias

---

#### Ferramentas

É obrigatório o uso de:

- TypeScript
- GraphQL
- Prisma
- SQLite

#### Variáveis ambiente

Todo projeto tem diversas configurações de variáveis que devem ser diferentes de acordo com o ambiente que ele é executado. Para isso, importante sabermos, de forma fácil e intuitiva, quais variáveis são essas. Então é obrigatório que esse projeto tenha um arquivo `.env.example` com as chaves necessárias.

```
JWT_SECRET=
DATABASE_URL=
```

Caso adicione variáveis adicionais, lembre-se de incluí-las no `.env.example`.

### Front-end

#### Funcionalidades e Regras

Assim como na API, temos as seguintes funcionalidades e regras:

- [X]  O usuário pode criar uma conta e fazer login
- [X]  O usuário pode ver e gerenciar apenas as transações e categorias criadas por ele
- [X]  Deve ser possível criar uma transação
- [X]  Deve ser possível deletar uma transação
- [X]  Deve ser possível editar uma transação
- [X]  Deve ser possível listar todas as transações
- [X]  Deve ser possível criar uma categoria
- [X]  Deve ser possível deletar uma categoria
- [X]  Deve ser possível editar uma categoria
- [X]  Deve ser possível listar todas as categorias

Além disso, também temos algumas regras importantes específicas para o front-end:

- [ ]  É obrigatória a criação de uma aplicação React usando GraphQL para consultas na API e Vite como `bundler`;
- [ ]  Siga o mais fielmente possível o layout do Figma;

<aside>
💡

Dica: Copie os checkbox acima para o README do seu projeto.
Assim irá poder ir marcando na medida que implementar as funcionalidades. 😉

</aside>

#### Páginas

Essa aplicação possui 6 páginas e dois modais com os formulários (Dialog):

- A página raiz (`/`) que exibe:
    - Tela de login caso o usuário esteja deslogado
    - Tela dashboard caso usuário esteja logado

#### Ferramentas

É obrigatório o uso de:

- Typescript
- React
- Vite sem framework
- GraphQL

É flexível o uso de:

- TailwindCSS
- Shadcn
- React Query
- React Hook Form
- Zod

#### Variáveis ambiente

Todo projeto tem diversas configurações de variáveis que devem ser diferentes de acordo com o ambiente que ele é executado. Para isso, importante sabermos, de forma fácil e intuitiva, quais variáveis são essas. Então é obrigatório que esse projeto tenha um arquivo `.env.example` com as chaves necessárias:

```
VITE_BACKEND_URL=
```

## Dicas

- Comece o projeto pela aba `Style Guide` no Figma. Dessa forma, você prepara todo o seu tema, fontes e componentes e quando for criar as páginas vai ser bem mais tranquilo;
- Assim com a experiência do usuário é importante (UX), a sua experiência no desenvolvimento (DX) também é muito importante. Por isso, apesar de ser possível criar essa aplicação sem nenhuma biblioteca, recomendamos utilizar algumas bibliotecas que vão facilitar tanto o desenvolvimento inicial quanto a manutenção do código;
- Em caso de dúvidas, utilize o espaço da comunidade e do nosso fórum para interagir com outros alunos/instrutores e encontrar uma solução que funcione para você.

## Entrega

Esse desafio deve ser entregue na nossa plataforma.
Para o envio, é necessário criar um repositório no GitHub e enviar o link  do seu repositório na nossa plataforma com a sua resolução!

Porém, é **importante seguir alguns padrões** para que possamos **corrigir** corretamente o seu projeto:

- O repositório deve estar público;
- O repositório deve conter a resolução do desafio;
- O repositório deve ter duas subpastas
    - `backend` vai conter a resolução completa do desafio Back-end;
    - `frontend` vai conter a resolução completa do desafio Front-end.
- O repositório deve conter o código referente as regras e funcionalidades obrigatórias. Caso queira se desafiar com funcionalidades extras, crie o código com essas alterações em uma nova `branch`, preservando o seu código original do desafio.

Após concluir o desafio, se você se sentir confortável, o que acha de postar no LinkedIn 
contando como foi a sua experiência compartilhando o seu projeto e o seu aprendizado?
É uma excelente forma de demonstrar seus conhecimentos e atrair novas oportunidades! 👀

E pode marcar a gente, viu? Vai ser incrível acompanhar toda a sua evolução! 💜

---

## Dicas

Esse projeto tem como forte inspiração as funcionalidades e tecnologias vistas no projeto MindShare. Então caso tenha dúvidas, vale a pena revisitar as aulas dos módulos **Back-end GraphQL** e **Front-end GraphQL** ou o código do projeto ([**frontend**](https://github.com/rocketseat-education/ftr-pos-360-mindshare/tree/main/frontend) e [**backend**](https://github.com/rocketseat-education/ftr-pos-360-mindshare/tree/main/backend)) pois podem te ajudar bastante na resolução desse desafio.

---

## Considerações finais

Lembre-se que o intuito de um desafio é te impulsionar, por isso, dependendo do desafio, pode ser que você precise ir além do que foi discutido em sala de aula. 
Mas isso não é algo ruim: ter autonomia para buscar informações extras é uma habilidade muito valiosa e vai ser ótimo pra você treinar ela aqui com a gente!

E lembre-se: **tenha calma**! Enfrentar desafios faz parte do seu processo de aprendizado! 

Se precisar de alguma orientação ou suporte, estamos aqui com você!
Bons estudos e boa prática! 💜