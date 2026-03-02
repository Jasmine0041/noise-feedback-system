import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Settings, Webhook, MessageSquare, Bell, Link2 } from 'lucide-react';
import type { IMessageTemplate, ISystemSettings, IFeiShuConfig } from '@/types';

const STORAGE_KEYS = {
  FEI_SHU_CONFIG: '__global_noise_fei_shu_config',
  MESSAGE_TEMPLATES: '__global_noise_message_templates',
  SYSTEM_SETTINGS: '__global_noise_system_settings',
};

export function SettingsPage() {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [appUrl, setAppUrl] = useState('');
  const [triggerThreshold, setTriggerThreshold] = useState(3);
  const [cooldownMinutes, setCooldownMinutes] = useState(5);
  const [templates, setTemplates] = useState<IMessageTemplate[]>([]);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    const feiShuData = localStorage.getItem(STORAGE_KEYS.FEI_SHU_CONFIG);
    if (feiShuData) {
      const config: IFeiShuConfig = JSON.parse(feiShuData);
      setWebhookUrl(config.webhookUrl);
    }

    const settingsData = localStorage.getItem(STORAGE_KEYS.SYSTEM_SETTINGS);
    if (settingsData) {
      const settings: ISystemSettings = JSON.parse(settingsData);
      setAppUrl(settings.appUrl || '');
      setTriggerThreshold(settings.triggerThreshold);
      setCooldownMinutes(settings.cooldownMinutes);
    }

    const templatesData = localStorage.getItem(STORAGE_KEYS.MESSAGE_TEMPLATES);
    if (templatesData) {
      setTemplates(JSON.parse(templatesData));
    } else {
      // 默认模板
      const defaultTemplates: IMessageTemplate[] = [
        {
          id: '1',
          content: '🔔 叮咚~ 办公室的"分贝小精灵"提醒您：当前音量已超标，会议室的大门永远为您敞开~',
          style: 'humor',
          isEnabled: true,
          isDefault: true,
        },
        {
          id: '2',
          content: '💙 亲爱的同事们，办公室有点热闹呢，如需讨论可以移步会议室，让专注的小伙伴也能安心工作~',
          style: 'warm',
          isEnabled: true,
          isDefault: false,
        },
        {
          id: '3',
          content: '📢 办公室音量较高，建议使用会议室进行沟通，感谢配合！',
          style: 'formal',
          isEnabled: true,
          isDefault: false,
        },
      ];
      setTemplates(defaultTemplates);
    }
  };

  const saveSettings = () => {
    const feiShuConfig: IFeiShuConfig = {
      webhookUrl,
      isValid: webhookUrl.includes('feishu.cn'),
    };
    localStorage.setItem(STORAGE_KEYS.FEI_SHU_CONFIG, JSON.stringify(feiShuConfig));

    const systemSettings: ISystemSettings = {
      triggerThreshold,
      cooldownMinutes,
      autoStatusUpdate: true,
      appUrl,
    };
    localStorage.setItem(STORAGE_KEYS.SYSTEM_SETTINGS, JSON.stringify(systemSettings));

    localStorage.setItem(STORAGE_KEYS.MESSAGE_TEMPLATES, JSON.stringify(templates));

    toast.success('设置已保存');
  };

  const toggleTemplate = (id: string) => {
    setTemplates(templates.map(t => 
      t.id === id ? { ...t, isEnabled: !t.isEnabled } : t
    ));
  };

  const setDefaultTemplate = (id: string) => {
    setTemplates(templates.map(t => ({
      ...t,
      isDefault: t.id === id
    })));
  };

  const testWebhook = () => {
    if (!webhookUrl) {
      toast.error('请先填写 Webhook 地址');
      return;
    }
    toast.success('测试消息已发送（模拟）');
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-[hsl(222_47%_11%)]">系统配置</h1>
        <p className="text-[hsl(215_16%_47%)] mt-1">配置飞书机器人和消息模板</p>
      </div>

      {/* Feishu Webhook */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Webhook className="h-5 w-5 text-[hsl(217_91%_60%)]" />
            飞书 Webhook 配置
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="webhook">Webhook 地址</Label>
            <div className="flex gap-2">
              <Input
                id="webhook"
                placeholder="https://open.feishu.cn/open-apis/bot/v2/hook/..."
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
              />
              <Button variant="outline" onClick={testWebhook}>
                测试
              </Button>
            </div>
            <p className="text-xs text-[hsl(215_16%_47%)]">
              在飞书群设置 → 添加自定义机器人 → 复制 Webhook 地址
            </p>
          </div>
        </CardContent>
      </Card>

      {/* App URL */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Link2 className="h-5 w-5 text-[hsl(217_91%_60%)]" />
            应用访问地址
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="appUrl">部署后的应用 URL</Label>
            <Input
              id="appUrl"
              placeholder="https://your-app.vercel.app"
              value={appUrl}
              onChange={(e) => setAppUrl(e.target.value)}
            />
            <p className="text-xs text-[hsl(215_16%_47%)]">
              部署后复制 Vercel 分配的域名，用于生成飞书卡片链接
            </p>
          </div>
        </CardContent>
      </Card>

      {/* System Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings className="h-5 w-5 text-[hsl(217_91%_60%)]" />
            系统设置
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="threshold">触发提醒阈值（次）</Label>
            <Input
              id="threshold"
              type="number"
              min={1}
              max={10}
              value={triggerThreshold}
              onChange={(e) => setTriggerThreshold(parseInt(e.target.value) || 1)}
            />
            <p className="text-xs text-[hsl(215_16%_47%)]">
              当天反馈达到此次数后自动发送飞书提醒
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="cooldown">反馈冷却时间（分钟）</Label>
            <Input
              id="cooldown"
              type="number"
              min={1}
              max={60}
              value={cooldownMinutes}
              onChange={(e) => setCooldownMinutes(parseInt(e.target.value) || 1)}
            />
            <p className="text-xs text-[hsl(215_16%_47%)]">
              同一人两次反馈之间的最小间隔
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Message Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-[hsl(217_91%_60%)]" />
            消息模板
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className="p-4 rounded-lg border border-[hsl(214_32%_91%)] space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={template.isEnabled}
                    onCheckedChange={() => toggleTemplate(template.id)}
                  />
                  <Badge variant={template.style === 'humor' ? 'default' : template.style === 'warm' ? 'secondary' : 'outline'}>
                    {template.style === 'humor' ? '幽默' : template.style === 'warm' ? '温馨' : '正式'}
                  </Badge>
                  {template.isDefault && (
                    <Badge variant="default" className="bg-[hsl(142_71%_45%)]">默认</Badge>
                  )}
                </div>
                {!template.isDefault && template.isEnabled && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDefaultTemplate(template.id)}
                  >
                    设为默认
                  </Button>
                )}
              </div>
              <p className="text-sm text-[hsl(222_47%_11%)]">{template.content}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Save button */}
      <div className="flex justify-end">
        <Button onClick={saveSettings} className="bg-[hsl(217_91%_60%)] hover:bg-[hsl(217_91%_50%)]">
          <Bell className="h-4 w-4 mr-2" />
          保存所有设置
        </Button>
      </div>
    </div>
  );
}