# 🚀 Trabalho de Microsserviços

Este projeto consiste em uma arquitetura baseada em microsserviços utilizando Node.js, Docker, CI/CD e observabilidade com Prometheus e Grafana.

O sistema foi desenvolvido para gerenciamento de salas e reservas, utilizando uma estrutura desacoplada e escalável.

---

# 📋 Microsserviços

## 🔐 API Gateway
Responsável pela autenticação, roteamento e observabilidade.

### Funcionalidades
- Autenticação JWT
- Middleware de autorização
- Proxy para microsserviços
- Swagger
- Métricas Prometheus
- Integração com Grafana

---

## 🏢 Rooms Service
Responsável pelo gerenciamento das salas.

### Funcionalidades
- Cadastro de salas
- Edição de salas
- Exclusão de salas
- Ativação/Inativação
- Listagem de salas

---

## 📅 Bookings Service
Responsável pelo gerenciamento das reservas.

### Funcionalidades
- Criar reservas
- Editar reservas
- Cancelar reservas
- Validação de conflitos de horário
- Controle de disponibilidade

---

# 🛠️ Tecnologias Utilizadas

- Node.js
- Express
- PostgreSQL
- Sequelize
- Docker
- Docker Compose
- GitHub Actions
- SonarCloud
- Prometheus
- Grafana
- Swagger

---

# 🌳 Fluxo de Branches

Projeto organizado utilizando Git Flow:

| Branch | Objetivo |
|---|---|
| feature/* | Desenvolvimento de funcionalidades |
| develop | Ambiente DEV |
| staging | Validação intermediária |
| release | Preparação para homologação |
| main | Ambiente HOMOL |

---

# 🔄 CI/CD

Pipeline automatizado utilizando GitHub Actions:

- Build automático
- Execução de testes
- Cobertura de testes
- SonarCloud
- Build Docker
- Publicação de imagens

## Deploy Automático

| Branch | Ambiente |
|---|---|
| develop | DEV |
| main | HOMOL |

---

# 🐳 Docker

Todos os microsserviços foram containerizados.

Cada serviço possui:
- Dockerfile próprio
- Build independente
- Execução isolada

O ambiente completo é iniciado via Docker Compose.

---

# 🚀 Como Executar o Projeto

## 1. Clonar o repositório

```bash
git clone https://github.com/lk4trina/trabalho-microsservico.git
```

---

## 2. Executar os containers

```bash
docker-compose up --build
```

---

# 🌐 Serviços Disponíveis

| Serviço | Porta |
|---|---|
| API Gateway | 3000 |
| Rooms Service | 3002 |
| Bookings Service | 3001 |
| Back For Front | 3003 |
| PostgreSQL | 5432 |
| Prometheus | 9090 |
| Grafana | 3004 |

---

# 🔒 Segurança

- JWT Authentication
- GitHub Secrets
- Dependabot habilitado
- Swagger restrito por ambiente

---

# 🧪 Testes

Projeto possui:
- Testes unitários
- Testes de integração
- Testes E2E com Selenium

Cobertura gerada automaticamente no pipeline CI.

---

# 📁 Estrutura do Projeto

```bash
backend/
 ├── api-gateway
 ├── rooms-service
 ├── bookings-service
 └── back-for-front
```
