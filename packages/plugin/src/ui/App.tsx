import React, { useEffect, useState } from "react";

type Progress = { step: string } | null;

export default function App() {
  const [progress, setProgress] = useState<Progress>(null);
  const [subject, setSubject] = useState("Draft from Figma");
  const [preheader, setPreheader] = useState("");
  const [templateName, setTemplateName] = useState("Figma Template");
  const [createCampaign, setCreateCampaign] = useState(false);
  const [listId, setListId] = useState("");

  useEffect(() => {
    (window as any).onmessage = (e: MessageEvent) => {
      const msg = (e.data as any)?.pluginMessage;
      if (!msg) return;
      if (msg.type === "PROGRESS") setProgress({ step: msg.step });
      if (msg.type === "DONE") setProgress(null);
      if (msg.type === "ERROR") alert(msg.message);
    };
  }, []);

  function connect() {
    parent.postMessage({ pluginMessage: { type: "CONNECT" } }, "*");
  }
  function push() {
    parent.postMessage({ pluginMessage: { type: "PUSH", subject, preheader, templateName, createCampaign, listId } }, "*");
  }

  return (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif", padding: 12, width: 360 }}>
      <h3>Figma → Mailchimp</h3>
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
        <div style={{ marginTop: 8 }}>
          <label>Audience List ID</label>
          <input value={listId} onChange={e => setListId(e.target.value)} style={{ width: "100%" }} placeholder="e.g. a1b2c3d4..." />
          <small>Requires Mailchimp List ID</small>
        </div>
      )}
      <button style={{ marginTop: 12 }} onClick={push}>Compile & Push</button>
      {progress && <p style={{ marginTop: 8 }}>⏳ {progress.step}</p>}
    </div>
  );
}
