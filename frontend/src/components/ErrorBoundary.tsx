
import React from 'react'

type State = { hasError: boolean; error?: any }

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { hasError: false }
  static getDerivedStateFromError(error: any) { return { hasError: true, error } }
  componentDidCatch(error: any, info: any) { console.error('[ErrorBoundary]', error, info) }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 16, fontFamily: 'sans-serif' }}>
          <h2>Ocorreu um erro na interface</h2>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{String(this.state.error)}</pre>
          <p>Veja o console do navegador para mais detalhes.</p>
        </div>
      )
    }
    return this.props.children
  }
}
