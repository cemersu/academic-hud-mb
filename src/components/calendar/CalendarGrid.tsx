import React from 'react';
import type { Course } from '../../types';
import type { CourseSession } from '../../types';
import { CourseBlock } from './CourseBlock';
import { START_HOUR, END_HOUR, HOUR_HEIGHT } from '../../utils/timeUtils';

interface CalendarGridProps {
  courses: Course[];
  sessions: CourseSession[];
  missedSessionIds: Set<string>;
  onToggleSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  onSlotClick?: (day: number, hour: number) => void;
}

const DAYS = [
  { id: 1, name: 'PAZARTESİ' },
  { id: 2, name: 'SALI' },
  { id: 3, name: 'ÇARŞAMBA' },
  { id: 4, name: 'PERŞEMBE' },
  { id: 5, name: 'CUMA' },
];

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  courses,
  sessions,
  missedSessionIds,
  onToggleSession,
  onDeleteSession,
  onSlotClick,
}) => {
  const hours = Array.from(
    { length: END_HOUR - START_HOUR },
    (_, i) => START_HOUR + i
  );

  const getCourseById = (id: string) => courses.find((c) => c.id === id);

  return (
    <div className="flex flex-col h-full bg-hud-card border border-hud-border rounded-xl overflow-hidden shadow-2xl">
      <div className="grid grid-cols-[60px_repeat(5,1fr)] border-b border-hud-border bg-hud-card/80 backdrop-blur sticky top-0 z-10">
        <div className="p-3 text-[11px] font-mono text-hud-muted text-center border-r border-hud-border flex items-center justify-center">
          SAAT
        </div>
        {DAYS.map((day) => (
          <div
            key={day.id}
            className="p-3 text-xs font-semibold text-center tracking-wider text-hud-text border-r border-hud-border last:border-r-0"
          >
            {day.name}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-[60px_repeat(5,1fr)] flex-1 overflow-y-auto relative">
        <div className="border-r border-hud-border bg-[#0E1017]">
          {hours.map((hour) => (
            <div
              key={hour}
              style={{ height: `${HOUR_HEIGHT}px` }}
              className="border-b border-hud-border/40 text-[11px] font-mono text-hud-muted text-center pt-2 select-none"
            >
              {String(hour).padStart(2, '0')}:00
            </div>
          ))}
        </div>

        {DAYS.map((day) => {
          const daySessions = sessions.filter((s) => s.dayOfWeek === day.id);

          return (
            <div
              key={day.id}
              className="relative border-r border-hud-border/50 last:border-r-0 bg-hud-card/30"
              style={{ height: `${hours.length * HOUR_HEIGHT}px` }}
            >
              {hours.map((hour) => (
                <div
                  key={hour}
                  onClick={() => onSlotClick && onSlotClick(day.id, hour)}
                  style={{ height: `${HOUR_HEIGHT}px` }}
                  className="border-b border-hud-border/30 hover:bg-hud-cardHover/40 cursor-pointer transition-colors"
                />
              ))}

              {daySessions.map((session) => (
                <CourseBlock
                  key={session.id}
                  session={session}
                  course={getCourseById(session.courseId)}
                  isMissed={missedSessionIds.has(session.id)}
                  onToggleStatus={onToggleSession}
                  onDeleteSession={onDeleteSession}
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};