import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { BotaoPrimario } from '@/components/BotaoPrimario';
import { CampoTexto } from '@/components/CampoTexto';
import { LogoConecta } from '@/components/LogoConecta';
import { GRADIENTE_FUNDO } from '@/constants/theme';
import { useCadastro } from '@/hooks/useCadastro';

export default function TelaCadastro() {
  const router = useRouter();
  const {
    nome,
    email,
    senha,
    confirmarSenha,
    erros,
    erroGeral,
    carregando,
    definirNome,
    definirEmail,
    definirSenha,
    definirConfirmarSenha,
    submeter,
  } = useCadastro();
  const [senhaVisivel, definirSenhaVisivel] = useState(false);
  const [confirmacaoVisivel, definirConfirmacaoVisivel] = useState(false);

  return (
    <LinearGradient colors={[...GRADIENTE_FUNDO]} style={{ flex: 1 }}>
      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <ScrollView className="flex-1" contentContainerClassName="grow px-6 py-5" keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Voltar" hitSlop={10} className="h-11 w-11 items-center justify-center rounded-full bg-superficie-cartao">
            <Ionicons name="arrow-back" size={20} color="#141a3a" />
          </Pressable>

          <View className="mt-5 items-center"><LogoConecta largura={156} /></View>

          <View className="mt-7 rounded-3xl bg-superficie-cartao p-6 shadow-sm shadow-black/5">
            <Text className="font-bold text-[22px] text-texto-forte">Criar conta</Text>
            <Text className="mt-1 font-regular text-[14px] leading-5 text-texto-medio">Cadastre seus dados para começar a usar o Conecta+.</Text>

            <View className="mt-6 gap-4">
              <CampoTexto rotulo="Nome" icone="person-outline" placeholder="Seu nome completo" value={nome} onChangeText={definirNome} erro={erros.nome} autoCapitalize="words" autoComplete="name" textContentType="name" />
              <CampoTexto rotulo="E-mail" icone="mail-outline" placeholder="nome@organizacao.com" value={email} onChangeText={definirEmail} erro={erros.email} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} autoComplete="email" textContentType="emailAddress" />
              <CampoTexto rotulo="Senha" icone="lock-closed-outline" placeholder="Crie uma senha" value={senha} onChangeText={definirSenha} erro={erros.senha} secureTextEntry={!senhaVisivel} autoCapitalize="none" autoCorrect={false} textContentType="newPassword" acaoFinal={{ icone: senhaVisivel ? 'eye-off-outline' : 'eye-outline', rotuloAcessivel: senhaVisivel ? 'Ocultar senha' : 'Mostrar senha', aoTocar: () => definirSenhaVisivel((visivel) => !visivel) }} />
              <CampoTexto rotulo="Confirmar senha" icone="lock-closed-outline" placeholder="Digite a senha novamente" value={confirmarSenha} onChangeText={definirConfirmarSenha} erro={erros.confirmarSenha} secureTextEntry={!confirmacaoVisivel} autoCapitalize="none" autoCorrect={false} textContentType="newPassword" acaoFinal={{ icone: confirmacaoVisivel ? 'eye-off-outline' : 'eye-outline', rotuloAcessivel: confirmacaoVisivel ? 'Ocultar confirmação' : 'Mostrar confirmação', aoTocar: () => definirConfirmacaoVisivel((visivel) => !visivel) }} />
            </View>

            {erroGeral ? <Text className="mt-5 text-center font-regular text-[13px] text-estado-erro">{erroGeral}</Text> : null}
            <View className="mt-6"><BotaoPrimario titulo="Criar conta" aoTocar={submeter} carregando={carregando} /></View>
          </View>

          <View className="mt-7 flex-row items-center justify-center">
            <Text className="font-regular text-[14px] text-texto-medio">Já tem uma conta? </Text>
            <Link href="/login" asChild><Pressable accessibilityRole="link" accessibilityLabel="Entrar" hitSlop={8}><Text className="font-semibold text-[14px] text-marca-azul">Entrar</Text></Pressable></Link>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
