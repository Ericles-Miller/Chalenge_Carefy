<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ yarn install
```

## Compile and run the project

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Run tests

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ yarn install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Requisitos 
1. Autenticação: 
   - Use autenticação básica (usuário e senha fixos) para proteger os endpoints da 
API. Não é necessário criar meios de criação de novos usuários!. 
 
2. Integração com API Externa: 
   - Integre a API com uma API pública de filmes The Movie Database - TMDB. 
   - Ao adicionar um filme, busque informações como título, sinopse, ano de 
lançamento e gênero na API externa (qualquer informação adicional pode ser 
adicionada desde que faça sentido para o projeto). 
 
3. Middleware de Logs: 
   - Crie um middleware que registre todas as requisições recebidas, incluindo: 
 
     - Método HTTP, URL, status da resposta, timestamp e identificador único do filme 
(se aplicável, o filme deve ser válido, ou seja, existente na API sugerida). 
   - Para cada filme adicionado, gere um identificador único (ex: UUID) e o vincule 
a todas as ações futuras relacionadas a esse filme (ex: mover para assistido, 
avaliar, etc.). 
   - Armazene os logs em banco de dados (ex: SQLite ou MongoDB). 
 
4. Estados do Filme: 
   - Um filme pode estar em um dos seguintes estados: 
     1. A assistir (estado inicial ao adicionar, sempre). 
     2. Assistido. 
     3. Avaliado (com uma nota de 0 a 5). 
     4. Recomendado ou Não recomendado. 
   - Crie endpoints para mover o filme entre esses estados. 
 
5. Histórico de um Filme: 
   - Crie um endpoint que retorne o histórico completo de um filme, incluindo todas 
as ações realizadas (ex: adicionado, movido para assistido, avaliado, etc.) com 
timestamps e a identificação do usuário que realizou a ação. 
 
6. Swagger: 
   - Documente a API usando Swagger, incluindo exemplos de requisições e 
respostas para todos os endpoints. 
 
 
 
Endpoints sugeridos 
1. Filmes: 
 
   - `POST /filme` → Adiciona um filme à lista de desejos. Busca informações na API 
externa e gera um identificador único. 
   - `GET /filme` → Lista todos os filmes na lista de desejos. 
   - `GET /filme/:id` → Retorna detalhes de um filme específico. 
   - `PUT /filme/:id/estado` → Move o filme para um novo estado (ex: assistido, 
avaliado, recomendado). 
   - `POST /filme/:id/avaliar` → Avalia o filme com uma nota de 0 a 5. 
   - `GET /filme/:id/historico` → Retorna o histórico completo de um filme. 
 
2. Logs: 
   - `GET /logs` → Retorna todos os logs registrados (para fins de debug). 
 
Exemplo de funcionamento 
1. Adicionar um Filme: 
   - O usuário faz uma requisição `POST /filme` com o nome do filme. 
   - A API busca informações na API externa (TMDB) e adiciona o filme à lista de 
desejos com o estado "A assistir". 
   - Um identificador único é gerado e vinculado ao filme. 
   - O middleware registra a ação no log. 
 
2. Mover para Assistido: 
   - O usuário faz uma requisição `PUT /filme/:id/estado` com o novo estado 
"Assistido". 
   - O middleware registra a ação no log, vinculada ao identificador único do filme. 
 
3. Avaliar o Filme: 
   - O usuário faz uma requisição `POST /filme/:id/avaliar` com uma nota de 0 a 5. 
   - O middleware registra a ação no log, vinculada ao identificador único do filme. 
 
 
4. Consultar Histórico: 
   - O usuário faz uma requisição `GET /filme/:id/historico` e recebe o histórico 
completo do filme, incluindo todas as ações realizadas.