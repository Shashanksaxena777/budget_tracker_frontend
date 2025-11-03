# Budget Tracker Frontend

Modern React + TypeScript frontend for the Personal Budget Tracker application.

## 🚀 Features

- **User Authentication** - Secure login with token-based auth
- **Dashboard** - Financial overview with charts and summary cards
- **Transaction Management** - Add, edit, delete transactions with filters
- **Budget Tracking** - Set monthly budgets and track spending
- **Category Management** - Dynamic category creation
-  **AI Advisor** - AI based financial advisor to your query
- **Data Visualization** - Beautiful D3.js charts
- **Responsive Design** - Works on all devices
- **Modern UI** - Ant Design component library

## 🛠️ Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Library**: Ant Design (antd)
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Charts**: D3.js
- **Date Handling**: dayjs
- **State Management**: React Context API

## 📋 Prerequisites

- Node.js 16.x or higher
- npm or yarn
- Backend API running (see backend README)

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repo_url>
cd budget-tracker-frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the project root:

```bash
# Copy example env file
cp .env.example .env
```

Edit `.env`:

```env
# Development
VITE_API_BASE_URL= <Backend_url>

```

### 4. Run Development Server

```bash
npm run dev
```

Application will start at: `http://localhost:5173/`

### 5. Build for Production

```bash
npm run build
```

Build output will be in `dist/` folder.

### 6. Preview Production Build

```bash
npm run preview
```

## 🎨 Features Overview

### 1. Authentication
- Secure login with token storage
- Auto-logout on token expiration
- Protected routes

### 2. Dashboard
- Financial summary cards (Income, Expenses, Balance)
- D3.js bar chart (Income vs Expenses)
- Recent transactions list
- Color-coded indicators

### 3. Transactions
- View all transactions in paginated table
- Add/Edit/Delete transactions
- Advanced filters:
  - Search by description
  - Filter by type (income/expense)
  - Filter by category
  - Date range filter
  - Amount range filter
- Sort by date or amount
- 10/20/50/100 items per page

### 4. Budget Management
- Set monthly budget
- Budget vs Actual comparison chart (D3.js)
- Category-wise spending breakdown
- Progress indicators
- Status alerts (On Track / Warning / Over Budget)

### 5. Categories
- Create categories on-the-fly
- Categories filtered by transaction type
- Search categories


### 6. AI Advisor
- Get Financial Advise
- Easy chat system
- Short and readable responses

## 📂 Project Structure

```
budget-tracker-frontend/
├── public/
├── src/
│   ├── api/                    # API services
│   │   ├── axios.ts           # Axios configuration
│   │   ├── transactionApi.ts  # Transaction APIs
│   │   ├── categoryApi.ts     # Category APIs
│   │   └── budgetApi.ts       # Budget APIs
│   ├── components/             # Reusable components
│   │   ├── Profile/            # Profile Modal
│   │   └── layout/            # Layout components
│   ├── pages/                  # Page components
│   │   ├── Login/
│   │   ├── AIAdvisor/
│   │   ├── Dashboard/
│   │   ├── Transactions/
│   │   └── Budget/
│   ├── context/                # React Context
│   │   └── AuthContext.tsx    # Authentication state
│   ├── types/                  # TypeScript types
│   │   └── index.ts
│   ├── styles/                 # Global styles
│   │   ├── index.css
│   │   └── theme.ts           # Ant Design theme
│   ├── utils/                  # Utility functions
│   ├── App.tsx                 # Main app component
│   ├── main.tsx                # Entry point
│   └── vite-env.d.ts          # Vite types
├── .env
├── .env.example
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🔒 Security Best Practices

1. **API Base URL** - Use environment variables
2. **Token Storage** - Stored in localStorage (consider httpOnly cookies for production)

## 🎯 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📝 Code Style

- TypeScript for type safety
- Functional components with hooks
- CSS Modules for styling
- ESLint + Prettier for formatting

## 👥 Test Credentials

**For reviewers:**
- Username: `testuser`
- Password: `testpass123`

## 🔗 Links

- **Live Demo**: [\[URL\]](https://budget-tracker-frontend-nine.vercel.app/login)

---

**Built with ❤️ using React, TypeScript, and Ant Design**
