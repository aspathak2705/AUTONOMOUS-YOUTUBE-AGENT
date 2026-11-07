import React from 'react';
import { PosterFrame } from '../poster/PosterFrame';
import { PosterButton } from '../poster/PosterButton';

export interface CreatorProfileData {
  display_name: string;
  primary_niche: string;
  target_audience: string;
  content_style: string;
  timezone: string;
  channel_name?: string | null;
}

export interface ProfileViewProps {
  profile: CreatorProfileData | null;
  onUpdate: (updatedData: Partial<CreatorProfileData>) => Promise<void>;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ profile, onUpdate }) => {
  const [displayName, setDisplayName] = React.useState(profile?.display_name || 'Solo Creator');
  const [primaryNiche, setPrimaryNiche] = React.useState(profile?.primary_niche || 'Technology & AI');
  const [targetAudience, setTargetAudience] = React.useState(profile?.target_audience || 'Software developers and tech builders');
  const [contentStyle, setContentStyle] = React.useState(profile?.content_style || 'Editorial, deeply researched, high-density tutorials');
  const [timezone, setTimezone] = React.useState(profile?.timezone || 'Asia/Kolkata');
  const [isSaving, setIsSaving] = React.useState(false);
  const [saveMessage, setSaveMessage] = React.useState<string | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage(null);
    setErrorMessage(null);
    try {
      await onUpdate({
        display_name: displayName,
        primary_niche: primaryNiche,
        target_audience: targetAudience,
        content_style: contentStyle,
        timezone: timezone,
      });
      setSaveMessage('Creator profile saved successfully.');
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to update profile settings.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto' }}>
      <PosterFrame title="CREATOR PROFILE // CHANNEL MATRIX" variant="cream">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 800, fontFamily: 'var(--font-display)', fontSize: '0.85rem', marginBottom: '0.4rem', color: 'var(--text-on-cream)' }}>
              ✦ CREATOR DISPLAY NAME
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '3px solid var(--dark-outline)',
                borderRadius: '6px',
                fontFamily: 'var(--font-body)',
                backgroundColor: '#FFFFFF',
                fontSize: '1rem',
                boxShadow: '3px 3px 0px rgba(0,0,0,0.1)',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 800, fontFamily: 'var(--font-display)', fontSize: '0.85rem', marginBottom: '0.4rem', color: 'var(--text-on-cream)' }}>
              ✦ PRIMARY NICHE
            </label>
            <input
              type="text"
              value={primaryNiche}
              onChange={(e) => setPrimaryNiche(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '3px solid var(--dark-outline)',
                borderRadius: '6px',
                fontFamily: 'var(--font-body)',
                backgroundColor: '#FFFFFF',
                fontSize: '1rem',
                boxShadow: '3px 3px 0px rgba(0,0,0,0.1)',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 800, fontFamily: 'var(--font-display)', fontSize: '0.85rem', marginBottom: '0.4rem', color: 'var(--text-on-cream)' }}>
              ✦ TARGET AUDIENCE
            </label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              required
              minLength={5}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '3px solid var(--dark-outline)',
                borderRadius: '6px',
                fontFamily: 'var(--font-body)',
                backgroundColor: '#FFFFFF',
                fontSize: '1rem',
                boxShadow: '3px 3px 0px rgba(0,0,0,0.1)',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 800, fontFamily: 'var(--font-display)', fontSize: '0.85rem', marginBottom: '0.4rem', color: 'var(--text-on-cream)' }}>
              ✦ NARRATIVE &amp; EDITORIAL STYLE
            </label>
            <input
              type="text"
              value={contentStyle}
              onChange={(e) => setContentStyle(e.target.value)}
              required
              minLength={5}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '3px solid var(--dark-outline)',
                borderRadius: '6px',
                fontFamily: 'var(--font-body)',
                backgroundColor: '#FFFFFF',
                fontSize: '1rem',
                boxShadow: '3px 3px 0px rgba(0,0,0,0.1)',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 800, fontFamily: 'var(--font-display)', fontSize: '0.85rem', marginBottom: '0.4rem', color: 'var(--text-on-cream)' }}>
              ✦ CREATOR TIMEZONE (IANA FORMAT)
            </label>
            <input
              type="text"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '3px solid var(--dark-outline)',
                borderRadius: '6px',
                fontFamily: 'var(--font-mono)',
                backgroundColor: '#FFFFFF',
                fontSize: '1rem',
                boxShadow: '3px 3px 0px rgba(0,0,0,0.1)',
              }}
            />
            <span style={{ display: 'block', marginTop: '0.3rem', fontSize: '0.8rem', color: 'var(--text-on-cream-muted)', fontFamily: 'var(--font-mono)' }}>
              Used for 07:00 morning scheduler &amp; video publication times (e.g. <code>Asia/Kolkata</code>, <code>America/New_York</code>).
            </span>
          </div>

          {saveMessage && (
            <div style={{ padding: '0.85rem 1rem', backgroundColor: 'var(--festival-teal)', color: '#FFFFFF', borderRadius: '4px', fontWeight: 700, border: '2px solid var(--dark-outline)' }}>
              ✓ {saveMessage}
            </div>
          )}

          {errorMessage && (
            <div style={{ padding: '0.85rem 1rem', backgroundColor: 'var(--vermilion)', color: '#FFFFFF', borderRadius: '4px', fontWeight: 700, border: '2px solid var(--dark-outline)' }}>
              ✕ {errorMessage}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <PosterButton type="submit" variant="saffron" size="lg" disabled={isSaving}>
              {isSaving ? 'SAVING...' : 'SAVE CONFIGURATION'}
            </PosterButton>
          </div>
        </form>
      </PosterFrame>
    </div>
  );
};
