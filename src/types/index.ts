export interface Course {
  id: string;
  name: string;            // Örn: "MATH-123"
  maxAbsenceHours: number; // Örn: 8
  color?: string;
  isAttendanceOptional?: boolean;
  attendanceRequirement?: number;
}

export interface CourseSession {
  id: string;
  courseId: string;
  dayOfWeek: 1 | 2 | 3 | 4 | 5; // 1: Pazartesi ... 5: Cuma
  startTime: string;            // "08:40"
  endTime: string;              // "10:30"
  room?: string;                // "Lecture"
}

export interface AttendanceRecord {
  weekKey: string;     // Örn: "2026-W39"
  sessionId: string;   // Hangi oturum
  courseId: string;
  hours: number;       // Kaçırılan blok süresi (saat cinsinden)
  isMissed: boolean;   // true ise kırmızı/kaçırıldı
}

export interface Task {
  id: string;
  title: string;
  dueDate: string;     // "YYYY-MM-DD"
  isCompleted: boolean;
}