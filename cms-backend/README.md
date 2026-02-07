# CivicCast CMS Backend API

A complete RESTful API backend for a CMS Management System built with PHP 8 and MySQL.

## Features

- ✅ JWT-based authentication
- ✅ Role-based access control (Admin & Operator)
- ✅ Secure password hashing with bcrypt
- ✅ SQL injection prevention (prepared statements)
- ✅ CORS support for React frontend
- ✅ File upload with image validation
- ✅ Image cropping functionality
- ✅ Comprehensive RESTful API endpoints

## Requirements

- PHP 8.0 or higher
- MySQL 5.7+ or MariaDB 10.3+
- Apache/Nginx with mod_rewrite enabled
- Composer (for dependency management)
- PHP Extensions:
  - PDO
  - PDO_MySQL
  - JSON
  - GD (for image cropping)
  - FileInfo (recommended)

## Installation

### Quick Start (5 minutes)

For a quick setup, see [QUICKSTART.md](./QUICKSTART.md)

### Complete Setup Guide

For detailed step-by-step installation instructions, see [SETUP.md](./SETUP.md)

### Quick Installation Steps

1. **Clone or copy the project**
   ```bash
   cd cms-backend
   ```

2. **Run setup verification** (optional but recommended)
   ```bash
   php setup-check.php
   ```

3. **Install dependencies**
   ```bash
   composer install
   ```

4. **Configure environment**
   - Copy `.env.example` to `.env` (if it exists) or create a `.env` file
   - Update database credentials and JWT secret:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=civiccast_cms
   DB_USER=root
   DB_PASS=your_password
   
   JWT_SECRET=your-secret-key-change-this-in-production
   APP_DEBUG=true
   BASE_URL=http://localhost/cms-backend
   FRONTEND_URL=http://localhost:3000
   ```

5. **Create database**
   ```bash
   mysql -u root -p < database/schema.sql
   ```
   Or import `database/schema.sql` using phpMyAdmin or your MySQL client.

6. **Set permissions**
   ```bash
   chmod 755 uploads/news
   chmod 755 uploads/advertisements
   chmod 755 uploads
   ```

7. **Start the server**
   
   **Development (PHP built-in server):**
   ```bash
   php -S localhost:8000
   ```
   
   **Production (Apache/Nginx):**
   - See [SETUP.md](./SETUP.md) for detailed web server configuration
   
   **Apache**: Ensure mod_rewrite is enabled and `.htaccess` is working.
   
   **Nginx**: Add this to your server configuration:
   ```nginx
   location /cms-backend {
       try_files $uri $uri/ /cms-backend/index.php?$query_string;
   }
   ```

8. **Verify installation**
   ```bash
   php setup-check.php
   ```

## Default Admin Credentials

After running the schema, you can login with:
- **Username/Email**: `admin`
- **Password**: `admin123`

⚠️ **Important**: Change the default admin password immediately after installation!

## API Endpoints

### Authentication

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email_or_username": "admin",
  "password": "admin123",
  "role": "admin" // or "operator"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "user": {
      "id": 1,
      "username": "admin",
      "email": "admin@civiccast.com",
      "name": "System Administrator",
      "role": "admin"
    }
  }
}
```

### Dashboard (Admin Only)

#### Get Dashboard Statistics
```
GET /api/admin/dashboard
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "news": {
      "total": 150,
      "total_views": 50000,
      "this_month": 25,
      "pending": 10
    },
    "advertisements": {
      "active": 5
    },
    "notifications": {
      "list": [...],
      "unread_count": 3
    }
  }
}
```

#### Get Notifications
```
GET /api/admin/notifications?is_read=0&limit=50
Authorization: Bearer {token}
```

#### Mark Notification as Read
```
POST /api/admin/notifications/mark-read
Authorization: Bearer {token}
Content-Type: application/json

{
  "id": 1
}
```

### Category Management (Admin Only)

#### Create Category
```
POST /api/admin/categories
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Politics",
  "slug": "politics",
  "description": "Political news and updates",
  "is_active": 1
}
```

#### Update Category
```
PUT /api/admin/categories/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Updated Category Name",
  "is_active": 0
}
```

#### List Categories
```
GET /api/admin/categories?active_only=1
Authorization: Bearer {token}
```

#### Get Category by ID
```
GET /api/admin/categories/:id
Authorization: Bearer {token}
```

#### Delete Category
```
DELETE /api/admin/categories/:id
Authorization: Bearer {token}
```

### Sub-Category Management (Admin Only)

#### Create Sub-Category
```
POST /api/admin/sub-categories
Authorization: Bearer {token}
Content-Type: application/json

{
  "category_id": 1,
  "name": "Local Politics",
  "slug": "local-politics",
  "description": "Local political news",
  "is_active": 1
}
```

#### Update Sub-Category
```
PUT /api/admin/sub-categories/:id
Authorization: Bearer {token}
Content-Type: application/json
```

#### List Sub-Categories
```
GET /api/admin/sub-categories?category_id=1&active_only=1
Authorization: Bearer {token}
```

#### Get Sub-Category by ID
```
GET /api/admin/sub-categories/:id
Authorization: Bearer {token}
```

#### Delete Sub-Category
```
DELETE /api/admin/sub-categories/:id
Authorization: Bearer {token}
```

### Operator Management (Admin Only)

#### Create Operator
```
POST /api/admin/operators
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "John Doe",
  "area": "Mumbai",
  "post": "Correspondent",
  "user_id": "JD001"
}

Response includes auto-generated login_id and password:
{
  "success": true,
  "data": {
    "id": 1,
    "login_id": "johndoemum001",
    "name": "John Doe",
    "generated_password": "xY9#kL2$pQ",
    ...
  }
}
```

#### Update Operator
```
PUT /api/admin/operators/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Updated Name",
  "area": "Delhi",
  "is_active": 1,
  "password": "new_password" // optional
}
```

#### List Operators
```
GET /api/admin/operators?active_only=1
Authorization: Bearer {token}
```

#### Get Operator by ID
```
GET /api/admin/operators/:id
Authorization: Bearer {token}
```

#### Toggle Operator Active Status
```
POST /api/admin/operators/:id/toggle-active
Authorization: Bearer {token}
```

### News Management

#### Create News (Operator)
```
POST /api/news
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  "category_id": 1,
  "sub_category_id": 2, // optional
  "title": "Breaking News Title",
  "sub_title": "Subtitle here",
  "content": "Full news content here...",
  "images[]": [file1, file2, ...] // optional, multiple images
}

Response:
{
  "success": true,
  "message": "News created successfully",
  "data": {
    "id": 1,
    "title": "Breaking News Title",
    "status": "pending",
    "images": [...]
  }
}
```

#### Update News (Operator - only pending)
```
PUT /api/news/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content"
}
```

#### Approve News (Admin)
```
POST /api/admin/news/:id/approve
Authorization: Bearer {token}
Content-Type: application/json

{}
```

#### Reject News (Admin)
```
POST /api/admin/news/:id/reject
Authorization: Bearer {token}
Content-Type: application/json

{
  "reason": "Rejection reason here"
}
```

#### List News (Admin)
```
GET /api/admin/news?status=pending&category_id=1&limit=20&offset=0
Authorization: Bearer {token}
```

#### List News (Operator - own news)
```
GET /api/operator/news?status=pending
Authorization: Bearer {token}
```

#### Get Public News (Approved only)
```
GET /api/news?category_id=1&limit=10&offset=0
```

#### Get News by ID (Public)
```
GET /api/news/:id
```

#### Upload Images to News
```
POST /api/news/:id/images
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  "images[]": [file1, file2, ...]
}
```

#### Delete News Image
```
DELETE /api/news/:newsId/images/:imageId
Authorization: Bearer {token}
```

#### Increment Views (Public)
```
POST /api/news/:id/views
```

### Advertisement Management (Admin Only)

#### Create Advertisement
```
POST /api/admin/advertisements
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  "section": "header",
  "title": "Ad Title",
  "image": [file],
  "link_url": "https://example.com",
  "is_active": 1,
  "display_order": 1
}
```

#### Update Advertisement
```
PUT /api/admin/advertisements/:id
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  "section": "sidebar",
  "title": "Updated Title",
  "image": [file], // optional, new image
  "link_url": "https://new-url.com",
  "is_active": 0
}
```

#### Crop Advertisement Image
```
POST /api/admin/advertisements/:id/crop
Authorization: Bearer {token}
Content-Type: application/json

{
  "x": 100,
  "y": 100,
  "width": 500,
  "height": 300
}
```

#### List Advertisements
```
GET /api/admin/advertisements?section=header&active_only=1
Authorization: Bearer {token}
```

#### Get Advertisement by ID
```
GET /api/admin/advertisements/:id
Authorization: Bearer {token}
```

#### Toggle Advertisement Active Status
```
POST /api/admin/advertisements/:id/toggle-active
Authorization: Bearer {token}
```

#### Delete Advertisement
```
DELETE /api/admin/advertisements/:id
Authorization: Bearer {token}
```

#### Get Active Advertisements (Public)
```
GET /api/advertisements?section=header
```

## Error Responses

All error responses follow this format:
```json
{
  "success": false,
  "message": "Error message here",
  "data": null
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict (e.g., duplicate slug)
- `422` - Validation Error
- `500` - Internal Server Error

### Validation Errors

```json
{
  "success": false,
  "message": "Validation Error",
  "data": {
    "errors": {
      "name": ["Name is required"],
      "email": ["Email must be a valid email"]
    }
  }
}
```

## Security Features

1. **SQL Injection Prevention**: All queries use prepared statements
2. **Password Hashing**: bcrypt with secure defaults
3. **JWT Authentication**: Secure token-based authentication
4. **Role-Based Access**: Middleware enforces role restrictions
5. **CORS Protection**: Configured for specific frontend URL
6. **File Upload Validation**: MIME type and size validation
7. **Input Validation**: Server-side validation for all inputs

## Database Schema

See `database/schema.sql` for complete database structure including:
- `admins` - Admin users
- `operators` - Operator users
- `categories` - News categories
- `sub_categories` - Sub-categories under categories
- `news` - News articles
- `news_images` - Images associated with news
- `advertisements` - Advertisement records
- `notifications` - System notifications

All tables include proper foreign keys and indexes for performance.

## File Upload

- **Location**: `uploads/news/` and `uploads/advertisements/`
- **Max Size**: 5MB (configurable in `config/app.php`)
- **Allowed Types**: JPEG, PNG, GIF, WebP
- **Auto-generated filenames**: Prevents conflicts and ensures uniqueness

## Project Structure

```
cms-backend/
├── config/
│   ├── app.php
│   ├── database.php
│   └── jwt.php
├── controllers/
│   ├── AdvertisementController.php
│   ├── AuthController.php
│   ├── CategoryController.php
│   ├── DashboardController.php
│   ├── NewsController.php
│   ├── OperatorController.php
│   └── SubCategoryController.php
├── database/
│   └── schema.sql
├── middleware/
│   ├── AuthMiddleware.php
│   └── RoleMiddleware.php
├── models/
│   ├── Admin.php
│   ├── Advertisement.php
│   ├── Category.php
│   ├── News.php
│   ├── NewsImage.php
│   ├── Notification.php
│   ├── Operator.php
│   └── SubCategory.php
├── routes/
│   └── api.php
├── uploads/
│   ├── advertisements/
│   └── news/
├── utils/
│   ├── Database.php
│   ├── FileUpload.php
│   ├── helpers.php
│   ├── JWT.php
│   ├── Response.php
│   └── Validator.php
├── .htaccess
├── composer.json
├── index.php
└── README.md
```

## Development

### Testing with cURL

```bash
# Login
curl -X POST http://localhost/cms-backend/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email_or_username":"admin","password":"admin123","role":"admin"}'

# Get dashboard stats
curl -X GET http://localhost/cms-backend/api/admin/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Testing with Postman

1. Import the endpoints from the API documentation above
2. Set up environment variables for `base_url` and `token`
3. Use the Bearer Token authentication type

## Troubleshooting

### 500 Internal Server Error
- Check PHP error logs
- Ensure database connection credentials are correct
- Verify file permissions on `uploads/` directory
- Check that required PHP extensions are installed

### CORS Issues
- Verify `FRONTEND_URL` in `.env` matches your React app URL
- Check that CORS headers are being sent (check browser network tab)

### File Upload Fails
- Check `upload_max_filesize` and `post_max_size` in `php.ini`
- Verify `uploads/` directory has write permissions (755 or 777)
- Ensure GD extension is installed for image cropping

### Authentication Issues
- Verify JWT secret is set in `.env`
- Check that Authorization header is being sent correctly
- Ensure token hasn't expired (default 24 hours)

## License

This project is proprietary software.

## Support

For issues or questions, please contact the development team.

