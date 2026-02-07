# CMS Backend - Verification Checklist

Use this checklist to verify that your CMS backend is properly set up and all features are working correctly.

## ✅ Pre-Installation Checks

- [ ] PHP 8.0+ installed (`php -v`)
- [ ] MySQL 5.7+ installed and running
- [ ] Composer installed (`composer --version`)
- [ ] Required PHP extensions installed:
  - [ ] PDO (`php -m | grep pdo`)
  - [ ] PDO_MySQL (`php -m | grep pdo_mysql`)
  - [ ] GD (`php -m | grep gd`)
  - [ ] JSON (`php -m | grep json`)
  - [ ] OpenSSL (`php -m | grep openssl`)
  - [ ] mbstring (`php -m | grep mbstring`)

## ✅ Installation Steps

- [ ] Project files copied to web server directory
- [ ] Composer dependencies installed (`composer install`)
- [ ] Database created (`civiccast_cms`)
- [ ] Database schema imported (`database/schema.sql`)
- [ ] `.env` file created with correct configuration
- [ ] Upload directories created and have write permissions:
  - [ ] `uploads/news/`
  - [ ] `uploads/advertisements/`
- [ ] Web server configured (Apache/Nginx)

## ✅ Configuration Verification

### Database Configuration
- [ ] `config/database.php` exists
- [ ] Database credentials in `.env` are correct
- [ ] Database connection test passes (`setup-check.php`)

### JWT Configuration
- [ ] `config/jwt.php` exists
- [ ] `JWT_SECRET` in `.env` is set and strong
- [ ] JWT secret is NOT the default value

### Application Configuration
- [ ] `config/app.php` exists
- [ ] `BASE_URL` in `.env` matches your server URL
- [ ] `FRONTEND_URL` in `.env` matches your React app URL
- [ ] `APP_DEBUG` set appropriately (false for production)

## ✅ File Structure Verification

```
cms-backend/
├── config/
│   ├── app.php ✅
│   ├── database.php ✅
│   └── jwt.php ✅
├── controllers/
│   ├── AdvertisementController.php ✅
│   ├── AuthController.php ✅
│   ├── CategoryController.php ✅
│   ├── DashboardController.php ✅
│   ├── NewsController.php ✅
│   ├── OperatorController.php ✅
│   └── SubCategoryController.php ✅
├── database/
│   └── schema.sql ✅
├── middleware/
│   ├── AuthMiddleware.php ✅
│   └── RoleMiddleware.php ✅
├── models/
│   ├── Admin.php ✅
│   ├── Advertisement.php ✅
│   ├── Category.php ✅
│   ├── News.php ✅
│   ├── NewsImage.php ✅
│   ├── Notification.php ✅
│   ├── Operator.php ✅
│   └── SubCategory.php ✅
├── routes/
│   └── api.php ✅
├── uploads/
│   ├── advertisements/ ✅
│   └── news/ ✅
├── utils/
│   ├── Database.php ✅
│   ├── FileUpload.php ✅
│   ├── helpers.php ✅
│   ├── JWT.php ✅
│   ├── Response.php ✅
│   └── Validator.php ✅
├── index.php ✅
└── routes/api.php ✅
```

## ✅ Database Tables Verification

Run this SQL query to verify all tables exist:

```sql
SHOW TABLES;
```

Expected tables:
- [ ] `admins`
- [ ] `operators`
- [ ] `categories`
- [ ] `sub_categories`
- [ ] `news`
- [ ] `news_images`
- [ ] `advertisements`
- [ ] `notifications`

Verify default admin exists:
```sql
SELECT id, username, email FROM admins WHERE username = 'admin';
```

## ✅ API Endpoint Testing

### Authentication
- [ ] `POST /api/auth/login` - Admin login works
- [ ] `POST /api/auth/login` - Operator login works
- [ ] JWT token is returned and valid
- [ ] Invalid credentials return 401

### Dashboard (Admin)
- [ ] `GET /api/admin/dashboard` - Returns statistics
- [ ] `GET /api/admin/notifications` - Returns notifications
- [ ] `POST /api/admin/notifications/mark-read` - Marks notification as read
- [ ] `POST /api/admin/notifications/mark-all-read` - Marks all as read

### Category Management (Admin)
- [ ] `POST /api/admin/categories` - Creates category
- [ ] `GET /api/admin/categories` - Lists categories
- [ ] `GET /api/admin/categories/:id` - Gets category by ID
- [ ] `PUT /api/admin/categories/:id` - Updates category
- [ ] `DELETE /api/admin/categories/:id` - Deletes category

### Sub-Category Management (Admin)
- [ ] `POST /api/admin/sub-categories` - Creates sub-category
- [ ] `GET /api/admin/sub-categories` - Lists sub-categories
- [ ] `GET /api/admin/sub-categories?category_id=1` - Filters by category
- [ ] `GET /api/admin/categories/:id/sub-categories` - Gets sub-categories by category ID
- [ ] `GET /api/admin/sub-categories/:id` - Gets sub-category by ID
- [ ] `PUT /api/admin/sub-categories/:id` - Updates sub-category
- [ ] `DELETE /api/admin/sub-categories/:id` - Deletes sub-category

### Operator Management (Admin)
- [ ] `POST /api/admin/operators` - Creates operator with auto-generated login ID & password
- [ ] `GET /api/admin/operators` - Lists operators
- [ ] `GET /api/admin/operators/:id` - Gets operator by ID
- [ ] `PUT /api/admin/operators/:id` - Updates operator
- [ ] `POST /api/admin/operators/:id/toggle-active` - Toggles active status

### News Management
- [ ] `POST /api/news` - Operator can create news (status: pending)
- [ ] `POST /api/news/:id/images` - Uploads multiple images
- [ ] `GET /api/admin/news` - Admin can list all news
- [ ] `GET /api/operator/news` - Operator can list own news
- [ ] `GET /api/news` - Public can get approved news only
- [ ] `GET /api/news/:id` - Public can get approved news by ID
- [ ] `POST /api/admin/news/:id/approve` - Admin can approve news
- [ ] `POST /api/admin/news/:id/reject` - Admin can reject news
- [ ] `PUT /api/news/:id` - Operator can update pending news
- [ ] `DELETE /api/news/:newsId/images/:imageId` - Deletes news image
- [ ] `POST /api/news/:id/views` - Increments views (public)

### Advertisement Management (Admin)
- [ ] `POST /api/admin/advertisements` - Creates advertisement with image upload
- [ ] `GET /api/admin/advertisements` - Lists advertisements
- [ ] `GET /api/admin/advertisements/:id` - Gets advertisement by ID
- [ ] `PUT /api/admin/advertisements/:id` - Updates advertisement
- [ ] `POST /api/admin/advertisements/:id/crop` - Crops advertisement image
- [ ] `POST /api/admin/advertisements/:id/toggle-active` - Toggles active status
- [ ] `DELETE /api/admin/advertisements/:id` - Deletes advertisement
- [ ] `GET /api/advertisements?active_only=1` - Public gets active advertisements

## ✅ Security Verification

- [ ] All passwords are hashed (bcrypt)
- [ ] JWT tokens expire after 24 hours
- [ ] SQL injection prevention (prepared statements used)
- [ ] CORS configured correctly
- [ ] Role-based access control working:
  - [ ] Admin can access admin routes
  - [ ] Operator cannot access admin routes
  - [ ] Unauthenticated users cannot access protected routes
- [ ] File upload validation:
  - [ ] File type validation (images only)
  - [ ] File size validation (max 5MB)
  - [ ] MIME type checking

## ✅ Functionality Verification

### Operator Creation
- [ ] Login ID auto-generated from name and area
- [ ] Password auto-generated (10 characters)
- [ ] Generated credentials returned in response
- [ ] Password is hashed in database

### News Workflow
- [ ] Operator creates news → status: pending
- [ ] Admin approves → status: approved
- [ ] Admin rejects → status: rejected
- [ ] Only approved news visible to public
- [ ] Multiple images can be uploaded
- [ ] Images stored in `uploads/news/`

### Advertisement Workflow
- [ ] Image upload works
- [ ] Image cropping works (requires GD extension)
- [ ] Cropped image stored separately
- [ ] Active/inactive toggle works
- [ ] Only active ads visible to public

### Notifications
- [ ] Notification created when news is pending
- [ ] Unread count accurate
- [ ] Mark as read works
- [ ] Mark all as read works

## ✅ Error Handling

- [ ] 400 Bad Request - Invalid input
- [ ] 401 Unauthorized - Missing/invalid token
- [ ] 403 Forbidden - Insufficient permissions
- [ ] 404 Not Found - Resource not found
- [ ] 422 Validation Error - Validation failures
- [ ] 500 Server Error - Server errors

## ✅ Performance Checks

- [ ] Database indexes exist on foreign keys
- [ ] Database indexes exist on frequently queried columns
- [ ] File uploads complete in reasonable time
- [ ] API responses are fast (< 500ms for most endpoints)

## ✅ Documentation

- [ ] `README.md` exists and is complete
- [ ] `API_DOCUMENTATION.md` exists with all endpoints
- [ ] `SETUP_GUIDE.md` exists with installation steps
- [ ] Code comments are present in key files

## Quick Test Script

Run this to test basic functionality:

```bash
# Test login
curl -X POST http://localhost/cms-backend/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email_or_username":"admin","password":"admin123","role":"admin"}'

# Save token from response, then test dashboard
curl -X GET http://localhost/cms-backend/api/admin/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Production Checklist

Before deploying to production:

- [ ] Change default admin password
- [ ] Set strong JWT_SECRET
- [ ] Set APP_DEBUG=false
- [ ] Use HTTPS
- [ ] Configure proper CORS origins
- [ ] Set up database backups
- [ ] Configure error logging
- [ ] Set up monitoring
- [ ] Review file permissions
- [ ] Test all critical endpoints
- [ ] Load test the API
- [ ] Set up SSL certificate
- [ ] Configure firewall rules

## Troubleshooting

If any check fails:

1. **Database Connection Issues**
   - Verify credentials in `.env`
   - Check MySQL is running
   - Verify database exists

2. **Authentication Issues**
   - Check JWT_SECRET is set
   - Verify token format: `Bearer {token}`
   - Check token expiration

3. **File Upload Issues**
   - Check directory permissions
   - Verify PHP upload settings
   - Check GD extension for cropping

4. **CORS Issues**
   - Verify FRONTEND_URL in `.env`
   - Check CORS headers in response
   - Verify web server CORS config

5. **Route Not Found**
   - Check `.htaccess` (Apache) or Nginx config
   - Verify URL rewriting is enabled
   - Check base path in routes

## Completion Status

- [ ] All checks passed
- [ ] System ready for development
- [ ] System ready for production (after production checklist)

---

**Last Verified:** _______________
**Verified By:** _______________
**Notes:** _______________
