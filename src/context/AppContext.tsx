import { createContext, useContext, ReactNode } from 'react'
import { useAppStore } from '@/store/useAppStore'

type AppStore = ReturnType<typeof useAppStore>

const AppContext = createContext<AppStore | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const store = useAppStore()
  return <AppContext.Provider value={store}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
