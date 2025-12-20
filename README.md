# Resume Builder - Admin Dashboard

Next.js admin dashboard for managing users, templates, and subscriptions for the Resume Builder platform.

## 🎯 Features

### Analytics Dashboard
- 📊 User statistics (total, active, premium)
- 📈 Resume creation metrics
- 💰 Revenue analytics
- 📅 Monthly growth charts
- 🏆 Popular templates

### User Management
- 👥 View all users with pagination
- 🔍 Search users by name/email
- 🔒 Block/Unblock users
- 👁️ View user details & resumes
- 🗑️ Delete users
- 📊 User activity tracking

### Template Management
- 🎨 Create new resume templates
- ✏️ Edit existing templates
- 👁️ Preview templates
- 🔄 Enable/Disable templates
- 🏷️ Assign free/premium status
- 📊 Template usage statistics

### Subscription Management
- 💳 View all subscriptions
- 📋 Create/Edit plans
- 💰 Set pricing & limits
- 📈 Track revenue
- 📧 Manage payment methods

### Content Management
- 📝 Career tips articles
- 💼 Resume examples
- 📢 In-app notices
- 📚 Help documentation

### Settings
- ⚙️ App branding
- 💧 Watermark configuration
- 🎨 Template pricing
- 🔧 Feature toggles
- 🌐 Localization settings

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **State Management**: React Query + Zustand
- **Charts**: Recharts
- **Forms**: React Hook Form
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## 📋 Prerequisites

- Node.js 18+ and npm
- Backend API running (see backend/README.md)

## ⚙️ Installation

1. **Navigate to admin dashboard folder**
```bash
cd admin_dashboard
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Setup environment variables**
```bash
cp .env.example .env
```

Edit `.env`:
```env
API_BASE_URL=http://localhost:5000/api
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your_secret_key
```

4. **Run the development server**
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3001](http://localhost:3001)

## 📁 Project Structure

```
admin_dashboard/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── users/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── templates/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── [id]/edit/page.tsx
│   │   │   ├── subscriptions/
│   │   │   │   └── page.tsx
│   │   │   ├── settings/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── table.tsx
│   │   │   └── tabs.tsx
│   │   ├── dashboard/
│   │   │   ├── sidebar.tsx
│   │   │   ├── header.tsx
│   │   │   ├── stats-card.tsx
│   │   │   └── chart.tsx
│   │   ├── users/
│   │   │   ├── user-table.tsx
│   │   │   └── user-detail-modal.tsx
│   │   ├── templates/
│   │   │   ├── template-card.tsx
│   │   │   └── template-form.tsx
│   │   └── providers.tsx
│   ├── lib/
│   │   ├── api.ts
│   │   ├── utils.ts
│   │   └── constants.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useUsers.ts
│   │   ├── useTemplates.ts
│   │   └── useAnalytics.ts
│   └── types/
│       ├── user.ts
│       ├── template.ts
│       └── analytics.ts
├── public/
│   ├── images/
│   └── icons/
├── .env.example
├── .gitignore
├── next.config.js
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## 🔐 Authentication

Admin login credentials (default):
```
Email: admin@resumebuilder.com
Password: admin123
```

**⚠️ Important**: Change default credentials in production!

## 📊 Dashboard Pages

### 1. Overview Dashboard (`/dashboard`)
- User statistics cards
- Resume creation metrics
- Revenue summary
- Growth charts (users, resumes, revenue)
- Recent activity feed

### 2. Users Management (`/users`)
- User list with pagination
- Search & filter
- User status (active, blocked, premium)
- Quick actions (view, block, delete)
- User detail modal

### 3. Templates (`/templates`)
- Template grid view
- Add new template
- Edit existing template
- Preview template
- Template statistics
- Enable/disable toggle

### 4. Subscriptions (`/subscriptions`)
- Active subscriptions list
- Plan management
- Revenue tracking
- Payment history
- Subscription analytics

### 5. Settings (`/settings`)
- General settings
- Email configuration
- Payment gateway setup
- Feature toggles
- Branding options

## 🎨 UI Components

Built with Radix UI primitives:
- Button
- Card
- Dialog (Modal)
- Dropdown Menu
- Input
- Select
- Table
- Tabs
- Avatar
- Badge

## 📈 Charts & Analytics

Using Recharts:
- Line Chart (Growth)
- Bar Chart (Monthly stats)
- Pie Chart (User distribution)
- Area Chart (Revenue)

## 🔧 API Integration

All API calls through `src/lib/api.ts`:

```typescript
import { usersAPI, templatesAPI, analyticsAPI } from '@/lib/api'

// Get users
const users = await usersAPI.getAll({ page: 1, limit: 20 })

// Block user
await usersAPI.toggleBlock(userId)

// Get analytics
const analytics = await analyticsAPI.getDashboard()
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Manual Build
```bash
# Build for production
npm run build

# Start production server
npm start
```

### Docker
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .
RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]
```

## 🔒 Security

- JWT token authentication
- Protected routes
- Role-based access control (RBAC)
- CSRF protection
- Input sanitization
- Rate limiting on API

## 🌐 Environment Variables

```env
# API
API_BASE_URL=http://localhost:5000/api

# Auth
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your_secret

# Optional
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_API_KEY=
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# E2E tests
npm run test:e2e
```

## 📝 Scripts

```json
{
  "dev": "next dev -p 3001",
  "build": "next build",
  "start": "next start -p 3001",
  "lint": "next lint",
  "format": "prettier --write ."
}
```

## 🎯 Features TODO

- [ ] Export data to CSV/Excel
- [ ] Email notifications
- [ ] Activity logs
- [ ] Advanced filtering
- [ ] Bulk actions
- [ ] Template marketplace
- [ ] AI content suggestions
- [ ] Multi-language support

## 🐛 Known Issues

- Chart animations may lag on large datasets
- Template preview requires refresh sometimes
- Mobile responsiveness needs improvement

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Radix UI](https://www.radix-ui.com)
- [React Query](https://tanstack.com/query)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

## 📄 License

MIT License

## 👨‍💻 Support

For issues:
- GitHub Issues
- Email: admin@resumebuilder.com

---

**Built with ❤️ using Next.js 14**
# resume-admin-dashboard
