import React from 'react';
import type { Course } from '../../types';
import type { CourseSession } from '../../types';
import { calculateTopOffset, calculateBlockHeight } from '../../utils/timeUtils';
import { Trash2 } from 'lucide-react';

interface CourseBlockProps {
  session: CourseSession;
  course?: Course;
  isMissed: boolean;
  onToggleStatus: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
}

export const CourseBlock: React.FC<CourseBlockProps> = ({
  session,
  course,
  isMissed,
  onToggleStatus,
  onDeleteSession,
}) => {
  const top = calculateTopOffset(session.startTime);
  const height = calculateBlockHeight(session.startTime, session.endTime);

  const courseName = course ? course.name : 'Bilinmeyen Ders';

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onToggleStatus(session.id);
      }}
      style={{
        top: `${top}px`,
        height: `${height}px`,
      }}
      className={`group absolute left-1 right-1 rounded-md p-2 cursor-pointer transition-all duration-150 select-none flex flex-col justify-between overflow-hidden border ${
        isMissed
          ? 'bg-hud-red/20 border-hud-red text-hud-red shadow-[0_0_12px_rgba(239,68,68,0.25)]'
          : 'bg-[#151928] hover:bg-[#1C2237] border-hud-borderLight text-hud-text'
      }`}
    >
      <div>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-xs tracking-wide">
            {courseName}
          </span>
          <div className="flex items-center gap-1.5">
            {/* Silme İkonu */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm(`${courseName} dersinin bu saatini takvimden silmek istiyor musun?`)) {
                  onDeleteSession(session.id);
                }
              }}
              className="opacity-0 group-hover:opacity-100 text-hud-muted hover:text-hud-red transition-all p-0.5 rounded"
              title="Bu oturumu sil"
            >
              <Trash2 className="w-3 h-3" />
            </button>
            <span
              className={`w-2 h-2 rounded-full ${
                isMissed ? 'bg-hud-red' : 'bg-hud-green'
              }`}
            />
          </div>
        </div>
        <div className="text-[10px] text-hud-muted mt-0.5">
          {session.room || 'Lecture'}
        </div>
      </div>

      <div className="text-[10px] font-mono text-hud-muted/80">
        {session.startTime} - {session.endTime}
      </div>
    </div>
  );
};