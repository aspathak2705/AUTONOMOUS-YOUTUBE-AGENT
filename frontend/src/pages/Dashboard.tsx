import React, { useEffect, useState } from 'react';
import { healthApi } from '../services/api';
import { DependenciesHealth, LiveHealth, ReadyHealth, RootInfo } from '../types/api';

export const Dashboard: React.FC = () => {
  const [rootInfo, setRootInfo] = useState<RootInfo | null>(null);
  const [liveHealth, setLiveHealth] = useState<LiveHealth | null>(null);
  const [readyHealth, setReadyHealth] = useState<ReadyHealth | null>(null);
  const [dependencies, setDependencies] = useState<DependenciesHealth | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHealthData = async () => {
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect to backend server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthData();
  }, []);

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '2rem 1rem', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#1e293b' }}>
      <header style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: '#0f172a' }}>
          Autonomous YouTube Agent
        </h1>
        <p style={{ margin: 0, color: '#64748b', fontSize: '1rem', lineHeight: 1.5 }}>
          AI-assisted YouTube content production and publishing system. Phase 0: Project Setup &amp; Feasibility Audit.
        </p>
      </header>

      {loading && (
        <div style={{ padding: '2rem', textAlign: 'center', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <p style={{ margin: 0, color: '#475569', fontSize: '1.1rem' }}>Checking backend health status...</p>
        </div>
      )}

      {error && (
        <div style={{ padding: '1.5rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.1rem', margin: '0 0 0.5rem 0', color: '#991b1b' }}>Backend Connection Error</h2>
          <p style={{ margin: '0 0 1rem 0', color: '#b91c1c' }}>{error}</p>
          <button
            onClick={fetchHealthData}
            style={{ padding: '0.5rem 1rem', background: '#dc2626', color: '#ffffff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
          >
            Retry Connection
          </button>
        </div>
      )}

      {!loading && !error && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            {/* System Info */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h2 style={{ fontSize: '1rem', color: '#475569', margin: '0 0 0.75rem 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Application Process
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ height: '10px', width: '10px', borderRadius: '50%', background: '#22c55e' }}></span>
                <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>{rootInfo?.name}</span>
              </div>
              <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.875rem', color: '#64748b' }}>Version: {rootInfo?.version}</p>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>Environment: {rootInfo?.environment}</p>
            </div>

            {/* Liveness Check */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h2 style={{ fontSize: '1rem', color: '#475569', margin: '0 0 0.75rem 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Process Liveness
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ height: '10px', width: '10px', borderRadius: '50%', background: liveHealth?.status === 'live' ? '#22c55e' : '#ef4444' }}></span>
                <span style={{ fontWeight: 600, fontSize: '1.1rem', textTransform: 'capitalize' }}>{liveHealth?.status}</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>
                Server UTC: {liveHealth?.timestamp ? new Date(liveHealth.timestamp).toLocaleTimeString() : 'N/A'}
              </p>
            </div>

            {/* Readiness Check */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h2 style={{ fontSize: '1rem', color: '#475569', margin: '0 0 0.75rem 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Database Readiness
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ height: '10px', width: '10px', borderRadius: '50%', background: readyHealth?.status === 'ready' ? '#22c55e' : '#f59e0b' }}></span>
                <span style={{ fontWeight: 600, fontSize: '1.1rem', textTransform: 'capitalize' }}>{readyHealth?.status}</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>
                Database: {readyHealth?.checks.database}
              </p>
            </div>
          </div>

          {/* Dependencies Status Panel */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 600, margin: '0 0 1rem 0', color: '#0f172a' }}>
              External Service Configuration
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
                <div>
                  <strong style={{ display: 'block', fontSize: '0.95rem' }}>Supabase PostgreSQL</strong>
                  <span style={{ fontSize: '0.825rem', color: '#64748b' }}>{dependencies?.database.details}</span>
                </div>
                <span style={{ fontSize: '0.825rem', fontWeight: 600, padding: '0.25rem 0.6rem', borderRadius: '4px', background: dependencies?.database.configured ? '#dcfce7' : '#fef3c7', color: dependencies?.database.configured ? '#166534' : '#92400e' }}>
                  {dependencies?.database.status}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
                <div>
                  <strong style={{ display: 'block', fontSize: '0.95rem' }}>OpenRouter LLM Gateway</strong>
                  <span style={{ fontSize: '0.825rem', color: '#64748b' }}>{dependencies?.openrouter.details}</span>
                </div>
                <span style={{ fontSize: '0.825rem', fontWeight: 600, padding: '0.25rem 0.6rem', borderRadius: '4px', background: dependencies?.openrouter.configured ? '#dcfce7' : '#f1f5f9', color: dependencies?.openrouter.configured ? '#166534' : '#475569' }}>
                  {dependencies?.openrouter.status}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ display: 'block', fontSize: '0.95rem' }}>YouTube Data API / OAuth 2.0</strong>
                  <span style={{ fontSize: '0.825rem', color: '#64748b' }}>{dependencies?.youtube.details}</span>
                </div>
                <span style={{ fontSize: '0.825rem', fontWeight: 600, padding: '0.25rem 0.6rem', borderRadius: '4px', background: dependencies?.youtube.configured ? '#dcfce7' : '#f1f5f9', color: dependencies?.youtube.configured ? '#166534' : '#475569' }}>
                  {dependencies?.youtube.status}
                </span>
              </div>
            </div>
            <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
              <button
                onClick={fetchHealthData}
                style={{ padding: '0.5rem 1rem', background: '#0284c7', color: '#ffffff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
              >
                Refresh Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
