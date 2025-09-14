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
      background: "#ffffff",
      margin: 0,
      padding: "20px",
      minHeight: "100vh",
      boxSizing: "border-box"
    }}>
      <div style={{ maxWidth: 380, margin: "0 auto" }}>
        <div style={{
          background: "#ffffff",
          borderRadius: 8,
          padding: 24,
          marginBottom: 16,
          boxShadow: "4px 4px 0px oklch(0.25 0 0)",
          border: "2px solid oklch(0.25 0 0)"
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "16px"
          }}>
            <div
              style={{
                width: "32px",
                height: "24px",
                backgroundColor: "oklch(0.96 0 0)",
                border: "2px solid oklch(0.25 0 0)",
                borderRadius: "2px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                fontWeight: "bold",
                color: "oklch(0.25 0 0)"
              }}
            >
              📧
            </div>
            <h3 style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 600,
              color: "oklch(0.25 0 0)",
              letterSpacing: "-0.025em"
            }}>FigMail</h3>
          </div>
          <p style={{
            color: "oklch(0.55 0 0)",
            marginBottom: 20,
            fontSize: 14
          }}>
            Convert Figma designs to email templates
          </p>

          {/* Selection Status */}
          {selectionStatus && (
            <div style={{
              padding: "12px 16px",
              borderRadius: 4,
              marginBottom: 16,
              fontSize: 13,
              background: selectionStatus.hasValidFrame
                ? "oklch(0.96 0 0)"
                : "oklch(0.96 0 0)",
              color: selectionStatus.hasValidFrame ? "oklch(0.25 0 0)" : "oklch(0.55 0 0)",
              border: `2px solid ${selectionStatus.hasValidFrame ? "oklch(0.65 0.25 330)" : "oklch(0.45 0 0)"}`,
              boxShadow: selectionStatus.hasValidFrame ? "2px 2px 0px oklch(0.65 0.25 330)" : "2px 2px 0px oklch(0.45 0 0)"
            }}>
              <span>{selectionStatus.message}</span>
            </div>
          )}

          {/* Template Section */}
          <div style={{ marginBottom: 16 }}>
            <label style={{
              fontSize: 14,
              fontWeight: 600,
              color: "oklch(0.25 0 0)",
              marginBottom: 8,
              display: "block"
            }}>Quick Start Templates</label>
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "2px solid oklch(0.25 0 0)",
                borderRadius: 4,
                fontSize: 13,
                background: "white",
                cursor: "pointer",
                marginBottom: 8,
                boxShadow: "2px 2px 0px oklch(0.25 0 0)"
              }}
            >
              <option value="">Choose a template...</option>
              <option value="modern-newsletter">Newsletter</option>
              <option value="modern-promotional">Promotional</option>
              <option value="modern-welcome">Welcome Email</option>
              <option value="modern-product-showcase">Product Showcase</option>
            </select>
            <button
              onClick={handleInsertTemplate}
              disabled={!selectedTemplate}
              style={{
                width: "100%",
                background: selectedTemplate
                  ? "oklch(0.65 0.25 330)"
                  : "oklch(0.45 0 0)",
                color: "white",
                border: `2px solid ${selectedTemplate ? "oklch(0.65 0.25 330)" : "oklch(0.45 0 0)"}`,
                padding: "10px",
                borderRadius: 4,
                cursor: selectedTemplate ? "pointer" : "not-allowed",
                fontSize: 13,
                fontWeight: 500,
                marginBottom: 8,
                transition: "all 0.2s ease",
                boxShadow: selectedTemplate ? "2px 2px 0px oklch(0.25 0 0)" : "2px 2px 0px oklch(0.25 0 0)"
              }}
            >
              Insert Template
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
                borderRadius: 4,
                fontSize: 13,
                fontWeight: 500,
                cursor: selectionStatus?.hasValidFrame ? "pointer" : "not-allowed",
                border: `2px solid ${selectionStatus?.hasValidFrame ? "oklch(0.6 0.25 240)" : "oklch(0.45 0 0)"}`,
                flex: 1,
                background: selectionStatus?.hasValidFrame
                  ? "oklch(0.6 0.25 240)"
                  : "oklch(0.45 0 0)",
                color: "white",
                transition: "all 0.2s ease",
                boxShadow: "2px 2px 0px oklch(0.25 0 0)"
              }}
            >
              Download HTML
            </button>
            <button
              onClick={push}
              disabled={!selectionStatus?.hasValidFrame || !oauthStatus?.connected}
              style={{
                padding: "12px 16px",
                borderRadius: 4,
                fontSize: 13,
                fontWeight: 500,
                cursor: (selectionStatus?.hasValidFrame && oauthStatus?.connected) ? "pointer" : "not-allowed",
                border: `2px solid ${(selectionStatus?.hasValidFrame && oauthStatus?.connected) ? "oklch(0.6 0.25 180)" : "oklch(0.45 0 0)"}`,
                flex: 1,
                background: (selectionStatus?.hasValidFrame && oauthStatus?.connected)
                  ? "oklch(0.6 0.25 180)"
                  : "oklch(0.45 0 0)",
                color: "white",
                transition: "all 0.2s ease",
                boxShadow: "2px 2px 0px oklch(0.25 0 0)"
              }}
            >
              Push to Mailchimp
            </button>
          </div>

          {/* OAuth Status */}
          <div style={{
            background: "oklch(0.96 0 0)",
            padding: "12px 16px",
            borderRadius: 4,
            marginTop: 16,
            fontSize: 13,
            color: oauthStatus?.connected ? "oklch(0.25 0 0)" : "oklch(0.55 0 0)",
            border: `2px solid ${oauthStatus?.connected ? "oklch(0.6 0.25 180)" : "oklch(0.7 0.25 60)"}`,
            boxShadow: `2px 2px 0px ${oauthStatus?.connected ? "oklch(0.6 0.25 180)" : "oklch(0.7 0.25 60)"}`
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
                  background: "oklch(0.6 0.25 240)",
                  color: "white",
                  border: "2px solid oklch(0.6 0.25 240)",
                  padding: "8px 12px",
                  borderRadius: 4,
                  cursor: "pointer",
                  fontSize: 12,
                  marginTop: 4,
                  boxShadow: "2px 2px 0px oklch(0.25 0 0)"
                }}
              >
                Connect Mailchimp
              </button>
            )}
          </div>

          {/* Progress */}
          {progress && (
            <div style={{
              color: "oklch(0.25 0 0)",
              fontStyle: "normal",
              marginTop: 16,
              padding: "12px",
              background: "oklch(0.96 0 0)",
              borderRadius: 4,
              border: "2px solid oklch(0.6 0.25 240)",
              textAlign: "center",
              boxShadow: "2px 2px 0px oklch(0.6 0.25 240)"
            }}>
              {progress.step}
            </div>
          )}

          {/* Help Text */}
          <div style={{
            fontSize: 12,
            color: "oklch(0.55 0 0)",
            marginTop: 16,
            textAlign: "center",
            padding: 8,
            background: "oklch(0.98 0 0)",
            borderRadius: 4,
            border: "1px solid oklch(0.9 0 0)"
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
