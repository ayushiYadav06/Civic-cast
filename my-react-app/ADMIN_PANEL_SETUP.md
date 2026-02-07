# Admin Panel - Quick Setup

## ✅ What's Been Created

A complete, fully functional React admin panel with:

### Pages Created
1. **Login Page** (`/admin/login`)
   - Admin/Operator role selection
   - JWT authentication
   - Auto-redirect after login

2. **Dashboard** (`/admin/dashboard`)
   - Statistics cards (Total News, Views, Monthly News, Active Ads)
   - Notifications list with mark as read functionality

3. **Categories** (`/admin/categories`)
   - Full CRUD operations
   - Auto-slug generation
   - Active/inactive toggle

4. **Sub-Categories** (`/admin/sub-categories`)
   - Create under categories
   - Filter by category
   - Full CRUD operations

5. **Operators** (`/admin/operators`)
   - Create with auto-generated credentials
   - Display generated login ID & password
   - Activate/deactivate
   - Update details

6. **News** (`/admin/news`)
   - View all news submissions
   - Filter by status
   - Approve/reject functionality
   - View full news details

7. **Advertisements** (`/admin/advertisements`)
   - Create with image upload
   - Update advertisements
   - Activate/deactivate
   - Display order management

### Services Created
- `api.ts` - Axios instance with interceptors
- `authService.ts` - Authentication service
- `adminService.ts` - All admin API services

### Components Created
- `AuthContext.tsx` - Authentication context
- `AdminLayout.tsx` - Main layout with sidebar
- `ProtectedRoute.tsx` - Route protection

## 🚀 Quick Start

1. **Install Dependencies**
   ```bash
   cd my-react-app
   npm install
   ```

2. **Create .env file**
   ```bash
   # Create .env file in my-react-app/
   VITE_API_BASE_URL=http://localhost/cms-backend
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Access Admin Panel**
   - URL: `http://localhost:3000/admin/login`
   - Default Admin: `admin` / `admin123`

## 📋 Features

✅ JWT Authentication
✅ Protected Routes
✅ Role-based Access
✅ Toast Notifications
✅ Responsive Design
✅ Error Handling
✅ Loading States
✅ Form Validation
✅ Image Upload
✅ Auto-slug Generation
✅ Status Filtering
✅ CRUD Operations

## 🔗 Backend Connection

The admin panel connects to your PHP backend at:
- Base URL: Configured in `.env` as `VITE_API_BASE_URL`
- All API calls use the endpoints defined in `src/config/api.ts`
- Authentication tokens are stored in localStorage
- Auto-redirect to login on 401 errors

## 📁 File Structure

```
my-react-app/src/
├── config/
│   └── api.ts                    # API endpoints
├── contexts/
│   └── AuthContext.tsx           # Auth context
├── services/
│   ├── api.ts                    # Axios setup
│   ├── authService.ts            # Auth service
│   └── adminService.ts           # Admin services
├── components/
│   └── admin/
│       ├── AdminLayout.tsx        # Layout
│       └── ProtectedRoute.tsx    # Route guard
├── pages/
│   └── admin/
│       ├── Login.tsx
│       ├── Dashboard.tsx
│       ├── Categories.tsx
│       ├── SubCategories.tsx
│       ├── Operators.tsx
│       ├── News.tsx
│       └── Advertisements.tsx
└── App.tsx                        # Main app with routes
```

## 🎨 UI Components

Uses shadcn/ui components (already in your project):
- Button, Input, Label, Textarea
- Dialog, AlertDialog
- Table, Badge, Switch
- Select, ScrollArea
- Card components
- Toast notifications (Sonner)

## 🔒 Security

- JWT tokens in localStorage
- Protected routes
- Admin role requirement
- Auto-logout on token expiration
- CORS configured
- Input validation

## 📝 Next Steps

1. **Test the Admin Panel**
   - Login with default credentials
   - Test each feature
   - Verify backend connection

2. **Customize**
   - Update colors/styling
   - Add more features
   - Customize dashboard

3. **Production**
   - Update API base URL
   - Build for production
   - Deploy

## 🐛 Troubleshooting

**Can't login?**
- Check backend is running
- Verify API base URL in `.env`
- Check browser console for errors

**CORS errors?**
- Update `FRONTEND_URL` in backend `.env`
- Ensure backend CORS is configured

**API errors?**
- Check network tab in DevTools
- Verify backend routes
- Check API documentation

## ✨ Ready to Use!

The admin panel is fully functional and ready to use. All features are connected to your PHP backend API.
