# Church Directory & Events Platform (Frontend)

This project is a **React-based frontend application** for a global Church Directory and Events platform. It allows users to explore congregations around the world, view upcoming church events, and access detail pages for each congregation.

> ✅ This is the **frontend-only implementation**, currently powered by mock JSON data stored in the `public/` folder to simulate API calls until the backend is integrated.

## 📌 Features

- 🌍 Global church directory with detailed congregation profiles
- 🗓️ Events listing with filtering by congregation, date, and category
- 🔎 Search & filter for congregations
- 📍 Map preview placeholder for congregation location
- 🧩 Modular file/component structure (scalable)
- ⚡ Fast mock data fetching from `/public` folder
- ✅ TailwindCSS styled UI

---

## 🗂 Project Structure (Relevant Files)
```
src/
├── components/
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── DirectoryFilterBar.jsx
│   ├── EventFilterBar.jsx
│   ├── LoadingSpinner.jsx
│   └── MapSection.jsx
│
├── pages/
│   ├── Home/
│   ├── Directory/
│   ├── Events/
│   └── Dashboard/ (coming later)
│
├── utils/
│   ├── api.js
│   ├── formatDate.js
│   └── filterUtils.js
│
├── App.jsx
└── main.jsx
```

Mock data is stored in:
```
public/
├── congregations.json
├── events.json
└── verifications.json
```

---

## 🚀 Getting Started

### 1️⃣ Clone the repository
```bash
git clone <repo-url>
cd project-folder
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Start Development Server
```bash
npm run dev
```

The app will be available at:
```
http://localhost:5173/
```

---

## 📁 Mock Data Fetching
This project fetches mock JSON files directly from the `public/` folder using absolute paths:

```js
fetch("/congregations.json")
```

This simulates real API calls, so replacing it with a backend endpoint later will be seamless.

---

## 🔧 Tech Stack
| Tech | Purpose |
|------|---------|
| React | UI Library |
| React Router | Navigation / Routing |
| TailwindCSS | Styling |
| Lucide React | Icons |
| JSON Mock Files | Temporary data source |

---

No major refactoring required.

---

## 📍 Next Steps
- ✅ Build Home, Directory & Events pages (in progress)
- ✅ Add filtering, sorting & search
- ⏳ Add Dashboard pages for church admins
- ⏳ Authentication (login + roles)
- ⏳ Real map integration (Leaflet or Google Maps)
- ⏳ Connect to backend API

---

## 🤝 Contributing
Contributions are welcome once the backend structure is finalized. Frontend styling, components, and optimization are open for extension.

---

## 📄 License
This project will be open-source after backend completion (license to be added).

---

**Built with ❤️ to help you locate a congregation nearest to you globally**
