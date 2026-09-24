import { useLocalStorage } from './useLocalStorage';
import { INITIAL_COURSES, INITIAL_SESSIONS, INITIAL_TASKS } from '../utils/initialData';
import { getCurrentWeekKey } from '../utils/timeUtils';
import type { Course, CourseSession, Task } from '../types';
import type { ImportPayload } from '../components/modals/DataManagementModal';

export function useAcademicData() {
  const [courses, setCourses] = useLocalStorage<Course[]>('academic_courses_v1', INITIAL_COURSES);
  const [sessions, setSessions] = useLocalStorage<CourseSession[]>('academic_sessions_v1', INITIAL_SESSIONS);
  const [tasks, setTasks] = useLocalStorage<Task[]>('academic_tasks_v1', INITIAL_TASKS);
  const [missedSessionsMap, setMissedSessionsMap] = useLocalStorage<Record<string, string[]>>('academic_missed_sessions_v1', {});

  const currentWeekKey = getCurrentWeekKey();
  const currentMissedList = missedSessionsMap[currentWeekKey] || [];
  const missedSet = new Set(currentMissedList);

  const handleToggleSession = (sessionId: string) => {
    const updated = missedSet.has(sessionId)
      ? currentMissedList.filter((id) => id !== sessionId)
      : [...currentMissedList, sessionId];
    setMissedSessionsMap({ ...missedSessionsMap, [currentWeekKey]: updated });
  };

  const handleDeleteSession = (sessionId: string) => {
    setSessions(sessions.filter((s) => s.id !== sessionId));
    if (missedSet.has(sessionId)) {
      setMissedSessionsMap({
        ...missedSessionsMap,
        [currentWeekKey]: currentMissedList.filter((id) => id !== sessionId),
      });
    }
  };

  const handleDeleteCourse = (courseId: string) => {
    const sessionIdsToDelete = new Set(sessions.filter((s) => s.courseId === courseId).map((s) => s.id));
    setCourses(courses.filter((c) => c.id !== courseId));
    setSessions(sessions.filter((s) => s.courseId !== courseId));
    setMissedSessionsMap({
      ...missedSessionsMap,
      [currentWeekKey]: currentMissedList.filter((id) => !sessionIdsToDelete.has(id)),
    });
  };

  const handleEditCourse = (updatedCourse: Course) => {
    setCourses(courses.map((c) => (c.id === updatedCourse.id ? updatedCourse : c)));
  };

  const handleArchiveWeek = () => {
    const missedCount = currentMissedList.length;
    const confirmMessage = missedCount > 0
      ? `Bu haftaki ${missedCount} adet kaçırılan ders devamsızlık hanesine işlenecek ve takvim yeni haftaya sıfırlanacak. Onaylıyor musun?`
      : 'Bu hafta hiç kaçırılan ders yok. Takvim yeni haftaya sıfırlansın mı?';

    if (window.confirm(confirmMessage)) {
      const archiveTimestampKey = `${currentWeekKey}_archived_${Date.now()}`;
      setMissedSessionsMap({
        ...missedSessionsMap,
        [archiveTimestampKey]: currentMissedList,
        [currentWeekKey]: [],
      });
    }
  };

  const handleImportData = (data: ImportPayload) => {
    if (data.courses && data.sessions) {
      setCourses(data.courses);
      setSessions(data.sessions);
      if (data.type === 'full_backup') {
        if (data.tasks) setTasks(data.tasks);
        if (data.missedSessionsMap) setMissedSessionsMap(data.missedSessionsMap);
      }
    }
  };

  const handleSaveSession = (newSession: CourseSession, newCourse?: Course) => {
    if (newCourse) setCourses([...courses, newCourse]);
    setSessions([...sessions, newSession]);
  };

  const handleToggleTask = (taskId: string) => setTasks(tasks.map((t) => (t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t)));
  const handleAddTask = (newTask: Task) => setTasks([newTask, ...tasks]);
  const handleDeleteTask = (taskId: string) => setTasks(tasks.filter((t) => t.id !== taskId));

  return {
    courses, sessions, tasks, missedSessionsMap,
    currentWeekKey, missedSet,
    handleToggleSession, handleDeleteSession, handleDeleteCourse, handleEditCourse,
    handleArchiveWeek, handleImportData, handleSaveSession,
    handleToggleTask, handleAddTask, handleDeleteTask
  };
}