import { Button, Modal, Tooltip } from 'antd';
import { useMemo, useState } from 'react';
import type { Tool } from '@/types/tool';
import { useToolsStore } from '@/stores/toolsStore';
import styles from './toolRow.module.css';
import { ToolModal } from './ToolModal';

export function ToolRow() {
  const tools = useToolsStore((s) => s.tools);
  const del = useToolsStore((s) => s.deleteTool);

  const [editing, setEditing] = useState<Tool | null>(null);
  const [open, setOpen] = useState(false);

  const sorted = useMemo(() => tools, [tools]);

  return (
    <div className={styles.row}>
      {sorted.map((t) => (
        <div
          key={t.id}
          className={styles.card}
          role="button"
          tabIndex={0}
          onClick={() => window.open(t.url, '_blank', 'noopener,noreferrer')}
          onKeyDown={(e) => {
            if (e.key === 'Enter') window.open(t.url, '_blank', 'noopener,noreferrer');
          }}
        >
          <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
            <Tooltip title="编辑">
              <Button
                size="small"
                onClick={() => {
                  setEditing(t);
                  setOpen(true);
                }}
              >
                ✏️
              </Button>
            </Tooltip>
            <Tooltip title="删除">
              <Button
                size="small"
                danger
                onClick={() => {
                  Modal.confirm({
                    title: '确认删除？',
                    okText: '删除',
                    cancelText: '取消',
                    okButtonProps: { danger: true },
                    onOk: () => del(t.id),
                  });
                }}
              >
                🗑️
              </Button>
            </Tooltip>
          </div>
          <div className={styles.icon}>{t.icon || '🔗'}</div>
          <div className={styles.name}>{t.name}</div>
        </div>
      ))}

      <ToolModal
        open={open}
        onClose={() => {
          setOpen(false);
          setEditing(null);
        }}
        initial={editing}
      />
    </div>
  );
}

