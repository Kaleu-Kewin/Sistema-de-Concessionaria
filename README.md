# 🚗 Sistema de Concessionária
Sistema completo de gerenciamento veículos desenvolvido com React + TypeScript no frontend e Flask + SQLAlchemy no backend.

## 📋 Descrição

O sistema é uma aplicação web Full-Stack para gerenciamento de veículos, incluindo controle de clientes, usuários, vendas e permissões. O sistema oferece uma interface moderna e responsiva com funcionalidades completas de CRUD.

## 📸 Demonstrações Visuais - Sistema ainda incompleto.

### Login e Cadastro

<p align="center">
  <img src="https://github.com/user-attachments/assets/12c0af57-ff5d-49aa-82da-1a535ec2c134" width="49%" style="display:inline-block; margin-right: 1px;" />
  <img src="https://github.com/user-attachments/assets/8f689805-26f1-4efd-b3c2-56752cda973f" width="49%" style="display:inline-block;" />
</p>

### Dashboard
<img src="https://github.com/user-attachments/assets/2412f120-e0b3-4181-bb2e-548d9d35c291" width="100%" />

### Clientes
<img src="https://github.com/user-attachments/assets/27f3d8b9-e916-4a47-9bdf-8e23884b020a" width="100%" />

### Usuários
<img src="https://github.com/user-attachments/assets/21c22361-7223-473d-8744-c2a21c975876" width="100%" />

###Veículos
<img src="https://github.com/user-attachments/assets/7fea4a92-3ac3-4ef6-bf5a-5c0dfcf9c0d4" width="100%" />

### Vendas
<img src="https://github.com/user-attachments/assets/d5a75e84-3214-452d-954c-5d1959725d4a" width="100%" />

### Perfil
<img width="1914" height="946" alt="Capturar_2025_08_04_18_38_10_207" src="https://github.com/user-attachments/assets/45cd353b-53b0-4be3-bd91-8d40b5c2ee77" />

## 🏗️ Arquitetura

```
Sistema de Concessionária/
├── frontend/    # Aplicação React + TypeScript
├── backend/     # API Flask + SQLAlchemy
└── README.md
```

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React** 
- **TypeScript** 
- **Vite** - 
- **Tailwind CSS**
- **Shadcn/ui** - Componentes UI baseados em Radix UI
- **Lucide React** - Ícones
- **Recharts** - Gráficos e visualizações
- **Sonner** - Notificações toast

### Backend
- **Python**
- **Flask**
- **Flask-SQLAlchemy**
- **Flask-CORS** 
- **SQLite** - Banco de dados (em desenvolvimento)

## 🛣️ Rotas da API

### Autenticação
- `POST /api/login` - Login de usuário
- ...

### Veículos
- `GET /api/veiculos` - Listar veículos (com busca opcional)
- `POST /api/veiculos` - Criar novo veículo
- `PUT /api/veiculos/<id>` - Atualizar veículo
- `DELETE /api/veiculos/<id>` - Excluir veículo

### Clientes
- `GET /api/clientes` - Listar clientes (com busca opcional)
- `POST /api/clientes` - Criar novo cliente
- `PUT /api/clientes/<id>` - Atualizar cliente
- `DELETE /api/clientes/<id>` - Excluir cliente

### Usuários
- `GET /api/usuarios` - Listar usuários (com busca opcional)
- `POST /api/usuarios` - Criar novo usuário
- `PUT /api/usuarios/<id>` - Atualizar usuário
- `DELETE /api/usuarios/<id>` - Excluir usuário

### Vendas
- `GET /api/vendas` - Listar vendas (com busca opcional)
- `POST /api/vendas` - Criar nova venda
- `PUT /api/vendas/<id>` - Atualizar venda
- `DELETE /api/vendas/<id>` - Excluir venda

## 📁 Estrutura do Projeto

### Frontend (`/frontend`)
```
src/
├── components/        # Componentes reutilizáveis
├── contexts/          # Contextos React (Auth, etc.)
├── hooks/             # Custom hooks
├── lib/               # Utilitários e configurações
├── pages/             # Páginas da aplicação
│   ├── Dashboard.tsx
│   ├── Login.tsx
│   ├── Clientes.tsx
│   ├── Usuarios.tsx
│   ├── Veiculos.tsx
│   ├── Vendas.tsx
│   └── Perfil.tsx
└── App.tsx            # Componente principal
```

### Backend (`/backend`)
```
src/
├── database/     # Configuração do banco de dados
├── decorators/   # Decoradores personalizados
├── enums/        # Enumerações do sistema
├── models/       # Modelos SQLAlchemy
├── routes/       # Rotas da API
├── services/     # Lógica de negócio
├── utils/        # Utilitários
└── __init__.py   # Configuração da aplicação Flask
```

## 📱 Funcionalidades

### Dashboard
- Visão geral do sistema
- Estatísticas de vendas
- Gráficos e métricas

### Gestão de Veículos
- Cadastro, edição e exclusão de veículos
- Controle de status (disponível, vendido, manutenção)
- Filtros por tipo, marca, modelo
- Upload de imagens

### Gestão de Clientes
- Cadastro completo de clientes
- Controle de saldo
- Histórico de compras
- Filtros e busca avançada

### Gestão de Usuários
- Sistema de roles e permissões
- Controle de acesso
- Diferentes tipos de usuário

### Gestão de Vendas
- Registro de vendas
- Relacionamento veículo-cliente
- Controle de status de venda
- Relatórios

## 🔒 Segurança

- Autenticação JWT
- Rotas protegidas
- Validação de dados
- Sanitização de inputs
- Controle de acesso baseado em roles
