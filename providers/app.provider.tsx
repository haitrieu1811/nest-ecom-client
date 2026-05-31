'use client'

import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { create } from 'zustand'

import languageApi from '@/apis/language.api'
import { getAccessTokenFromLS, getProfileFromLS } from '@/lib/utils'
import { LanguageType } from '@/schemas/language.schema'
import { ProfileInLSType } from '@/types/utils.type'

type AppStoreType = {
  isAuthenticated: boolean
  setIsAuthenticated: (isAuthenticated: boolean) => void
  profile: ProfileInLSType | null
  setProfile: (profile: ProfileInLSType | null) => void
}

// Create store using the curried form of `create`
export const useAppStore = create<AppStoreType>()((set) => ({
  isAuthenticated: !!getAccessTokenFromLS(),
  setIsAuthenticated: (isAuthenticated: boolean) => set({ isAuthenticated }),
  profile: getProfileFromLS(),
  setProfile: (profile: ProfileInLSType | null) => set({ profile }),
}))

type AppContextType = {
  languages: LanguageType[]
}

const AppContext = React.createContext<AppContextType>({
  languages: [],
})

export const useAppContext = () => React.useContext(AppContext)

export default function AppProvider({ children }: { children: React.ReactNode }) {
  const getLanguagesQuery = useQuery({
    queryKey: ['get-languages'],
    queryFn: () => languageApi.getLanguages(),
  })

  const languages = getLanguagesQuery.data?.payload.data || []

  return <AppContext value={{ languages }}>{children}</AppContext>
}
