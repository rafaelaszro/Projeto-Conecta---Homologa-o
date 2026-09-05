/**
 * Campo de texto padrão dos formulários.
 *
 * Segue os padrões para telas descritos em PropostaInicial/objetivos.md: rótulo
 * acima do campo e mensagem de validação logo abaixo, junto do campo que precisa
 * de correção.
 */

import { forwardRef, useState } from 'react';
import { Pressable, Text, TextInput, View, type TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { CORES } from '@/constants/theme';

type CampoTextoProps = TextInputProps & {
  rotulo: string;
  /** Ícone do Ionicons exibido à esquerda do campo. */
  icone: keyof typeof Ionicons.glyphMap;
  /** Mensagem de validação; quando presente, o campo é destacado como inválido. */
  erro?: string | null;
  /** Botão opcional à direita, usado para mostrar ou ocultar a senha. */
  acaoFinal?: {
    icone: keyof typeof Ionicons.glyphMap;
    rotuloAcessivel: string;
    aoTocar: () => void;
  };
};

export const CampoTexto = forwardRef<TextInput, CampoTextoProps>(function CampoTexto(
  { rotulo, icone, erro = null, acaoFinal, onFocus, onBlur, ...props },
  ref,
) {
  const [focado, definirFocado] = useState(false);

  const invalido = erro !== null;
  const corDaBorda = invalido ? CORES.ERRO : focado ? CORES.AZUL : CORES.BORDA;
  const corDoIcone = invalido ? CORES.ERRO : focado ? CORES.AZUL : CORES.TEXTO_FRACO;

  return (
    <View className="w-full">
      <Text className="mb-2 font-medium text-[13px] text-texto-medio">{rotulo}</Text>

      <View
        className="w-full flex-row items-center rounded-2xl bg-superficie-campo px-4"
        style={{ borderWidth: 1.5, borderColor: corDaBorda, height: 56 }}
      >
        <Ionicons name={icone} size={20} color={corDoIcone} />

        <TextInput
          ref={ref}
          className="ml-3 h-full min-w-0 flex-1 font-regular text-[15px] text-texto-forte"
          placeholderTextColor={CORES.TEXTO_FRACO}
          accessibilityLabel={rotulo}
          accessibilityHint={erro ?? undefined}
          onFocus={(evento) => {
            definirFocado(true);
            onFocus?.(evento);
          }}
          onBlur={(evento) => {
            definirFocado(false);
            onBlur?.(evento);
          }}
          {...props}
        />

        {acaoFinal ? (
          <Pressable
            onPress={acaoFinal.aoTocar}
            accessibilityRole="button"
            accessibilityLabel={acaoFinal.rotuloAcessivel}
            hitSlop={10}
            className="pl-2"
          >
            <Ionicons name={acaoFinal.icone} size={20} color={CORES.TEXTO_MEDIO} />
          </Pressable>
        ) : null}
      </View>

      {invalido ? (
        <View className="mt-2 flex-row items-center">
          <Ionicons name="alert-circle" size={14} color={CORES.ERRO} />
          <Text className="ml-1.5 flex-1 font-regular text-[12px] text-estado-erro">{erro}</Text>
        </View>
      ) : null}
    </View>
  );
});
