/**
 * Tela de cadastro de organização — Incremento 1.
 *
 * Atende ao primeiro item do requisito "Cadastro de organização": o usuário
 * realiza o cadastro de uma nova organização. A autorização e a revogação são
 * do administrador do sistema e acontecem no backend, por isso esta tela nunca
 * envia o status: a organização sempre nasce pendente.
 *
 * Depois do envio, o formulário dá lugar à confirmação, deixando claro que a
 * organização ainda depende da análise do administrador do sistema.
 */

import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { AvisoFormulario } from '@/components/AvisoFormulario';
import { BotaoPrimario } from '@/components/BotaoPrimario';
import { CampoTexto } from '@/components/CampoTexto';
import { LogoConecta } from '@/components/LogoConecta';
import { CORES, GRADIENTE_FUNDO } from '@/constants/theme';
import { useCadastroOrganizacao } from '@/hooks/useCadastroOrganizacao';

export default function TelaCadastroOrganizacao() {
  const router = useRouter();

  // Enquanto o backend não tem o guard de JWT, o identificador do usuário chega
  // pela navegação, no mesmo formato já usado pela tela de início.
  const { usuarioId } = useLocalSearchParams<{ usuarioId?: string }>();

  const {
    nome,
    descricao,
    erros,
    aviso,
    carregando,
    enviada,
    caracteresUsados,
    limiteDeCaracteres,
    descricaoExcedeu,
    aoDigitarNome,
    aoDigitarDescricao,
    submeter,
  } = useCadastroOrganizacao(usuarioId ?? null);

  return (
    <LinearGradient colors={[...GRADIENTE_FUNDO]} style={{ flex: 1 }}>
      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            className="flex-1"
            contentContainerClassName="grow px-6 py-5"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Pressable
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel="Voltar"
              hitSlop={10}
              className="h-11 w-11 items-center justify-center rounded-full bg-superficie-cartao"
            >
              <Ionicons name="arrow-back" size={20} color={CORES.TEXTO_FORTE} />
            </Pressable>

            <View className="mt-5 items-center">
              <LogoConecta largura={156} />
            </View>

            <View className="mt-7 rounded-3xl bg-superficie-cartao p-6 shadow-sm shadow-black/5">
              {enviada ? (
                <>
                  <View className="h-12 w-12 items-center justify-center rounded-full bg-superficie-campo">
                    <Ionicons name="time" size={24} color={CORES.ALERTA} />
                  </View>

                  <Text className="mt-4 font-bold text-[22px] text-texto-forte">
                    Solicitação enviada
                  </Text>

                  <Text className="mt-2 font-regular text-[14px] leading-5 text-texto-medio">
                    A organização {nome.trim()} foi cadastrada e aguarda a autorização de um
                    administrador do sistema. Você será avisado assim que ela for analisada.
                  </Text>

                  <View className="mt-5 self-start rounded-full bg-superficie-campo px-4 py-2">
                    <Text className="font-medium text-[12px] text-texto-medio">
                      Situação atual: aguardando autorização
                    </Text>
                  </View>

                  <View className="mt-6">
                    <BotaoPrimario titulo="Voltar ao início" aoTocar={() => router.back()} />
                  </View>
                </>
              ) : (
                <>
                  <Text className="font-bold text-[22px] text-texto-forte">Criar organização</Text>

                  <Text className="mt-1 font-regular text-[14px] leading-5 text-texto-medio">
                    Informe os dados da organização. O cadastro passa pela autorização de um
                    administrador do sistema antes de ficar disponível.
                  </Text>

                  {aviso ? (
                    <View className="mt-5">
                      <AvisoFormulario aviso={aviso} />
                    </View>
                  ) : null}

                  <View className="mt-6 gap-4">
                    <CampoTexto
                      rotulo="Nome da organização"
                      icone="business-outline"
                      placeholder="Ex.: Conselho Municipal de Educação"
                      value={nome}
                      onChangeText={aoDigitarNome}
                      erro={erros.nome}
                      autoCapitalize="words"
                      autoCorrect={false}
                      returnKeyType="next"
                      editable={!carregando}
                    />

                    <View>
                      <CampoTexto
                        rotulo="Descrição (opcional)"
                        icone="document-text-outline"
                        placeholder="Diga em poucas palavras o que a organização faz."
                        value={descricao}
                        onChangeText={aoDigitarDescricao}
                        erro={erros.descricao}
                        multiline
                        autoCapitalize="sentences"
                        editable={!carregando}
                      />

                      <Text
                        className="mt-2 text-right font-regular text-[12px]"
                        style={{ color: descricaoExcedeu ? CORES.ERRO : CORES.TEXTO_FRACO }}
                      >
                        {caracteresUsados}/{limiteDeCaracteres}
                      </Text>
                    </View>
                  </View>

                  <View className="mt-6">
                    <BotaoPrimario
                      titulo="Enviar solicitação"
                      aoTocar={submeter}
                      carregando={carregando}
                      tituloCarregando="Enviando..."
                    />
                  </View>
                </>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}
