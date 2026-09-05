/**
 * Recuperação de conta — requisito "Recuperação de conta" das configurações de
 * usuário. Implementação prevista para a sequência do Incremento 1.
 */

import { TelaEmConstrucao } from '@/components/TelaEmConstrucao';

export default function TelaRecuperarConta() {
  return (
    <TelaEmConstrucao
      titulo="Recuperar conta"
      descricao="O envio do link de redefinição por e-mail e a troca de senha entram na sequência desta etapa."
      requisito="Incremento 1 · Configurações de usuário"
    />
  );
}
