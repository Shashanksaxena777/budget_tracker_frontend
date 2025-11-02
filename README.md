# Budget Tracker Frontend

Modern React + TypeScript frontend for the Personal Budget Tracker application.

## 🚀 Features

- **User Authentication** - Secure login with token-based auth
- **Dashboard** - Financial overview with charts and summary cards
- **Transaction Management** - Add, edit, delete transactions with filters
- **Budget Tracking** - Set monthly budgets and track spending
- **Category Management** - Dynamic category creation
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
git clone <your-repo-url>
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
VITE_API_BASE_URL=budgettracker-production-033c.up.railway.app

# Production (update when deploying)
# VITE_API_BASE_URL=https://your-backend-url.com
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
│   │   ├── common/            # Generic components
│   │   └── layout/            # Layout components
│   ├── pages/                  # Page components
│   │   ├── Login/
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

## 🧪 Running Tests

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 🌐 Deployment

### Option 1: Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login and deploy:
```bash
vercel login
vercel
```

3. Set environment variables:
   - Go to Vercel Dashboard
   - Select your project
   - Settings → Environment Variables
   - Add: `VITE_API_BASE_URL` = your backend URL

4. Redeploy after adding variables

**Or deploy via Git:**
1. Push code to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy

### Option 2: Netlify

1. Build the project:
```bash
npm run build
```

2. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

3. Deploy:
```bash
netlify login
netlify deploy --prod
```

4. Set environment variables:
   - Netlify Dashboard
   - Site settings → Environment variables
   - Add: `VITE_API_BASE_URL`

**Or deploy via Git:**
1. Push to GitHub
2. Connect repository in Netlify
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Add environment variables
6. Deploy

### Option 3: GitHub Pages

1. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Update `vite.config.ts`:
```typescript
export default defineConfig({
  base: '/budget-tracker/',  // Your repo name
  // ... other config
});
```

3. Add scripts to `package.json`:
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

4. Deploy:
```bash
npm run deploy
```

## 🎨 Customization

### Theme Customization

Edit `src/styles/theme.ts`:

```typescript
export const theme: ThemeConfig = {
  token: {
    colorPrimary: '#1677ff',  // Primary color
    borderRadius: 8,           // Border radius
    // ... more customization
  },
};
```

### Adding New Pages

1. Create page component in `src/pages/NewPage/`
2. Add route in `src/App.tsx`
3. Add menu item in `src/components/layout/DashboardLayout.tsx`

## 🔒 Security Best Practices

1. **API Base URL** - Use environment variables
2. **Token Storage** - Stored in localStorage (consider httpOnly cookies for production)
3. **Token Expiration** - Auto-logout handled
4. **XSS Protection** - React escapes by default
5. **HTTPS** - Always use HTTPS in production

## 📱 Responsive Breakpoints

```css
Mobile:  < 576px
Tablet:  576px - 992px
Desktop: > 992px
```

## 🎯 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🐛 Troubleshooting

### Issue: Cannot connect to backend

**Solution:**
1. Ensure backend is running
2. Check `VITE_API_BASE_URL` in `.env`
3. Verify CORS settings in backend

### Issue: Build fails

**Solution:**
1. Delete `node_modules` and `package-lock.json`
2. Run `npm install` again
3. Check for TypeScript errors: `npm run type-check`

### Issue: Routing not working after deployment

**Solution:**
- Configure server to redirect all routes to `index.html`
- For Vercel: Automatically handled
- For Netlify: Add `_redirects` file:
  ```
  /*    /index.html   200
  ```

## 📦 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
npm test             # Run tests
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

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

- **Live Demo**: [Your deployed URL]
- **Backend API**: [Your backend URL]
- **API Documentation**: [Backend URL]/api/

## 📞 Support

For issues and questions, please open an issue on GitHub.

---

**Built with ❤️ using React, TypeScript, and Ant Design**