# EMPOWAY – Empowering Every Journey
### Sri Lanka Urban Accessibility & Mobility Discovery Platform

**EMPOWAY** is a full-stack, responsive accessibility discovery and reporting web application designed to bridge the accessibility information gap in Sri Lanka, starting with an initial pilot in **Colombo**.

Many people with mobility difficulties, particularly wheelchair users, senior citizens, and caregivers with strollers, face unexpected barriers when visiting public buildings. EMPOWAY provides transparent, evidence-based accessibility information, distinctly separating **VERIFIED** assessments from **COMMUNITY REPORTED** and **UNKNOWN** statuses.

---

## 🎨 Visual Identity & Brand System

EMPOWAY combines **Sunset Peach** (warm, friendly, empowering) and **Champagne Luxury** (elegant, sophisticated, trustworthy):

- **Primary Terracotta:** `#B96F54`
- **Sunset Peach:** `#E9A58D`
- **Soft Blush:** `#F4D7CE`
- **Warm Cream:** `#F8EEE5`
- **Deep Coffee Brown:** `#684638`
- **Caramel:** `#B98255`
- **Champagne:** `#E8D3AE`
- **Ivory Background:** `#FFF9F0`
- **Typography:** Plus Jakarta Sans & Manrope (Headings), Inter (Body)
- **Wordmark:** EMPOWAY with stylized pathway and journey accessibility symbol.

---

## 🚀 Key Features

### 1. Home Page
- **Hero Section:** "Every Journey Deserves to Be Accessible."
- **Search System:** Search by place name/landmark, Colombo area, and category.
- **Dynamic Impact Statistics:** Real-time metrics computed directly from PostgreSQL records (Candidate places, Verified locations, Community reports, Contributor count).
- **Category Explorer:** 7 core urban categories with live place counts.
- **How EMPOWAY Works:** 4-step workflow (Discover, Inspect Evidence, Journey, Contribute).
- **Featured Places & Purpose Section:** Explains the impact of accessible information.

### 2. Explore Places Directory
- **Multi-criteria Filtering:**
  - Search query
  - Category selector
  - Verification status (`VERIFIED`, `COMMUNITY_REPORTED`, `UNKNOWN`)
  - 8 Feature toggles (Step-free entrance, Wheelchair ramp, Elevator, Accessible toilet, Accessible parking, Wide doorways, Wheelchair pathways, Accessible counters)
- **View Switcher:**
  - **Grid View:** Responsive cards with badges and feature icons.
  - **List View:** Detailed horizontal place rows.
  - **Interactive Map View:** OpenStreetMap / Leaflet map with custom colored pin markers.

### 3. Place Details Profile
- **Comprehensive Scorecard:** 8-point accessibility checklist with 3 distinct states (Available, Not Available, Unknown).
- **Physical Details:** Ramp condition & slope, entrance steps count, elevator locations, known mobility limitations.
- **Visual Evidence:** Photo gallery with cover view, thumbnail selector, and captions.
- **Interactive Leaflet Map:** Precise location pin in Colombo + "Open in Google Maps" link.
- **User Actions:**
  - Submit Accessibility Update (propose feature updates).
  - Report Inaccurate Information.
  - Upload Additional Photographs.
  - Share Place (copy link or native share).

### 4. Colombo Pilot Project
- 30+ realistic candidate locations across:
  - **Hospitals:** National Hospital of Sri Lanka (NHSL), Asiri Central, Kalubowila, Lady Ridgeway, Castle Street.
  - **Universities:** University of Colombo (College House, Faculty of Science, Main Library), SLIIT Metro.
  - **Banks:** BOC Tower, People's Bank HQ, Commercial Bank Kollupitiya, Sampath Bank Fort.
  - **Government Offices:** Colombo Municipal Council (Town Hall), Colombo Divisional Secretariat, Suhurupaya (Immigration), Sethsiripaya Stage II, Supreme Court Complex.
  - **Public Places & Shopping:** Colombo City Centre, One Galle Face Mall, Galle Face Green, Viharamahadevi Park, Independence Memorial Hall.
  - **Dining & Hotels:** Barefoot Cafe, Department of Coffee, Galle Face Hotel, Cinnamon Grand, Shangri-La.
- Demonstrates clear labeling with `isDemoData` badges as specified.

### 5. Contributor & Admin Moderation Workflow
- **User Dashboard:** Track submitted places, pending review items, and accessibility reports.
- **Admin Console:**
  - **Pending Submissions Queue:** Approve or reject community submissions.
  - **Accessibility Reports Queue:** Review reported inaccuracies or feature condition updates.
  - **Manage Places:** Edit verification status to `VERIFIED` with physical audit notes.
  - **Audit History:** Full log of moderation actions.

## 🛠️ Technology Stack

- **Frontend:** React 18, Vite, Tailwind CSS, React Router v6, Leaflet & React Leaflet, Lucide React.
- **Backend:** Node.js, Express.js, RESTful API architecture.
- **Database:** PostgreSQL with Sequelize ORM (configured with automatic SQLite fallback).
- **Authentication:** JWT tokens + Bcrypt password hashing.
- **File Storage:** Multer image upload handler with type and size validation.

---

## 💻 Running the Application

### Backend Server:
```bash
cd server
npm install
node seeders/seedData.js   # Seed Colombo Pilot baseline data
node server.js             # Starts server on http://localhost:5000
```

### Frontend Client:
```bash
cd client
npm install
npm run dev                # Starts Vite on http://localhost:5173
```

