import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, Trash2, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { IFeedbackRecord, NoiseStatus } from '@/types';

const STORAGE_KEYS = {
  FEEDBACK_RECORDS: '__global_noise_feedback_records',
};

export function HistoryPage() {
  const [records, setRecords] = useState<IFeedbackRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<IFeedbackRecord[]>([]);
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    loadRecords();
  }, []);

  useEffect(() => {
    filterRecords();
  }, [records, dateFilter]);

  const loadRecords = () => {
    const data = localStorage.getItem(STORAGE_KEYS.FEEDBACK_RECORDS);
    const allRecords = data ? JSON.parse(data) : [];
    setRecords(allRecords.reverse());
  };

  const filterRecords = () => {
    if (!dateFilter) {
      setFilteredRecords(records);
      return;
    }
    const filtered = records.filter(r => {
      const recordDate = new Date(r.timestamp).toISOString().split('T');
      return recordDate === dateFilter;
    });
    setFilteredRecords(filtered);
  };

  const clearHistory = () => {
    if (confirm('确定要清空所有历史记录吗？此操作不可恢复。')) {
      localStorage.removeItem(STORAGE_KEYS.FEEDBACK_RECORDS);
      setRecords([]);
      toast.success('历史记录已清空');
    }
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

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[hsl(222_47%_11%)]">历史记录</h1>
          <p className="text-[hsl(215_16%_47%)] mt-1">查看所有反馈记录</p>
        </div>
        <Button variant="destructive" size="sm" onClick={clearHistory}>
          <Trash2 className="h-4 w-4 mr-2" />
          清空记录
        </Button>
      </div>

      {/* Date filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-[hsl(215_16%_47%)]" />
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-auto"
            />
            {dateFilter && (
              <Button variant="ghost" size="sm" onClick={() => setDateFilter('')}>
                清除筛选
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Records list */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            反馈记录 ({filteredRecords.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredRecords.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="h-12 w-12 text-[hsl(215_16%_47%)] mx-auto mb-4" />
              <p className="text-[hsl(215_16%_47%)]">暂无记录</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredRecords.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-[hsl(214_32%_91%)] hover:bg-[hsl(210_40%_96%)] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(record.status)}`} />
                    <div>
                      <p className="font-medium">{getStatusText(record.status)}</p>
                      <p className="text-xs text-[hsl(215_16%_47%)]">
                        {formatDate(record.timestamp)}
                      </p>
                    </div>
                  </div>
                  {record.messageSent && (
                    <Badge variant="outline" className="text-[hsl(142_71%_45%)]">
                      已发送提醒
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}