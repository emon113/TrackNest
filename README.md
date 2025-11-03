<p align="center">
  <h1 align="center">둥지 TrackNest</h1>
  <h3 align="center">Your Unified Command Center for Notes, Tasks, & R&D</h3>
</p>

<p align="center">
  <img alt="Laravel" src="https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white">
  <img alt="React" src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB">
  <img alt="Inertia.js" src="https://img.shields.io/badge/Inertia.js-9553E9?style=for-the-badge&logo=inertia&logoColor=white">
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white">
  <img alt="MySQL" src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white">
</p>

---

## ✨ Overview

**TrackNest** is a modern, aesthetic, all-in-one productivity app designed for developers, researchers, and creators.  
It combines a powerful note-taking system with a drag-and-drop task manager — helping you stop switching tabs and start focusing on your work.

---

## 🎨 The Aesthetic

A core feature of TrackNest is its calm, *"premium neutral"* design.

- **Aesthetic Theme:** A custom theme built on a zinc color palette with a teal primary accent.  
- **Light & Dark Mode:** Automatically detects your system preference.  
- **Responsive:** Fully optimized for desktop, tablet, and mobile.  
- **PWA Ready:** Can be installed as a Progressive Web App (desktop or mobile).  

---

## 🗒️ Notes Module (Complete)

A complete, full-stack system for capturing and organizing your ideas.

- **Full CRUD:** Create, Read, Update, and Delete notes.  
- **Rich Text Editor:** Powered by TipTap with code highlighting, headings, and lists.  
- **Organization:**
  - **Notebooks:** Group notes into separate notebooks.  
  - **Tags:** Apply multiple tags to any note (many-to-many relationship).  
  - **Pinning:** Pin important notes to the top of your list.  
- **Powerful Search:** Fast, simple search that filters notes by title and content (powered by Eloquent `LIKE`).  
- **Dashboard Integration:** Pinned notes and recent activity appear on your main dashboard.  

---

## ✅ To-Do Module (Kanban) — *In Progress*

The next major feature currently under development.

- **Kanban Board:** Drag-and-drop tasks between *To-Do*, *Doing*, and *Done*.  
- **Deadlines:** Assign due dates to tasks.  
- **Task Management:** Full CRUD support.  

---

## 🧭 Dashboard

Your app’s **command center** — an at-a-glance summary of your work.

- **Stats Widget:** Shows total notes, notebooks, and tags.  
- **Pinned Notes Widget:** Quick access to your top notes.  
- **Recent Activity Widget:** Displays your last 5 notes.  

---

## 📸 Screenshots

> *(Replace with your own images — create a `.github/img` folder and add your screenshots there.)*

- Dashboard  
- Notes (Grid View)  
- Welcome Page  
- Note Editor  

---

## 🛠️ Technology Stack

TrackNest is a modern “monolith” built with the **LIRR stack**.

### Backend
- **Laravel:** Core backend framework (PHP).  
- **MySQL:** Database.  
- **Laravel Scout:** Powers the search feature using the built-in database driver.  

### Frontend
- **Inertia.js:** Connects Laravel to React seamlessly.  
- **React:** Frontend library.  
- **Tailwind CSS:** For utility-first, aesthetic design.  
- **Vite:** Lightning-fast frontend bundler.  

---

## 🚀 Getting Started

### Prerequisites
Ensure you have the following installed:
- PHP ≥ 8.2  
- Composer  
- Node.js & npm  
- Local MySQL database  

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/tracknest.git
cd tracknest
