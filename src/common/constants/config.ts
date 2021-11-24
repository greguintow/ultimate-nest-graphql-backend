export const { PORT = 4000, SECRET = 'secret123', NODE_ENV = 'dev' } = process.env
export const AUTH_HEADER = 'authorization'
export const IN_PROD = NODE_ENV === 'production'
