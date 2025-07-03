import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './CalendarCustom.css';

const locales = {
  'en-US': enUS,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

type CalendarEvent = {
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  resource?: any;
};

const CalendarPage: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const [eventsRes, jobsRes] = await Promise.all([
          fetch('/api/events'),
          fetch('/api/jobs'),
        ]);
        if (!eventsRes.ok || !jobsRes.ok) {
          throw new Error('Failed to fetch events or jobs');
        }
        const eventsData = await eventsRes.json();
        const jobsData = await jobsRes.json();
        // Map events
        const mappedEvents = eventsData.map((ev: any) => ({
          title: ev.title,
          start: new Date(ev.startTime),
          end: new Date(ev.endTime),
          allDay: false,
          resource: { type: 'event', id: ev.id, ...ev },
        }));
        // Map jobs (use applicationDeadline or createdAt as date)
        const mappedJobs = jobsData.map((job: any) => ({
          title: job.title + (job.company ? ` @ ${job.company}` : ''),
          start: job.applicationDeadline ? new Date(job.applicationDeadline) : new Date(job.createdAt),
          end: job.applicationDeadline ? new Date(job.applicationDeadline) : new Date(job.createdAt),
          allDay: true,
          resource: { type: 'job', id: job.id, ...job },
        }));
        setEvents([...mappedEvents, ...mappedJobs]);
      } catch (err: any) {
        setError(err.message || 'Failed to load calendar data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div style={{ height: 500 }}>
      {loading ? (
        <div style={{padding: '2rem', textAlign: 'center'}}>Loading calendar...</div>
      ) : error ? (
        <div style={{padding: '2rem', color: 'red', textAlign: 'center'}}>{error}</div>
      ) : (
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          eventPropGetter={(event: any) => {
            let bg = event.resource?.type === 'job' ? '#06b6d4' : '#2563eb';
            return { style: { backgroundColor: bg, color: '#fff', borderRadius: 8, border: 'none' } };
          }}
        />
      )}
    </div>
  );
};

export default CalendarPage; 