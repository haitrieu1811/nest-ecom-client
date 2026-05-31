import http from '@/lib/http'
import { GetLanguagesResType } from '@/schemas/language.schema'

const languageApi = {
  getLanguages: () => {
    return http.get<GetLanguagesResType>('/languages')
  },
}

export default languageApi
