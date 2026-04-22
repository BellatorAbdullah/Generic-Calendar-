import { 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  format, 
  isSameMonth 
} from 'date-fns';

export const getMonthDays = (currentDate) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  return calendarDays.map((day) => ({
    date: day,
    key: format(day, 'yyyy-MM-dd'),
    isCurrentMonth: isSameMonth(day, monthStart),
    label: format(day, 'd'),
  }));
};