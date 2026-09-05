/**
 * Serviço de autenticação do Conecta+.
 *
 * Cobre o requisito de login do Incremento 1 e os estados que nascem do
 * requisito "Cadastro de usuário":
 *   - o usuário se cadastra na plataforma;
 *   - o usuário solicita acesso a uma organização;
 *   - o administrador da organização aprova ou rejeita a solicitação.
 *
 * Enquanto a API (NestJS) do incremento não estiver publicada, o serviço usa as
 * contas de demonstração definidas em `contasSimuladas.ts`. Basta definir a
 * variável de ambiente EXPO_PUBLIC_API_URL para que as chamadas passem a ser
 * feitas contra o servidor real, sem alteração nas telas.
 */

import type { Usuario } from '@/models/usuario';
import { buscarContaSimulada, LATENCIA_SIMULADA_MS } from './contasSimuladas';

/** Motivos pelos quais o login pode falhar. */
export const ERRO_LOGIN = {
  /** E-mail inexistente ou senha incorreta (mensagem única, para não revelar quais contas existem). */
  CREDENCIAIS_INVALIDAS: 'CREDENCIAIS_INVALIDAS',
  /** Conta desativada por um administrador do sistema. */
  CONTA_DESATIVADA: 'CONTA_DESATIVADA',
  /** O aplicativo não conseguiu falar com o servidor. */
  FALHA_CONEXAO: 'FALHA_CONEXAO',
  /** O servidor respondeu com erro inesperado. */
  ERRO_SERVIDOR: 'ERRO_SERVIDOR',
} as const;

export type ErroLogin = (typeof ERRO_LOGIN)[keyof typeof ERRO_LOGIN];

export type Credenciais = {
  email: string;
  senha: string;
};

export type ResultadoLogin =
  | { autenticado: true; usuario: Usuario; token: string }
  | { autenticado: false; erro: ErroLogin };

/** URL da API do incremento. Quando ausente, o aplicativo usa as contas de demonstração. */
export const URL_API = process.env.EXPO_PUBLIC_API_URL ?? null;

/** Indica se as telas estão falando com o servidor real ou com os dados de demonstração. */
export const USANDO_API_REAL = URL_API !== null;

/** Mensagens exibidas ao usuário para cada falha de login. */
export const MENSAGENS_ERRO_LOGIN: Record<ErroLogin, string> = {
  [ERRO_LOGIN.CREDENCIAIS_INVALIDAS]:
    'E-mail ou senha incorretos. Verifique os dados e tente novamente.',
  [ERRO_LOGIN.CONTA_DESATIVADA]:
    'Esta conta foi desativada. Procure o administrador do sistema.',
  [ERRO_LOGIN.FALHA_CONEXAO]:
    'Não foi possível falar com o servidor. Verifique a sua conexão e tente novamente.',
  [ERRO_LOGIN.ERRO_SERVIDOR]:
    'O servidor não conseguiu responder agora. Tente novamente em instantes.',
};

async function autenticarNaApi(credenciais: Credenciais): Promise<ResultadoLogin> {
  let resposta: Response;

  try {
    resposta = await fetch(`${URL_API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credenciais),
    });
  } catch {
    return { autenticado: false, erro: ERRO_LOGIN.FALHA_CONEXAO };
  }

  if (resposta.status === 401 || resposta.status === 404) {
    return { autenticado: false, erro: ERRO_LOGIN.CREDENCIAIS_INVALIDAS };
  }

  if (resposta.status === 403) {
    return { autenticado: false, erro: ERRO_LOGIN.CONTA_DESATIVADA };
  }

  if (!resposta.ok) {
    return { autenticado: false, erro: ERRO_LOGIN.ERRO_SERVIDOR };
  }

  try {
    const corpo = (await resposta.json()) as { usuario: Usuario; token: string };
    return { autenticado: true, usuario: corpo.usuario, token: corpo.token };
  } catch {
    return { autenticado: false, erro: ERRO_LOGIN.ERRO_SERVIDOR };
  }
}

async function autenticarComDadosDeDemonstracao(
  credenciais: Credenciais,
): Promise<ResultadoLogin> {
  await new Promise((resolve) => setTimeout(resolve, LATENCIA_SIMULADA_MS));

  const conta = buscarContaSimulada(credenciais.email);

  if (conta === null || conta.senha !== credenciais.senha) {
    return { autenticado: false, erro: ERRO_LOGIN.CREDENCIAIS_INVALIDAS };
  }

  if (conta.desativada) {
    return { autenticado: false, erro: ERRO_LOGIN.CONTA_DESATIVADA };
  }

  const { senha: _senha, desativada: _desativada, ...usuario } = conta;

  return { autenticado: true, usuario, token: `demonstracao.${conta.id}` };
}

/**
 * Autentica o usuário com e-mail e senha.
 *
 * Sempre resolve: as falhas são devolvidas como `{ autenticado: false }` para que
 * a tela exiba a mensagem correspondente em vez de tratar exceções.
 */
export async function entrar(credenciais: Credenciais): Promise<ResultadoLogin> {
  return USANDO_API_REAL
    ? autenticarNaApi(credenciais)
    : autenticarComDadosDeDemonstracao(credenciais);
}
