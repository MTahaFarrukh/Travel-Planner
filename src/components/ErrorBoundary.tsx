import { Component, type ErrorInfo, type ReactNode } from 'react'
import { focusRingOnInk } from '../utils/a11y'

interface ErrorBoundaryProps {
  children: ReactNode
  fallbackTitle?: string
}

interface ErrorBoundaryState {
  error: Error | null
}

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Waymark render error:', error, info.componentStack)
  }

  handleReset = () => {
    this.setState({ error: null })
  }

  render() {
    if (this.state.error) {
      return (
        <div
          className="mx-auto flex min-h-[40vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center"
          role="alert"
        >
          <p className="font-mono text-xs uppercase tracking-widest text-rust">
            Something went wrong
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-parchment">
            {this.props.fallbackTitle ?? 'This section hit a snag'}
          </h2>
          <p className="mt-3 text-sm text-parchment/75">
            {this.state.error.message || 'An unexpected error occurred.'}
          </p>
          <button
            type="button"
            onClick={this.handleReset}
            className={`mt-6 rounded-xl bg-brass px-5 py-3 font-mono text-xs uppercase tracking-widest text-ink motion-safe:transition-colors hover:bg-brass/90 ${focusRingOnInk}`}
          >
            Try again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
