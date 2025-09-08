import React, { useEffect, useState } from "react";

type Progress = { step: string } | null;
type SelectionStatus = { hasValidFrame: boolean; message: string } | null;

export default function App() {
  const [progress, setProgress] = useState<Progress>(null);
  const [selectionStatus, setSelectionStatus] = useState<SelectionStatus>(null);
  const [subject, setSubject] = useState("Draft from Figma");
  const [preheader, setPreheader] = useState("");
  const [templateName, setTemplateName] = useState("Figma Template");
  const [createCampaign, setCreateCampaign] = useState(false);
  const [listId, setListId] = useState("");
  const [replyTo, setReplyTo] = useState("");

  useEffect(() => {
    (window as any).onmessage = (e: MessageEvent) => {
      const msg = (e.data as any)?.pluginMessage;
      if (!msg) return;
      if (msg.type === "PROGRESS") setProgress({ step: msg.step });
      if (msg.type === "DONE") setProgress(null);
      if (msg.type === "ERROR") alert(msg.message);
      if (msg.type === "SELECTION_UPDATE") setSelectionStatus({ hasValidFrame: msg.hasValidFrame, message: msg.message });
    };
  }, []);

  function connect() {
    parent.postMessage({ pluginMessage: { type: "CONNECT" } }, "*");
  }
  function push() {
    parent.postMessage({ pluginMessage: { type: "PUSH", subject, preheader, templateName, createCampaign, listId, replyTo } }, "*");
  }

  return (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif", padding: 12, width: 360 }}>
      <h3>Figma → Mailchimp</h3>
      <div style={{ background: "#f0f8ff", padding: 8, borderRadius: 4, marginBottom: 12, fontSize: 12 }}>
        💡 <strong>Tip:</strong> Select an email design Frame in Figma before clicking "Compile & Push"
      </div>
      
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
      
      <button onClick={connect}>Connect Mailchimp</button>
      <div style={{ marginTop: 12 }}>
        <label>Template name</label>
        <input value={templateName} onChange={e => setTemplateName(e.target.value)} style={{ width: "100%" }} />
      </div>
      <div style={{ marginTop: 8 }}>
        <label>Subject</label>
        <input value={subject} onChange={e => setSubject(e.target.value)} style={{ width: "100%" }} />
      </div>
      <div style={{ marginTop: 8 }}>
        <label>Preheader</label>
        <input value={preheader} onChange={e => setPreheader(e.target.value)} style={{ width: "100%" }} />
      </div>
      <div style={{ marginTop: 8 }}>
        <label><input type="checkbox" checked={createCampaign} onChange={e => setCreateCampaign(e.target.checked)} /> Create draft campaign</label>
      </div>
      {createCampaign && (
        <>
          <div style={{ marginTop: 8 }}>
            <label>Audience List ID</label>
            <input value={listId} onChange={e => setListId(e.target.value)} style={{ width: "100%" }} placeholder="e.g. a1b2c3d4..." />
            <small>Requires Mailchimp List ID</small>
          </div>
          <div style={{ marginTop: 8 }}>
            <label>Reply-To Email</label>
            <input value={replyTo} onChange={e => setReplyTo(e.target.value)} style={{ width: "100%" }} placeholder="e.g. hello@yourdomain.com" />
            <small>Must be a verified email in your Mailchimp account</small>
          </div>
        </>
      )}
      <button 
        style={{ 
          marginTop: 12, 
          opacity: selectionStatus?.hasValidFrame ? 1 : 0.6,
          cursor: selectionStatus?.hasValidFrame ? "pointer" : "not-allowed"
        }} 
        onClick={selectionStatus?.hasValidFrame ? push : undefined}
        disabled={!selectionStatus?.hasValidFrame}
      >
        Compile & Push
      </button>
      {progress && <p style={{ marginTop: 8 }}>⏳ {progress.step}</p>}
    </div>
  );
}
