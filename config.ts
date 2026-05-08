import z from 'zod'

const configSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string(),
  NEXT_PUBLIC_BASE_URL: z.string(),
})

const configProject = configSchema.safeParse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
})

if (!configProject.success) {
  console.error(configProject.error.issues)
  throw new Error('Các khai báo biến môi trường không hợp lệ')
}

const envConfig = configProject.data
export default envConfig
