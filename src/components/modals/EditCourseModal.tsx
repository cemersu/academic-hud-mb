import React, { useState } from 'react';
import type { Course } from '../../types';
import { X } from 'lucide-react';

interface EditCourseModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedCourse: Course) => void;
}

const EditCourseForm: React.FC<{
  course: Course;
  onClose: () => void;
  onSave: (updatedCourse: Course) => void;
}> = ({ course, onClose, onSave }) => {
  const [name, setName] = useState(course.name ?? '');
  
  const initialReq = course.attendanceRequirement !== undefined
    ? course.attendanceRequirement
    : (course.isAttendanceOptional ? 0 : 70);

  const [attendanceRequirement, setAttendanceRequirement] = useState(String(initialReq));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      ...course,
      name: name.trim().toUpperCase(),
      attendanceRequirement: Number(attendanceRequirement),
      maxAbsenceHours: course.maxAbsenceHours ?? 0,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] text-hud-muted">DERS KODU / ADI</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-[#10121A] border border-hud-border rounded px-3 py-2 text-hud-text focus:outline-none"
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] text-hud-muted">ZORUNLULUK (%)</label>
        <div className="relative">
          <input
            type="number"
            value={attendanceRequirement}
            onChange={(e) => setAttendanceRequirement(e.target.value)}
            className="w-full bg-[#10121A] border border-hud-border rounded px-3 py-2 text-hud-text focus:outline-none pr-8"
            min="0"
            max="100"
            required
          />
          <span className="absolute right-3 top-2 text-hud-muted font-mono">
            %
          </span>
        </div>
        <span className="text-[9px] text-hud-muted/70 italic mt-1">
          * Devam zorunluluğu yoksa <strong>0</strong> girin.
        </span>
      </div>

      <div className="flex items-center justify-end gap-2.5 mt-2 pt-3 border-t border-hud-border">
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
          Güncelle
        </button>
      </div>
    </form>
  );
};

export const EditCourseModal: React.FC<EditCourseModalProps> = ({
  course,
  isOpen,
  onClose,
  onSave,
}) => {
  if (!isOpen || !course) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#12141C] border border-hud-borderLight w-full max-w-sm rounded-xl p-5 shadow-2xl flex flex-col gap-4">
        
        <div className="flex items-center justify-between border-b border-hud-border pb-3">
          <span className="font-mono text-sm tracking-wider font-semibold text-hud-text">
            DERSİ DÜZENLE
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-hud-muted hover:text-hud-text transition-colors p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <EditCourseForm
          key={course.id}
          course={course}
          onClose={onClose}
          onSave={onSave}
        />

      </div>
    </div>
  );
};