import { Component, type ErrorInfo, type PropsWithChildren, type ReactNode } from 'react'

type ErrorBoundaryFallbackProps = {
  error: Error
  reset: () => void
}

type ErrorBoundaryProps = PropsWithChildren<{
  fallback: (props: ErrorBoundaryFallbackProps) => ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  onReset?: () => void
}>

type ErrorBoundaryState = {
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    error: null,
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.props.onError?.(error, errorInfo)
  }

  reset = () => {
    this.props.onReset?.()
    this.setState({ error: null })
  }

  render() {
    if (this.state.error) {
      return this.props.fallback({
        error: this.state.error,
        reset: this.reset,
      })
    }

    return this.props.children
  }
}
