# Tech Challenge - Oficina Mecânica - MVP Back-end

## Visão geral

Este projeto apresenta o MVP de back-end para uma oficina mecânica de médio porte, com foco na organização do atendimento, controle de ordens de serviço, gestão de clientes, veículos, serviços, peças e insumos, além do fluxo de orçamento e aprovação.

A solução foi estruturada com **Domain-Driven Design (DDD)**, **Event Storming**, **contextos delimitados**, **arquitetura em camadas** e **testes automatizados** nos domínios críticos.

---

## Problema de negócio

A oficina enfrenta dificuldades operacionais como:

- atendimento desorganizado
- falhas no controle de peças e insumos
- dificuldade no acompanhamento do status da ordem de serviço
- perda de histórico de clientes e veículos
- ineficiência no fluxo de orçamentos e autorizações

---

## Objetivo do MVP

Desenvolver a primeira versão do back-end do sistema da oficina, contemplando:

- gestão de clientes
- gestão de veículos
- catálogo de serviços
- controle de peças e insumos
- criação e acompanhamento de ordens de serviço
- geração, envio e aprovação de orçamento
- autenticação administrativa
- documentação da API
- testes automatizados

---

## Abordagem arquitetural

A solução foi construída como um **back-end monolítico modular**, organizado em camadas:

- **Interface / Apresentação**
- **Aplicação**
- **Domínio**
- **Infraestrutura**
- **Persistência**

### Contextos principais

- Customers
- Vehicles
- Services
- Inventory
- Work Orders
- Budgets
- Auth / Administração

### Decisões de modelagem relevantes

- **Ordem de Serviço** é o núcleo do domínio
- **Veículo** é agregado próprio
- **Orçamento** é agregado próprio, separado da Ordem de Serviço
- itens de serviço e peças/insumos pertencem ao agregado de Ordem de Serviço
- movimentações pertencem ao agregado de Estoque

---

## Stack utilizada

- **NestJS**
- **TypeScript**
- **Prisma ORM**
- **PostgreSQL**
- **JWT**
- **Swagger / OpenAPI**
- **Jest**
- **Docker / docker-compose**

---

## Funcionalidades implementadas

### Autenticação
- login administrativo com JWT
- proteção de rotas administrativas

### Clientes
- CRUD de clientes
- validação de CPF/CNPJ
- busca por documento

### Veículos
- CRUD de veículos
- validação de placa
- associação ao cliente
- busca por placa e por cliente

### Serviços
- CRUD de serviços
- preço base
- tempo estimado de execução

### Estoque
- CRUD de peças e insumos
- entrada de estoque
- ajuste de estoque
- movimentações
- consulta de estoque baixo

### Ordens de Serviço
- criação da OS
- associação com cliente e veículo
- inclusão de serviços
- inclusão de peças/insumos previstos
- transições de status
- tracking da OS para consulta do cliente

### Orçamentos
- geração automática do orçamento com base na OS
- envio para aprovação
- aprovação ou rejeição

---

## Qualidade e testes

O projeto foi validado com testes automatizados nos domínios críticos.

### Resultado atual
- 10 suites de teste
- 119 testes passando
- 0 falhas
- cobertura acima de 80% nos domínios críticos dos services principais

---

## Pré-requisitos

Para executar o projeto, é recomendado ter instalado:

- Node.js 20+
- npm
- Docker
- Docker Compose

---

## Variáveis de ambiente

Crie um arquivo `.env` com base em `.env.example`.

### Exemplo para execução local fora do Docker

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/oficina_db?schema=public"
JWT_SECRET="troque-este-segredo"
PORT=3000