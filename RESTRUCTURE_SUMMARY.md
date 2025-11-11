# Sistema de Atestados - Estrutura Reorganizada

## Visão Geral

O sistema foi reorganizado para ter interfaces específicas para diferentes tipos de usuários:

### 🎓 **Estudantes**
- **Página Principal**: `/atestados` - Lista seus próprios atestados
- **Criar Atestado**: `/atestados/criar` - Formulário para enviar novos atestados
- **Funcionalidades**:
  - Visualizar status dos atestados (pendente, aprovado, rejeitado)
  - Upload de imagem do atestado
  - Ver observações administrativas
  - Estatísticas resumidas

### 👨‍💼 **Administradores**
- **Dashboard Principal**: `/dashboard` - Painel administrativo
- **Revisar Atestados**: `/admin/atestados` - Lista todos os atestados para revisão
- **Gerenciar Usuários**: `/admin/usuarios` - Gestão de usuários
- **Funcionalidades**:
  - Aprovar/rejeitar atestados
  - Adicionar observações administrativas
  - Visualizar informações completas dos estudantes

## 🔄 **Redirecionamentos Automáticos**

### Dashboard (`/dashboard`)
- ✅ **Administradores**: Acesso ao painel administrativo
- 🔄 **Estudantes**: Redirecionados automaticamente para `/atestados`

### Atestados (`/atestados`)
- ✅ **Estudantes**: Interface para gerenciar seus atestados
- 🔄 **Administradores**: Redirecionados automaticamente para `/dashboard`

## 📁 **Estrutura de Arquivos**

```
app/(private)/
├── dashboard/
│   └── page.tsx                    # Dashboard apenas para admins
├── atestados/
│   ├── page.tsx                    # Lista de atestados (estudantes)
│   └── criar/
│       └── page.tsx                # Criar novo atestado
└── admin/
    ├── page.tsx                    # Painel admin existente
    ├── atestados/
    │   └── page.tsx                # Revisar atestados (admins)
    └── usuarios/
        └── page.tsx                # Gerenciar usuários
```

## 🔗 **Rotas da API**

### Existentes
- `GET /api/profile` - Perfil do usuário
- `GET /api/atestados` - Atestados do usuário logado
- `POST /api/atestados` - Criar novo atestado

### Novas
- `GET /api/admin/atestados` - Todos os atestados (apenas admins)
- `PATCH /api/admin/atestados/[id]/review` - Revisar atestado (aprovar/rejeitar)

## 🎨 **Melhorias de Interface**

### Para Estudantes
- Interface limpa focada em suas próprias ações
- Botão prominente para criar novo atestado
- Cards de estatísticas (pendentes, aprovados, rejeitados)
- Preview de imagens do atestado
- Feedback visual claro sobre status

### Para Administradores
- Dashboard focado em ações administrativas
- Interface para revisar atestados em lote
- Modais para aprovação/rejeição com observações
- Visualização completa dos dados dos estudantes
- Histórico de revisões

## 🔐 **Controle de Acesso**

- Verificação automática do tipo de usuário em cada página
- Redirecionamentos baseados em permissões
- APIs protegidas com verificação de admin
- Tokens JWT para autenticação

## 🚀 **Próximos Passos**

1. Testar todas as funcionalidades
2. Implementar notificações em tempo real
3. Adicionar filtros na interface admin
4. Implementar histórico de ações
5. Adicionar métricas e relatórios
