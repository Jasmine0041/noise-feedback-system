import { useState, useEffect } from 'react';
import { Volume2, CheckCircle, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import type { IFeedbackRecord, NoiseStatus, IMessageTemplate, ISystemSettings } from '@/types';

const STORAGE_KEYS = {
  FEEDBACK_RECORDS: '__global_noise_feedback_records',
  MESSAGE_TEMPLATES: '__global_noise_message_templates',
  SYSTEM_SETTINGS: '__global_noise_system_settings',
  LAST_FEEDBACK_TIME: '__global_noise_last_feedback_time',
};

export function FeedbackPage() {
  const [currentStatus, setCurrentStatus] = useState<NoiseStatus>('moderate');
  const [todayCount, setTodayCount] = useState(0);
  const [recentRecords, setRecentRecords] = useState<IFeedbackRecord[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadTodayCount();
    loadRecentRecords();
  }, []);

  const loadTodayCount = () => {
    const records = getFeedbackRecords();
    const today = new Date().setHours(0, 0, 0, 0);
    const count = records.filter(r => r.timestamp >= today).length;
    setTodayCount(count);
  };

  const loadRecentRecords = () => {
    const records = getFeedbackRecords();
    setRecentRecords(records.slice(-5).reverse());
  };

  const getFeedbackRecords = (): IFeedbackRecord[] => {
    const data = localStorage.getItem(STORAGE_KEYS.FEEDBACK_RECORDS);
    return data ? JSON.parse(data) : [];
  };

  const getMessageTemplates = (): IMessageTemplate[] => {
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
    const data = localStorage.getItem(STORAGE_KEYS.MESSAGE_TEMPLATES);
    return data ? JSON.parse(data) : defaultTemplates;
  };

  const getSystemSettings = (): ISystemSettings => {
    const defaultSettings: ISystemSettings = {
      triggerThreshold: 3,
      cooldownMinutes: 5,
      autoStatusUpdate: true,
    };
    const data = localStorage.getItem(STORAGE_KEYS.SYSTEM_SETTINGS);
    return data ? JSON.parse(data) : defaultSettings;
  };

  const handleFeedback = async () => {
    setIsSubmitting(true);
    
    try {
      const settings = getSystemSettings();
      const lastFeedbackTime = localStorage.getItem(STORAGE_KEYS.LAST_FEEDBACK_TIME);
      
      // 检查冷却时间
      if (lastFeedbackTime) {
        const cooldownMs = settings.cooldownMinutes * 60 * 1000;
        const timeSinceLastFeedback = Date.now() - parseInt(lastFeedbackTime);
        
        if (timeSinceLastFeedback < cooldownMs) {
          const remainingMinutes = Math.ceil((cooldownMs - timeSinceLastFeedback) / 60000);
          toast.info(`请等待 ${remainingMinutes} 分钟后再反馈`, {
            description: '这是为了避免频繁打扰大家',
          });
          setIsSubmitting(false);
          return;
        }
      }

      // 创建反馈记录
      const record: IFeedbackRecord = {
        id: uuidv4(),
        timestamp: Date.now(),
        status: currentStatus,
        messageSent: false,
      };

      // 保存记录
      const records = getFeedbackRecords();
      records.push(record);
      localStorage.setItem(STORAGE_KEYS.FEEDBACK_RECORDS, JSON.stringify(records));
      localStorage.setItem(STORAGE_KEYS.LAST_FEEDBACK_TIME, Date.now().toString());

      // 检查是否需要发送消息
      const todayRecords = records.filter(r => {
        const recordDate = new Date(r.timestamp).setHours(0, 0, 0, 0);
        const today = new Date().setHours(0, 0, 0, 0);
        return recordDate === today;
      });

      if (todayRecords.length >= settings.triggerThreshold) {
        // 发送消息
        await sendFeiShuMessage();
        record.messageSent = true;
        
        // 更新记录
        const updatedRecords = getFeedbackRecords();
        const lastRecord = updatedRecords[updatedRecords.length - 1];
        if (lastRecord) {
          lastRecord.messageSent = true;
          localStorage.setItem(STORAGE_KEYS.FEEDBACK_RECORDS, JSON.stringify(updatedRecords));
        }
      }

      // 更新界面
      loadTodayCount();
      loadRecentRecords();
      
      toast.success('反馈已记录！', {
        description: '感谢您的反馈，我们会妥善处理',
      });
    } catch (error) {
      toast.error('反馈失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const sendFeiShuMessage = async () => {
    const templates = getMessageTemplates();
    const enabledTemplates = templates.filter(t => t.isEnabled);
    
    if (enabledTemplates.length === 0) return;
    
    const defaultTemplate = enabledTemplates.find(t => t.isDefault) || enabledTemplates;
    
    // 这里模拟发送，实际应该调用飞书API
    console.log('发送飞书消息:', defaultTemplate.content);
    
    // 实际发送代码（需要配置webhook）
    // await fetch(webhookUrl, {...});
  };

  const getStatusColor = (status: NoiseStatus) => {
    switch (status) {
      case 'quiet':
        return 'bg-[hsl(142_71%_45%)]';
      case 'moderate':
        return 'bg-[hsl(38_92%_50%)]';
      case 'noisy':
        return 'bg-[hsl(0_84%_60%)]';
    }
  };

  const getStatusText = (status: NoiseStatus) => {
    switch (status) {
      case 'quiet':
        return '安静';
      case 'moderate':
        return '适中';
      case 'noisy':
        return '较吵';
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-[hsl(222_47%_11%)]">音量反馈</h1>
        <p className="text-[hsl(215_16%_47%)] mt-1">快速反馈办公室音量情况</p>
      </div>

      {/* Current status card */}
      <Card className="border-l-4 border-l-[hsl(217_91%_60%)]">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Volume2 className="h-5 w-5 text-[hsl(217_91%_60%)]" />
            当前办公室状态
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className={`w-4 h-4 rounded-full ${getStatusColor(currentStatus)} animate-pulse`} />
            <span className="text-2xl font-bold">{getStatusText(currentStatus)}</span>
          </div>
          <p className="text-sm text-[hsl(215_16%_47%)] mt-2">
            基于最近反馈自动判断
          </p>
        </CardContent>
      </Card>

      {/* Main feedback button */}
      <div className="flex justify-center py-8">
        <Button
          onClick={handleFeedback}
          disabled={isSubmitting}
          className="w-full max-w-md h-24 bg-[hsl(217_91%_60%)] hover:bg-[hsl(217_91%_50%)] text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 flex flex-col items-center justify-center gap-2 group"
        >
          <Volume2 className="h-8 w-8 group-hover:scale-110 transition-transform" />
          <span className="text-lg font-semibold">办公室音量过高</span>
          <span className="text-sm opacity-80">点击反馈，发送温馨提醒</span>
        </Button>
      </div>

      {/* Today's stats */}
      <Card className="bg-gradient-to-br from-white to-[hsl(210_40%_96%)]">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[hsl(215_16%_47%)]">今日反馈次数</p>
              <p className="text-3xl font-bold text-[hsl(222_47%_11%)] mt-1">{todayCount}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-[hsl(217_91%_60%)]/10 flex items-center justify-center">
              <MessageCircle className="h-6 w-6 text-[hsl(217_91%_60%)]" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent records */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">最近反馈记录</CardTitle>
        </CardHeader>
        <CardContent>
          {recentRecords.length === 0 ? (
            <p className="text-center text-[hsl(215_16%_47%)] py-4">暂无反馈记录</p>
          ) : (
            <div className="space-y-3">
              {recentRecords.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-[hsl(210_40%_96%)]"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(record.status)}`} />
                    <span className="text-sm">{getStatusText(record.status)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {record.messageSent && (
                      <Badge variant="outline" className="text-[hsl(142_71%_45%)] border-[hsl(142_71%_45%)]">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        已提醒
                      </Badge>
                    )}
                    <span className="text-xs text-[hsl(215_16%_47%)]">
                      {formatTime(record.timestamp)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}