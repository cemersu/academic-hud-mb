import type { Course } from '../types';
import type { CourseSession } from '../types';
import type { Task } from '../types';

export const INITIAL_COURSES: Course[] = [
  { id: 'c1', name: 'MATH-123', maxAbsenceHours: 8 },
  { id: 'c2', name: 'MATH-111', maxAbsenceHours: 8 },
  { id: 'c3', name: 'MATH-113', maxAbsenceHours: 8 },
  { id: 'c4', name: 'PHYS-111', maxAbsenceHours: 8 },
  { id: 'c5', name: 'ENG-101',  maxAbsenceHours: 8 },
];

export const INITIAL_SESSIONS: CourseSession[] = [
  // Pazartesi (1)
  { id: 's1', courseId: 'c1', dayOfWeek: 1, startTime: '10:40', endTime: '11:30', room: 'Lecture' },
  { id: 's2', courseId: 'c2', dayOfWeek: 1, startTime: '11:40', endTime: '12:30', room: 'Lecture' },
  { id: 's3', courseId: 'c3', dayOfWeek: 1, startTime: '13:40', endTime: '15:30', room: 'Lecture' },

  // Salı (2)
  { id: 's4', courseId: 'c4', dayOfWeek: 2, startTime: '12:40', endTime: '14:30', room: 'Lecture' },

  // Çarşamba (3)
  { id: 's5', courseId: 'c1', dayOfWeek: 3, startTime: '08:40', endTime: '10:30', room: 'Lecture' },
  { id: 's6', courseId: 'c2', dayOfWeek: 3, startTime: '13:40', endTime: '15:30', room: 'Lecture' },
  { id: 's7', courseId: 'c5', dayOfWeek: 3, startTime: '15:40', endTime: '17:30', room: 'Lecture' },

  // Perşembe (4)
  { id: 's8', courseId: 'c4', dayOfWeek: 4, startTime: '08:40', endTime: '10:30', room: 'Lecture' },
  { id: 's9', courseId: 'c3', dayOfWeek: 4, startTime: '13:40', endTime: '15:30', room: 'Lecture' },

  // Cuma (5)
  { id: 's10', courseId: 'c3', dayOfWeek: 5, startTime: '13:40', endTime: '14:30', room: 'Lecture' },
  { id: 's11', courseId: 'c5', dayOfWeek: 5, startTime: '14:40', endTime: '16:30', room: 'Lecture' },
];

export const INITIAL_TASKS: Task[] = [
  { id: 't1', title: 'MATH-123 Problem Set 1', dueDate: '2026-09-20', isCompleted: false },
  { id: 't2', title: 'PHYS-111 Lab Raporu',    dueDate: '2026-09-23', isCompleted: false },
  { id: 't3', title: 'ENG-101 Essay Draft',   dueDate: '2026-10-05', isCompleted: false },
  { id: 't4', title: 'MATH-113 Quiz Öncesi',  dueDate: '2026-09-21', isCompleted: true },
];