import { Button, Form, Input, Modal, Space, Typography, Upload, message } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { useEffect, useMemo, useState } from 'react';
import { useCalendarStore } from '@/stores/calendarStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { useTodoStore } from '@/stores/todoStore';
import { useToolsStore } from '@/stores/toolsStore';
import { buildBackupPayload, downloadBackup, readFileAsText, validateBackupJson } from '@/utils/backup';

dayjs.locale('zh-cn');

export function TopBar() {
  const [now, setNow] = useState(() => dayjs());
  const nickname = useSettingsStore((s) => s.nickname);
  const setNickname = useSettingsStore((s) => s.setNickname);

  const todos = useTodoStore((s) => s.todos);
  const events = useCalendarStore((s) => s.events);
  const tools = useToolsStore((s) => s.tools);

  const [nicknameOpen, setNicknameOpen] = useState(false);
  const [backupOpen, setBackupOpen] = useState(false);
  const [importing, setImporting] = useState(false);

  const [nicknameForm] = Form.useForm<{ nickname: string }>();

  const defaultBackupName = useMemo(() => {
    return `personal-dashboard-backup-${now.format('YYYYMMDD')}.json`;
  }, [now]);

  useEffect(() => {
    const t = window.setInterval(() => setNow(dayjs()), 1000 * 30);
    return () => window.clearInterval(t);
  }, []);

  const setAllData = (payload: ReturnType<typeof buildBackupPayload>) => {
    useTodoStore.setState({ todos: payload.todos });
    useCalendarStore.setState({ events: payload.events });
    useToolsStore.setState({ tools: payload.tools });
    if (payload.settings?.nickname) useSettingsStore.setState({ nickname: payload.settings.nickname });
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        borderBottom: '1px solid #E2E8F0',
      }}
    >
      <Typography.Text style={{ color: '#1E293B' }}>
        {now.format('YYYY年M月D日 dddd HH:mm')}
      </Typography.Text>
      <Space>
        <Typography.Text>
          下午好，
          <Button
            type="link"
            style={{ padding: 0, height: 'auto' }}
            onClick={() => {
              nicknameForm.setFieldsValue({ nickname });
              setNicknameOpen(true);
            }}
          >
            {nickname || '用户'}
          </Button>
        </Typography.Text>
        <Button size="small" onClick={() => setBackupOpen(true)}>
          数据备份
        </Button>
      </Space>

      <Modal
        open={nicknameOpen}
        title="编辑昵称"
        okText="保存"
        cancelText="取消"
        onCancel={() => setNicknameOpen(false)}
        onOk={async () => {
          const values = await nicknameForm.validateFields();
          setNickname(values.nickname.trim() || '用户');
          setNicknameOpen(false);
        }}
      >
        <Form form={nicknameForm} layout="vertical">
          <Form.Item name="nickname" label="昵称" rules={[{ required: true, message: '请输入昵称' }]}>
            <Input placeholder="例如：小明" maxLength={20} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={backupOpen}
        title="数据备份"
        okText="关闭"
        cancelButtonProps={{ style: { display: 'none' } }}
        onOk={() => setBackupOpen(false)}
        onCancel={() => setBackupOpen(false)}
      >
        <Space direction="vertical" size={12} style={{ width: '100%' }}>
          <div style={{ color: '#64748B' }}>
            建议定期导出备份，以防清理浏览器缓存导致数据丢失。
          </div>
          <Button
            type="primary"
            onClick={() => {
              const payload = buildBackupPayload({ todos, events, tools, settings: { nickname } });
              downloadBackup(payload, defaultBackupName);
              message.success('已导出备份文件');
            }}
          >
            导出数据（下载 JSON）
          </Button>
          <Upload
            accept=".json,application/json"
            showUploadList={false}
            beforeUpload={async (file) => {
              Modal.confirm({
                title: '确认导入？',
                content: '导入将覆盖当前数据。建议先导出当前数据作为备份。',
                okText: '确认导入',
                cancelText: '取消',
                onOk: async () => {
                  setImporting(true);
                  try {
                    const text = await readFileAsText(file);
                    const res = validateBackupJson(text);
                    if (!res.ok) {
                      message.error(res.error);
                      return;
                    }
                    setAllData(res.payload);
                    message.success('导入成功');
                  } catch {
                    message.error('导入失败（读取文件或解析异常）。');
                  } finally {
                    setImporting(false);
                  }
                },
              });
              return false;
            }}
          >
            <Button loading={importing}>从文件导入（覆盖式）</Button>
          </Upload>
        </Space>
      </Modal>
    </div>
  );
}

