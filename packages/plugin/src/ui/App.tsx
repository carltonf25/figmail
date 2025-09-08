import React, { useEffect, useState } from "react";

type Progress = { step: string } | null;
type SelectionStatus = { hasValidFrame: boolean; message: string } | null;
type OAuthStatus = { connected: boolean; dc?: string; account?: string; total_subscribers?: number } | null;

export default function App() {
  const [progress, setProgress] = useState<Progress>(null);
  const [selectionStatus, setSelectionStatus] = useState<SelectionStatus>(null);
  const [subject, setSubject] = useState("Draft from Figma");
  const [preheader, setPreheader] = useState("");
  const [templateName, setTemplateName] = useState("Figma Template");
  const [createCampaign, setCreateCampaign] = useState(false);
  const [listId, setListId] = useState("");
  const [replyTo, setReplyTo] = useState("");
  const [oauthStatus, setOauthStatus] = useState<OAuthStatus>(null);
  const [oauthUrl, setOauthUrl] = useState<string>("");
  const [showOAuthInstructions, setShowOAuthInstructions] = useState(false);

  useEffect(() => {
    (window as any).onmessage = (e: MessageEvent) => {
      const msg = (e.data as any)?.pluginMessage;
      if (!msg) return;

      if (msg.type === "PROGRESS") setProgress({ step: msg.step });
      if (msg.type === "DONE") setProgress(null);
      if (msg.type === "ERROR") alert(msg.message);
      if (msg.type === "SELECTION_UPDATE") setSelectionStatus({ hasValidFrame: msg.hasValidFrame, message: msg.message });

      // Handle OAuth messages
      if (msg.type === "OAUTH_REQUIRED") {
        setOauthUrl(msg.url);
        setShowOAuthInstructions(true);
        // Auto-open URL if possible
        if (typeof window !== 'undefined' && window.open) {
          window.open(msg.url, '_blank');
        }
      }
    };
  }, []);

  // Check OAuth status on mount
  useEffect(() => {
    checkOAuthStatus();
  }, []);

  const checkOAuthStatus = async () => {
    try {
      const response = await fetch('http://localhost:4000/auth/mailchimp/status', {
        credentials: 'include'
      });
      const status = await response.json();
      setOauthStatus(status);
    } catch (error) {
      console.error('Failed to check OAuth status:', error);
    }
  };

  const connect = () => {
    parent.postMessage({ pluginMessage: { type: "CONNECT" } }, "*");
  };

  const disconnect = async () => {
    try {
      await fetch('http://localhost:4000/auth/mailchimp/disconnect', {
        method: 'POST',
        credentials: 'include'
      });
      setOauthStatus(null);
      alert('Disconnected from Mailchimp');
    } catch (error) {
      alert('Failed to disconnect');
    }
  };

  const push = () => {
    parent.postMessage({ pluginMessage: { type: "PUSH", subject, preheader, templateName, createCampaign, listId, replyTo } }, "*");
  };

  return (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif", padding: 12, width: 360 }}>
      <h3>🎨 FigChimp</h3>
      <p style={{ fontSize: 12, color: "#666", marginBottom: 16 }}>
        Convert Figma designs to Mailchimp email templates
      </p>

      {/* OAuth Status */}
      <div style={{
        background: oauthStatus?.connected ? "#e8f5e8" : "#fff3e0",
        padding: 8,
        borderRadius: 4,
        marginBottom: 12,
        border: `1px solid ${oauthStatus?.connected ? "#c8e6c9" : "#ffcc80"}`
      }}>
        {oauthStatus?.connected ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>✅</span>
              <strong>Connected to Mailchimp</strong>
            </div>
            {oauthStatus.account && (
              <div style={{ fontSize: 12, marginTop: 4 }}>
                Account: {oauthStatus.account} ({oauthStatus.dc})
                {oauthStatus.total_subscribers && (
                  <div>Subscribers: {oauthStatus.total_subscribers.toLocaleString()}</div>
                )}
              </div>
            )}
            <button
              onClick={disconnect}
              style={{
                marginTop: 8,
                padding: '4px 8px',
                fontSize: 11,
                background: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: 3,
                cursor: 'pointer'
              }}
            >
              Disconnect
            </button>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>⚠️</span>
              <strong>Not connected to Mailchimp</strong>
            </div>
            <button
              onClick={connect}
              style={{
                marginTop: 8,
                padding: '6px 12px',
                background: '#007cba',
                color: 'white',
                border: 'none',
                borderRadius: 3,
                cursor: 'pointer'
              }}
            >
              Connect Mailchimp
            </button>
          </div>
        )}
      </div>

      {/* OAuth Instructions */}
      {showOAuthInstructions && (
        <div style={{
          background: "#e3f2fd",
          padding: 12,
          borderRadius: 4,
          marginBottom: 12,
          border: "1px solid #2196f3",
          fontSize: 12
        }}>
          <h4 style={{ margin: '0 0 8px 0', color: '#1976d2' }}>🔐 Mailchimp Authorization</h4>
          <p style={{ margin: '0 0 8px 0' }}>
            A new tab should have opened with Mailchimp's authorization page.
          </p>
          <ol style={{ margin: '0 0 8px 0', paddingLeft: 16 }}>
            <li>Sign in to your Mailchimp account</li>
            <li>Click "Allow" to grant FigChimp access</li>
            <li>Return to this plugin</li>
          </ol>
          {oauthUrl && (
            <div>
              <a
                href={oauthUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#1976d2',
                  textDecoration: 'underline',
                  fontWeight: 'bold'
                }}
              >
                Open Authorization Page →
              </a>
            </div>
          )}
          <button
            onClick={() => setShowOAuthInstructions(false)}
            style={{
              marginTop: 8,
              padding: '4px 8px',
              fontSize: 11,
              background: '#666',
              color: 'white',
              border: 'none',
              borderRadius: 3,
              cursor: 'pointer'
            }}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Selection Status */}
      {selectionStatus && (
        <div style={{
          background: selectionStatus.hasValidFrame ? "#e8f5e8" : "#fff3e0",
          padding: 8,
          borderRadius: 4,
          marginBottom: 12,
          fontSize: 12,
          border: `1px solid ${selectionStatus.hasValidFrame ? "#c8e6c9" : "#ffcc80"}`
        }}>
          {selectionStatus.hasValidFrame ? "✅" : "⚠️"} <strong>Selection:</strong> {selectionStatus.message}
        </div>
      )}

      {/* Form */}
      <div style={{ background: "#f8f9fa", padding: 12, borderRadius: 4 }}>
        <div style={{ marginBottom: 8 }}>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Template Name</label>
          <input
            value={templateName}
            onChange={e => setTemplateName(e.target.value)}
            style={{ width: "100%", padding: 6, borderRadius: 3, border: '1px solid #ddd' }}
            placeholder="My Email Template"
          />
        </div>

        <div style={{ marginBottom: 8 }}>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Subject Line</label>
          <input
            value={subject}
            onChange={e => setSubject(e.target.value)}
            style={{ width: "100%", padding: 6, borderRadius: 3, border: '1px solid #ddd' }}
            placeholder="Your subject line here"
          />
        </div>

        <div style={{ marginBottom: 8 }}>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Preheader</label>
          <input
            value={preheader}
            onChange={e => setPreheader(e.target.value)}
            style={{ width: "100%", padding: 6, borderRadius: 3, border: '1px solid #ddd' }}
            placeholder="Preview text shown in inbox"
          />
        </div>

        <div style={{ marginBottom: 8 }}>
          <label style={{ display: 'block' }}>
            <input
              type="checkbox"
              checked={createCampaign}
              onChange={e => setCreateCampaign(e.target.checked)}
              style={{ marginRight: 8 }}
            />
            Create draft campaign
          </label>
        </div>

        {createCampaign && (
          <>
            <div style={{ marginBottom: 8 }}>
              <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Audience List ID</label>
              <input
                value={listId}
                onChange={e => setListId(e.target.value)}
                style={{ width: "100%", padding: 6, borderRadius: 3, border: '1px solid #ddd' }}
                placeholder="e.g. a1b2c3d4..."
              />
              <small style={{ color: '#666', fontSize: 11 }}>Find this in your Mailchimp audience settings</small>
            </div>

            <div style={{ marginBottom: 8 }}>
              <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Reply-To Email</label>
              <input
                type="email"
                value={replyTo}
                onChange={e => setReplyTo(e.target.value)}
                style={{ width: "100%", padding: 6, borderRadius: 3, border: '1px solid #ddd' }}
                placeholder="hello@yourdomain.com"
              />
              <small style={{ color: '#666', fontSize: 11 }}>Must be verified in your Mailchimp account</small>
            </div>
          </>
        )}

        <button
          style={{
            width: "100%",
            marginTop: 12,
            padding: 10,
            background: selectionStatus?.hasValidFrame && oauthStatus?.connected ? "#28a745" : "#6c757d",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: selectionStatus?.hasValidFrame && oauthStatus?.connected ? "pointer" : "not-allowed",
            fontWeight: "bold"
          }}
          onClick={selectionStatus?.hasValidFrame && oauthStatus?.connected ? push : undefined}
          disabled={!selectionStatus?.hasValidFrame || !oauthStatus?.connected}
        >
          🚀 Compile & Push to Mailchimp
        </button>

        {(!oauthStatus?.connected || !selectionStatus?.hasValidFrame) && (
          <div style={{ fontSize: 11, color: '#666', marginTop: 8, textAlign: 'center' }}>
            {!oauthStatus?.connected && "Connect Mailchimp first • "}
            {!selectionStatus?.hasValidFrame && "Select a Frame in Figma"}
          </div>
        )}
      </div>

      {progress && (
        <div style={{
          marginTop: 12,
          padding: 8,
          background: "#e3f2fd",
          borderRadius: 4,
          border: "1px solid #2196f3",
          fontSize: 12
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>⏳</span>
            <span>{progress.step}</span>
          </div>
        </div>
      )}
    </div>
  );
}