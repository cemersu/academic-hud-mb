import React from 'react';
import type { Course, CourseSession } from '../../types';
import { calculateAcademicHours } from '../../utils/timeUtils';
import { Activity } from 'lucide-react';

interface AttendanceTrackerProps {
  courses: Course[];
  sessions: CourseSession[];
  missedSessionIdsMap: Record<string, string[]>; // { "2026-W39": ["s1", "s5"], ... }
}

export const AttendanceTracker: React.FC<AttendanceTrackerProps> = ({
  courses,
  sessions,
  missedSessionIdsMap,
}) => {
  // Her dersin tüm haftalar boyunca toplam kaçırılan saatini hesapla
  const getAbsenceHoursForCourse = (courseId: string): number => {
    let totalMissedHours = 0;

    // Tüm haftalardaki kaçırılan session ID'lerini gez
    Object.values(missedSessionIdsMap).forEach((missedList) => {
      missedList.forEach((sessionId) => {
        const session = sessions.find((s) => s.id === sessionId);
        if (session && session.courseId === courseId) {
          totalMissedHours += calculateAcademicHours(session.startTime, session.endTime);
        }
      });
    });

    return totalMissedHours;
  };

  return (
    <div className="bg-hud-card border border-hud-border rounded-xl p-4 flex flex-col gap-3 shadow-lg">
      <div className="flex items-center gap-2 border-b border-hud-border/60 pb-2">
        <Activity className="w-4 h-4 text-hud-red" />
        <span className="font-mono text-xs uppercase tracking-wider font-semibold text-hud-text">
          Devamsızlık Durumu
        </span>
      </div>

      <div className="flex flex-col gap-3 overflow-y-auto max-h-56 pr-1">
        {courses.map((course) => {
          const usedHours = getAbsenceHoursForCourse(course.id);
          const maxHours = course.maxAbsenceHours;
          const percentage = Math.min(100, Math.round((usedHours / maxHours) * 100));
          const isDanger = percentage >= 75;

          return (
            <div key={course.id} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-hud-text tracking-wide">
                  {course.name}
                </span>
                <span className="font-mono text-[11px] text-hud-muted">
                  <span className={isDanger ? 'text-hud-red font-bold' : 'text-hud-text'}>
                    {usedHours}
                  </span>{' '}
                  / {maxHours} SAAT
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-[#181B26] h-1.5 rounded-full overflow-hidden border border-hud-border/40">
                <div
                  style={{ width: `${percentage}%` }}
                  className={`h-full rounded-full transition-all duration-300 ${
                    isDanger ? 'bg-hud-red shadow-[0_0_8px_#EF4444]' : 'bg-hud-primary'
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};