/**
 * Validações de formulário compartilhadas pelas telas de autenticação.
 *
 * Requisito não funcional atendido: "Validação próxima ao campo que precisa de
 * correção" (padrões para telas descritos em PropostaInicial/objetivos.md).
 */

/** Tamanho mínimo de senha aceito no cadastro e no login. */
export const TAMANHO_MINIMO_SENHA = 6;

/** Tamanho mínimo do nome aceito no cadastro. */
export const TAMANHO_MINIMO_NOME = 3;

const EXPRESSAO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Remove espaços das pontas e normaliza o e-mail para comparação. */
export function normalizarEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Valida o campo de e-mail.
 * @returns a mensagem de erro a ser exibida no campo, ou `null` quando válido.
 */
export function validarEmail(email: string): string | null {
  const valor = email.trim();

  if (valor.length === 0) {
    return 'Informe o seu e-mail.';
  }

  if (!EXPRESSAO_EMAIL.test(valor)) {
    return 'Informe um e-mail válido, como nome@dominio.com.';
  }

  return null;
}

/**
 * Valida o campo de senha no login.
 * @returns a mensagem de erro a ser exibida no campo, ou `null` quando válida.
 */
export function validarSenha(senha: string): string | null {
  if (senha.length === 0) {
    return 'Informe a sua senha.';
  }

  if (senha.length < TAMANHO_MINIMO_SENHA) {
    return `A senha deve ter ao menos ${TAMANHO_MINIMO_SENHA} caracteres.`;
  }

  return null;
}

export function validarNome(nome: string): string | null {
  if (nome.trim().length === 0) {
    return 'Informe o seu nome.';
  }

  if (nome.trim().length < TAMANHO_MINIMO_NOME) {
    return `O nome deve ter ao menos ${TAMANHO_MINIMO_NOME} caracteres.`;
  }

  return null;
}

export function validarConfirmacaoSenha(senha: string, confirmacao: string): string | null {
  if (confirmacao.length === 0) {
    return 'Confirme a sua senha.';
  }

  if (senha !== confirmacao) {
    return 'As senhas não coincidem.';
  }

  return null;
}
