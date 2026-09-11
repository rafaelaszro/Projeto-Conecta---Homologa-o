/**
 * Ação principal das telas, com o gradiente da marca.
 *
 * Mantém posição e feedback previsíveis, conforme os padrões para telas
 * descritos em PropostaInicial/objetivos.md.
 */

import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { CORES, GRADIENTE_MARCA } from '@/constants/theme';

type BotaoPrimarioProps = {
  titulo: string;
  aoTocar: () => void;
  /** Exibe o indicador de progresso e bloqueia novos toques. */
  carregando?: boolean;
  desabilitado?: boolean;
  /** Texto exibido ao lado do indicador de progresso. */
  tituloCarregando?: string;
};

export function BotaoPrimario({
  titulo,
  aoTocar,
  carregando = false,
  desabilitado = false,
  tituloCarregando = 'Entrando...',
}: BotaoPrimarioProps) {
  const bloqueado = desabilitado || carregando;

  return (
    <Pressable
      onPress={aoTocar}
      disabled={bloqueado}
      accessibilityRole="button"
      accessibilityLabel={titulo}
      accessibilityState={{ disabled: bloqueado, busy: carregando }}
      className="w-full overflow-hidden rounded-2xl"
      style={({ pressed }) => ({ opacity: bloqueado ? 0.55 : pressed ? 0.9 : 1 })}
    >
      <LinearGradient
        colors={[...GRADIENTE_MARCA]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ height: 56, alignItems: 'center', justifyContent: 'center' }}
      >
        {carregando ? (
          <View className="flex-row items-center">
            <ActivityIndicator color={CORES.BRANCO} />
            <Text className="ml-3 font-semibold text-[15px] text-white">{tituloCarregando}</Text>
          </View>
        ) : (
          <Text className="font-semibold text-[15px] text-white">{titulo}</Text>
        )}
      </LinearGradient>
    </Pressable>
  );
}
