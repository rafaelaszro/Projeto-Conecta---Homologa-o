/**
 * Tela de Login do Conecta+ — Incremento 1.
 *
 * Esta tela é a porta de entrada do requisito "Cadastro de usuário":
 *   - autentica quem já se cadastrou na plataforma;
 *   - encaminha para o cadastro quem ainda não tem conta;
 *   - encaminha para a recuperação de conta quem esqueceu a senha;
 *   - informa a situação da solicitação de acesso à organização quando o
 *     administrador ainda não aprovou, quando recusou, ou quando o usuário
 *     ainda não pediu acesso a nenhuma organização.
 */

import { useRef } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';

import { AvisoFormulario } from '@/components/AvisoFormulario';
import { BotaoPrimario } from '@/components/BotaoPrimario';
import { CampoTexto } from '@/components/CampoTexto';
import { LogoConecta } from '@/components/LogoConecta';
import { GRADIENTE_FUNDO } from '@/constants/theme';
import { useLogin } from '@/hooks/useLogin';

export default function TelaLogin() {
  const campoSenha = useRef<TextInput>(null);

  const {
    email,
    senha,
    senhaVisivel,
    erros,
    aviso,
    carregando,
    aoDigitarEmail,
    aoDigitarSenha,
    alternarVisibilidadeDaSenha,
    submeter,
  } = useLogin();

  return (
    <LinearGradient colors={[...GRADIENTE_FUNDO]} style={{ flex: 1 }}>
      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            className="flex-1"
            contentContainerClassName="grow justify-center px-6 py-10"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View className="items-center">
              <LogoConecta largura={196} />
            </View>

            <View className="mt-9 rounded-3xl bg-superficie-cartao p-6 shadow-sm shadow-black/5">
              <Text className="font-bold text-[22px] text-texto-forte">Entrar</Text>
              <Text className="mt-1 font-regular text-[14px] leading-5 text-texto-medio">
                Acesse com a conta criada no seu cadastro para ver as reuniões da sua organização.
              </Text>

              {aviso ? (
                <View className="mt-5">
                  <AvisoFormulario aviso={aviso} />
                </View>
              ) : null}

              <View className="mt-6 gap-4">
                <CampoTexto
                  rotulo="E-mail"
                  icone="mail-outline"
                  placeholder="nome@organizacao.com"
                  value={email}
                  onChangeText={aoDigitarEmail}
                  erro={erros.email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                  textContentType="emailAddress"
                  returnKeyType="next"
                  editable={!carregando}
                  onSubmitEditing={() => campoSenha.current?.focus()}
                />

                <CampoTexto
                  ref={campoSenha}
                  rotulo="Senha"
                  icone="lock-closed-outline"
                  placeholder="Sua senha"
                  value={senha}
                  onChangeText={aoDigitarSenha}
                  erro={erros.senha}
                  secureTextEntry={!senhaVisivel}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="current-password"
                  textContentType="password"
                  returnKeyType="go"
                  editable={!carregando}
                  onSubmitEditing={submeter}
                  acaoFinal={{
                    icone: senhaVisivel ? 'eye-off-outline' : 'eye-outline',
                    rotuloAcessivel: senhaVisivel ? 'Ocultar senha' : 'Mostrar senha',
                    aoTocar: alternarVisibilidadeDaSenha,
                  }}
                />
              </View>

              <View className="mt-3 flex-row justify-end">
                <Link href="/recuperar-conta" asChild>
                  <Pressable
                    accessibilityRole="link"
                    accessibilityLabel="Esqueci minha senha"
                    hitSlop={8}
                  >
                    <Text className="font-medium text-[13px] text-marca-azul">
                      Esqueci minha senha
                    </Text>
                  </Pressable>
                </Link>
              </View>

              <View className="mt-6">
                <BotaoPrimario titulo="Entrar" aoTocar={submeter} carregando={carregando} />
              </View>
            </View>

            <View className="mt-8 flex-row items-center justify-center">
              <Text className="font-regular text-[14px] text-texto-medio">
                Ainda não tem conta?{' '}
              </Text>
              <Link href="/cadastro" asChild>
                <Pressable accessibilityRole="link" accessibilityLabel="Criar conta" hitSlop={8}>
                  <Text className="font-semibold text-[14px] text-marca-azul">Criar conta</Text>
                </Pressable>
              </Link>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}
