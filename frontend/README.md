# LinkHub Frontend

A modern React/Next.js frontend for the LinkHub link-sharing platform.

## 🚀 Features

- **Modern UI**: Built with Next.js 15, TypeScript, and Tailwind CSS
- **Authentication**: JWT-based auth with Zustand state management
- **Drag & Drop**: Intuitive link reordering with @dnd-kit
- **Analytics**: Comprehensive dashboard with charts and insights
- **Responsive**: Mobile-first design with smooth animations
- **Real-time**: Live updates and optimistic UI

## 🛠 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand + React Query
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: Axios
- **Icons**: Lucide React

## 📦 Installation

1. **Setup project**
   ```bash
   cd frontend
   npm install
   ```

2. **Environment setup**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your API URL
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

## 🔗 Backend Connection

The frontend connects to the Node.js backend API. Make sure to:

1. Start the backend server first (port 5000)
2. Update `NEXT_PUBLIC_API_URL` in `.env.local`
3. Ensure CORS is configured in the backend

## 📱 Pages

### Public Pages
- `/` - Landing page
- `/[username]` - Public profile pages
- `/auth/signin` - Login page
- `/auth/signup` - Registration page

### Protected Pages (Dashboard)
- `/dashboard` - Main dashboard
- `/dashboard/analytics` - Analytics page
- `/dashboard/settings` - Settings page

## 🎨 Components

### Authentication
- `LoginForm` - User login
- `SignupForm` - User registration
- `ProtectedRoute` - Route protection

### Dashboard
- `DashboardHeader` - Navigation header
- `LinkManager` - Link CRUD with drag-and-drop
- `ProfilePreview` - Live mobile preview
- `AnalyticsDashboard` - Charts and insights
- `SettingsForm` - Profile settings

### Public
- `PublicProfile` - Public profile display
- `Hero` - Landing page hero
- `Features` - Feature showcase

## 🔐 Authentication Flow

1. User signs up/logs in
2. JWT token stored in localStorage
3. Token sent with API requests
4. Automatic logout on token expiry

## 📊 State Management

### Zustand Stores
- `useAuth` - Authentication state
- `useLinks` - Links management
- `useAnalytics` - Analytics data

### React Query
- Server state caching
- Optimistic updates
- Background refetching
- Error handling

## 🎯 Key Features

### Drag & Drop Links
```tsx
import { DndContext, closestCenter } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

// Sortable link list with position updates
```

### Real-time Analytics
```tsx
import { useQuery } from '@tanstack/react-query'
import { analyticsAPI } from '@/lib/api'

// Live analytics with auto-refresh
```

### Theme System
```tsx
const themes = {
  default: 'bg-gradient-to-br from-blue-50 to-purple-50',
  dark: 'bg-gradient-to-br from-gray-900 to-black',
  minimal: 'bg-gray-50',
  colorful: 'bg-gradient-to-br from-pink-100 to-indigo-100'
}
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
# Deploy to Vercel
```

### Environment Variables
```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
NEXT_PUBLIC_APP_URL=https://your-frontend-domain.com
```

## 📱 Mobile Optimization

- Responsive design for all screen sizes
- Touch-friendly interactions
- Mobile-first approach
- Progressive Web App ready

## 🧪 Development

### Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Project Structure
```
frontend/
├── src/
│   ├── app/             # Next.js app router pages
│   ├── components/      # React components
│   ├── lib/            # Utilities and API
│   └── styles/         # Global styles
├── public/             # Static assets
└── tailwind.config.js  # Tailwind configuration
```

## 🔧 Customization

### Adding New Themes
```tsx
// Add to theme configuration
const newTheme = {
  id: 'custom',
  name: 'Custom Theme',
  preview: 'bg-gradient-to-br from-red-100 to-yellow-100'
}
```

### Custom Components
```tsx
// Follow the existing component patterns
export function CustomComponent() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="..."
    >
      {/* Component content */}
    </motion.div>
  )
}
```

## 📄 License

MIT License - see LICENSE file for details.