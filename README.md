# FigChimp — Figma → Mailchimp Bridge

Design marketing emails directly in **Figma** and publish them as **responsive Mailchimp templates or draft campaigns** — with one click.

This monorepo contains the full stack:

- **Figma plugin (frontend + controller)**
- **Backend API (Express + TypeScript)**
- **Shared package (AST schema, types, validation)**

---

## Project Structure

```
figchimp/
├─ pnpm-workspace.yaml         # workspace configuration
├─ package.json                # root scripts (build, dev, lint)
├─ tsconfig.json               # project references
├─ packages/
│  ├─ shared/                  # shared types, AST schema, validation
│  │  ├─ package.json
│  │  ├─ tsconfig.json
│  │  └─ src/
│  │     ├─ ast.ts             # Zod schema for Email AST
│  │     ├─ validate.ts        # AST validation rules
│  │     └─ index.ts           # exports
│  │
│  ├─ backend/                 # Express API server
│  │  ├─ package.json
│  │  ├─ tsconfig.json
│  │  └─ src/
│  │     ├─ server.ts          # app entrypoint
│  │     ├─ routes/
│  │     │  ├─ auth.ts         # Mailchimp OAuth flow
│  │     │  └─ compile.ts      # compile & push endpoints
│  │     ├─ services/
│  │     │  ├─ astToMjml.ts    # AST → MJML compiler
│  │     │  ├─ mergeTags.ts    # Merge tag replacer
│  │     │  ├─ assets.ts       # Uploads images to S3 and rewrites AST
│  │     │  └─ mailchimp.ts    # Mailchimp Templates & Campaigns API calls
│  │     └─ utils/
│  │        └─ debug.ts        # Debug utilities and logging
│  │
│  └─ plugin/                  # Figma plugin (React UI + controller)
│     ├─ package.json
│     ├─ vite.config.ts
│     ├─ manifest.json         # Figma plugin manifest
│     └─ src/
│        ├─ code.ts            # plugin controller (Figma API)
│        └─ ui/                # React UI
│           ├─ index.html
│           ├─ index.tsx
│           └─ App.tsx
```

---

## Package Details

### `@figmc/shared`
- **Purpose:** Defines the **Email AST schema** and validation logic.
- **Tech:** TypeScript + [Zod](https://zod.dev/).
- **Exports:**
  - `ast.ts` — Figma primitives → email-safe AST (Text, Image, Button, Container, Divider, Spacer)
  - `validate.ts` — guardrails (max width, column totals, etc.)
- **Used by:** Backend for validation + compile, Plugin for AST construction.
- **Features:** Hyperlink detection, background color containers, spatial layout detection.

---

### `@figmc/backend`
- **Purpose:** Express API server to **compile Figma ASTs to Mailchimp-ready HTML** and push them to Mailchimp.
- **Endpoints:**
  - `GET /health` — health check.
  - `POST /compile` — compile AST + images → inlined HTML (MJML → HTML + Juice).
  - `POST /compile-and-push` — compile, upload assets to S3, create/update Mailchimp Template, optionally create draft Campaign.
  - `GET /auth/mailchimp/start` — start OAuth with Mailchimp.
  - `GET /auth/mailchimp/callback` — handle Mailchimp OAuth callback.
- **Services:**
  - `astToMjml.ts` — converts AST → MJML.
  - `mergeTags.ts` — maps `{{first_name}}` → `*|FNAME|*`.
  - `assets.ts` — uploads plugin-exported images to S3 and rewrites URLs.
  - `mailchimp.ts` — wraps Mailchimp Templates + Campaigns API.

---

### `@figmc/plugin`
- **Purpose:** The **Figma plugin** installed by users.
- **Components:**
  - `code.ts` — plugin controller:
    - Traverses selected Figma frame → AST.
    - Exports images → base64 → sends to backend.
    - Shows progress/errors in UI.
  - `ui/` — React interface for:
    - Mailchimp connect.
    - Subject, preheader, template name input.
    - Campaign creation with audience list ID and reply-to email.
    - "Compile & Push" button with selection status.
- **Build:** via Vite (`vite.config.ts`), outputs `code.js` and UI bundle referenced in `manifest.json`.

---

## Development

### Prereqs
- Node.js 20+
- pnpm 9+

### Install deps
```bash
pnpm install
```

### Run backend
```bash
pnpm --filter @figmc/backend dev
```

### Run plugin (UI build)
```bash
pnpm --filter @figmc/plugin dev
```

Then in **Figma**:
- `Plugins → Development → Import plugin from manifest…`
- Choose `packages/plugin/manifest.json`

### Build shared types
```bash
pnpm --filter @figmc/shared build
```

---

## Environment Variables

Backend requires `.env`:

```bash
# Mailchimp (for dev, can bypass OAuth with static token + dc)
MC_ACCESS_TOKEN=your_mailchimp_access_token
MC_DC=usXX

# S3 for asset hosting (optional - falls back to data URIs if not configured)
S3_BUCKET=your-bucket
S3_PREFIX=emails
AWS_REGION=us-east-1

# Email defaults
DEFAULT_REPLY_TO=hello@yourdomain.com

# Debug settings (optional)
DEBUG=true
DEBUG_LEVEL=info
```

---

## Documentation

- **[FIGMA_CONVENTIONS.md](./FIGMA_CONVENTIONS.md)** — Complete guide to designing emails in Figma
- **[packages/backend/DEBUG.md](./packages/backend/DEBUG.md)** — Backend debugging guide

### Key Features

- **🔗 Hyperlink Support:** Text links created in Figma (Cmd+K) become clickable in emails
- **🎨 Background Colors:** Colored rectangles become background sections in emails
- **📧 Campaign Creation:** Create draft campaigns with audience lists and reply-to emails
- **🖼️ Smart Images:** Automatic image export and optimization
- **📐 Layout Detection:** Intelligent conversion of Figma layouts to email-safe HTML

---

## Roadmap
- ✅ MVP: Figma → Template
- ✅ Campaign creation with audience lists
- ✅ Reply-to email configuration
- ✅ Hyperlink support in text
- ✅ Background color containers
- ✅ Debugging and error handling
- 🔄 OAuth token store per user (currently uses server-side tokens)
- 🔄 Visual audience list picker
- 🔄 Team features (brand tokens, shared workspaces)
- 🔄 Advanced layout features (multi-column, nested sections)
