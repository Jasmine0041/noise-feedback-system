// 反馈记录类型
export interface IFeedbackRecord {
  id: string;
  timestamp: number;
  status: 'quiet' | 'moderate' | 'noisy';
  messageSent: boolean;
  messageContent?: string;
}

// 飞书配置类型
export interface IFeiShuConfig {
  webhookUrl: string;
  isValid: boolean;
  lastTested?: number;
}

// 消息模板类型
export interface IMessageTemplate {
  id: string;
  content: string;
  style: 'humor' | 'warm' | 'formal';
  isEnabled: boolean;
  isDefault: boolean;
}

// 系统设置类型
export interface ISystemSettings {
  triggerThreshold: number;
  cooldownMinutes: number;
  autoStatusUpdate: boolean;
  appUrl?: string;
}

// 音量状态类型
export type NoiseStatus = 'quiet' | 'moderate' | 'noisy';

// 统计数据类型
export interface IStatisticsData {
  todayCount: number;
  weekCount: number;
  monthCount: number;
  totalCount: number;
  trendData: { date: string; count: number }[];
  hourlyDistribution: { hour: number; count: number }[];
  statusDistribution: { status: NoiseStatus; count: number }[];
}