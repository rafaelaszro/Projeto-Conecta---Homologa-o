## TODO - pra finalizar autenticação JWT

- testar `POST /auth/login`.
- criar `JwtAuthGuard`.
- validar token via `Authorization: Bearer TOKEN`.
- proteger rotas de usuários, organizações e comissões.
- manter públicas apenas login e cadastro, se necessário.
- testar token válido, inválido, expirado e usuário desativado.
- no React Native, salvar o token com `Expo SecureStore` e enviá-lo nas requisições protegidas.

- tratar exceções com msg personalizada
  {
  "message": [
  "senha must be longer than or equal to 6 characters"
  ],
  "error": "Bad Request",
  "statusCode": 400
  }
