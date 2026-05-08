'use client'

import { create } from 'zustand'

import { getAccessTokenFromLS, getProfileFromLS } from '@/lib/utils'
import { ProfileInLSType } from '@/types/utils.type'

type AppContextType = {
  isAuthenticated: boolean
  setIsAuthenticated: (isAuthenticated: boolean) => void
  profile: ProfileInLSType | null
  setProfile: (profile: ProfileInLSType | null) => void
}

// Create store using the curried form of `create`
export const useAppStore = create<AppContextType>()((set) => ({
  isAuthenticated: !!getAccessTokenFromLS(),
  setIsAuthenticated: (isAuthenticated: boolean) => set({ isAuthenticated }),
  profile: getProfileFromLS(),
  setProfile: (profile: ProfileInLSType | null) => set({ profile }),
}))
