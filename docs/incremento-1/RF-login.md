# RF — Autenticação de usuário (Tela de Login)

> Documento de apoio ao código da tela de login. A descrição abaixo segue a
> estrutura usual de requisito funcional; antes da entrega ela deve ser
> transcrita para o **formulário padrão da disciplina**, conforme exigido no
> Incremento 1.

## Identificação

| Campo | Conteúdo |
| --- | --- |
| **Identificador** | RF-01 |
| **Nome** | Autenticar usuário |
| **Incremento** | 1 — Cadastro de usuário |
| **Ator principal** | Usuário cadastrado na plataforma |
| **Atores secundários** | Administrador da organização (aprova ou rejeita a solicitação de acesso) |
| **Tela** | `src/app/(auth)/login.tsx` |

## Descrição

Permite que um usuário já cadastrado acesse o Conecta+ informando e-mail e
senha. A tela também é o ponto de partida para o cadastro de novos usuários e
para a recuperação de conta, e é onde o usuário fica sabendo em que situação
está a sua solicitação de acesso à organização.

## Pré-condições

1. O aplicativo está instalado e aberto na tela de login.
2. Para autenticar com sucesso, o usuário já concluiu o cadastro na plataforma.

## Pós-condições

1. **Sucesso:** o usuário com acesso aprovado é encaminhado para a tela inicial.
2. **Cadastro não liberado:** o usuário permanece na tela de login e recebe a
   informação da situação da sua solicitação de acesso.
3. **Falha:** o usuário permanece na tela de login com a mensagem do erro
   ocorrido.

## Fluxo principal

| # | Ator | Ação |
| --- | --- | --- |
| 1 | Usuário | Abre o aplicativo e chega à tela de login. |
| 2 | Sistema | Exibe o logotipo, os campos "E-mail" e "Senha", o botão "Entrar" e os atalhos "Esqueci minha senha" e "Criar conta". |
| 3 | Usuário | Informa o e-mail e a senha. |
| 4 | Usuário | Aciona "Entrar". |
| 5 | Sistema | Valida o preenchimento dos campos. |
| 6 | Sistema | Envia as credenciais ao servidor e exibe o indicador de progresso no botão. |
| 7 | Sistema | Recebe a confirmação e verifica a situação do usuário perante a organização. |
| 8 | Sistema | Encaminha o usuário aprovado para a tela inicial. |

## Fluxos alternativos

### FA-01 — Campo obrigatório não preenchido ou inválido

Ocorre no passo 5. O sistema não envia a requisição, destaca o campo com
problema e exibe a mensagem de correção logo abaixo dele. A mensagem é removida
assim que o usuário volta a digitar naquele campo.

Mensagens:

- `Informe o seu e-mail.`
- `Informe um e-mail válido, como nome@dominio.com.`
- `Informe a sua senha.`
- `A senha deve ter ao menos 8 caracteres.`

### FA-02 — Credenciais incorretas

Ocorre no passo 7. O sistema exibe a faixa "Não foi possível entrar" com a
mensagem `E-mail ou senha incorretos. Verifique os dados e tente novamente.`
A mesma mensagem é usada para e-mail inexistente e para senha incorreta, para
não revelar quais contas existem na plataforma.

### FA-03 — Solicitação de acesso aguardando aprovação

Ocorre no passo 7, quando as credenciais estão corretas e a situação do usuário
é `PENDENTE_APROVACAO`. O sistema não encaminha para a tela inicial: exibe a
faixa "Cadastro em análise" informando que a solicitação aguarda a aprovação do
administrador da organização, e limpa o campo de senha.

### FA-04 — Solicitação de acesso recusada

Ocorre no passo 7, com a situação `ACESSO_REJEITADO`. O sistema exibe a faixa
"Solicitação recusada" indicando a organização que recusou o acesso e orienta o
usuário a falar com ela ou solicitar acesso a outra.

### FA-05 — Usuário sem organização vinculada

Ocorre no passo 7, com a situação `SEM_ORGANIZACAO`. O sistema exibe a faixa
"Falta vincular uma organização", informando que o cadastro está concluído e que
é preciso solicitar acesso a uma organização.

### FA-06 — Conta desativada

Ocorre no passo 7, quando a conta foi desativada por um administrador do
sistema. Mensagem: `Esta conta foi desativada. Procure o administrador do sistema.`

### FA-07 — Falha de comunicação com o servidor

Ocorre no passo 6. Mensagem: `Não foi possível falar com o servidor. Verifique a
sua conexão e tente novamente.` Quando o servidor responde com erro inesperado,
a mensagem é `O servidor não conseguiu responder agora. Tente novamente em instantes.`

### FA-08 — Usuário sem cadastro

Ocorre no passo 3. O usuário aciona "Criar conta" e é encaminhado para o cadastro
na plataforma.

### FA-09 — Usuário esqueceu a senha

Ocorre no passo 3. O usuário aciona "Esqueci minha senha" e é encaminhado para a
recuperação de conta.

## Regras de negócio

| ID | Regra |
| --- | --- |
| RN-01 | O e-mail é normalizado (sem espaços nas pontas e em caixa baixa) antes de ser enviado ao servidor. |
| RN-02 | A senha tem no mínimo 8 caracteres. |
| RN-03 | Erros de autenticação usam mensagem única, sem indicar se o e-mail existe. |
| RN-04 | Somente o usuário com situação `ATIVO` entra no aplicativo. |
| RN-05 | Enquanto a requisição está em andamento, os campos ficam bloqueados e o botão exibe o progresso, impedindo envio duplicado. |
| RN-06 | Ao exibir um aviso de situação de acesso, o campo de senha é limpo. |

## Situações do usuário (modelo)

Definidas em `src/models/usuario.ts`:

| Situação | Significado |
| --- | --- |
| `ATIVO` | Cadastro aprovado por um administrador; o usuário pode usar o aplicativo. |
| `SEM_ORGANIZACAO` | Cadastro concluído, mas sem solicitação de acesso a nenhuma organização. |
| `PENDENTE_APROVACAO` | Solicitação enviada, aguardando decisão do administrador da organização. |
| `ACESSO_REJEITADO` | Solicitação recusada pelo administrador da organização. |

## Requisitos não funcionais atendidos

| Categoria | Como é atendido |
| --- | --- |
| **Usabilidade** | Título no topo, ação principal destacada e campos agrupados por assunto. |
| **Usabilidade** | Validação exibida junto do campo que precisa de correção. |
| **Segurança** | Senha oculta por padrão, com alternância explícita de visibilidade; mensagem de erro que não revela quais contas existem. |
| **Responsividade** | Layout verificado em telas de 320, 390 e 430 pontos de largura, sem perda de acesso às ações. |
| **Compatibilidade** | Implementado em React Native/Expo, executável em Android e iOS. |
| **Manutenibilidade** | Tela, componentes, regras (hook) e serviços separados, com a nomenclatura definida na proposta. |

## Casos de teste

| ID | Cenário | Resultado esperado | Evidência |
| --- | --- | --- | --- |
| CT-L01 | Abrir a tela de login | Logotipo, campos e ações são exibidos | `evidencias/01-inicial.png` |
| CT-L02 | Entrar com e-mail inválido e senha curta | Mensagens exibidas junto de cada campo; requisição não é enviada | `evidencias/02-validacao.png` |
| CT-L03 | Entrar com senha incorreta | Faixa "Não foi possível entrar" | `evidencias/03-credenciais-invalidas.png` |
| CT-L04 | Entrar com cadastro aguardando aprovação | Faixa "Cadastro em análise"; acesso não liberado | `evidencias/04-pendente-aprovacao.png` |
| CT-L05 | Entrar com solicitação recusada | Faixa "Solicitação recusada"; acesso não liberado | `evidencias/05-acesso-rejeitado.png` |
| CT-L06 | Entrar sem organização vinculada | Faixa "Falta vincular uma organização" | `evidencias/06-sem-organizacao.png` |
| CT-L07 | Entrar com cadastro aprovado | Usuário encaminhado para a tela inicial | `evidencias/07-acesso-liberado.png` |
| CT-L08 | Acionar "Criar conta" | Navegação para o cadastro de usuário | — |
| CT-L09 | Acionar "Esqueci minha senha" | Navegação para a recuperação de conta | — |

## Pendências desta etapa

- Publicar a rota `POST /auth/login` na API (NestJS) e apontar
  `EXPO_PUBLIC_API_URL` para ela.
- Implementar as telas de cadastro de usuário e de recuperação de conta, hoje
  presentes apenas como destino de navegação.
- Transcrever este documento para o formulário padrão da disciplina.
