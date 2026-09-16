# RF — Configurações de usuário

## Funcionalidades

| ID | Funcionalidade | Implementação |
| --- | --- | --- |
| RF-CU01 | Alterar dados pessoais | A tela Perfil permite alterar nome e e-mail pela rota autenticada `PATCH /usuarios/me`. |
| RF-CU02 | Definir tema preferido | A tela Perfil salva `claro`, `escuro` ou `sistema` no usuário do MongoDB e no armazenamento seguro local. |
| RF-CU03 | Trocar senha | A tela Alterar senha exige a senha atual e envia a nova senha para `PATCH /usuarios/me/senha`. |
| RF-CU04 | Recuperar conta | O formulário envia o e-mail para `POST /auth/recuperar-conta`. O backend envia um link temporário com Nodemailer. |
| RF-CU05 | Redefinir senha | O link abre `redefinir-senha` com um token e a nova senha é enviada para `POST /auth/redefinir-senha`. |

## Regras de segurança

- Rotas de perfil e troca de senha exigem JWT no cabeçalho `Authorization`.
- O token de login fica no Expo SecureStore.
- A troca de senha exige a senha atual.
- O token de recuperação usa 32 bytes aleatórios e expira após 30 minutos.
- O banco armazena apenas o hash SHA-256 do token de recuperação.
- A resposta da solicitação de recuperação não informa se o e-mail existe.
- As senhas são armazenadas com hash bcrypt.

## Configuração do e-mail

O backend lê as seguintes variáveis:

```env
MAIL_HOST=smtp.exemplo.com
MAIL_PORT=587
MAIL_USER=usuario-smtp
MAIL_PASS=senha-smtp
MAIL_FROM=Conecta+ <nao-responda@exemplo.com>
APP_RESET_URL=http://localhost:8081/redefinir-senha
```

Sem `MAIL_HOST`, o Nodemailer usa transporte JSON e o backend imprime o link de
recuperação no terminal. Esse modo serve apenas para desenvolvimento local.

O endereço de recuperação enviado por e-mail deve usar `http://` ou `https://`.
Clientes como o Gmail podem remover links com protocolos personalizados, como
`conectamais://`. Em um dispositivo físico, substitua `localhost` pelo endereço
acessível do computador ou por uma URL HTTPS publicada.

## Casos de teste essenciais

| ID | Cenário | Resultado esperado |
| --- | --- | --- |
| CT-CU01 | Atualizar nome e e-mail válidos | O perfil atualizado permanece salvo ao entrar novamente. |
| CT-CU02 | Usar um e-mail já cadastrado | O sistema recusa a alteração e informa o conflito. |
| CT-CU03 | Selecionar tema escuro | O aplicativo aplica o tema e mantém a escolha após reiniciar. |
| CT-CU04 | Informar senha atual incorreta | O sistema não altera a senha. |
| CT-CU05 | Alterar senha corretamente | A senha antiga deixa de autenticar e a nova passa a funcionar. |
| CT-CU06 | Solicitar recuperação | O sistema exibe resposta neutra e envia o link quando a conta existe. |
| CT-CU07 | Usar token válido | A senha é redefinida e o token deixa de funcionar. |
| CT-CU08 | Usar token vencido ou repetido | O sistema recusa a redefinição. |
