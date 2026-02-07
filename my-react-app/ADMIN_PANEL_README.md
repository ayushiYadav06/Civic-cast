# Admin Panel - Setup Guide

Complete React admin panel for CivicCast CMS Management System.

## Features

✅ **Authentication**
- Admin/Operator login
- JWT token-based authentication
- Protected routes
- Auto-logout on token expiration

✅ **Dashboard**
- Statistics overview
- News metrics (total, views, monthly)
- Active advertisements count
- Notifications management

✅ **Category Management**
- Create, update, delete categories
- Active/inactive status
- Slug generation

✅ **Sub-Category Management**
- Create sub-categories under categories
- Filter by category
- Full CRUD operations

✅ **Operator Management**
- Create operators with auto-generated credentials
- View generated login ID and password
- Activate/deactivate operators
- Update operator details

✅ **News Management**
- View all news submissions
- Approve/reject news
- Filter by status
- View news details
- Track views

✅ **Advertisement Management**
- Create advertisements with image upload
- Update advertisements
- Activate/deactivate
- Display order management

## Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   - Copy `.env.example` to `.env`
   - Update `VITE_API_BASE_URL` to match your backend URL
   ```env
   VITE_API_BASE_URL=http://localhost/cms-backend
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Access Admin Panel**
   - Navigate to: `http://localhost:3000/admin/login`
   - Default credentials:
     - Username: `admin` or `admin@civiccast.com`
     - Password: `admin123`

## Project Structure

```
src/
├── components/
│   ├── admin/
│   │   ├── AdminLayout.tsx      # Main admin layout with sidebar
│   │   └── ProtectedRoute.tsx   # Route protection component
│   └── ui/                      # shadcn/ui components
├── contexts/
│   └── AuthContext.tsx          # Authentication context
├── pages/
│   └── admin/
│       ├── Login.tsx            # Login page
│       ├── Dashboard.tsx        # Dashboard with stats
│       ├── Categories.tsx       # Category management
│       ├── SubCategories.tsx    # Sub-category management
│       ├── Operators.tsx        # Operator management
│       ├── News.tsx             # News approval/rejection
│       └── Advertisements.tsx   # Advertisement management
├── services/
│   ├── api.ts                   # Axios instance & interceptors
│   ├── authService.ts           # Authentication service
│   └── adminService.ts         # Admin API services
├── config/
│   └── api.ts                   # API endpoints configuration
└── App.tsx                      # Main app with routing
```

## Routes

### Admin Routes (Protected)
- `/admin/login` - Login page
- `/admin/dashboard` - Dashboard
- `/admin/categories` - Category management
- `/admin/sub-categories` - Sub-category management
- `/admin/operators` - Operator management
- `/admin/news` - News management
- `/admin/advertisements` - Advertisement management

### Public Routes
- `/` - Public website (existing frontend)

## Usage

### Login
1. Navigate to `/admin/login`
2. Select role (Admin/Operator)
3. Enter credentials
4. Click "Sign In"

### Dashboard
- View statistics at a glance
- Check notifications
- Mark notifications as read

### Category Management
1. Click "Add Category"
2. Enter name (slug auto-generates)
3. Add description (optional)
4. Set active status
5. Save

### Sub-Category Management
1. Click "Add Sub-Category"
2. Select parent category
3. Enter name and slug
4. Save

### Operator Management
1. Click "Add Operator"
2. Enter name, area, post
3. Save - credentials are auto-generated
4. **Important**: Save the generated login ID and password

### News Management
1. View all news submissions
2. Filter by status (pending/approved/rejected)
3. Click eye icon to view details
4. Approve or reject news
5. Provide rejection reason if rejecting

### Advertisement Management
1. Click "Add Advertisement"
2. Enter section (e.g., header, sidebar)
3. Upload image
4. Add link URL (optional)
5. Set display order
6. Save

## API Integration

The admin panel connects to the PHP backend via REST APIs:

- **Base URL**: Configured in `.env` file
- **Authentication**: JWT tokens stored in localStorage
- **Error Handling**: Automatic error messages via toast notifications
- **Token Refresh**: Auto-redirect to login on token expiration

## Dependencies

- `react-router-dom` - Routing
- `axios` - HTTP client
- `sonner` - Toast notifications
- `date-fns` - Date formatting
- `lucide-react` - Icons
- `@radix-ui/*` - UI components (shadcn/ui)

## Troubleshooting

### CORS Errors
- Ensure backend CORS is configured correctly
- Check `FRONTEND_URL` in backend `.env` matches React app URL

### Authentication Issues
- Check API base URL in `.env`
- Verify backend is running
- Check browser console for errors

### API Errors
- Verify backend is accessible
- Check network tab in browser DevTools
- Ensure backend routes match API endpoints

## Production Build

```bash
npm run build
```

Build output will be in the `build` directory.

## Security Notes

- Tokens are stored in localStorage
- Tokens expire after 24 hours
- Auto-logout on 401 errors
- Protected routes require authentication
- Admin routes require admin role

## Support

For issues or questions:
1. Check browser console for errors
2. Verify backend API is working
3. Check network requests in DevTools
4. Review API documentation
