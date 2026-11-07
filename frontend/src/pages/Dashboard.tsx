import React, { useEffect, useState } from 'react';
import { healthApi, profileApi, CreatorProfile, WeeklyTopicSchedule } from '../services/api';
import { DependenciesHealth, LiveHealth, ReadyHealth, RootInfo } from '../types/api';
import { AppShell } from '../components/layout/AppShell';
import { PosterFrame } from '../components/poster/PosterFrame';
import { PosterButton } from '../components/poster/PosterButton';
import { PosterBadge } from '../components/poster/PosterBadge';
import { PosterHero } from '../components/illustrations/PosterHero';
import { PosterRibbonDivider } from '../components/poster/PosterBanner';
import { MedallionCard } from '../components/poster/MedallionCard';
import { PosterAssetImage } from '../components/poster/PosterAssetImage';
import { ProfileView } from '../components/dashboard/ProfileView';
import { ScheduleView } from '../components/dashboard/ScheduleView';
import { illustrations, medallions, ornaments } from '../assets';

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
              <div style={{ width: 36, height: 36 }}>
                <PosterAssetImage asset={ornaments.badgeDiya} width={36} height={36} />
              </div>
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
                onActionClick={() => setActiveTab('packages')}
                onPlannerClick={() => setActiveTab('schedule')}
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: 44, height: 44, flexShrink: 0 }}>
                      <PosterAssetImage asset={ornaments.badgeLotus} width={44} height={44} />
                    </div>
                    <div>
                      <h2 style={{ margin: '0 0 0.3rem 0', fontSize: '1.3rem', color: 'var(--dark-outline)' }}>
                        CHANNEL DISPATCH: {profile ? profile.display_name.toUpperCase() : 'SOLO CREATOR'}
                      </h2>
                      <p style={{ margin: 0, color: 'var(--text-on-cream-muted)', fontSize: '0.95rem' }}>
                        Niche: <strong>{profile ? profile.primary_niche : 'Configure in Creator Profile'}</strong> // Timezone: <strong>{profile ? profile.timezone : 'Asia/Kolkata'}</strong>
                      </p>
                    </div>
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

              {/* Six Pillar Medallion Cards Grid */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <span style={{ color: 'var(--saffron-gold)', fontSize: '1.25rem' }}>★</span>
                  <h2
                    style={{
                      margin: 0,
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.2rem',
                      color: 'var(--saffron-gold)',
                      letterSpacing: '0.04em',
                    }}
                  >
                    CREATOR STUDIO MODULES
                  </h2>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '1.25rem',
                  }}
                >
                  <MedallionCard
                    asset={medallions.goldSun}
                    title="STUDIO HOME"
                    badge="Active"
                    description="Central dispatch overview, real-time gateway registers, and automated morning workflow dispatch."
                    actionText="View Status"
                    onAction={() => setActiveTab('dashboard')}
                    accentColor="var(--saffron-gold)"
                  />
                  <MedallionCard
                    asset={medallions.tealLotus}
                    title="CREATOR PROFILE"
                    badge="Configured"
                    description="Configure target audience, language, primary niche, and channel identity settings."
                    actionText="Edit Profile"
                    onAction={() => setActiveTab('profile')}
                    accentColor="var(--festival-teal)"
                  />
                  <MedallionCard
                    asset={medallions.rubyShield}
                    title="TOPIC SCHEDULE"
                    badge="Weekly"
                    description="7-day automated topic roster driving daily research synthesis and content creation."
                    actionText="Edit Schedule"
                    onAction={() => setActiveTab('schedule')}
                    accentColor="var(--vermilion)"
                  />
                  <MedallionCard
                    asset={medallions.saffronMandala}
                    title="CONTENT WORKSPACE"
                    badge="Upcoming"
                    description="One-prompt complete script generation: long-form script, Shorts script, titles, descriptions & tags."
                    actionText="Phase 2 Module"
                    planned={true}
                    accentColor="var(--saffron-gold)"
                  />
                  <MedallionCard
                    asset={medallions.peacockWheel}
                    title="MEDIA CRAFTING"
                    badge="Upcoming"
                    description="Manual creator video validation, zero-cost external tool workflow, and audio-visual check."
                    actionText="Phase 3 Module"
                    planned={true}
                    accentColor="var(--festival-teal)"
                  />
                  <MedallionCard
                    asset={medallions.emeraldStar}
                    title="YOUTUBE PUBLISHING"
                    badge="Upcoming"
                    description="Automated OAuth deployment to YouTube Data API v3, thumbnail staging, and scheduled release."
                    actionText="Phase 4 Module"
                    planned={true}
                    accentColor="var(--saffron-bright)"
                  />
                </div>
              </div>

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
                          User creates video in preferred tool; $0 video API budget.
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

              <PosterRibbonDivider />

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
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-on-cream-muted)', marginTop: '0.25rem' }}>
                            {s.subtopic}
                          </div>
                        )}
                        {s.content_focus && (
                          <div style={{ marginTop: '0.6rem' }}>
                            <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', fontWeight: 700, backgroundColor: 'rgba(7,141,173,0.15)', color: 'var(--rich-turquoise)', padding: '2px 6px', borderRadius: '3px' }}>
                              {s.content_focus}
                            </span>
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

          {/* TAB 4: CONTENT WORKSPACE (EMPTY STATE WITH MEDIA GARDEN ILLUSTRATION) */}
          {activeTab === 'packages' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <PosterFrame title="CONTENT WORKSPACE // SCRIPT SYNTHESIS" variant="indigo">
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    gap: '2rem',
                    padding: '1rem 0',
                  }}
                >
                  <div style={{ flex: '1 1 360px' }}>
                    <div
                      style={{
                        borderRadius: '8px',
                        border: '3px solid var(--saffron-gold)',
                        overflow: 'hidden',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
                      }}
                    >
                      <PosterAssetImage asset={illustrations.mediaGarden} />
                    </div>
                  </div>
                  <div style={{ flex: '1 1 360px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--saffron-gold)' }}>★</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--saffron-gold)', fontWeight: 700 }}>
                        UPCOMING PHASE 2 PIPELINE
                      </span>
                    </div>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--text-on-dark)', margin: '0 0 1rem 0' }}>
                      ONE-CALL LLM GENERATION
                    </h2>
                    <p style={{ color: 'var(--antique-paper)', lineHeight: 1.6, fontSize: '0.95rem', margin: '0 0 1.5rem 0' }}>
                      Once scheduled topics are active, the automated morning workflow retrieves research citations and dispatches a single structured prompt to OpenRouter (:free tier). It generates full long-form narration, Shorts script, thumbnail concepts, and publishing metadata.
                    </p>
                    <PosterButton variant="saffron" size="md" onClick={() => setActiveTab('schedule')}>
                      CONFIGURE TOPIC SCHEDULE ➔
                    </PosterButton>
                  </div>
                </div>
              </PosterFrame>
            </div>
          )}

          {/* TAB 5: MEDIA UPLOAD (EMPTY STATE WITH MEDIA GARDEN ILLUSTRATION) */}
          {activeTab === 'media' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <PosterFrame title="MEDIA UPLOAD // WORKSTATION CHECK" variant="cream">
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    gap: '2rem',
                    padding: '1rem 0',
                  }}
                >
                  <div style={{ flex: '1 1 360px' }}>
                    <div
                      style={{
                        borderRadius: '8px',
                        border: '3px solid var(--dark-outline)',
                        overflow: 'hidden',
                        boxShadow: '4px 4px 0px var(--dark-outline)',
                      }}
                    >
                      <PosterAssetImage asset={illustrations.workstation} />
                    </div>
                  </div>
                  <div style={{ flex: '1 1 360px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--vermilion)' }}>★</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--vermilion)', fontWeight: 700 }}>
                        EXTERNAL CRAFTING // ZERO API COST
                      </span>
                    </div>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--dark-outline)', margin: '0 0 1rem 0' }}>
                      HUMAN-PRODUCED MEDIA VALIDATION
                    </h2>
                    <p style={{ color: 'var(--text-on-cream-muted)', lineHeight: 1.6, fontSize: '0.95rem', margin: '0 0 1.5rem 0' }}>
                      To maintain our zero-paid-API mandate, video rendering is crafted externally by you using your preferred editor. In Phase 3, this workstation validates video dimensions, duration, bitrate, audio tracks, and caption alignment before deployment.
                    </p>
                    <PosterButton variant="vermilion" size="md" onClick={() => setActiveTab('dashboard')}>
                      RETURN TO DISPATCH
                    </PosterButton>
                  </div>
                </div>
              </PosterFrame>
            </div>
          )}

          {/* TAB 6: PUBLISHING (EMPTY STATE) */}
          {activeTab === 'youtube' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <PosterFrame title="YOUTUBE PUBLISHING // DEPLOYMENT CALENDAR" variant="turquoise">
                <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                  <div style={{ width: 64, height: 64, margin: '0 auto 1rem auto' }}>
                    <PosterAssetImage asset={medallions.emeraldStar} width={64} height={64} />
                  </div>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: '#FFF', margin: '0 0 0.75rem 0' }}>
                    YOUTUBE DATA API V3 AUTOMATION
                  </h2>
                  <p style={{ color: 'var(--warm-cream)', maxWidth: '580px', margin: '0 auto 1.5rem auto', lineHeight: 1.6 }}>
                    Direct OAuth integration with YouTube Studio for automated uploads, thumbnail staging, description tagging, and scheduled release times according to your editorial calendar.
                  </p>
                  <PosterButton variant="saffron" size="md" onClick={() => setActiveTab('dashboard')}>
                    RETURN TO STUDIO HOME
                  </PosterButton>
                </div>
              </PosterFrame>
            </div>
          )}
        </div>
      )}
    </AppShell>
  );
};
