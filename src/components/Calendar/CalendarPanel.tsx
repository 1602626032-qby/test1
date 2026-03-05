import { Card } from 'antd';
import { MonthView } from './MonthView';

export function CalendarPanel() {
  return (
    <Card title="日历（日程）" styles={{ body: { paddingTop: 8 } }}>
      <MonthView />
    </Card>
  );
}

