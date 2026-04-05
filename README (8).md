<div align="center">
  <img src="https://upload.wikimedia.org/wikipedia/en/thumb/6/69/IIT_Madras_Logo.svg/200px-IIT_Madras_Logo.svg.png" alt="IIT Madras Logo" width="100"/>
  <h1>🎓 TDS Exam Portal — Elite Engine</h1>
  <p><strong>A hyper-fast, completely deterministic, infinite-scale client-side workspace for solving IIT Madras TDS Exams (ROE & GA).</strong></p>

  <p>
    <a href="#features">Features</a> •
    <a href="#architecture">Architecture</a> •
    <a href="#running-locally">Local Testing</a> •
    <a href="#deployment">Deployment</a>
  </p>
  
  <img src="https://img.shields.io/badge/Status-Production_Ready-success?style=for-the-badge&logo=vercel" alt="Status" />
  <img src="https://img.shields.io/badge/Architecture-Vanilla_JavaScript-f1c40f?style=for-the-badge&logo=javascript" alt="JS" />
  <img src="https://img.shields.io/badge/Style-Glassmorphism-blue?style=for-the-badge&logo=css3" alt="CSS" />
</div>

---

## ⚡ Overview

The **TDS Exam Portal** represents a radical departure from traditional script execution. Built using a professional **IDE Workspace Architecture** (similar to VS Code or Notion), this tool allows thousands of students to rapidly generate fully customized examination payloads natively inside their browser—without calling a single external API or backend service.

It achieves instant computation using seeded client-side pseudo-random number generator (PRNG) logic matched directly against IITM backend specifications.

## ✨ Elite Features

- **Split-Pane Workspace:** Ditch infinite scrolling. Solutions render cleanly in a massive, 100vh dual-pane structural canvas.
- **Smart Session Memory:** Closes your browser securely. Your email and target environment are automatically cached locally via the `localStorage` API, restoring instantly upon return.
- **Lightning-Fast Node Filtering:** Navigating 15+ complex questions? The hidden sidebar search lets you filter specific topics in milliseconds.
- **Prism.js Syntax Highlighting:** Your Python code functions and JSON API trees are no longer dull strings. They're rendered beautifully using the premium `prism-tomorrow` syntax engine natively.
- **Hardware Benchmarking:** Live rendering of generation speeds (e.g. `Compiled in 42.1ms`).
- **Progressive Web App (PWA) Ready:** Mobile users can click *Add to Home Screen* to operate the solver as a native, offline-capable iOS/Android application.

---

## 🛠 Architecture

The portal leverages dynamic ES module routing (`await import()`). Adding new exams does not increase the initial loading footprint of the application.

```bash
/
├── index.html         # Workspace Canvas UI & Layout Frame
├── style.css          # Glassmorphism & IDE Grid rules
├── app.js             # State Manager, V-DOM Renderer, & Error Boundaries
├── vercel.json        # Edge network deployment protocols
├── manifest.json      # Mobile PWA configurations
└── solvers/           # The Engine Block
    ├── registry.js    # Shared engine utilities 
    ├── bypass-hook.js # DevTools global override generator
    ├── roe/           # Term 1 ROE solver module 
    └── ga7/           # Week 7 GA solver module
```

---

## 🚀 Running Locally

To edit or expand the solver engine locally, utilize any lightweight HTTP Server.

### Using Node / BrowserSync (Recommended)
```bash
npx serve -l 3000
# Server online at http://localhost:3000
```

### Using Python
```bash
python3 -m http.server 3000
# Server online at http://localhost:3000
```

---

## 🌍 Vercel Deployment

This portal is extremely aggressive with Edge Caching configurations and has been hardened to securely handle thousands of students simultaneously. No build pipelines or package managers are required.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Connect your Github repository to Vercel.
2. Ensure the root directory is selected.
3. Deploy. (Because `vercel.json` handles the heavy cache lifting, Vercel will process this flawlessly as a standard static project).

---
> *Developed exclusively for the TDS ecosystem.*
