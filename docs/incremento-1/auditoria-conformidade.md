# Auditoria de conformidade do Incremento 1

Análise realizada em 15/09/2026 a partir dos dois arquivos de apresentação da
disciplina, da proposta do Conecta+ e do código disponível no repositório.

## Critérios do professor

O Incremento 1 exige:

- documentação coerente com os requisitos e com o código desenvolvido;
- código funcional de acordo com a documentação;
- execução do aplicativo em Android e iOS;
- cadastro e gerenciamento de organizações;
- cadastro e gerenciamento de comissões e equipes;
- cadastro de usuário, solicitação de acesso e gerenciamento de usuários;
- troca de senha, recuperação de conta, alteração de dados pessoais e tema;
- status, relatórios, inicialização e reinicialização do sistema;
- diagrama de casos de uso e descrição de cada caso no formulário padrão;
- diagrama de classes e dicionário de dados;
- diagrama relacional e dicionário de dados;
- requisitos não funcionais do incremento;
- diagrama de sequência de todos os requisitos.

As tecnologias podem ser escolhidas pela equipe, desde que sejam gratuitas,
não exijam assinatura e não limitem os requisitos básicos. O sistema deve ser
mobile, gratuito, de código aberto, simples, responsivo e seguro.

## Resultado da verificação

| Área | Situação | Evidência e lacuna |
| --- | --- | --- |
| Android e iOS | Parcial | O app usa React Native e Expo. A interface agora usa `StyleSheet`, sem NativeWind. Ainda falta registrar um teste real em um Android e um iOS. |
| Cadastro de usuário | Parcial | Há tela, validação e chamada a `POST /usuarios`. Faltam solicitação de acesso a uma organização e telas administrativas para aprovação, rejeição e gerenciamento. |
| Autenticação | Parcial | Há login no app e `POST /auth/login` no backend. O próprio código registra como pendência a proteção das rotas com JWT e o armazenamento seguro do token. |
| Cadastro de organização | Parcial | Há formulário no app e CRUD no backend. Faltam telas e regras de autorização para o administrador do sistema aprovar, revogar e gerenciar organizações. |
| Comissões | Parcial | O backend possui CRUD e associação de membros. Faltam telas, controle de acesso e evidências dos fluxos de administração. |
| Configurações do usuário | Implementado, aguardando evidências | Há Perfil para nome, e-mail e tema, troca autenticada de senha e recuperação por e-mail com token temporário. Falta executar os casos de teste documentados em Android e iOS. |
| Informações do sistema | Não atendido | Não há interface ou fluxo documentado para status, relatórios, setup, reinicialização de subsistemas ou reset. |
| Persistência | Parcial | O backend possui schemas MongoDB para usuários, organizações e comissões. Falta demonstrar migração ou preservação dos dados entre incrementos e documentar backup. |
| Segurança | Parcial | Há hash de senha, JWT nas rotas do próprio perfil, token no SecureStore e recuperação sem enumeração de conta. Ainda faltam autorização por papel e proteção das rotas administrativas. |
| Testes | Parcial | Existem testes básicos do backend e evidências do login. A maior parte dos testes apenas verifica criação de módulos; faltam testes dos casos de uso e evidências dos fluxos exigidos. |
| Documentação UML | Não atendido no repositório | Não foram encontrados diagramas de casos de uso, sequência e classes com seus dicionários no formato de entrega. Há arquivos de modelagem em `EXTRAS`, mas eles não cobrem sozinhos toda a documentação exigida. |
| Requisitos não funcionais | Parcial | A proposta lista usabilidade, desempenho, disponibilidade, segurança, compatibilidade, manutenção, responsividade e custo. Falta atualizar a descrição por incremento e anexar evidências de execução e medição. |
| Coerência da documentação | Parcial | A proposta e o README foram atualizados para `StyleSheet`. O arquivo `RF-login.md` ainda precisa ser transcrito para o formulário padrão da disciplina. |

## Mudança de tecnologia de interface

O projeto deixou de usar NativeWind e Tailwind. Os estilos agora são definidos
com `StyleSheet` e as cores e fontes continuam centralizadas em
`src/constants/theme.ts`. Foram removidos os plugins do Babel e Metro, os tipos,
o CSS global, a configuração do Tailwind e as dependências correspondentes.

## Pendências prioritárias para a entrega

1. Testar e registrar a execução em um dispositivo Android e um dispositivo iOS.
2. Implementar autenticação JWT completa, guards e autorização por papel.
3. Entregar os fluxos administrativos de organizações, comissões e usuários.
4. Implementar solicitação de acesso, configurações do usuário e informações do sistema.
5. Produzir todos os diagramas, dicionários e requisitos funcionais no formulário padrão.
6. Criar testes funcionais e evidências para cada requisito do Incremento 1.

## Conclusão

O projeto está coerente com a proposta geral do Conecta+ e usa tecnologias
gratuitas adequadas a Android e iOS. Porém, ainda não está completo para o
Incremento 1 descrito pelo professor. A base de backend cobre usuários,
organizações e comissões, mas faltam interfaces, segurança, fluxos
administrativos, configurações do usuário, informações do sistema, documentação
UML e evidências de teste.
