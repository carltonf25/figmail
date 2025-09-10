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
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");

  useEffect(() => {
    (window as any).onmessage = (e: MessageEvent) => {
      const msg = (e.data as any)?.pluginMessage;
      if (!msg) return;

      if (msg.type === "PROGRESS") setProgress({ step: msg.step });
      if (msg.type === "DONE") setProgress(null);
      if (msg.type === "ERROR") alert(msg.message);
      if (msg.type === "SELECTION_UPDATE") setSelectionStatus({ hasValidFrame: msg.hasValidFrame, message: msg.message });

      // Handle download ready
      if (msg.type === "DOWNLOAD_READY") {
        const link = document.createElement('a');
        link.href = msg.downloadUrl;
        link.download = msg.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(msg.downloadUrl);
      }

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

  const downloadHtml = () => {
    parent.postMessage({ pluginMessage: { type: "DOWNLOAD_HTML", subject, preheader, templateName } }, "*");
  };

  const handleInsertTemplate = () => {
    if (!selectedTemplate) return;
    parent.postMessage({ pluginMessage: { type: "INSERT_TEMPLATE", templateType: selectedTemplate } }, "*");
    setSelectedTemplate(""); // Reset selection after insertion
  };

  return (
    <div style={{
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      margin: 0,
      padding: "20px",
      minHeight: "100vh",
      boxSizing: "border-box"
    }}>
      <div style={{ maxWidth: 380, margin: "0 auto" }}>
        <div style={{
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          borderRadius: 16,
          padding: 24,
          marginBottom: 16,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          border: "1px solid rgba(255, 255, 255, 0.2)"
        }}>
          <h3 style={{
            margin: "0 0 16px 0",
            fontSize: 18,
            fontWeight: 600,
            color: "#1a1a1a",
            letterSpacing: "-0.025em"
          }}>🎨 FigMail</h3>
          <p style={{
            color: "#6b7280",
            marginBottom: 20,
            fontSize: 14
          }}>
            Convert Figma designs to email templates
          </p>

          {/* Selection Status */}
          {selectionStatus && (
            <div style={{
              padding: "12px 16px",
              borderRadius: 8,
              marginBottom: 16,
              fontSize: 13,
              border: "none",
              background: selectionStatus.hasValidFrame
                ? "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)"
                : "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)",
              color: selectionStatus.hasValidFrame ? "#1e40af" : "#6b7280",
              borderLeft: `4px solid ${selectionStatus.hasValidFrame ? "#2563eb" : "#9ca3af"}`
            }}>
              <span>{selectionStatus.message}</span>
            </div>
          )}

          {/* Template Section */}
          <div style={{ marginBottom: 16 }}>
            <label style={{
              fontSize: 14,
              fontWeight: 600,
              color: "#374151",
              marginBottom: 8,
              display: "block"
            }}>🎯 Quick Start Templates</label>
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #d1d5db",
                borderRadius: 8,
                fontSize: 13,
                background: "white",
                cursor: "pointer",
                marginBottom: 8
              }}
            >
              <option value="">Choose a template...</option>
              <option value="newsletter">📰 Newsletter Layout</option>
              <option value="promotional">🎉 Promotional Email</option>
              <option value="product-showcase">📦 Product Showcase</option>
              <option value="event-invite">📅 Event Invitation</option>
              <option value="welcome">👋 Welcome Email</option>
              <option value="2-column-basic">📊 2-Column Basic</option>
              <option value="3-column-features">📋 3-Column Features</option>
            </select>
            <button
              onClick={handleInsertTemplate}
              disabled={!selectedTemplate}
              style={{
                width: "100%",
                background: selectedTemplate
                  ? "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)"
                  : "#6c757d",
                color: selectedTemplate ? "#374151" : "white",
                border: "none",
                padding: "10px",
                borderRadius: 8,
                cursor: selectedTemplate ? "pointer" : "not-allowed",
                fontSize: 13,
                fontWeight: 500,
                marginBottom: 8,
                transition: "all 0.2s ease"
              }}
            >
              ✨ Insert Template
            </button>
          </div>

          {/* Action Buttons */}
          <div style={{
            display: "flex",
            gap: 8,
            marginTop: 20
          }}>
            <button
              onClick={downloadHtml}
              disabled={!selectionStatus?.hasValidFrame}
              style={{
                padding: "12px 16px",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 500,
                cursor: selectionStatus?.hasValidFrame ? "pointer" : "not-allowed",
                border: "none",
                flex: 1,
                background: selectionStatus?.hasValidFrame
                  ? "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"
                  : "#6c757d",
                color: "white",
                transition: "all 0.2s ease"
              }}
            >
              📥 Download HTML
            </button>
            <button
              onClick={push}
              disabled={!selectionStatus?.hasValidFrame || !oauthStatus?.connected}
              style={{
                padding: "12px 16px",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 500,
                cursor: (selectionStatus?.hasValidFrame && oauthStatus?.connected) ? "pointer" : "not-allowed",
                border: "none",
                flex: 1,
                background: (selectionStatus?.hasValidFrame && oauthStatus?.connected)
                  ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                  : "#6c757d",
                color: "white",
                transition: "all 0.2s ease"
              }}
            >
              🚀 Push to Mailchimp
            </button>
          </div>

          {/* OAuth Status */}
          <div style={{
            background: oauthStatus?.connected
              ? "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)"
              : "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
            padding: "12px 16px",
            borderRadius: 8,
            marginTop: 16,
            fontSize: 13,
            border: "none",
            color: oauthStatus?.connected ? "#065f46" : "#92400e",
            borderLeft: `4px solid ${oauthStatus?.connected ? "#059669" : "#d97706"}`
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span>{oauthStatus?.connected ? "✅" : "⚠️"}</span>
              <strong>
                {oauthStatus?.connected
                  ? `Connected to ${oauthStatus.account || 'Mailchimp'}`
                  : 'Not connected to Mailchimp'
                }
              </strong>
            </div>
            {!oauthStatus?.connected && (
              <button
                onClick={connect}
                style={{
                  background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                  color: "white",
                  border: "none",
                  padding: "8px 12px",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontSize: 12,
                  marginTop: 4
                }}
              >
                🔗 Connect Mailchimp
              </button>
            )}
          </div>

          {/* Progress */}
          {progress && (
            <div style={{
              color: "#6b7280",
              fontStyle: "normal",
              marginTop: 16,
              padding: "12px",
              background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
              borderRadius: 8,
              border: "1px solid #0ea5e9",
              textAlign: "center"
            }}>
              ⏳ {progress.step}
            </div>
          )}

          {/* Help Text */}
          <div style={{
            fontSize: 12,
            color: "#6b7280",
            marginTop: 16,
            textAlign: "center",
            padding: 8,
            background: "rgba(255, 255, 255, 0.8)",
            borderRadius: 6
          }}>
            {(!selectionStatus?.hasValidFrame)
              ? "Select a Frame in Figma or insert a template to get started"
              : (!oauthStatus?.connected)
                ? "Connect Mailchimp to use 'Push to Mailchimp' feature"
                : ""
            }
          </div>
        </div>
      </div>
    </div>
  );
}
