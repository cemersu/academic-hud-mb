import React from 'react';
import type { Course } from '../../types';
import type { CourseSession } from '../../types';
import { calculateAcademicHours } from '../../utils/timeUtils';
import { Activity, Trash2, Edit2 } from 'lucide-react'; // Edit2 eklendi

interface AttendanceTrackerProps {
  courses: Course[];
  sessions: CourseSession[];
  missedSessionIdsMap: Record<string, string[]>;
  onDeleteCourse?: (courseId: string) => void;
  onEditCourse?: (course: Course) => void; // Yeni prop eklendi
}

export const AttendanceTracker: React.FC<AttendanceTrackerProps> = ({
  courses,
  sessions,
  missedSessionIdsMap,
  onDeleteCourse,
  onEditCourse,
}) => {
  const getAbsenceHoursForCourse = (courseId: string): number => {
    let totalMissedHours = 0;
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
        {courses.length === 0 ? (
          <div className="text-[11px] text-hud-muted text-center py-4">
            Henüz ders eklenmedi.
          </div>
        ) : (
          courses.map((course) => {
            const usedHours = getAbsenceHoursForCourse(course.id);
            const req = course.attendanceRequirement;
            
            let maxHours = 0;
            let isOptional = false;

            if (req === 0 || course.isAttendanceOptional) {
              isOptional = true;
            } else if (req !== undefined) {
              const weeklyHours = sessions
                .filter((s) => s.courseId === course.id)
                .reduce((total, s) => total + calculateAcademicHours(s.startTime, s.endTime), 0);
              
              maxHours = Math.round(14 * weeklyHours * ((100 - req) / 100));
            } else {
              maxHours = course.maxAbsenceHours || 0;
            }

            const percentage = isOptional || maxHours === 0 ? 0 : Math.min(100, Math.round((usedHours / maxHours) * 100));
            const isDanger = !isOptional && percentage >= 75;

            return (
              <div key={course.id} className="group/item flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-hud-text tracking-wide">
                      {course.name}
                    </span>
                    
                    {/* MOBİLDE HER ZAMAN GÖRÜNÜR, DESKTOPTA HOVER İLE GÖRÜNÜR BUTONLAR */}
                    <div className="flex items-center opacity-100 lg:opacity-0 group-hover/item:opacity-100 transition-opacity gap-1 ml-1">
                      {onEditCourse && (
                        <button
                          onClick={() => onEditCourse(course)}
                          className="text-hud-muted hover:text-hud-primary p-0.5 transition-colors"
                          title="Dersi Düzenle"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {onDeleteCourse && (
                        <button
                          onClick={() => {
                            if (window.confirm(`${course.name} dersini ve takvimdeki tüm saatlerini silmek istiyor musun?`)) {
                              onDeleteCourse(course.id);
                            }
                          }}
                          className="text-hud-muted hover:text-hud-red p-0.5 transition-colors"
                          title="Dersi Sil"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <span className="font-mono text-[11px] text-hud-muted">
                    {isOptional ? (
                      <span className="text-hud-muted/70 italic text-[10px] px-1.5 py-0.5 rounded bg-hud-border/40">
                        Zorunlu Değil
                      </span>
                    ) : (
                      <><span className={isDanger ? 'text-hud-red font-bold' : 'text-hud-text'}>{usedHours}</span> / {maxHours} SAAT</>
                    )}
                  </span>
                </div>

                <div className="w-full bg-[#181B26] h-1.5 rounded-full overflow-hidden border border-hud-border/40">
                  <div
                    style={{ width: `${percentage}%` }}
                    className={`h-full rounded-full transition-all duration-300 ${
                      isOptional
                        ? 'bg-transparent'
                        : isDanger
                        ? 'bg-hud-red shadow-[0_0_8px_#EF4444]'
                        : 'bg-hud-primary'
                    }`}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};