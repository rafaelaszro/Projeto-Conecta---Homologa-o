/**
 * Contas de demonstração usadas enquanto a API do Incremento 1 não está publicada.
 *
 * Cada conta representa um dos estados possíveis do requisito "Cadastro de
 * usuário", para que a tela de login possa ser demonstrada e testada em todos os
 * caminhos previstos. Assim que EXPO_PUBLIC_API_URL for definida, este arquivo
 * deixa de ser usado (ver `authService.ts`).
 *
 * As senhas abaixo são fictícias e existem apenas para a apresentação da etapa.
 */

import { STATUS_ACESSO, type Usuario } from '@/models/usuario';
import { normalizarEmail } from '@/utils/validacao';

export type ContaSimulada = Usuario & {
  senha: string;
  desativada: boolean;
};

/** Atraso artificial para que o estado de carregamento do botão fique visível. */
export const LATENCIA_SIMULADA_MS = 900;

export const CONTAS_SIMULADAS: ContaSimulada[] = [
  {
    id: 'usr-001',
    nome: 'Ana Ribeiro',
    email: 'ana.ribeiro@conectamais.app',
    senha: 'conecta2026',
    statusAcesso: STATUS_ACESSO.ATIVO,
    organizacao: 'Prefeitura de Ponta Grossa',
    desativada: false,
  },
  {
    id: 'usr-002',
    nome: 'Bruno Carvalho',
    email: 'bruno.carvalho@conectamais.app',
    senha: 'conecta2026',
    statusAcesso: STATUS_ACESSO.PENDENTE_APROVACAO,
    organizacao: 'Prefeitura de Ponta Grossa',
    desativada: false,
  },
  {
    id: 'usr-003',
    nome: 'Carla Souza',
    email: 'carla.souza@conectamais.app',
    senha: 'conecta2026',
    statusAcesso: STATUS_ACESSO.ACESSO_REJEITADO,
    organizacao: 'Conselho Municipal de Saúde',
    desativada: false,
  },
  {
    id: 'usr-004',
    nome: 'Diego Martins',
    email: 'diego.martins@conectamais.app',
    senha: 'conecta2026',
    statusAcesso: STATUS_ACESSO.SEM_ORGANIZACAO,
    organizacao: null,
    desativada: false,
  },
  {
    id: 'usr-005',
    nome: 'Eduarda Lima',
    email: 'eduarda.lima@conectamais.app',
    senha: 'conecta2026',
    statusAcesso: STATUS_ACESSO.ATIVO,
    organizacao: 'Prefeitura de Ponta Grossa',
    desativada: true,
  },
];

/** Procura uma conta de demonstração pelo e-mail, ignorando caixa e espaços. */
export function buscarContaSimulada(email: string): ContaSimulada | null {
  const procurado = normalizarEmail(email);
  return CONTAS_SIMULADAS.find((conta) => normalizarEmail(conta.email) === procurado) ?? null;
}
