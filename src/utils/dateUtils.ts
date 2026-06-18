
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export const formatDateTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const dateStr = formatDate(d);
  const h = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${dateStr} ${h}:${min}`;
};

export const formatMonth = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

export const getMonthLabel = (monthKey: string): string => {
  const [, m] = monthKey.split('-');
  const labels = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
  return labels[parseInt(m, 10) - 1];
};

export const getStreakDays = (dateStrings: string[]): number => {
  if (dateStrings.length === 0) return 0;
  const dates = [...new Set(dateStrings.map((d) => formatDate(d)))].sort().reverse();
  const today = formatDate(new Date());
  let streak = 0;
  let cursor = new Date(today);
  for (const dateStr of dates) {
    if (dateStr === formatDate(cursor)) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else if (streak === 0 && dateStr < today) {
      break;
    } else if (streak > 0) {
      break;
    }
  }
  return streak;
};

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

export const getRelativeTime = (dateStr: string): string => {
  const d = new Date(dateStr).getTime();
  const now = Date.now();
  const diff = now - d;
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  if (diff < minute) return '刚刚';
  if (diff < hour) return `${Math.floor(diff / minute)}分钟前`;
  if (diff < day) return `${Math.floor(diff / hour)}小时前`;
  if (diff < 7 * day) return `${Math.floor(diff / day)}天前`;
  return formatDate(dateStr);
};
