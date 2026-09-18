# Parte 2 — Permissões de organizações

Esta entrega corrige as permissões da API de organizações. A integração do login
com múltiplos vínculos e as telas de solicitação e gerenciamento ficam nas próximas
partes. Os testes desta etapa são feitos na API, e não pelos botões dessas telas.

## Regras implementadas

- Todas as rotas de organizações exigem Bearer token válido e conta ativa.
- A conta e seu tipo atual são consultados novamente: um token antigo não mantém
  acesso após desativação da conta nem mantém o papel de administrador do sistema.
- Criar organização usa a identidade da sessão e sempre gera status PENDENTE.
  O criador fica como ADMIN/APROVADO no vínculo; a organização ainda depende da
  aprovação do administrador do sistema para receber solicitações.
- O catálogo lista somente organizações APROVADAS, sem dados pessoais dos membros.
- Consultar detalhes com a lista de membros exige ser ADMIN/APROVADO daquela organização.
- Solicitar acesso usa a identidade da sessão e sempre gera MEMBRO/PENDENTE.
- O usuário pode ter vínculos com várias organizações, mas somente um por organização.
- Solicitações rejeitadas não podem ser reenviadas nem reabertas pela rota de decisão.
- Somente ADMIN/APROVADO da organização pode aprovar/rejeitar solicitações PENDENTES.
- Organizações PENDENTES ou REVOGADAS não recebem nem analisam solicitações.
- Alterar dados/status globais da organização ou revogá-la exige ADMIN_SISTEMA.
- A rota de decisão não altera membros já aprovados, inclusive administradores.
  Remover vínculos será implementado na etapa de gerenciamento, com proteção do
  último administrador.

## Testes automáticos

Na pasta `backend`:

```powershell
npm test
npm run build
npm run lint
```

Na raiz do projeto:

```powershell
npm run typecheck
npm run lint
```

Os testes de organizações cobrem permissões, identidade da sessão, rejeição
definitiva, múltiplas organizações e filtros para operações concorrentes.
Os testes HTTP executam os guards reais e a validação, com dados simulados.
Eles não conectam a um MongoDB real. O roteiro abaixo verifica a persistência real.

Verificação realizada nesta entrega: 31 testes passaram; compilação e lint do
backend passaram. A verificação completa de tipos do backend, incluindo a pasta
`test`, encontra um problema preexistente em `test/app.e2e-spec.ts`: o import
`supertest/types` não é resolvido. Esse arquivo antigo também espera a rota de
exemplo `Hello World!`; a suíte e2e antiga não foi usada como validação desta etapa.

## Teste manual com Postman ou Insomnia

### Preparação

1. Configure `MONGODB_URI` e `JWT_SECRET` no ambiente do backend.
2. Na pasta `backend`, execute `npm run start:dev`. A URL padrão é
   `http://localhost:3000`.
3. Use contas de teste: A (criador/admin da organização), B (solicitante), C
   (outro administrador de organização) e S (administrador do sistema).
4. A, B e C podem ser criadas por `POST /usuarios` com JSON:

```json
{"nome":"Usuário A","email":"usuario-a@example.com","senha":"Teste12345!"}
```

Repita com nomes/e-mails diferentes. S deve ser uma conta de teste já configurada
como `tipo: ADMIN_SISTEMA` no banco. O cadastro público não concede esse papel.
Caso ela não exista, o responsável pelo banco deve preparar essa conta no ambiente
de testes. Não é necessário mudar o papel global de A ou C: ser administrador de
organização é um vínculo separado.

5. Faça `POST /auth/login` para cada conta com `email` e `senha`. Guarde o
   `accessToken` e o `usuario.id` de cada resposta. Nas requisições protegidas,
   escolha **Authorization → Bearer Token** e use o token da conta indicada.
   Para corpos JSON, use `Content-Type: application/json`.

### Fluxo principal

1. Com token A, faça `POST /organizacoes` com `{"nome":"Organização A"}`.
   Espere 201, status PENDENTE, `criadaPor` igual ao ID de A e vínculo ADMIN/APROVADO
   para A. Guarde o `_id` como ID_ORG_A.
2. Com token B, tente `POST /organizacoes/ID_ORG_A/membros` com `{}`.
   Espere 403, porque a organização ainda está pendente.
3. Com token S, faça `PATCH /organizacoes/ID_ORG_A` com `{"status":"APROVADA"}`.
   Espere 200. Com token A ou B, essa alteração global deve retornar 403.
4. Com token B, faça `GET /organizacoes`. A organização deve aparecer, sem
   o campo `membros` e sem os e-mails de seus integrantes.
5. Com token B, faça `POST /organizacoes/ID_ORG_A/membros` com `{}`.
   Espere 201, com o ID de B, papel MEMBRO e status PENDENTE.
6. Repita o pedido. Espere 409, sem criar outro vínculo.
7. Com token B ou C, tente `PATCH /organizacoes/ID_ORG_A/membros/ID_USUARIO_B`
   com `{"status":"APROVADO"}`. Espere 403.
8. Com token A, faça a mesma aprovação. Espere 200.
9. Com token A, faça `GET /organizacoes/ID_ORG_A`. Confira B como APROVADO
   e com `aprovadoEm` preenchido. Com token B ou C, essa consulta administrativa
   deve retornar 403. Reiniciar a API e repetir a consulta deve preservar o vínculo.

### Rejeição e múltiplas organizações

1. Com token C, crie Organização B. Aprove-a usando S.
2. Com token B, solicite acesso à Organização B: deve retornar 201 mesmo que
   B já esteja aprovado na Organização A.
3. Com token A, tente decidir essa solicitação na Organização B: espere 403.
4. Com token C, rejeite usando `{"status":"REJEITADO"}`: espere 200.
5. Com token B, tente solicitar novamente à Organização B: espere 409.
6. Com token C, tente aprovar a solicitação já rejeitada: espere 409.
7. Consulte a Organização A com token A: B deve continuar APROVADO nela.

### Verificações adicionais

| Tentativa | Resultado esperado |
| --- | --- |
| Chamar qualquer rota de organizações sem token ou com token inválido/expirado | 401 |
| Usar token de conta que foi desativada no banco | 401 |
| Enviar `usuarioId` de outra pessoa e `papel: ADMIN` ao solicitar entrada em uma organização nova para o solicitante | Dados ignorados; vínculo criado para a pessoa conectada como MEMBRO/PENDENTE |
| Enviar `criadaPor` de outra pessoa e `status: APROVADA` ao criar organização | Dados ignorados; criada pela pessoa conectada como PENDENTE |
| Enviar `status: PENDENTE` na rota de decisão | 400 |
| Usar a decisão para rejeitar o próprio administrador já aprovado | 409; vínculo preservado |
| Revogar a organização com S e tentar solicitar/analisar acesso | 403 |

Solicitações e decisões simultâneas possuem filtros de atualização para evitar
duplicação e sobrescrita de decisões. A suíte automatizada verifica os filtros;
um teste de concorrência real requer executar as requisições contra o MongoDB.

## Compatibilidade com o aplicativo

A chamada existente de criação de organização agora envia o token salvo no login.
Para verificar, entre novamente no app, abra **Criar organização**, preencha e envie.
A organização deve ser criada como PENDENTE com o usuário conectado como criador.
A tela não depende mais de um identificador do usuário recebido pela navegação.

O login ainda não consulta os vínculos e pode exibir “Acesso liberado” sem refletir
aprovações/rejeições. Esse ajuste pertence à parte 3; não use essa mensagem como
evidência de aprovação nesta etapa. As rotas de outros módulos, como comissões,
não foram auditadas nem protegidas por esta entrega.
