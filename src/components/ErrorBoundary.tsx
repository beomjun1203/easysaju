import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) return this.props.fallback
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-white p-6 text-black">
          <p className="mb-2 font-medium">오류가 발생했습니다</p>
          <p className="text-sm text-gray-600">{this.state.error.message}</p>
        </div>
      )
    }
    return this.props.children
  }
}
