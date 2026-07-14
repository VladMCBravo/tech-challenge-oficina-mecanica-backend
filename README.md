# Tech Challenge - Oficina Mecanica - MVP Back-end (Fases 1 e 2)

## 1. Visao Geral (Fase 1)

Este projeto apresenta o MVP de back-end para uma oficina mecanica de medio porte, focado na organizacao do atendimento, controle de ordens de servico, gestao de clientes, veiculos, servicos, pecas e insumos, alem do fluxo de orcamento e aprovacao.

A solucao inicial foi estruturada com Domain-Driven Design (DDD), Event Storming, contextos delimitados, arquitetura em camadas e testes automatizados nos dominios criticos. O nucleo do dominio e a Ordem de Servico (OS), acompanhada de agregados como Veiculos, Clientes e Orcamentos.

---

## 2. Problema de Negocio

A oficina enfrenta dificuldades operacionais decorrentes de processos manuais ou pouco integrados, incluindo:
- Atendimento desorganizado.
- Falhas no controle de pecas e insumos.
- Dificuldade no acompanhamento do status da ordem de servico.
- Perda de historico de clientes e veiculos.
- Ineficiencia no fluxo de orcamentos e autorizacoes.

---

## 3. Objetivo do MVP

Desenvolver a primeira versao do back-end do sistema da oficina, contemplando:
- Gestao de clientes e veiculos.
- Catalogo de servicos e controle de pecas/insumos.
- Criacao e acompanhamento de ordens de serviço.
- Geracao, envio e aprovacao de orcamentos.
- Autenticacao administrativa com JWT.
- Documentacao da API via Swagger e testes automatizados.

---

## 4. Evolucao da Aplicacao (Fase 2)

Com o aumento da demanda, expansao para novas unidades e a necessidade de garantir alta disponibilidade do ecossistema, a Fase 2 focou em transformar a aplicacao monolitica local em uma infraestrutura resiliente, escalavel e automatizada, pronta para operar em nuvem.

Os objetivos alcancados nesta fase incluem:
- **Refatoracao Estrutural:** Aplicacao de padroes estritos de Clean Code e principios de Clean Architecture.
- **Evolucao das APIs:** Implementacao de abertura de OS unificada, consulta publica de status, aprovacao de orcamentos via Webhook externo e listagem com ordenacao inteligente por criticidade operacional (ocultando registros finalizados).
- **Conteinerizacao Segura:** Otimizacao do Dockerfile utilizando Multi-stage build e execucao sob o privilegio restrito de USER node.
- **Orquestracao com Kubernetes:** Criacao de manifestos de Deployment, Services, Secrets e HPA (Horizontal Pod Autoscaler) baseado no consumo de recursos.
- **Infraestrutura como Codigo (IaC):** Provisionamento seguro em nuvem AWS utilizando scripts em Terraform.
- **Esteira Automatizada (CI/CD):** Configuracao de pipeline via GitHub Actions cobrindo validacao de qualidade (Lint), execucao de testes e simulacao de deploy (Dry Run).

---

## 5. Desenho da Arquitetura e Infraestrutura Proposta

A arquitetura foi projetada para a nuvem AWS, seguindo padroes estritos de isolamento de rede e defesa em profundidade:

```text
               [ INTERNET ]
                    │
                    ▼
          [ AWS Route 53 / DNS ]
                    │
                    ▼
       [ Application Load Balancer ]
                    │
   ┌────────────────VPC (10.0.0.0/16)────────────────┐
   │                                                 │
   │   ┌── Subnets Publicas (10.0.101.0/24) ─────┐   │
   │   │  - NAT Gateway                          │   │
   │   └─────────────────────────────────────────┘   │
   │                                                 │
   │   ┌── Subnets Privadas (10.0.1.0/24) ───────┐   │
   │   │                                         │   │
   │   │  [ Cluster EKS (Kubernetes 1.30) ]      │   │
   │   │     ├── Pods API NestJS (Replicas) <──┐ │   │
   │   │     └── Horizontal Pod Autoscaler     │ │   │
   │   │                                       │ │   │
   │   │  [ Banco de Dados Gerenciado ]        │ │   │
   │   │     └── AWS RDS PostgreSQL  ──────────┘ │   │
   │   │                                         │   │
   │   └─────────────────────────────────────────┘   │
   └─────────────────────────────────────────────────┘
```

---


Componentes da Arquitetura:
API Monolitica Modular (NestJS): Distribui as requisicoes em contextos delimitados de dominio conversando com a persistencia via Prisma ORM.
Networking (VPC via Terraform): Divisao clara em sub-redes publicas (para recepcao de trafego externo via Load Balancer) e privadas (onde residem as instancias de computacao e banco de dados), protegidas por NAT Gateway.
Compute (AWS EKS via Terraform): Cluster Kubernetes elastico configurado com Node Groups baseados em instancias EC2 equilibradas (t3.medium).
Database (AWS RDS via Terraform): Instancia isolada do PostgreSQL na camada de rede interna, com barreira de Security Groups amarrada exclusivamente ao trafego do EKS.

---

## 6. Estrutura do Repositorio

O projeto segue uma organizacao estrutural modular dividida por responsabilidades de codigo e infraestrutura:

Plaintext
├── .github/workflows/
│   └── deploy.yaml         # Esteira automatizada de CI/CD (GitHub Actions)
├── infra/                  # Camada de Infraestrutura como Codigo (Terraform IaC)
│   ├── eks.tf              # Configuracao do Cluster Kubernetes AWS EKS
│   ├── network.tf          # Recursos de VPC, Subnets, Gateways e Roteamento
│   ├── rds.tf              # Provisionamento da instancia PostgreSQL gerenciada
│   └── variables.tf        # Centralizacao de variaveis e parametrizacoes
├── k8s/                    # Camada de Orquestracao (Manifestos Kubernetes)
│   ├── db.yaml             # Pod e Service do Banco Local para Homologacao
│   ├── deployment.yaml     # Workload da API (InitContainers de Resiliencia + Limits)
│   ├── hpa.yaml            # Configuracao do Autoscaler Dinamico por CPU/Memoria
│   ├── secret.yaml         # Armazenamento seguro de credenciais sensiveis em Base64
│   └── service.yaml        # Abstracao de rede e exposicao da API via LoadBalancer
├── prisma/
│   └── schema.prisma       # Modelagem de dados e esquemas de persistencia (DDD)
├── src/                    # Codigo-fonte da aplicacao NestJS
├── Dockerfile              # Receita de Build Otimizada (Multi-Stage Build)
├── seed-full.js            # Script automatizado de povoamento massivo do banco
└── README.md               # Manual arquitetural e tecnico da solucao

---

## 7. Stack Utilizada

NestJS e TypeScript (Framework e Linguagem do Core)
Prisma ORM e PostgreSQL (Persistencia e Modelagem Relacional)
JWT (Autenticacao Administrativa Segura)
Swagger / OpenAPI (Documentacao viva das rotas)
Jest (Mecanismo de testes automatizados)
Kubernetes e Terraform (Orquestracao e Infraestrutura como Codigo)
GitHub Actions (Esteira de Integracao e Entrega Continua)

---

## 8. Funcionalidades Implementadas

Autenticacao e Clientes
Login administrativo com emissao de token JWT e protecao de rotas operacionais.
CRUD completo de clientes com validacao nativa de documentos estruturados (CPF/CNPJ).
Veiculos e Catalogo de Servicos
Vinculo de frotas e veiculos associados diretamente aos IDs de clientes proprietarios.
Gestao de precificacao base e tempo medio estimado de execucao para o catalogo de servicos.
Estoque e Insumos
Controle patrimonial de pecas com inteligencia de gatilho para consulta de itens com estoque baixo (Minimum Quantity).
Ordens de Servico e Webhooks de Orcamento
Abertura unificada de OS consolidando multiplos servicos e pecas sob um identificador unico.
Endpoint de Webhook dedicado para receber notificacoes assincronas de aprovacao ou rejeicao de orcamentos por canais externos.

---

## 9. Qualidade e Testes

O projeto foi validado com testes automatizados focados nos fluxos de negocios mais sensiveis da oficina.
Resultado Atual: Suites de testes unitarios e de integracao cobrindo os services centrais.
Cobertura: Acima de 80% nos dominios criticos principais (Work Orders, Budgets, Customers, Inventory).

---

## 10. Instrucoes de Execucao (Local via Docker Compose)

Para rodar o ambiente integrado da oficina de forma simples e isolada no computador local:
Certifique-se de possuir o Docker e o Docker Compose instalados.
Acesse a pasta raiz do projeto de codigo:
Bash
cd backend
Instancie o arquivo de variaveis locais de desenvolvimento:
Bash
cp .env.example .env
Suba toda a stack de conteineres:
Bash
docker-compose up --build
O Swagger estara disponivel para testes e consumo em: http://localhost:3000/api-docs

---

## 11. Instrucoes de Deploy (Kubernetes Local)

Para homologar e testar os manifestos de orquestracao localmente (Docker Desktop K8s, Minikube ou Kind), execute os comandos respeitando estritamente a ordem logica abaixo:
Injete as credenciais e segredos no cluster:
Bash
kubectl apply -f k8s/secret.yaml
Suba o banco de dados interno temporario:
Bash
kubectl apply -f k8s/db.yaml
Provisione os servicos de networking e exposicao de portas:
Bash
kubectl apply -f k8s/service.yaml
Ative o Autoscaler dinamico:
Bash
kubectl apply -f k8s/hpa.yaml
Realize o deploy do workload da API principal:
Bash
kubectl apply -f k8s/deployment.yaml
Nota de Resiliencia: O manifesto deployment.yaml conta com um mecanismo de InitContainer. A API NestJS aguardara ate que o banco PostgreSQL esteja pronto para receber conexoes. Assim que o banco responde, o InitContainer dispara as migrations de banco de dados automaticamente (prisma migrate deploy) antes de inicializar o conteiner principal da aplicacao.
Povoamento em Massa de Dados no Kubernetes:
Para injetar instancias de teste dentro do cluster Kubernetes, execute:
Bash
cat seed-full.js | kubectl exec -i deployment/oficina-backend -- node -

---

## 12. Automacao e Infraestrutura na Nuvem

CI/CD (GitHub Actions)
A esteira configurada em .github/workflows/deploy.yaml dispara gatilhos automatizados a cada novo commit enviado a branch principal. Para viabilizar a demonstracao academica e proteger contra custos financeiros imprevistos de recursos em nuvem, a pipeline utiliza a estrategia de Dry Run (Execucao Simulada) nas etapas finais:
Checkout ➔ Setup Node v22 ➔ Lint (Tolerante) ➔ Bateria de Testes ➔ Build Docker Otimizado (Dry Run) ➔ Deploy AWS EKS (Dry Run).
Terraform (IaC AWS)
Para realizar o provisionamento dos recursos de nuvem mapeados para producao:
Bash
cd infra
terraform init
terraform plan
terraform apply -auto-approve

---

## 13. Links Uteis da Entrega

Repositorio GitHub: https://github.com/VladMCBravo/tech-challenge-oficina-mecanica-backend
Documentacao da API (Swagger): Disponivel localmente na rota /api-docs
Planejamento Arquitetural (Miro - Fase 1): https://miro.com/app/board/uXjVGkf-Te8=/
Video Demonstrativo da Solucao (YouTube): https://youtu.be/CHflSmErDmU
(Nota: O video demonstrativo possui duracao de ate 15 minutos e cobre o deploy pratico, execucao bem-sucedida da pipeline de CI/CD, chamadas das novas rotas via Swagger e simulacao do escalonamento de replicas via K8s).

---

### Comandos para Sincronizar o GitHub

Abra o terminal na pasta `backend` e execute as instruções normais para atualizar o seu repositório:

```bash
git add README.md
git commit -m "docs: atualiza documentacao formal unificada no readme sem caracteres graficos emotivos"
git push origin main