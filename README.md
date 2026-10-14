# 🎓 GradTrack — Higher Education Application Command Center

> A sleek, high-performance web application designed for students tracking **Bachelors, Masters, and PhD applications**, deadlines, document requirements, scholarships, and admission decisions across universities worldwide.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-amber)

---

## 🌟 Key Highlights

### 1. 🏛️ Smart University Pipeline & Classification
- Categorize each target school into **🟢 Safety**, **🔵 Target**, **🟡 Reach**, or **🔴 Dream**.
- Track status stages: *Researching → In Progress → Submitted → Interview → Accepted / Waitlisted / Rejected*.
- Filter by admission status, degree type, or category with instant keyword search.

### 2. ⏰ Intelligent Deadline Urgency Engine
- Real-time countdown badges compute urgency dynamically:
  - 🔴 **Overdue / Due Today** (pulsing alerts)
  - 🔴 **≤ 7 days left** (high urgency)
  - 🟡 **≤ 14 days left** (moderate urgency)
  - 🟢 **≤ 30 days left** (upcoming)
  - 🗓️ **> 30 days** (standard date)

### 3. 📄 Automated 7-Point Document Checklist
Every university added automatically initializes standard graduate admissions requirements:
1. Statement of Purpose (SOP)
2. Official Academic Transcripts
3. Letters of Recommendation (LOR)
4. Academic Resume / CV
5. English Proficiency Exam (IELTS / TOEFL)
6. Standardized Test (GRE / GMAT)
7. Application Fee Payment
- Track document readiness with live progress meters (e.g. `5/7 Ready`).

### 4. 💰 Financial Aid & Application Expense Tracker
- Compare scholarship packages, graduate assistantships (GRA/GTA), tuition costs, and estimated cost of living.
- Automatic computation of **Net Out-of-Pocket Expenses**.
- **Application Fee Budget Tracker**: Keeps a tally of total application fees spent across universities.

### 5. 📤 Triple Export System
- **Print-Ready PDF**: Generates a formatted executive summary report with status tables, deadline warnings, and statistics.
- **Excel / CSV**: 1-click download compatible with Google Sheets, Microsoft Excel, and Apple Numbers.
- **JSON Backup & Restore**: Full offline portable backup to transfer data between devices seamlessly.

### 6. 📚 Admissions Toolkit & Resources Hub
- **Cold-Email Templates to Professors**: Copy-ready templates for research assistantship inquiries, admissions questions, and recommendation follow-ups.
- **SOP (Statement of Purpose) Blueprint**: Section-by-section breakdown (Hook, Technical Foundation, Faculty Alignment, Long-Term Vision).
- **Global Scholarship Directory**: Direct links to top international awards (Fulbright, DAAD, Erasmus Mundus, Chevening, Swiss Government Excellence).

### 7. 🏆 Gamified Milestone Badges
- Celebrates application progress with 8 unlockable achievements (*First University Added, 5 Shortlisted, 10 Schools Strong, First Submission, Admission Offer Received, Global Explorer, etc.*).
- Visual achievement grid with glowing indicators and celebration toast notifications.

### 8. 🔒 100% Client-Side Privacy
- All application records and personal notes are stored locally in the user's browser using `localStorage`.
- **Zero server costs, zero database vulnerabilities, zero data sharing.** Every visitor gets their own private workspace.

---

## 🚀 Quick Start (Local Development)

```bash
# 1. Clone the repository
git clone https://github.com/your-username/bachelors-and-master-application-tracker.git

# 2. Enter project directory
cd bachelors-and-master-application-tracker

# 3. Install dependencies
npm install

# 4. Start Vite development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📦 Production Build

```bash
# Compile TypeScript and bundle with Vite
npm run build

# Preview production bundle locally
npm run preview
```

---

## 🌐 Deploy to Vercel (1-Click)

1. Fork or push this repository to your GitHub account.
2. Go to [Vercel](https://vercel.com/) and click **"Add New Project"**.
3. Import this repository.
4. Framework Preset will auto-detect as **Vite**.
5. Click **Deploy** — your application will be live on a custom `.vercel.app` URL in under 60 seconds!

---

## 🛠️ Technology Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 8](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Storage**: Client-Side `localStorage` with state synchronization

---

## 👨‍💻 Author & Copyright

**Created & Maintained by [Abdul Rahim](https://github.com)**

All original concepts, design architecture, and implementation belong to Abdul Rahim.

---

## 📄 License & Terms of Use

Copyright (c) 2024-2026 **Abdul Rahim**. All rights reserved.

- **Permitted Use:** Anyone is free to visit, clone, self-host, and use this application for personal university and master's application tracking.
- **Restrictions:** No individual or organization is permitted to claim ownership or copyright, remove the author's attribution, sell, or redistribute modified copies of the proprietary codebase without explicit written permission from Abdul Rahim.
- Refer to the full [LICENSE](file:///LICENSE) file for complete details.

