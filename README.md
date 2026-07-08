# Kubernetes com CI/CD e Observabilidade

Este diretório contém os manifests Kubernetes para executar a aplicação de microsserviços no Minikube.

## Serviços contemplados

- PostgreSQL
- API Gateway
- Rooms Service
- Bookings Service
- Back For Front
- Prometheus
- Grafana

Os microsserviços da aplicação foram configurados com `replicas: 2`.

## Pré-requisitos

- Docker
- Minikube
- kubectl
- Ingress Controller do Minikube

## 1. Iniciar o Minikube

```bash
minikube start
minikube addons enable ingress
```

## 2. Apontar o Docker para o ambiente do Minikube

### Git Bash / Linux / macOS

```bash
eval $(minikube docker-env)
```

### Windows PowerShell

```powershell
minikube -p minikube docker-env --shell powershell | Invoke-Expression
```

Esse passo faz com que as imagens Docker sejam construídas diretamente dentro do Docker usado pelo Minikube.

## 3. Construir as imagens dos microsserviços

Execute na raiz do repositório:

```bash
docker build -t trabalho/api-gateway:local ./backend/api-gateway
docker build -t trabalho/rooms-service:local ./backend/rooms-service
docker build -t trabalho/bookings-service:local ./backend/bookings-service
docker build -t trabalho/back-for-front:local ./backend/back-for-front
```

As imagens usam `imagePullPolicy: Never`, porque serão usadas localmente dentro do Minikube.

## 4. Aplicar os manifests

```bash
kubectl apply -f k8s/00-namespace.yaml
kubectl apply -R -f k8s/
```

## 5. Verificar se os pods estão rodando

```bash
kubectl get pods -n trabalho-microsservico -o wide
kubectl get deployments -n trabalho-microsservico
kubectl get services -n trabalho-microsservico
kubectl get ingress -n trabalho-microsservico
```

Evidência esperada para os microsserviços:

```text
api-gateway        2/2 réplicas
rooms-service      2/2 réplicas
bookings-service   2/2 réplicas
back-for-front     2/2 réplicas
```

## 6. Configurar acesso por Ingress

Obtenha o IP do Minikube:

```bash
minikube ip
```

Adicione no arquivo `hosts` da máquina, substituindo `<MINIKUBE_IP>` pelo IP retornado:

```text
<MINIKUBE_IP> api.trabalho.local
<MINIKUBE_IP> rooms.trabalho.local
<MINIKUBE_IP> bookings.trabalho.local
<MINIKUBE_IP> bff.trabalho.local
<MINIKUBE_IP> prometheus.trabalho.local
<MINIKUBE_IP> grafana.trabalho.local
```

No Windows, o arquivo fica em:

```text
C:\Windows\System32\drivers\etc\hosts
```

No Linux/macOS, o arquivo fica em:

```text
/etc/hosts
```

## 7. URLs para demonstração

- API Gateway: http://api.trabalho.local
- Swagger do API Gateway: http://api.trabalho.local/api-docs
- Rooms Service: http://rooms.trabalho.local
- Bookings Service: http://bookings.trabalho.local
- BFF: http://bff.trabalho.local
- Prometheus: http://prometheus.trabalho.local
- Grafana: http://grafana.trabalho.local

Credenciais do Grafana:

```text
Usuário: admin
Senha: admin123
```

## 8. Validar Prometheus

Acesse:

```text
http://prometheus.trabalho.local/targets
```

Targets configurados inicialmente:

- `api-gateway:3000/metrics`
- `bookings-service:3001/metrics`

## 9. Alternativa sem Ingress: port-forward

Caso o Ingress não abra no Windows, use port-forward:

```bash
kubectl port-forward -n trabalho-microsservico service/api-gateway 3000:3000
kubectl port-forward -n trabalho-microsservico service/back-for-front 3003:3003
kubectl port-forward -n trabalho-microsservico service/prometheus 9090:9090
kubectl port-forward -n trabalho-microsservico service/grafana 3004:3000
```

Depois acesse:

- http://localhost:3000
- http://localhost:3003
- http://localhost:9090
- http://localhost:3004

## 10. Outros comandos úteis 

Ver múltiplos pods:

```bash
kubectl get pods -n trabalho-microsservico
```

Ver logs de um serviço:

```bash
kubectl logs -n trabalho-microsservico deployment/api-gateway
kubectl logs -n trabalho-microsservico deployment/rooms-service
kubectl logs -n trabalho-microsservico deployment/bookings-service
kubectl logs -n trabalho-microsservico deployment/back-for-front
```

Ver configurações aplicadas:

```bash
kubectl get configmap -n trabalho-microsservico
kubectl get secret -n trabalho-microsservico
```

Escalar manualmente para demonstrar escalabilidade:

```bash
kubectl scale deployment api-gateway --replicas=3 -n trabalho-microsservico
kubectl get pods -n trabalho-microsservico
```

Voltar para 2 réplicas:

```bash
kubectl scale deployment api-gateway --replicas=2 -n trabalho-microsservico
```

## 11. Limpar o ambiente

```bash
kubectl delete namespace trabalho-microsservico
```

## Observações importantes

1. Os dados sensíveis estão em `Secret`, como senha do banco, `DATABASE_URL`, `JWT_SECRET` e senha do Grafana.
2. Variáveis não sensíveis estão em `ConfigMap`, como portas, `NODE_ENV`, hosts internos e URLs entre serviços.
3. O banco PostgreSQL usa `PersistentVolumeClaim` para persistência local no Minikube.
4. Para observabilidade completa de todos os serviços futuramente serão adicionadas métricas também ali para o Rooms Service e Back For Front