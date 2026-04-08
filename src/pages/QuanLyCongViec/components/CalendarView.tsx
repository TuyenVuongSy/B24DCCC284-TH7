import React, { useMemo } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import type { Task } from '@/models/useTaskModel';

// Setup localizer
const localizer = momentLocalizer(moment);

interface CalendarViewProps {
  taskModel: any;
}

const CalendarView: React.FC<CalendarViewProps> = ({ taskModel }) => {
  const events = useMemo(() => {
    return taskModel.tasks.map((task: Task) => {
      // Create a Date object from deadline
      const date = new Date(task.deadline);
      return {
        id: task.id,
        title: `${task.name} (${task.assignee})`,
        start: date, // Using deadline as both start and end for simple display
        end: date,
        allDay: true,
        resource: task,
      };
    });
  }, [taskModel.tasks]);

  const eventStyleGetter = (event: any) => {
    let backgroundColor = '#3174ad';
    if (event.resource.status === 'Đã xong') {
      backgroundColor = '#52c41a'; // green
    } else if (event.resource.status === 'Chưa làm') {
      backgroundColor = '#bfbfbf'; // gray
    }
    
    return {
      style: {
        backgroundColor,
        borderRadius: '5px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    };
  };

  return (
    <div style={{ height: '70vh', padding: 20, backgroundColor: '#fff', borderRadius: 8 }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        eventPropGetter={eventStyleGetter}
        views={['month', 'week', 'day']}
        messages={{
          next: "Tiếp",
          previous: "Trước",
          today: "Hôm nay",
          month: "Tháng",
          week: "Tuần",
          day: "Ngày",
        }}
      />
    </div>
  );
};

export default CalendarView;
