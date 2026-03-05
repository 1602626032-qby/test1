import { Form, Input, Modal, message } from 'antd';
import { useEffect } from 'react';
import type { Tool } from '@/types/tool';
import { isValidHttpUrl, normalizeUrl, useToolsStore } from '@/stores/toolsStore';

type Values = {
  name: string;
  url: string;
  icon?: string;
};

export function ToolModal({
  open,
  onClose,
  initial,
}: {
  open: boolean;
  onClose: () => void;
  initial?: Tool | null;
}) {
  const add = useToolsStore((s) => s.addTool);
  const update = useToolsStore((s) => s.updateTool);
  const [form] = Form.useForm<Values>();

  useEffect(() => {
    if (!open) return;
    if (initial) {
      form.setFieldsValue({ name: initial.name, url: initial.url, icon: initial.icon });
    } else {
      form.setFieldsValue({ name: '', url: '', icon: '🔗' });
    }
  }, [form, initial, open]);

  return (
    <Modal
      open={open}
      title={initial ? '编辑工具' : '添加工具'}
      okText={initial ? '保存' : '添加'}
      cancelText="取消"
      onCancel={onClose}
      onOk={async () => {
        const v = await form.validateFields();
        const url = normalizeUrl(v.url);
        if (!isValidHttpUrl(url)) {
          message.error('URL 必须以 http:// 或 https:// 开头（或可自动补全为 https://）');
          return;
        }
        if (initial) {
          update(initial.id, { name: v.name.trim(), url, icon: (v.icon || '🔗').trim() || '🔗' });
        } else {
          add({ name: v.name.trim(), url, icon: (v.icon || '🔗').trim() || '🔗' });
        }
        onClose();
      }}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="名称" rules={[{ required: true, message: '请输入名称' }]}>
          <Input maxLength={40} placeholder="例如：Notion" />
        </Form.Item>
        <Form.Item name="url" label="URL" rules={[{ required: true, message: '请输入 URL' }]}>
          <Input placeholder="https://example.com" />
        </Form.Item>
        <Form.Item name="icon" label="图标（Emoji，可选）">
          <Input maxLength={4} placeholder="例如：📁" />
        </Form.Item>
      </Form>
    </Modal>
  );
}

