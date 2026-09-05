/**
 * Faixa de aviso do formulário.
 *
 * Comunica tanto falhas de autenticação quanto a situação do cadastro do
 * usuário perante a organização (aguardando aprovação, recusado ou ainda sem
 * organização vinculada).
 */

import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { CORES } from '@/constants/theme';
import type { Aviso } from '@/hooks/useLogin';

type AvisoFormularioProps = {
  aviso: Aviso;
};

const APARENCIA = {
  erro: {
    icone: 'close-circle' as const,
    cor: CORES.ERRO,
    fundo: '#fdeef0',
    borda: '#f6c9d0',
  },
  alerta: {
    icone: 'time' as const,
    cor: CORES.ALERTA,
    fundo: '#fdf3e6',
    borda: '#f2ddbc',
  },
  informacao: {
    icone: 'information-circle' as const,
    cor: CORES.AZUL,
    fundo: '#eaf1fe',
    borda: '#cbdcfb',
  },
};

export function AvisoFormulario({ aviso }: AvisoFormularioProps) {
  const aparencia = APARENCIA[aviso.tom];

  return (
    <View
      accessible
      accessibilityRole="alert"
      accessibilityLabel={`${aviso.titulo}. ${aviso.mensagem}`}
      className="w-full flex-row rounded-2xl p-4"
      style={{ backgroundColor: aparencia.fundo, borderWidth: 1, borderColor: aparencia.borda }}
    >
      <Ionicons name={aparencia.icone} size={20} color={aparencia.cor} />

      <View className="ml-3 flex-1">
        <Text className="font-semibold text-[13px]" style={{ color: aparencia.cor }}>
          {aviso.titulo}
        </Text>
        <Text className="mt-1 font-regular text-[13px] leading-5 text-texto-medio">
          {aviso.mensagem}
        </Text>
      </View>
    </View>
  );
}
