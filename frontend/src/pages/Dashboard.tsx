import React, { useEffect, useState } from 'react';
import { healthApi, profileApi, CreatorProfile, WeeklyTopicSchedule } from '../services/api';
import { DependenciesHealth, LiveHealth, ReadyHealth, RootInfo } from '../types/api';
import { AppShell } from '../components/layout/AppShell';
import { PosterFrame } from '../components/poster/PosterFrame';
import { PosterButton } from '../components/poster/PosterButton';
import { PosterBadge } from '../components/poster/PosterBadge';
import { PosterHero } from '../components/illustrations/PosterHero';
import { OrnateDivider } from '../components/illustrations/OrnateMotifs';
import { ProfileView } from '../components/dashboard/ProfileView';
import { ScheduleView } from '../components/dashboard/ScheduleView';

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

      // Load profile and schedule if database is available
      if (ready.checks.database === 'connected') {
        try {
          const [prof, scheds] = await Promise.all([
            profileApi.getProfile(),
            profileApi.listSchedules(),
          ]);
          setProfile(prof);
          setSchedules(scheds);
        } catch {
          // If profile table not initialized yet, retain safe fallback
        }
      }
    } catch {
      setError('Studio workspace connection is currently unavailable. Ensure the backend server is running and retry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleProfileUpdate = async (updatedData: Partial<CreatorProfile>) => {
    const res = await profileApi.updateProfile(updatedData);
    setProfile(res);
  };

  const handleScheduleUpsert = async (entry: { day_of_week: string; topic: string; subtopic?: string; content_focus?: string }) => {
    await profileApi.upsertSchedule(entry);
    const updated = await profileApi.listSchedules();
    setSchedules(updated);
  };

  const handleScheduleDelete = async (id: string) => {
    await profileApi.deleteSchedule(id);
    const updated = await profileApi.listSchedules();
    setSchedules(updated);
  };

  return (
    <AppShell activeTab={activeTab} onTabChange={setActiveTab}>
      {/* Loading Banner */}
      {loading && (
        <div style={{ marginBottom: '2rem' }}>
          <PosterFrame title="INITIALIZING CREATOR WORKSPACE" variant="cream">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 0' }}>
              <span style={{ fontSize: '1.5rem', color: 'var(--vermilion)' }}>✦</span>
              <p style={{ margin: 0, fontWeight: 700, fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>
                Connecting to studio gateway and reading channel registers...
              </p>
            </div>
          </PosterFrame>
        </div>
      )}

      {/* Clean User-Facing Connection Error State */}
      {error && (
        <div style={{ marginBottom: '2rem' }}>
          <PosterFrame
            title="STUDIO CONNECTION NOTICE"
            variant="vermilion"
            action={
              <PosterButton variant="saffron" size="sm" onClick={loadData}>
                RECONNECT
              </PosterButton>
            }
          >
            <div style={{ padding: '0.5rem 0' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#FFFFFF', fontSize: '1.25rem' }}>
                Studio Connection Unavailable
              </h3>
              <p style={{ margin: '0 0 1rem 0', color: 'var(--warm-cream)', fontSize: '1rem' }}>
                Your workspace could not establish a connection to the backend service. Check that the service is running, then select Reconnect.
              </p>
            </div>
          </PosterFrame>
        </div>
      )}

      {!loading && !error && (
        <div>
          {/* TAB 1: DASHBOARD COMMAND CENTER */}
          {activeTab === 'dashboard' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* Grand Illustrated Hero Poster Banner */}
              <PosterHero
                channelName={profile ? profile.display_name : 'CREATOR STUDIO'}
                niche={profile ? profile.primary_niche : 'TECH & CULTURE'}
                onActionClick={() => setActiveTab('schedule')}
              />

              {/* Status & Gateway Summary Card */}
              <PosterFrame
                title="STUDIO DISPATCH // OPERATIONAL STATUS"
                variant="cream"
                action={
                  <PosterButton variant="vermilion" size="sm" onClick={loadData}>
                    REFRESH REGISTERS
                  </PosterButton>
                }
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h2 style={{ margin: '0 0 0.3rem 0', fontSize: '1.3rem', color: 'var(--dark-outline)' }}>
                      CHANNEL DISPATCH: {profile ? profile.display_name.toUpperCase() : 'SOLO CREATOR'}
                    </h2>
                    <p style={{ margin: 0, color: 'var(--text-on-cream-muted)', fontSize: '0.95rem' }}>
                      Niche: <strong>{profile ? profile.primary_niche : 'Configure in Creator Profile'}</strong> // Timezone: <strong>{profile ? profile.timezone : 'Asia/Kolkata'}</strong>
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <PosterBadge
                      status={liveHealth?.status === 'live' ? 'active' : 'alert'}
                      label={`API: ${liveHealth?.status === 'live' ? 'ONLINE' : 'OFFLINE'}`}
                    />
                    <PosterBadge
                      status={readyHealth?.checks.database === 'connected' ? 'active' : 'warning'}
                      label={`DB: ${readyHealth?.checks.database === 'connected' ? 'CONNECTED' : 'DISCONNECTED'}`}
                    />
                    <PosterBadge
                      status={dependencies?.openrouter.configured ? 'info' : 'warning'}
                      label={`LLM: ${dependencies?.openrouter.configured ? 'ACTIVE (:free)' : 'UNCONFIGURED'}`}
                    />
                  </div>
                </div>
              </PosterFrame>

              {/* Grid: Daily Production Journey & Gateway Connections */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
                {/* Visual Workflow Journey Timeline */}
                <PosterFrame title="DAILY PRODUCTION TIMELINE" variant="indigo">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '6px', border: '1px solid rgba(244,169,40,0.3)' }}>
                      <span style={{ fontSize: '1.4rem', color: 'var(--saffron-gold)' }}>★</span>
                      <div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', color: 'var(--saffron-gold)' }}>
                          07:00 MORNING WORKFLOW
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--antique-paper)' }}>
                          Retrieves active weekday topic &amp; gathers research citations.
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '6px', border: '1px solid rgba(244,169,40,0.3)' }}>
                      <span style={{ fontSize: '1.4rem', color: 'var(--festival-teal)' }}>✦</span>
                      <div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', color: 'var(--festival-teal)' }}>
                          ONE-CALL LLM GENERATION
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--antique-paper)' }}>
                          Builds complete long-form script, Shorts script, titles &amp; tags in 1 prompt.
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '6px', border: '1px solid rgba(244,169,40,0.3)' }}>
                      <span style={{ fontSize: '1.4rem', color: 'var(--vermilion)' }}>🎬</span>
                      <div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', color: 'var(--vermilion)' }}>
                          HUMAN CREATOR CRAFTING
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--antique-paper)' }}>
                          User creates video in preferred tool; \$0 video API budget.
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '6px', border: '1px solid rgba(244,169,40,0.3)' }}>
                      <span style={{ fontSize: '1.4rem', color: 'var(--saffron-bright)' }}>🚀</span>
                      <div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', color: 'var(--saffron-bright)' }}>
                          SCHEDULED PUBLICATION
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--antique-paper)' }}>
                          Scheduled deployment via YouTube Data API v3 with metadata.
                        </div>
                      </div>
                    </div>
                  </div>
                </PosterFrame>

                {/* Gateway Integration Registers */}
                <PosterFrame title="INTEGRATION GATEWAYS" variant="turquoise">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid rgba(0,0,0,0.15)', paddingBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 700 }}>DATABASE CLUSTER:</span>
                      <span style={{ fontWeight: 800 }}>
                        {readyHealth?.checks.database === 'connected' ? 'POSTGRES CONNECTED' : 'UNCONFIGURED'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid rgba(0,0,0,0.15)', paddingBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 700 }}>OPENROUTER GATEWAY:</span>
                      <span style={{ fontWeight: 800 }}>
                        {dependencies?.openrouter.configured ? 'FREE TIER ACTIVE' : 'KEY REQUIRED'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid rgba(0,0,0,0.15)', paddingBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 700 }}>YOUTUBE DATA API:</span>
                      <span style={{ fontWeight: 800 }}>
                        {dependencies?.youtube.configured ? 'CLIENT ID REGISTERED' : 'OAUTH REQUIRED'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 700 }}>SYSTEM STATUS:</span>
                      <span style={{ fontWeight: 800 }}>
                        {rootInfo?.status === 'running' ? 'OPERATIONAL' : 'OFFLINE'}
                      </span>
                    </div>
                  </div>
                </PosterFrame>
              </div>

              <OrnateDivider />

              {/* Weekly Topic Planner Preview */}
              <PosterFrame
                title="WEEKLY TOPIC SCHEDULE // EDITORIAL ROSTER"
                variant="cream"
                action={
                  <PosterButton variant="saffron" size="sm" onClick={() => setActiveTab('schedule')}>
                    MANAGE ROSTER
                  </PosterButton>
                }
              >
                {schedules.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                    <p style={{ margin: '0 0 0.5rem 0', fontWeight: 800, fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--text-on-cream)' }}>
                      NO PRODUCTION TOPICS CONFIGURED YET
                    </p>
                    <p style={{ margin: '0 0 1.5rem 0', fontSize: '0.95rem', color: 'var(--text-on-cream-muted)', maxWidth: '520px', marginLeft: 'auto', marginRight: 'auto' }}>
                      Assign topics for each day of the week to enable automated morning workflow packages and structured script synthesis.
                    </p>
                    <PosterButton variant="vermilion" size="md" onClick={() => setActiveTab('schedule')}>
                      CONFIGURE WEEKDAY TOPICS
                    </PosterButton>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                    {schedules.map((s) => (
                      <div
                        key={s.id}
                        style={{
                          backgroundColor: 'var(--antique-paper)',
                          border: '2px solid var(--dark-outline)',
                          borderRadius: '6px',
                          padding: '1rem',
                          boxShadow: '2px 2px 0px var(--dark-outline)',
                        }}
                      >
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', fontWeight: 800, color: 'var(--vermilion)', textTransform: 'uppercase' }}>
                          ✦ {s.day_of_week}
                        </div>
                        <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-on-cream)', marginTop: '0.4rem', lineHeight: 1.3 }}>
                          {s.topic}
                        </div>
                        {s.subtopic && (
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-on-cream-muted)', marginTop: '0.3rem' }}>
                            {s.subtopic}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </PosterFrame>
            </div>
          )}

          {/* TAB 2: CREATOR PROFILE */}
          {activeTab === 'profile' && (
            <ProfileView profile={profile} onUpdate={handleProfileUpdate} />
          )}

          {/* TAB 3: TOPIC SCHEDULE */}
          {activeTab === 'schedule' && (
            <ScheduleView
              schedules={schedules}
              onUpsert={handleScheduleUpsert}
              onDelete={handleScheduleDelete}
            />
          )}
        </div>
      )}
    </AppShell>
  );
};
