'use client';

import { useState } from 'react';
import { Schedule } from '@/types';
import { useInterviewData } from '@/hooks/useInterviewData';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Calendar, Plus, Trash2, Clock, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ScheduleManagerProps {
  companyId: string;
  schedules: Schedule[];
}

export function ScheduleManager({
  companyId,
  schedules,
}: ScheduleManagerProps) {
  const { addSchedule, deleteSchedule } = useInterviewData();
  const [isAdding, setIsAdding] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [type, setType] = useState('전형');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date) return;

    // Combine date and time if time is provided
    const dateTimeString = time ? `${date}T${time}` : date;

    await addSchedule(companyId, title, dateTimeString, description, type);

    // Reset
    setTitle('');
    setDate('');
    setTime('');
    setDescription('');
    setType('전형');
    setIsAdding(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('일정을 삭제하시겠습니까?')) {
      await deleteSchedule(companyId, id);
    }
  };

  const getDDay = (targetDate: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(targetDate);
    target.setHours(0, 0, 0, 0);

    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'D-Day';
    if (diffDays > 0) return `D-${diffDays}`;
    return `D+${Math.abs(diffDays)}`;
  };

  const formatDateTime = (isoString: string) => {
    const d = new Date(isoString);
    const dateStr = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
    const hasTime = isoString.includes('T');

    if (hasTime) {
      const timeStr = d.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
      return `${dateStr} ${timeStr}`;
    }
    return dateStr;
  };

  // Group schedules by "Upcoming" and "Past"
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const upcomingSchedules = schedules.filter((s) => new Date(s.date) >= now);
  const pastSchedules = schedules.filter((s) => new Date(s.date) < now);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h2
          style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Calendar size={20} className="text-primary" /> 채용 일정
        </h2>
        <Button
          onClick={() => setIsAdding(!isAdding)}
          variant={isAdding ? 'secondary' : 'primary'}
        >
          {isAdding ? (
            '취소'
          ) : (
            <>
              <Plus size={16} style={{ marginRight: '0.3rem' }} /> 일정 추가
            </>
          )}
        </Button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <Card
              style={{
                padding: '1.5rem',
                border: '1px solid hsl(var(--primary))',
                background: 'hsl(var(--surface))',
              }}
            >
              <form
                onSubmit={handleSubmit}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }}
              >
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        marginBottom: '0.5rem',
                        fontWeight: 500,
                      }}
                    >
                      일정명
                    </label>
                    <Input
                      placeholder="예: 서류 마감, 코딩테스트"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div style={{ width: '120px' }}>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        marginBottom: '0.5rem',
                        fontWeight: 500,
                      }}
                    >
                      분류
                    </label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid hsl(var(--border))',
                        background: 'hsl(var(--background))',
                        color: 'hsl(var(--text-main))',
                        height: '40px',
                      }}
                    >
                      <option value="전형">전형</option>
                      <option value="발표">발표</option>
                      <option value="기타">기타</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        marginBottom: '0.5rem',
                        fontWeight: 500,
                      }}
                    >
                      날짜
                    </label>
                    <Input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        marginBottom: '0.5rem',
                        fontWeight: 500,
                      }}
                    >
                      시간 (선택)
                    </label>
                    <Input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      marginBottom: '0.5rem',
                      fontWeight: 500,
                    }}
                  >
                    메모 (선택)
                  </label>
                  <Input
                    placeholder="시험 장소, 준비물 등..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginTop: '0.5rem',
                  }}
                >
                  <Button type="submit">등록하기</Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {schedules.length === 0 && !isAdding && (
          <div
            style={{
              textAlign: 'center',
              padding: '2rem',
              color: 'hsl(var(--text-muted))',
              background: 'hsl(var(--surface-hover) / 0.3)',
              borderRadius: 'var(--radius-lg)',
            }}
          >
            <Calendar
              size={32}
              style={{ marginBottom: '0.5rem', opacity: 0.5 }}
            />
            <p>등록된 일정이 없습니다.</p>
          </div>
        )}

        {upcomingSchedules.length > 0 && (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
          >
            <h3
              style={{
                fontSize: '0.9rem',
                fontWeight: 600,
                color: 'hsl(var(--primary))',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Upcoming
            </h3>
            {upcomingSchedules.map((schedule) => (
              <ScheduleItem
                key={schedule.id}
                schedule={schedule}
                onDelete={handleDelete}
                dDay={getDDay(schedule.date)}
                formattedDate={formatDateTime(schedule.date)}
              />
            ))}
          </div>
        )}

        {pastSchedules.length > 0 && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              marginTop: '1rem',
            }}
          >
            <h3
              style={{
                fontSize: '0.9rem',
                fontWeight: 600,
                color: 'hsl(var(--text-muted))',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Past
            </h3>
            {pastSchedules.map((schedule) => (
              <ScheduleItem
                key={schedule.id}
                schedule={schedule}
                onDelete={handleDelete}
                isPast
                formattedDate={formatDateTime(schedule.date)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ScheduleItem({
  schedule,
  onDelete,
  dDay,
  formattedDate,
  isPast,
}: {
  schedule: Schedule;
  onDelete: (id: string) => void;
  dDay?: string;
  formattedDate: string;
  isPast?: boolean;
}) {
  return (
    <Card
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '1rem',
        gap: '1rem',
        opacity: isPast ? 0.7 : 1,
        borderLeft: isPast
          ? '4px solid hsl(var(--border))'
          : '4px solid hsl(var(--primary))',
        background: 'hsl(var(--surface))',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: '60px',
          textAlign: 'center',
        }}
      >
        {dDay && (
          <span
            style={{
              fontSize: '1rem',
              fontWeight: 800,
              color: dDay === 'D-Day' ? '#ef4444' : 'hsl(var(--primary))',
              marginBottom: '0.2rem',
            }}
          >
            {dDay}
          </span>
        )}
        <span style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted))' }}>
          {schedule.type}
        </span>
      </div>

      <div
        style={{
          width: '1px',
          height: '40px',
          background: 'hsl(var(--border))',
        }}
      ></div>

      <div style={{ flex: 1 }}>
        <h4
          style={{
            fontSize: '1rem',
            fontWeight: 600,
            marginBottom: '0.2rem',
            textDecoration: isPast ? 'line-through' : 'none',
            color: isPast ? 'hsl(var(--text-muted))' : 'hsl(var(--text-main))',
          }}
        >
          {schedule.title}
        </h4>
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
            fontSize: '0.85rem',
            color: 'hsl(var(--text-muted))',
          }}
        >
          <span
            style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}
          >
            <Clock size={14} /> {formattedDate}
          </span>
          {schedule.description && (
            <span
              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}
            >
              <FileText size={14} /> {schedule.description}
            </span>
          )}
        </div>
      </div>

      <Button
        variant="ghost"
        onClick={() => onDelete(schedule.id)}
        style={{ color: 'hsl(var(--text-muted))', opacity: 0.5 }}
        className="hover:opacity-100"
      >
        <Trash2 size={16} />
      </Button>
    </Card>
  );
}
