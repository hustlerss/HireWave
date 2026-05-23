import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', background: '#fef2f2', color: '#991b1b', fontFamily: 'monospace', minHeight: '100vh', zIndex: 999999, position: 'relative' }}>
          <h1 style={{ fontSize: '24px', marginBottom: '10px' }}>Something went wrong! (Caught by ErrorBoundary)</h1>
          <p style={{ fontWeight: 'bold' }}>{this.state.error && this.state.error.toString()}</p>
          <pre style={{ background: '#fee2e2', padding: '15px', borderRadius: '8px', overflowX: 'auto' }}>
            {this.state.errorInfo ? this.state.errorInfo.componentStack : 'No stack trace available'}
          </pre>
          <pre style={{ background: '#fecaca', padding: '15px', borderRadius: '8px', overflowX: 'auto', marginTop: '10px' }}>
            {this.state.error && this.state.error.stack}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}

// Add a global window.onerror handler too so we catch non-react errors
window.onerror = function (message, source, lineno, colno, error) {
  const div = document.createElement('div');
  div.id = "global-error-overlay";
  div.style.position = 'fixed';
  div.style.bottom = '0';
  div.style.left = '0';
  div.style.width = '100%';
  div.style.background = 'rgba(0,0,0,0.9)';
  div.style.color = '#ff6b6b';
  div.style.padding = '20px';
  div.style.zIndex = '999999';
  div.style.fontFamily = 'monospace';
  div.style.fontSize = '12px';
  div.style.maxHeight = '50vh';
  div.style.overflowY = 'auto';
  div.innerHTML = `<strong>Global Uncaught Error:</strong> ${message}<br/><em>${source}:${lineno}:${colno}</em><br/>Stack: ${error ? error.stack : 'N/A'}`;
  document.body.appendChild(div);
  return false;
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);

