import { z } from 'zod'

const configSchema = z.object({
  nodeEnv: z.enum(['development', 'production', 'test']).default('development'),
  port: z.coerce.number().default(5000),
  databaseUrl: z.string(),
  jwtSecret: z.string(),
  jwtExpiresIn: z.string().default('7d'),
  redisUrl: z.string().optional(),
  frontendUrl: z.string().default('http://localhost:3000'),
})

const env = {
  nodeEnv: process.env.NODE_ENV,
  port: process.env.PORT,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN,
  redisUrl: process.env.REDIS_URL,
  frontendUrl: process.env.FRONTEND_URL,
}

// Validate environment variables
let config: z.infer<typeof configSchema>

try {
  config = configSchema.parse(env)
} catch (error) {
  console.error('❌ Invalid environment variables:')
  if (error instanceof z.ZodError) {
    error.errors.forEach((err) => {
      console.error(`  - ${err.path.join('.')}: ${err.message}`)
    })
  }
  console.error('\n📝 Please check your .env file and ensure all required variables are set.')
  process.exit(1)
}

export { config }