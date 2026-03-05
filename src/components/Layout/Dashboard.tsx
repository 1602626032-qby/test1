import { Layout } from 'antd';
import { TopBar } from './TopBar';
import { CalendarPanel } from '../Calendar/CalendarPanel';
import { TodoPanel } from '../Todo/TodoPanel';
import { ToolsPanel } from '../Tools/ToolsPanel';
import styles from './dashboard.module.css';

export function Dashboard() {
  return (
    <Layout style={{ minHeight: '100%', background: '#F8FAFC' }}>
      <Layout.Header style={{ background: '#fff', padding: 0, height: 60, lineHeight: '60px' }}>
        <TopBar />
      </Layout.Header>
      <Layout.Content style={{ padding: 16 }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div className={styles.topRow}>
            <TodoPanel />
            <CalendarPanel />
          </div>
          <div className={styles.bottomRow}>
            <ToolsPanel />
          </div>
        </div>
      </Layout.Content>
    </Layout>
  );
}

