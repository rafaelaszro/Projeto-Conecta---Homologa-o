/**
 * Marcador das telas que serão implementadas nos próximos requisitos do
 * Incremento 1. Existe para que os caminhos saindo da tela de login sejam
 * navegáveis durante os testes, sem simular funcionalidades ainda não entregues.
 */

import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { CORES } from '@/constants/theme';
import { LogoConecta } from './LogoConecta';

type TelaEmConstrucaoProps = {
  titulo: string;
  descricao: string;
  /** Requisito do Incremento 1 que dará origem a esta tela. */
  requisito: string;
};

export function TelaEmConstrucao({ titulo, descricao, requisito }: TelaEmConstrucaoProps) {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-superficie-fundo">
      <View className="px-6 pt-2">
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          hitSlop={10}
          className="h-11 w-11 items-center justify-center rounded-full bg-superficie-cartao"
        >
          <Ionicons name="arrow-back" size={20} color={CORES.TEXTO_FORTE} />
        </Pressable>
      </View>

      <View className="flex-1 items-center justify-center px-8">
        <LogoConecta variante="simbolo" largura={72} />

        <Text className="mt-6 text-center font-bold text-[20px] text-texto-forte">{titulo}</Text>
        <Text className="mt-2 text-center font-regular text-[14px] leading-5 text-texto-medio">
          {descricao}
        </Text>

        <View className="mt-6 rounded-full bg-superficie-campo px-4 py-2">
          <Text className="font-medium text-[12px] text-texto-medio">{requisito}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
