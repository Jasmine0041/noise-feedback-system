import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, MessageSquare, Calendar } from 'lucide-react';
import type { IFeedbackRecord, IStatisticsData, NoiseStatus } from '@/types';

const STORAGE_KEYS = {
  FEEDBACK_RECORDS: '__global_noise_feedback_records',
};

export function StatisticsPage() {
  const [stats, setStats] = useState<IStatisticsData>({
    todayCount: 0,
    weekCount: 0,
    monthCount: 0,
    totalCount: 0,
    trendData: [],
    hourlyDistribution: [],
    statusDistribution: [],
  });

  useEffect(() => {
    calculateStatistics();
  }, []);

  const getFeedbackRecords = (): IFeedbackRecord[] => {
    const data = localStorage.getItem(STORAGE_KEYS.FEEDBACK_RECORDS);
    return data ? JSON.parse(data) : [];
  };

  const calculateStatistics = () => {
    const records = getFeedbackRecords();
    const now = new Date();
    
    // Today
    const today = new Date(now).setHours(0, 0, 0, 0);
    const todayCount = records.filter(r => r.timestamp >= today).length;
    
    // Week
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).getTime();
    const weekCount = records.filter(r => r.timestamp >= weekAgo).length;
    
    // Month
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).getTime();
    const monthCount = records.filter(r => r.timestamp >= monthAgo).length;
    
    // Total
    const totalCount = records.length;
    
    // Trend data (last 7 days)
    const trendData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
      const dayStart = new Date(date).setHours(0, 0, 0, 0);
      const dayEnd = new Date(date).setHours(23, 59, 59, 999);
      const count = records.filter(r => r.timestamp >= dayStart && r.timestamp <= dayEnd).length;
      trendData.push({ date: dateStr, count });
    }
    
    // Hourly distribution
    const hourlyDistribution = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      count: records.filter(r => new Date(r.timestamp).getHours() === hour).length,
    })).filter(h => h.count > 0);
    
    // Status distribution
    const statusCount: Record<NoiseStatus, number> = { quiet: 0, moderate: 0, noisy: 0 };
    records.forEach(r => {
      statusCount[r.status]++;
    });
    const statusDistribution = Object.entries(statusCount).map(([status, count]) => ({
      status: status as NoiseStatus,
      count,
    }));
    
    setStats({
      todayCount,
      weekCount,
      monthCount,
      totalCount,
      trendData,
      hourlyDistribution,
      statusDistribution,
    });
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

  const maxTrendCount = Math.max(...stats.trendData.map(d => d.count), 1);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-[hsl(222_47%_11%)]">数据统计</h1>
        <p className="text-[hsl(215_16%_47%)] mt-1">反馈数据分析与趋势</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-white to-[hsl(210_40%_96%)]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[hsl(215_16%_47%)]">今日反馈</p>
                <p className="text-2xl font-bold">{stats.todayCount}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-[hsl(217_91%_60%)]/10 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-[hsl(217_91%_60%)]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-[hsl(210_40%_96%)]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[hsl(215_16%_47%)]">本周累计</p>
                <p className="text-2xl font-bold">{stats.weekCount}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-[hsl(142_71%_45%)]/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-[hsl(142_71%_45%)]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-[hsl(210_40%_96%)]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[hsl(215_16%_47%)]">本月累计</p>
                <p className="text-2xl font-bold">{stats.monthCount}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-[hsl(38_92%_50%)]/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-[hsl(38_92%_50%)]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-[hsl(210_40%_96%)]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[hsl(215_16%_47%)]">历史总计</p>
                <p className="text-2xl font-bold">{stats.totalCount}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-[hsl(250_95%_76%)]/10 flex items-center justify-center">
                <TrendingDown className="h-5 w-5 text-[hsl(250_95%_76%)]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">近7天反馈趋势</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.trendData.length === 0 ? (
            <p className="text-center text-[hsl(215_16%_47%)] py-8">暂无数据</p>
          ) : (
            <div className="space-y-3">
              {stats.trendData.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="w-16 text-xs text-[hsl(215_16%_47%)]">{item.date}</span>
                  <div className="flex-1 h-6 bg-[hsl(210_40%_96%)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[hsl(217_91%_60%)] rounded-full transition-all duration-500"
                      style={{ width: `${(item.count / maxTrendCount) * 100}%` }}
                    />
                  </div>
                  <span className="w-8 text-xs font-medium text-right">{item.count}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Status Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">状态分布</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.statusDistribution.length === 0 || stats.totalCount === 0 ? (
            <p className="text-center text-[hsl(215_16%_47%)] py-8">暂无数据</p>
          ) : (
            <div className="flex gap-4 flex-wrap">
              {stats.statusDistribution.map((item) => (
                <div key={item.status} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(item.status)}`} />
                  <span className="text-sm">{getStatusText(item.status)}</span>
                  <Badge variant="secondary">{item.count}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Peak Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">高峰时段</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.hourlyDistribution.length === 0 ? (
            <p className="text-center text-[hsl(215_16%_47%)] py-8">暂无数据</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {stats.hourlyDistribution
                .sort((a, b) => b.count - a.count)
                .slice(0, 5)
                .map((item) => (
                  <Badge key={item.hour} variant="outline" className="text-sm py-1 px-3">
                    {item.hour}:00 - {item.count}次
                  </Badge>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}