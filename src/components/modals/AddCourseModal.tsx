import React, { useState } from 'react';
import type { Course } from '../../types';
import type { CourseSession } from '../../types';
import { X } from 'lucide-react';

interface AddCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: Course[];
  initialDay?: number;
  initialStartTime?: string;
  onSave: (session: CourseSession, newCourse?: Course) => void;
}

const HOURS = Array.from({ length: 11 }, (_, i) => String(i + 8).padStart(2, '0'));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

const CourseForm: React.FC<{
  courses: Course[];
  initialDay: number;
  initialStartTime: string;
  onClose: () => void;
  onSave: (session: CourseSession, newCourse?: Course) => void;
}> = ({ courses, initialDay, initialStartTime, onClose, onSave }) => {
  const [selectedCourseId, setSelectedCourseId] = useState<string>(
    courses.length > 0 ? courses[0].id : 'NEW'
  );
  const [newCourseName, setNewCourseName] = useState('');
  
  // Sadece zorunluluk yüzdesi state'i kaldı.
  const [attendanceRequirement, setAttendanceRequirement] = useState('70');

  const validDay = (initialDay >= 1 && initialDay <= 5 ? initialDay : 1) as 1 | 2 | 3 | 4 | 5;
  const [dayOfWeek, setDayOfWeek] = useState<1 | 2 | 3 | 4 | 5>(validDay);

  const [rawInitH, rawInitM] = (initialStartTime || '08:40').split(':');
  const safeInitH = HOURS.includes(rawInitH) ? rawInitH : '08';
  const safeInitM = MINUTES.includes(rawInitM) ? rawInitM : '40';

  const [startHour, setStartHour] = useState(safeInitH);
  const [startMinute, setStartMinute] = useState(safeInitM);

  const initialEndH = String(Math.min(Number(safeInitH) + 1, 18)).padStart(2, '0');
  const [endHour, setEndHour] = useState(initialEndH);
  const [endMinute, setEndMinute] = useState(safeInitM);

  const [room, setRoom] = useState('Lecture');

  const handleStartHourChange = (newH: string) => {
    setStartHour(newH);
    const targetEndH = Math.min(Number(newH) + 1, 18);
    setEndHour(String(targetEndH).padStart(2, '0'));
  };

  const handleStartMinuteChange = (newM: string) => {
    setStartMinute(newM);
    setEndMinute(newM);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const startTime = `${startHour}:${startMinute}`;
    const endTime = `${endHour}:${endMinute}`;

    if (endTime <= startTime) {
      alert('Bitiş saati başlangıç saatinden sonra olmalıdır.');
      return;
    }

    let targetCourseId = selectedCourseId;
    let createdCourse: Course | undefined;

    if (selectedCourseId === 'NEW') {
      if (!newCourseName.trim()) return;
      targetCourseId = `c_${Date.now()}`;
      
      createdCourse = {
        id: targetCourseId,
        name: newCourseName.trim().toUpperCase(),
        // Eski verilerle uyumluluk için varsayılan 0 atıyoruz, asıl değer dinamik hesaplanacak
        maxAbsenceHours: 0,
        attendanceRequirement: Number(attendanceRequirement),
      };
    }

    const newSession: CourseSession = {
      id: `s_${Date.now()}`,
      courseId: targetCourseId,
      dayOfWeek,
      startTime,
      endTime,
      room: room.trim() || 'Lecture',
    };

    onSave(newSession, createdCourse);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 text-xs">
      <div className="flex flex-col gap-1.5">
        <label className="text-hud-muted font-mono">DERS SEÇİMİ</label>
        <select
          value={selectedCourseId}
          onChange={(e) => setSelectedCourseId(e.target.value)}
          className="bg-[#181B26] border border-hud-border rounded-lg px-3 py-2 text-hud-text focus:outline-none"
        >
          {courses.map((c) => {
            const req = c.attendanceRequirement;
            const isOpt = req === 0 || c.isAttendanceOptional;
            return (
              <option key={c.id} value={c.id}>
                {c.name} {isOpt ? '(Zorunlu Değil)' : ''}
              </option>
            );
          })}
          <option value="NEW">+ Yeni Ders Tanımla...</option>
        </select>
      </div>

      {selectedCourseId === 'NEW' && (
        <div className="grid grid-cols-2 gap-3 bg-[#161822] p-3 rounded-lg border border-hud-border/70">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-hud-muted">DERS KODU</label>
            <input
              type="text"
              placeholder="örn: MATH-123"
              value={newCourseName}
              onChange={(e) => setNewCourseName(e.target.value)}
              className="w-full bg-[#10121A] border border-hud-border rounded px-2.5 py-1.5 text-hud-text focus:outline-none"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-hud-muted">ZORUNLULUK (%)</label>
            <div className="relative">
              <input
                type="number"
                value={attendanceRequirement}
                onChange={(e) => setAttendanceRequirement(e.target.value)}
                className="w-full bg-[#10121A] border border-hud-border rounded px-2.5 py-1.5 text-hud-text focus:outline-none pr-8"
                min="0"
                max="100"
                required
              />
              <span className="absolute right-2.5 top-1.5 text-hud-muted font-mono text-xs">%</span>
            </div>
          </div>
          
          <div className="col-span-2">
            <span className="text-[9px] text-hud-muted/70 italic block">
              * Devam zorunluluğu yoksa <strong>0</strong> girin. Devamsızlık hakkınız, takvime eklediğiniz ders saatlerine göre otomatik hesaplanacaktır.
            </span>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label className="text-hud-muted font-mono">GÜN</label>
        <select
          value={dayOfWeek}
          onChange={(e) => setDayOfWeek(Number(e.target.value) as 1 | 2 | 3 | 4 | 5)}
          className="bg-[#181B26] border border-hud-border rounded-lg px-3 py-2 text-hud-text focus:outline-none"
        >
          <option value={1}>Pazartesi</option>
          <option value={2}>Salı</option>
          <option value={3}>Çarşamba</option>
          <option value={4}>Perşembe</option>
          <option value={5}>Cuma</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-hud-muted font-mono">BAŞLANGIÇ</label>
          <div className="flex items-center gap-1.5">
            <select
              value={startHour}
              onChange={(e) => handleStartHourChange(e.target.value)}
              className="flex-1 bg-[#181B26] border border-hud-border rounded-lg px-2.5 py-2 text-hud-text text-center focus:outline-none"
            >
              {HOURS.map((h) => (
                <option key={`start-h-${h}`} value={h}>
                  {h}
                </option>
              ))}
            </select>
            <span className="text-hud-muted font-bold">:</span>
            <select
              value={startMinute}
              onChange={(e) => handleStartMinuteChange(e.target.value)}
              className="flex-1 bg-[#181B26] border border-hud-border rounded-lg px-2.5 py-2 text-hud-text text-center focus:outline-none"
            >
              {MINUTES.map((m) => (
                <option key={`start-m-${m}`} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-hud-muted font-mono">BİTİŞ</label>
          <div className="flex items-center gap-1.5">
            <select
              value={endHour}
              onChange={(e) => setEndHour(e.target.value)}
              className="flex-1 bg-[#181B26] border border-hud-border rounded-lg px-2.5 py-2 text-hud-text text-center focus:outline-none"
            >
              {HOURS.map((h) => (
                <option key={`end-h-${h}`} value={h}>
                  {h}
                </option>
              ))}
            </select>
            <span className="text-hud-muted font-bold">:</span>
            <select
              value={endMinute}
              onChange={(e) => setEndMinute(e.target.value)}
              className="flex-1 bg-[#181B26] border border-hud-border rounded-lg px-2.5 py-2 text-hud-text text-center focus:outline-none"
            >
              {MINUTES.map((m) => (
                <option key={`end-m-${m}`} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-hud-muted font-mono">DERSLİK / ODA</label>
        <input
          type="text"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          placeholder="Lecture / Amfi-1"
          className="bg-[#181B26] border border-hud-border rounded-lg px-3 py-2 text-hud-text focus:outline-none"
        />
      </div>

      <div className="flex items-center justify-end gap-2.5 mt-2 pt-2 border-t border-hud-border">
        <button
          type="button"
          onClick={onClose}
          className="px-3.5 py-1.5 rounded-lg border border-hud-border text-hud-muted hover:text-hud-text transition-colors"
        >
          İptal
        </button>
        <button
          type="submit"
          className="px-4 py-1.5 bg-hud-primary hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
        >
          Kaydet
        </button>
      </div>
    </form>
  );
};

export const AddCourseModal: React.FC<AddCourseModalProps> = ({
  isOpen,
  onClose,
  courses,
  initialDay = 1,
  initialStartTime = '08:40',
  onSave,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#12141C] border border-hud-borderLight w-full max-w-md rounded-xl p-5 shadow-2xl flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-hud-border pb-3">
          <span className="font-mono text-sm tracking-wider font-semibold text-hud-text">
            DERS PROGRAMINA EKLE
          </span>
          <button
            onClick={onClose}
            className="text-hud-muted hover:text-hud-text transition-colors p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <CourseForm
          key={`${initialDay}-${initialStartTime}`}
          courses={courses}
          initialDay={initialDay}
          initialStartTime={initialStartTime}
          onClose={onClose}
          onSave={onSave}
        />
      </div>
    </div>
  );
};