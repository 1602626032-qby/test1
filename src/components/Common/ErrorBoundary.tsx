import React from 'react';
import { Alert, Button, Space, Typography } from 'antd';

type Props = {
  children: React.ReactNode;
};

type State = {
  hasError: boolean;
  error?: Error;
};

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div style={{ maxWidth: 720, margin: '64px auto', padding: 16 }}>
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <Typography.Title level={3} style={{ margin: 0 }}>
            页面遇到错误
          </Typography.Title>
          <Alert
            type="error"
            showIcon
            message="应用出现异常，已进入保护模式。"
            description={
              <div>
                <div style={{ marginBottom: 8 }}>
                  你可以尝试刷新页面。如果问题持续，建议先导出数据备份（如仍可操作）或稍后重试。
                </div>
                {this.state.error?.message ? (
                  <Typography.Text type="secondary">{this.state.error.message}</Typography.Text>
                ) : null}
              </div>
            }
          />
          <Space>
            <Button type="primary" onClick={() => window.location.reload()}>
              刷新页面
            </Button>
            <Button onClick={() => this.setState({ hasError: false, error: undefined })}>
              尝试继续
            </Button>
          </Space>
        </Space>
      </div>
    );
  }
}

