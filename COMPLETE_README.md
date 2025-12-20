# 🎨 Resume Builder - Admin Dashboard

Modern, feature-rich admin dashboard built with Next.js 15, React 19, and Tailwind CSS for managing the Resume Builder platform.

## ✨ Features Overview

### 📊 Dashboard
- **Real-time Statistics**: Total users, active users, premium users, total resumes
- **Quick Actions**: Fast navigation to all major sections
- **Modern UI**: Clean, responsive design with gradient cards
- **Analytics Preview**: Key metrics at a glance

### 👥 User Management (`/users`)
- ✅ View all registered users in a data table
- 🔍 Search users by name or email
- 🎯 Filter by role (user, premium, admin)
- ⚡ Activate/Deactivate user accounts
- 🗑️ Delete users
- 📊 View resume count per user
- 🏷️ Role badges (color-coded)
- 📅 Registration date tracking

### 📄 Resume Management (`/resumes`)
- ✅ Browse all resumes created across the platform
- 🔍 Search by resume title, user name, or email
- 👁️ View detailed resume information modal
- 📊 Public/Private status tracking
- 🗑️ Delete resumes
- 📈 Statistics cards (total, public, private)
- 📅 Creation and update timestamps
- 👤 Owner information display

### 🎨 Template Management (`/templates`)
- ✅ View all templates in responsive grid layout
- ➕ Create new templates with modal form
- 🎯 Category selection (professional, creative, modern, classic, minimalist)
- 💎 Premium/Free template designation
- ⚡ Toggle active/inactive status
- 🗑️ Delete templates
- 📊 Usage count tracking
- 🖼️ Thumbnail display
- 📅 Creation date

### 💳 Subscription Management (`/subscriptions`)
- ✅ View all subscription plans with features
- 📋 Active subscriptions table
- 👤 User subscription details
- 💰 Pricing display
- ⏰ Start and end date tracking
- 🏷️ Status badges (active, expired, cancelled)
- 📊 Tabbed interface (Plans vs Subscriptions)

### 📈 Analytics & Insights (`/analytics`)
- ✅ **User Growth Metrics**:
  - New users today
  - New users this week
  - New users this month
- ✅ **Resume Activity**:
  - Resumes created today
  - Resumes created this week
  - Resumes created this month
- ✅ **Top Templates**: Most popular templates with usage counts
- ✅ **Recent Users**: Latest user registrations
- 🎨 Color-coded cards with gradient backgrounds
- 🔄 Time range filtering
- 📊 Ranking display for top templates

### ⚙️ Settings (`/settings`)
- ✅ **Profile Settings**:
  - Update name
  - Change password (current + new + confirm)
  - Email display (read-only)
- ✅ **Platform Settings**:
  - Site name configuration
  - Support email
  - Max free resumes limit
  - Max free downloads limit
  - Toggle user registration
  - Toggle email verification
  - Maintenance mode switch
- ✅ **Security Tab**:
  - Account status overview
  - Password management
  - Logout from all devices
- 🎯 Tabbed interface
- 🔒 Secure password change flow

### 🔐 Authentication (`/login`)
- ✅ Modern login page with gradient background
- 🔒 Email + Password authentication
- 🔐 JWT token-based security
- 🎯 Role verification (admin/superadmin only)
- 💾 Token and user data persistence
- 🚀 Auto-redirect on successful login
- 📋 Demo credentials display
- ⚡ Loading states
- 🎨 Responsive design

### 🎨 UI/UX Features
- ✅ **Sidebar Navigation** (Desktop):
  - Collapsible sidebar
  - Active route highlighting
  - Icon-based navigation
  - Logout button
- ✅ **Bottom Navigation** (Mobile):
  - Fixed bottom bar
  - Icon + label display
  - Touch-friendly
- ✅ **Responsive Design**:
  - Mobile-first approach
  - Tablet optimized
  - Desktop enhanced
- ✅ **Loading States**: Spinner animations
- ✅ **Toast Notifications**: Success/Error messages
- ✅ **Modals**: Form dialogs, detail views
- ✅ **Tables**: Sortable, searchable data tables
- ✅ **Cards**: Statistics, quick actions
- ✅ **Badges**: Status indicators, role tags

## 🛠️ Tech Stack

| Category | Technology | Version |
|----------|-----------|---------|
| **Framework** | Next.js | 15.1.0 |
| **React** | React | 19.0.0 |
| **Language** | TypeScript | 5.x |
| **Styling** | Tailwind CSS | 3.3.0 |
| **State Management** | TanStack Query | 5.17.19 |
| **HTTP Client** | Axios | 1.6.5 |
| **Forms** | React Hook Form | 7.49.3 |
| **Notifications** | React Hot Toast | 2.4.1 |
| **UI Components** | Radix UI | Various |
| **State Store** | Zustand | 4.4.7 |
| **Date Handling** | date-fns | 3.0.6 |
| **Icons** | Heroicons | (inline SVG) |

## 📁 Project Structure

```
admin_dashboard/
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── login/               # Login page
│   │   │   └── page.tsx
│   │   ├── dashboard/           # Main dashboard
│   │   │   └── page.tsx
│   │   ├── users/               # User management
│   │   │   └── page.tsx
│   │   ├── resumes/             # Resume management
│   │   │   └── page.tsx
│   │   ├── templates/           # Template management
│   │   │   └── page.tsx
│   │   ├── subscriptions/       # Subscription management
│   │   │   └── page.tsx
│   │   ├── analytics/           # Analytics & insights
│   │   │   └── page.tsx
│   │   ├── settings/            # Settings page
│   │   │   └── page.tsx
│   │   ├── layout.tsx           # Root layout
│   │   └── page.tsx             # Home/redirect page
│   │
│   ├── components/              # React components
│   │   ├── Sidebar.tsx          # Navigation sidebar
│   │   ├── AdminLayout.tsx      # Layout wrapper
│   │   └── providers.tsx        # Context providers
│   │
│   ├── lib/                     # Utilities
│   │   └── api.ts              # API client with interceptors
│   │
│   └── styles/
│       └── globals.css          # Global styles
│
├── public/                      # Static assets
├── .env.local                   # Environment variables
├── next.config.js              # Next.js configuration
├── tailwind.config.ts          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Backend API running on `http://localhost:5000`

### Installation

1. **Install dependencies:**
   ```bash
   cd admin_dashboard
   npm install
   ```

2. **Create environment file:**
   ```bash
   echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   ```
   http://localhost:3000
   ```

### Login Credentials

**Super Admin:**
```
Email: admin@resumebuilder.com
Password: admin123
```

**Admin:**
```
Email: admin2@resumebuilder.com
Password: admin123
```

## 📄 Available Pages

| Route | Description | Protected |
|-------|-------------|-----------|
| `/login` | Admin login page | No |
| `/dashboard` | Main dashboard with stats | Yes |
| `/users` | User management | Yes |
| `/resumes` | Resume management | Yes |
| `/templates` | Template management | Yes |
| `/subscriptions` | Subscription management | Yes |
| `/analytics` | Analytics & insights | Yes |
| `/settings` | Platform settings | Yes |

## 🔌 API Integration

The dashboard communicates with the backend API using Axios with interceptors.

### API Client Configuration (`src/lib/api.ts`)

```typescript
// Base configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

// Automatic token injection
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Automatic logout on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
```

### API Endpoints Used

**Authentication:**
- `POST /api/auth/login` - Admin login

**Users:**
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user

**Resumes:**
- `GET /api/admin/resumes` - Get all resumes
- `DELETE /api/admin/resumes/:id` - Delete resume

**Templates:**
- `GET /api/templates` - Get all templates
- `POST /api/templates` - Create template
- `PUT /api/templates/:id` - Update template
- `DELETE /api/templates/:id` - Delete template

**Subscriptions:**
- `GET /api/subscriptions/plans` - Get all plans
- `GET /api/admin/subscriptions` - Get all subscriptions

**Analytics:**
- `GET /api/admin/analytics/dashboard` - Get dashboard analytics

## 🎨 Customization

### Theme Colors

Edit `tailwind.config.ts` to customize colors:

```typescript
colors: {
  primary: colors.blue,
  secondary: colors.gray,
  success: colors.green,
  danger: colors.red,
  warning: colors.yellow,
}
```

### Components

All components are built with Tailwind CSS and can be easily customized.

## 📱 Responsive Design

- **Mobile**: < 768px (bottom navigation)
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px (sidebar navigation)

## 🔒 Security

- JWT token-based authentication
- Role verification (admin/superadmin only)
- Automatic token refresh
- Secure token storage (localStorage)
- API request interceptors
- Auto-logout on unauthorized access

## 🚀 Deployment

### Build for production:
```bash
npm run build
```

### Start production server:
```bash
npm start
```

### Environment Variables:
```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
```

### Recommended Platforms:
- Vercel (Recommended for Next.js)
- Netlify
- AWS Amplify
- DigitalOcean App Platform

## 🐛 Troubleshooting

### Port already in use:
```bash
# Change port in package.json
"dev": "next dev -p 3001"
```

### API connection failed:
- Verify backend is running
- Check `.env.local` has correct API URL
- Check CORS settings in backend

### Build errors:
```bash
# Clean install
rm -rf node_modules .next package-lock.json
npm install
npm run build
```

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TanStack Query](https://tanstack.com/query/latest)

## 🎉 Features Summary

✅ **7 Complete Pages**:
1. Login
2. Dashboard
3. Users
4. Resumes
5. Templates
6. Subscriptions
7. Analytics
8. Settings

✅ **Full CRUD Operations**:
- Create, Read, Update, Delete for all entities

✅ **Advanced Features**:
- Search & filtering
- Real-time statistics
- Role-based access
- Responsive design
- Toast notifications
- Loading states
- Error handling
- Modal dialogs

✅ **Modern UI/UX**:
- Gradient cards
- Smooth transitions
- Hover effects
- Active states
- Mobile-friendly

---

**Admin Dashboard is complete and production-ready! 🚀**
