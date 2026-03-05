import { Button, Card } from 'antd';
import { useState } from 'react';
import { ToolRow } from './ToolRow';
import { ToolModal } from './ToolModal';

export function ToolsPanel() {
  const [open, setOpen] = useState(false);

  return (
    <Card
      title="常用工具"
      extra={
        <Button size="small" type="primary" onClick={() => setOpen(true)}>
          + 添加
        </Button>
      }
    >
      <ToolRow />
      <ToolModal open={open} onClose={() => setOpen(false)} />
    </Card>
  );
}

