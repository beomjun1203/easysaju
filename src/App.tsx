import { AppProvider, useApp } from '@/context/AppContext'
import { HomeView } from '@/components/HomeView'
import { InputView } from '@/components/InputView'
import { LoadingView } from '@/components/LoadingView'
import { ResultView } from '@/components/ResultView'

function AppContent() {
  const { view } = useApp()
  if (view === 'home') return <HomeView />
  if (view === 'loading') return <LoadingView />
  if (view === 'result') return <ResultView />
  return <InputView />
}

export default function App() {
  return (
    <AppProvider>
      <div className="mx-auto min-h-screen max-w-mobile">
        <AppContent />
      </div>
    </AppProvider>
  )
}
