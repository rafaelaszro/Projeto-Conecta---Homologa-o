/**
 * Destino do login bem-sucedido.
 *
 * Confirma a autenticação e a organização vinculada, e dá acesso à solicitação
 * de criação de organização do requisito "Cadastro de organização". As telas de
 * reuniões, calendário e histórico descritas na proposta entram nos incrementos
 * seguintes.
 */

import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { LogoConecta } from '@/components/LogoConecta';
import { CORES } from '@/constants/theme';

export default function TelaInicio() {
  const router = useRouter();

  const { id, nome, organizacao } = useLocalSearchParams<{
    id?: string;
    nome?: string;
    organizacao?: string;
  }>();

  return (
    <SafeAreaView className="flex-1 bg-superficie-fundo">
      <View className="flex-row items-center justify-between px-6 pt-2">
        <LogoConecta variante="simbolo" largura={40} />

        <Pressable
          onPress={() => router.replace('/login')}
          accessibilityRole="button"
          accessibilityLabel="Sair da conta"
          hitSlop={10}
          className="h-11 flex-row items-center rounded-full bg-superficie-cartao px-4"
        >
          <Ionicons name="log-out-outline" size={18} color={CORES.TEXTO_MEDIO} />
          <Text className="ml-2 font-medium text-[13px] text-texto-medio">Sair</Text>
        </Pressable>
      </View>

      <View className="flex-1 justify-center px-6">
        <Text className="font-bold text-[24px] text-texto-forte">
          Olá, {nome?.split(' ')[0] ?? 'bem-vindo'}!
        </Text>

        {organizacao ? (
          <Text className="mt-1 font-regular text-[14px] text-texto-medio">
            Você entrou como membro de {organizacao}.
          </Text>
        ) : null}

        <View className="mt-6 rounded-3xl bg-superficie-cartao p-5">
          <View className="flex-row items-center">
            <Ionicons name="checkmark-circle" size={20} color={CORES.SUCESSO} />
            <Text className="ml-2 font-semibold text-[14px] text-texto-forte">
              Acesso liberado
            </Text>
          </View>
          <Text className="mt-2 font-regular text-[13px] leading-5 text-texto-medio">
            O login do Incremento 1 está concluído. As próximas telas — início, calendário,
            reuniões e histórico — entram nos incrementos seguintes.
          </Text>
        </View>

        <Pressable
          onPress={() =>
            router.push({ pathname: '/organizacao/cadastro', params: { usuarioId: id ?? '' } })
          }
          accessibilityRole="button"
          accessibilityLabel="Criar organização"
          className="mt-4 flex-row items-center rounded-3xl bg-superficie-cartao p-5"
          style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}
        >
          <View className="h-11 w-11 items-center justify-center rounded-full bg-superficie-campo">
            <Ionicons name="business-outline" size={20} color={CORES.AZUL} />
          </View>

          <View className="ml-3 flex-1">
            <Text className="font-semibold text-[14px] text-texto-forte">Criar organização</Text>
            <Text className="mt-1 font-regular text-[13px] leading-5 text-texto-medio">
              Envie o cadastro e aguarde a autorização do administrador do sistema.
            </Text>
          </View>

          <Ionicons name="chevron-forward" size={18} color={CORES.TEXTO_FRACO} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
