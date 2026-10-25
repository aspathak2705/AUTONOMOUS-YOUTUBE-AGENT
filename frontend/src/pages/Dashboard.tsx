import React, { useEffect, useState } from 'react';
import { healthApi, profileApi, CreatorProfile, WeeklyTopicSchedule } from '../services/api';
import { DependenciesHealth, LiveHealth, ReadyHealth, RootInfo } from '../types/api';
import { AppShell } from '../components/layout/AppShell';
import { RetroWindow } from '../components/retro/RetroWindow';
import { PixelButton } from '../components/retro/PixelButton';
import { StatusBadge } from '../components/retro/StatusBadge';

export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [rootInfo, setRootInfo] = useState<RootInfo | null>(null);
  const [liveHealth, setLiveHealth] = useState<LiveHealth | null>(null);
  const [readyHealth, setReadyHealth] = useState<ReadyHealth | null>(null);
  const [dependencies, setDependencies] = useState<DependenciesHealth | null>(null);
  const [profile, setProfile] = useState<CreatorProfile | null>(null);
  const [schedules, setSchedules] = useState<WeeklyTopicSchedule[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [root, live, ready, deps] = await Promise.all([
        healthApi.getRootInfo(),
        healthApi.getLiveHealth(),
        healthApi.getReadyHealth(),
        healthApi.getDependencies(),
      ]);
      setRootInfo(root);
      setLiveHealth(live);
      setReadyHealth(ready);
      setDependencies(deps);

      // Attempt loading real persisted profile & schedule if ready
      if (ready.checks.database === 'connected') {
        try {
          const [prof, scheds] = await Promise.all([
            profileApi.getProfile(),
            profileApi.listSchedules(),
          ]);
          setProfile(prof);
          setSchedules(scheds);
        } catch {
          // Keep profile null if DB has temporary issue
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Backend connection failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <AppShell activeTab={activeTab} onTabChange={setActiveTab}>
      {/* Loading Banner */}
      {loading && (
        <div style={{ marginBottom: '1.5rem' }}>
          <RetroWindow title="SYSTEM BOOT SEQUENCE" variant="cream">
            <p style={{ margin: 0, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
              ⚡ Reading system registers and querying backend health endpoints...
            </p>
          </RetroWindow>
        </div>
      )}

      {/* Connection Failure Error State */}
      {error && (
        <div style={{ marginBottom: '1.5rem' }}>
          <RetroWindow
            title="CRITICAL ALERT // CONNECTION ERROR"
            variant="purple"
            badge="OFFLINE"
            action={
              <PixelButton variant="orange" size="sm" onClick={loadData}>
                RETRY HANDSHAKE
              </PixelButton>
            }
          >
            <p style={{ margin: '0 0 1rem 0', color: 'var(--status-error)' }}>
              Could not establish connection with FastAPI backend server at {import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}:
            </p>
            <div
              style={{
                backgroundColor: 'rgba(0,0,0,0.3)',
                padding: '0.75rem',
                borderRadius: '4px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
                color: '#fff',
                marginBottom: '1rem',
              }}
            >
              {error}
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Ensure backend server is running via: <code>uvicorn app.main:app --reload</code>
            </p>
          </RetroWindow>
        </div>
      )}

      {!loading && !error && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Top Hero / Welcome Banner */}
          <RetroWindow
            title="WORKSPACE TERMINAL // ACTIVE SESSION"
            variant="cream"
            action={
              <PixelButton variant="teal" size="sm" onClick={loadData}>
                REFRESH STATUS
              </PixelButton>
            }
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ margin: '0 0 0.4rem 0', fontSize: '1.4rem', color: 'var(--text-dark)', fontWeight: 800 }}>
                  COMMAND CENTER: {profile ? profile.display_name.toUpperCase() : 'SOLO CREATOR'}
                </h2>
                <p style={{ margin: 0, color: 'var(--text-dark-muted)', fontSize: '0.95rem' }}>
                  Niche: <strong>{profile ? profile.primary_niche : 'Configurable in Creator Profile'}</strong> // Timezone: <strong>{profile ? profile.timezone : 'Asia/Kolkata'}</strong>
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <StatusBadge
                  status={liveHealth?.status === 'live' ? 'success' : 'error'}
                  label={`API: ${liveHealth?.status || 'UNKNOWN'}`}
                />
                <StatusBadge
                  status={readyHealth?.checks.database === 'connected' ? 'success' : 'warning'}
                  label={`DB: ${readyHealth?.checks.database || 'NOT_READY'}`}
                />
                <StatusBadge
                  status={dependencies?.openrouter.configured ? 'info' : 'neutral'}
                  label={`LLM: ${dependencies?.openrouter.configured ? 'FREE GATEWAY' : 'UNCONFIGURED'}`}
                />
              </div>
            </div>
          </RetroWindow>

          {/* Grid Layout: System Health & Production Overview */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {/* System Diagnostic Window */}
            <RetroWindow title="HARDWARE & GATEWAY REGISTERS" variant="purple">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.4rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>APPLICATION PROCESS:</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{rootInfo?.name} (v{rootInfo?.version})</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.4rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>SUPABASE POSTGRESQL:</span>
                  <span style={{ color: readyHealth?.checks.database === 'connected' ? 'var(--status-success)' : 'var(--status-warning)', fontWeight: 700 }}>
                    {dependencies?.database.status.toUpperCase()}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.4rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>OPENROUTER GATEWAY:</span>
                  <span style={{ color: dependencies?.openrouter.configured ? 'var(--accent-teal)' : 'var(--text-muted)' }}>
                    {dependencies?.openrouter.configured ? 'CONFIGURED (:free)' : 'AWAITING KEY'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>YOUTUBE DATA API v3:</span>
                  <span style={{ color: dependencies?.youtube.configured ? 'var(--accent-teal)' : 'var(--text-muted)' }}>
                    {dependencies?.youtube.configured ? 'CLIENT ID READY' : 'AWAITING OAUTH'}
                  </span>
                </div>
              </div>
            </RetroWindow>

            {/* Daily Workflow Overview Window */}
            <RetroWindow title="AUTOMATION PIPELINE OVERVIEW" variant="purple" badge="PIPELINE SPEC">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '4px' }}>
                  <span style={{ fontSize: '1.2rem' }}>⏰</span>
                  <div style={{ fontSize: '0.85rem' }}>
                    <div style={{ fontWeight: 700, color: 'var(--accent-gold)' }}>07:00 Morning Scheduler</div>
                    <div style={{ color: 'var(--text-secondary)' }}>Queries active weekday topic &amp; gathers research bundle.</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '4px' }}>
                  <span style={{ fontSize: '1.2rem' }}>⚡</span>
                  <div style={{ fontSize: '0.85rem' }}>
                    <div style={{ fontWeight: 700, color: 'var(--accent-teal)' }}>Single-Call LLM Generation</div>
                    <div style={{ color: 'var(--text-secondary)' }}>Builds long-form script, Shorts script, titles, tags, narration.</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '4px' }}>
                  <span style={{ fontSize: '1.2rem' }}>🎬</span>
                  <div style={{ fontSize: '0.85rem' }}>
                    <div style={{ fontWeight: 700, color: 'var(--accent-orange)' }}>External Video Creation</div>
                    <div style={{ color: 'var(--text-secondary)' }}>User manually creates video; zero paid video APIs utilized.</div>
                  </div>
                </div>
              </div>
            </RetroWindow>
          </div>

          {/* Weekly Topics Schedule Section */}
          <RetroWindow title="WEEKLY TOPIC SCHEDULE // ACTIVE MATRIX" variant="cream" badge="RECURRING">
            {schedules.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <p style={{ margin: '0 0 0.5rem 0', fontWeight: 700, color: 'var(--text-dark)' }}>
                  No scheduled topics configured for this creator profile yet.
                </p>
                <p style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', color: 'var(--text-dark-muted)' }}>
                  Phase 1 persistent database model and API routes are ready. Topic entries can be posted to <code>/api/v1/profile/schedules</code>.
                </p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                {schedules.map((s) => (
                  <div
                    key={s.id}
                    style={{
                      backgroundColor: 'var(--card-cream-light)',
                      border: '1px solid var(--border-cream)',
                      borderRadius: '4px',
                      padding: '0.75rem',
                    }}
                  >
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-orange)', textTransform: 'uppercase' }}>
                      {s.day_of_week}
                    </div>
                    <div style={{ fontWeight: 700, color: 'var(--text-dark)', marginTop: '0.25rem' }}>
                      {s.topic}
                    </div>
                    {s.subtopic && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-dark-muted)', marginTop: '0.2rem' }}>
                        {s.subtopic}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </RetroWindow>
        </div>
      )}
    </AppShell>
  );
};
