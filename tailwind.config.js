/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      // Paleta oficial definida na documentacao de Identidade Visual (PropostaInicial/Topico3.pdf).
      colors: {
        marca: {
          indigo: '#1e2080',
          violeta: '#544cee',
          azul: '#256ef1',
          roxo: '#5e46e8',
          eletrico: '#1a3ff9',
          grafite: '#363ac5',
          magenta: '#8436dd',
        },
        texto: {
          forte: '#141a3a',
          medio: '#4b5375',
          fraco: '#8a90ad',
        },
        superficie: {
          fundo: '#f5f6fc',
          cartao: '#ffffff',
          campo: '#f2f3fb',
          borda: '#e2e5f2',
        },
        estado: {
          erro: '#d92d42',
          alerta: '#b25e00',
          sucesso: '#0f8a5f',
        },
      },
      fontFamily: {
        regular: ['Poppins_400Regular'],
        medium: ['Poppins_500Medium'],
        semibold: ['Poppins_600SemiBold'],
        bold: ['Poppins_700Bold'],
      },
    },
  },
  plugins: [],
};
