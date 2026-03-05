import { ConfigProvider, theme } from 'antd';
import { ErrorBoundary } from './components/Common/ErrorBoundary';
import { Dashboard } from './components/Layout/Dashboard';

export function App() {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#3B82F6',
          borderRadius: 12,
          fontFamily:
            "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        },
      }}
    >
      <ErrorBoundary>
        <Dashboard />
      </ErrorBoundary>
    </ConfigProvider>
  );
}

