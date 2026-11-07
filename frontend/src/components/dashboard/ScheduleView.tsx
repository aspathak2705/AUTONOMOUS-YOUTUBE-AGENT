import React, { useState } from 'react';
import { PosterFrame } from '../poster/PosterFrame';
import { PosterButton } from '../poster/PosterButton';
import { WeeklyTopicSchedule } from '../../services/api';

export interface ScheduleViewProps {
  schedules: WeeklyTopicSchedule[];
  onUpsert: (entry: { day_of_week: string; topic: string; subtopic?: string; content_focus?: string }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const WEEKDAYS = [
  { id: 'monday', label: 'Monday' },
  { id: 'tuesday', label: 'Tuesday' },
  { id: 'wednesday', label: 'Wednesday' },
  { id: 'thursday', label: 'Thursday' },
  { id: 'friday', label: 'Friday' },
  { id: 'saturday', label: 'Saturday' },
  { id: 'sunday', label: 'Sunday' },
];

export const ScheduleView: React.FC<ScheduleViewProps> = ({ schedules, onUpsert, onDelete }) => {
  const [selectedDay, setSelectedDay] = useState<string>('monday');
  const [topic, setTopic] = useState<string>('');
  const [subtopic, setSubtopic] = useState<string>('');
  const [contentFocus, setContentFocus] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setIsSubmitting(true);
    setFeedback(null);
    try {
      await onUpsert({
        day_of_week: selectedDay,
        topic: topic.trim(),
        subtopic: subtopic.trim() || undefined,
        content_focus: contentFocus.trim() || undefined,
      });
      setTopic('');
      setSubtopic('');
      setContentFocus('');
      setFeedback(`Schedule updated for ${selectedDay.toUpperCase()}`);
    } catch {
      setFeedback('Failed to update schedule.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const scheduleMap = new Map(schedules.map((s) => [s.day_of_week.toLowerCase(), s]));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
      {/* Schedule Configuration Form */}
      <PosterFrame title="EDITORIAL CALENDAR // TOPIC CONFIGURATION" variant="cream">
        <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.2rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 800, fontFamily: 'var(--font-display)', fontSize: '0.85rem', marginBottom: '0.4rem', color: 'var(--text-on-cream)' }}>
                ✦ SELECT WEEKDAY
              </label>
              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '3px solid var(--dark-outline)',
                  borderRadius: '6px',
                  backgroundColor: '#FFFFFF',
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.9rem',
                }}
              >
                {WEEKDAYS.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.label.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ flex: 2 }}>
              <label style={{ display: 'block', fontWeight: 800, fontFamily: 'var(--font-display)', fontSize: '0.85rem', marginBottom: '0.4rem', color: 'var(--text-on-cream)' }}>
                ✦ MAIN VIDEO TOPIC
              </label>
              <input
                type="text"
                placeholder="e.g. Building Real-Time AI Agents"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                required
                minLength={3}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '3px solid var(--dark-outline)',
                  borderRadius: '6px',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.95rem',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.2rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 800, fontFamily: 'var(--font-display)', fontSize: '0.85rem', marginBottom: '0.4rem', color: 'var(--text-on-cream)' }}>
                ✦ SUBTOPIC / THESIS
              </label>
              <input
                type="text"
                placeholder="e.g. Memory retention & benchmarks"
                value={subtopic}
                onChange={(e) => setSubtopic(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '3px solid var(--dark-outline)',
                  borderRadius: '6px',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.95rem',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 800, fontFamily: 'var(--font-display)', fontSize: '0.85rem', marginBottom: '0.4rem', color: 'var(--text-on-cream)' }}>
                ✦ EDITORIAL FOCUS
              </label>
              <input
                type="text"
                placeholder="e.g. Hands-on coding walkthrough"
                value={contentFocus}
                onChange={(e) => setContentFocus(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '3px solid var(--dark-outline)',
                  borderRadius: '6px',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.95rem',
                }}
              />
            </div>
          </div>

          {feedback && (
            <div style={{ padding: '0.6rem 0.8rem', backgroundColor: 'var(--festival-teal)', color: '#FFFFFF', borderRadius: '4px', fontWeight: 700, fontSize: '0.85rem' }}>
              ✓ {feedback}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <PosterButton type="submit" variant="saffron" disabled={isSubmitting}>
              {isSubmitting ? 'SAVING...' : 'ASSIGN WEEKDAY TOPIC'}
            </PosterButton>
          </div>
        </form>
      </PosterFrame>

      {/* Weekday Cards Matrix */}
      <PosterFrame title="ACTIVE WEEKLY PRODUCTION MATRIX" variant="indigo">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {WEEKDAYS.map((w) => {
            const entry = scheduleMap.get(w.id);
            return (
              <div
                key={w.id}
                style={{
                  backgroundColor: entry ? 'var(--warm-cream)' : 'rgba(255, 255, 255, 0.05)',
                  color: entry ? 'var(--dark-outline)' : 'var(--text-on-dark-muted)',
                  border: entry ? '3px solid var(--dark-outline)' : '2px dashed var(--saffron-gold)',
                  borderRadius: '8px',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '150px',
                  boxShadow: entry ? 'var(--poster-shadow)' : 'none',
                  position: 'relative',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontWeight: 800,
                        fontSize: '0.95rem',
                        color: entry ? 'var(--vermilion)' : 'var(--saffron-gold)',
                      }}
                    >
                      {w.label}
                    </span>
                    {entry && (
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 700,
                          backgroundColor: 'var(--festival-teal)',
                          color: '#FFFFFF',
                          padding: '0.15rem 0.45rem',
                          borderRadius: '2px',
                        }}
                      >
                        SCHEDULED
                      </span>
                    )}
                  </div>

                  {entry ? (
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '1.05rem', lineHeight: 1.3, marginBottom: '0.3rem' }}>
                        {entry.topic}
                      </div>
                      {entry.subtopic && (
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-on-cream-muted)', marginBottom: '0.2rem' }}>
                          ↳ {entry.subtopic}
                        </div>
                      )}
                      {entry.content_focus && (
                        <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--rich-turquoise)' }}>
                          Focus: {entry.content_focus}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-on-dark-muted)', fontStyle: 'italic', marginTop: '0.75rem' }}>
                      No production topic set.
                    </div>
                  )}
                </div>

                {entry && (
                  <div style={{ marginTop: '1rem', textAlign: 'right' }}>
                    <button
                      onClick={() => onDelete(entry.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--vermilion)',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        fontWeight: 800,
                        fontFamily: 'var(--font-display)',
                      }}
                    >
                      [REMOVE]
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </PosterFrame>
    </div>
  );
};
