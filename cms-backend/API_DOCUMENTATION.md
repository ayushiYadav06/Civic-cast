# CMS Management System - API Documentation

Complete REST API documentation for the CivicCast CMS Management System.

## Base URL
```
http://localhost/cms-backend
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer {token}
```

---

## 🔐 Authentication APIs

### Admin/Operator Login
**POST** `/api/auth/login`

**Request Body:**
```json
{
  "email_or_username": "admin@civiccast.com",
  "password": "admin123",
  "role": "admin"  // or "operator"
}
```

**Response (200 OK):**
```json
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

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid credentials",
  "data": null
}
```

---

## 📊 Dashboard APIs (Admin Only)

### Get Dashboard Statistics
**GET** `/api/admin/dashboard`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "news": {
      "total": 150,
      "total_views": 12500,
      "this_month": 25,
      "pending": 5
    },
    "advertisements": {
      "active": 12
    },
    "notifications": {
      "list": [
        {
          "id": 1,
          "type": "news_pending",
          "title": "New News Pending Approval",
          "message": "News 'Breaking News Title' is pending approval",
          "related_id": 10,
          "related_type": "news",
          "is_read": 0,
          "created_at": "2024-01-15 10:30:00"
        }
      ],
      "unread_count": 5
    }
  }
}
```

### Get Notifications
**GET** `/api/admin/notifications?is_read=0&limit=50`

**Query Parameters:**
- `is_read` (optional): 0 or 1
- `limit` (optional): Number of notifications to return (default: 50)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "type": "news_pending",
      "title": "New News Pending Approval",
      "message": "News 'Breaking News Title' is pending approval",
      "related_id": 10,
      "related_type": "news",
      "is_read": 0,
      "created_at": "2024-01-15 10:30:00"
    }
  ]
}
```

### Mark Notification as Read
**POST** `/api/admin/notifications/mark-read`

**Request Body:**
```json
{
  "id": 1
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Notification marked as read",
  "data": null
}
```

### Mark All Notifications as Read
**POST** `/api/admin/notifications/mark-all-read`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "All notifications marked as read",
  "data": {
    "count": 5
  }
}
```

---

## 📂 Category Management (Admin Only)

### Create Category
**POST** `/api/admin/categories`

**Request Body:**
```json
{
  "name": "Politics",
  "slug": "politics",
  "description": "Political news and updates",
  "is_active": 1
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "id": 1,
    "name": "Politics",
    "slug": "politics",
    "description": "Political news and updates",
    "is_active": 1,
    "created_at": "2024-01-15 10:00:00",
    "updated_at": "2024-01-15 10:00:00"
  }
}
```

### Update Category
**PUT** `/api/admin/categories/:id`

**Request Body:**
```json
{
  "name": "Politics & Governance",
  "description": "Updated description"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Category updated successfully",
  "data": {
    "id": 1,
    "name": "Politics & Governance",
    "slug": "politics",
    "description": "Updated description",
    "is_active": 1,
    "created_at": "2024-01-15 10:00:00",
    "updated_at": "2024-01-15 11:00:00"
  }
}
```

### List Categories
**GET** `/api/admin/categories?active_only=1`

**Query Parameters:**
- `active_only` (optional): 1 to get only active categories

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "name": "Politics",
      "slug": "politics",
      "description": "Political news",
      "is_active": 1,
      "created_at": "2024-01-15 10:00:00",
      "updated_at": "2024-01-15 10:00:00"
    }
  ]
}
```

### Get Category by ID
**GET** `/api/admin/categories/:id`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": 1,
    "name": "Politics",
    "slug": "politics",
    "description": "Political news",
    "is_active": 1,
    "created_at": "2024-01-15 10:00:00",
    "updated_at": "2024-01-15 10:00:00"
  }
}
```

### Delete Category
**DELETE** `/api/admin/categories/:id`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Category deleted successfully",
  "data": null
}
```

---

## 📂 Sub-Category Management (Admin Only)

### Create Sub-Category
**POST** `/api/admin/sub-categories`

**Request Body:**
```json
{
  "category_id": 1,
  "name": "Local Politics",
  "slug": "local-politics",
  "description": "Local political news",
  "is_active": 1
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Sub-category created successfully",
  "data": {
    "id": 1,
    "category_id": 1,
    "category_name": "Politics",
    "name": "Local Politics",
    "slug": "local-politics",
    "description": "Local political news",
    "is_active": 1,
    "created_at": "2024-01-15 10:00:00",
    "updated_at": "2024-01-15 10:00:00"
  }
}
```

### Update Sub-Category
**PUT** `/api/admin/sub-categories/:id`

**Request Body:**
```json
{
  "name": "Local & Regional Politics",
  "description": "Updated description"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Sub-category updated successfully",
  "data": {
    "id": 1,
    "category_id": 1,
    "category_name": "Politics",
    "name": "Local & Regional Politics",
    "slug": "local-politics",
    "description": "Updated description",
    "is_active": 1,
    "created_at": "2024-01-15 10:00:00",
    "updated_at": "2024-01-15 11:00:00"
  }
}
```

### List Sub-Categories
**GET** `/api/admin/sub-categories?category_id=1&active_only=1`

**Query Parameters:**
- `category_id` (optional): Filter by category ID
- `active_only` (optional): 1 to get only active sub-categories

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "category_id": 1,
      "category_name": "Politics",
      "name": "Local Politics",
      "slug": "local-politics",
      "description": "Local political news",
      "is_active": 1,
      "created_at": "2024-01-15 10:00:00",
      "updated_at": "2024-01-15 10:00:00"
    }
  ]
}
```

### Get Sub-Categories by Category ID
**GET** `/api/admin/categories/:id/sub-categories`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "category_id": 1,
      "category_name": "Politics",
      "name": "Local Politics",
      "slug": "local-politics",
      "description": "Local political news",
      "is_active": 1,
      "created_at": "2024-01-15 10:00:00",
      "updated_at": "2024-01-15 10:00:00"
    }
  ]
}
```

### Get Sub-Category by ID
**GET** `/api/admin/sub-categories/:id`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": 1,
    "category_id": 1,
    "category_name": "Politics",
    "name": "Local Politics",
    "slug": "local-politics",
    "description": "Local political news",
    "is_active": 1,
    "created_at": "2024-01-15 10:00:00",
    "updated_at": "2024-01-15 10:00:00"
  }
}
```

### Delete Sub-Category
**DELETE** `/api/admin/sub-categories/:id`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Sub-category deleted successfully",
  "data": null
}
```

---

## 👥 Operator Management (Admin Only)

### Create Operator
**POST** `/api/admin/operators`

**Request Body:**
```json
{
  "name": "John Doe",
  "area": "Delhi",
  "post": "Reporter",
  "user_id": "JD001"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Operator created successfully",
  "data": {
    "id": 1,
    "login_id": "johndeldel123",
    "name": "John Doe",
    "area": "Delhi",
    "post": "Reporter",
    "user_id": "JD001",
    "is_active": 1,
    "created_at": "2024-01-15 10:00:00",
    "updated_at": "2024-01-15 10:00:00",
    "generated_password": "aB3$kL9m"
  }
}
```

**Note:** The `generated_password` is only shown once during creation. Save it securely.

### Update Operator
**PUT** `/api/admin/operators/:id`

**Request Body:**
```json
{
  "name": "John Doe Updated",
  "area": "Mumbai",
  "post": "Senior Reporter",
  "password": "newpassword123",
  "is_active": 1
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Operator updated successfully",
  "data": {
    "id": 1,
    "login_id": "johndeldel123",
    "name": "John Doe Updated",
    "area": "Mumbai",
    "post": "Senior Reporter",
    "user_id": "JD001",
    "is_active": 1,
    "created_at": "2024-01-15 10:00:00",
    "updated_at": "2024-01-15 11:00:00"
  }
}
```

### List Operators
**GET** `/api/admin/operators?active_only=1`

**Query Parameters:**
- `active_only` (optional): 1 to get only active operators

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "login_id": "johndeldel123",
      "name": "John Doe",
      "area": "Delhi",
      "post": "Reporter",
      "user_id": "JD001",
      "is_active": 1,
      "created_at": "2024-01-15 10:00:00",
      "updated_at": "2024-01-15 10:00:00"
    }
  ]
}
```

### Get Operator by ID
**GET** `/api/admin/operators/:id`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": 1,
    "login_id": "johndeldel123",
    "name": "John Doe",
    "area": "Delhi",
    "post": "Reporter",
    "user_id": "JD001",
    "is_active": 1,
    "created_at": "2024-01-15 10:00:00",
    "updated_at": "2024-01-15 10:00:00"
  }
}
```

### Toggle Operator Active Status
**POST** `/api/admin/operators/:id/toggle-active`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Operator status updated successfully",
  "data": {
    "id": 1,
    "login_id": "johndeldel123",
    "name": "John Doe",
    "area": "Delhi",
    "post": "Reporter",
    "user_id": "JD001",
    "is_active": 0,
    "created_at": "2024-01-15 10:00:00",
    "updated_at": "2024-01-15 11:00:00"
  }
}
```

---

## 📰 News Management

### Create News (Operator Only)
**POST** `/api/news`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request Body (multipart/form-data):**
```
title: Breaking News Title
sub_title: Subtitle here
category_id: 1
sub_category_id: 1 (optional)
content: Full news content here...
images[]: [file1.jpg, file2.jpg, file3.jpg]
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "News created successfully",
  "data": {
    "id": 1,
    "operator_id": 1,
    "category_id": 1,
    "sub_category_id": 1,
    "title": "Breaking News Title",
    "sub_title": "Subtitle here",
    "content": "Full news content here...",
    "slug": "breaking-news-title",
    "status": "pending",
    "views": 0,
    "category_name": "Politics",
    "sub_category_name": "Local Politics",
    "operator_name": "John Doe",
    "image_count": 3,
    "created_at": "2024-01-15 10:00:00",
    "updated_at": "2024-01-15 10:00:00"
  }
}
```

### Update News
**PUT** `/api/news/:id`

**Request Body (JSON):**
```json
{
  "title": "Updated News Title",
  "sub_title": "Updated subtitle",
  "content": "Updated content",
  "category_id": 1,
  "sub_category_id": 2
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "News updated successfully",
  "data": {
    "id": 1,
    "operator_id": 1,
    "category_id": 1,
    "sub_category_id": 2,
    "title": "Updated News Title",
    "sub_title": "Updated subtitle",
    "content": "Updated content",
    "slug": "breaking-news-title",
    "status": "pending",
    "views": 0,
    "created_at": "2024-01-15 10:00:00",
    "updated_at": "2024-01-15 11:00:00"
  }
}
```

### List News (Admin)
**GET** `/api/admin/news?status=pending&category_id=1&limit=20&offset=0`

**Query Parameters:**
- `status` (optional): pending, approved, rejected
- `operator_id` (optional): Filter by operator
- `category_id` (optional): Filter by category
- `limit` (optional): Number of results
- `offset` (optional): Pagination offset

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "operator_id": 1,
      "category_id": 1,
      "sub_category_id": 1,
      "title": "Breaking News Title",
      "sub_title": "Subtitle here",
      "content": "Full news content...",
      "slug": "breaking-news-title",
      "status": "pending",
      "views": 0,
      "category_name": "Politics",
      "sub_category_name": "Local Politics",
      "operator_name": "John Doe",
      "image_count": 3,
      "created_at": "2024-01-15 10:00:00",
      "updated_at": "2024-01-15 10:00:00"
    }
  ]
}
```

### List News (Operator - Own News Only)
**GET** `/api/operator/news?status=pending`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "operator_id": 1,
      "category_id": 1,
      "title": "Breaking News Title",
      "status": "pending",
      "views": 0,
      "created_at": "2024-01-15 10:00:00"
    }
  ]
}
```

### Get News by ID
**GET** `/api/admin/news/:id` or `/api/news/:id` (public)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": 1,
    "operator_id": 1,
    "category_id": 1,
    "sub_category_id": 1,
    "title": "Breaking News Title",
    "sub_title": "Subtitle here",
    "content": "Full news content...",
    "slug": "breaking-news-title",
    "status": "approved",
    "views": 150,
    "approved_by": 1,
    "approved_at": "2024-01-15 11:00:00",
    "category_name": "Politics",
    "sub_category_name": "Local Politics",
    "operator_name": "John Doe",
    "approved_by_name": "System Administrator",
    "image_count": 3,
    "created_at": "2024-01-15 10:00:00",
    "updated_at": "2024-01-15 11:00:00"
  }
}
```

### Approve News (Admin Only)
**POST** `/api/admin/news/:id/approve`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "News approved successfully",
  "data": {
    "id": 1,
    "status": "approved",
    "approved_by": 1,
    "approved_at": "2024-01-15 11:00:00"
  }
}
```

### Reject News (Admin Only)
**POST** `/api/admin/news/:id/reject`

**Request Body:**
```json
{
  "reason": "Content does not meet editorial standards"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "News rejected successfully",
  "data": {
    "id": 1,
    "status": "rejected",
    "approved_by": 1,
    "rejected_reason": "Content does not meet editorial standards"
  }
}
```

### Upload News Images
**POST** `/api/news/:id/images`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request Body (multipart/form-data):**
```
images[]: [file1.jpg, file2.jpg]
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Images uploaded successfully",
  "data": [
    {
      "id": 1,
      "news_id": 1,
      "image_path": "uploads/news/news_1234567890.jpg",
      "image_url": "http://localhost/cms-backend/uploads/news/news_1234567890.jpg",
      "display_order": 0,
      "created_at": "2024-01-15 10:00:00"
    }
  ]
}
```

### Delete News Image
**DELETE** `/api/news/:newsId/images/:imageId`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Image deleted successfully",
  "data": null
}
```

### Increment News Views (Public)
**POST** `/api/news/:id/views`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Views incremented",
  "data": null
}
```

---

## 📢 Advertisement Management (Admin Only)

### Create Advertisement
**POST** `/api/admin/advertisements`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request Body (multipart/form-data):**
```
section: header
title: Advertisement Title (optional)
image: [file.jpg]
link_url: https://example.com (optional)
is_active: 1
display_order: 0
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Advertisement created successfully",
  "data": {
    "id": 1,
    "section": "header",
    "title": "Advertisement Title",
    "image_path": "uploads/advertisements/ad_1234567890.jpg",
    "image_url": "http://localhost/cms-backend/uploads/advertisements/ad_1234567890.jpg",
    "cropped_image_path": null,
    "cropped_image_url": null,
    "link_url": "https://example.com",
    "is_active": 1,
    "display_order": 0,
    "created_at": "2024-01-15 10:00:00",
    "updated_at": "2024-01-15 10:00:00"
  }
}
```

### Update Advertisement
**PUT** `/api/admin/advertisements/:id`

**Request Body (JSON or multipart/form-data):**
```json
{
  "section": "sidebar",
  "title": "Updated Title",
  "link_url": "https://newexample.com",
  "is_active": 1,
  "display_order": 1
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Advertisement updated successfully",
  "data": {
    "id": 1,
    "section": "sidebar",
    "title": "Updated Title",
    "image_path": "uploads/advertisements/ad_1234567890.jpg",
    "image_url": "http://localhost/cms-backend/uploads/advertisements/ad_1234567890.jpg",
    "link_url": "https://newexample.com",
    "is_active": 1,
    "display_order": 1,
    "created_at": "2024-01-15 10:00:00",
    "updated_at": "2024-01-15 11:00:00"
  }
}
```

### Crop Advertisement Image
**POST** `/api/admin/advertisements/:id/crop`

**Request Body:**
```json
{
  "x": 100,
  "y": 50,
  "width": 800,
  "height": 400
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Image cropped successfully",
  "data": {
    "id": 1,
    "section": "header",
    "image_path": "uploads/advertisements/ad_1234567890.jpg",
    "image_url": "http://localhost/cms-backend/uploads/advertisements/ad_1234567890.jpg",
    "cropped_image_path": "uploads/advertisements/ad_1234567890_cropped.jpg",
    "cropped_image_url": "http://localhost/cms-backend/uploads/advertisements/ad_1234567890_cropped.jpg",
    "is_active": 1,
    "created_at": "2024-01-15 10:00:00",
    "updated_at": "2024-01-15 11:00:00"
  }
}
```

### List Advertisements
**GET** `/api/admin/advertisements?section=header&active_only=1`

**Query Parameters:**
- `section` (optional): Filter by section
- `active_only` (optional): 1 to get only active advertisements

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "section": "header",
      "title": "Advertisement Title",
      "image_path": "uploads/advertisements/ad_1234567890.jpg",
      "image_url": "http://localhost/cms-backend/uploads/advertisements/ad_1234567890.jpg",
      "cropped_image_path": "uploads/advertisements/ad_1234567890_cropped.jpg",
      "cropped_image_url": "http://localhost/cms-backend/uploads/advertisements/ad_1234567890_cropped.jpg",
      "link_url": "https://example.com",
      "is_active": 1,
      "display_order": 0,
      "created_at": "2024-01-15 10:00:00",
      "updated_at": "2024-01-15 10:00:00"
    }
  ]
}
```

### Get Active Advertisements (Public)
**GET** `/api/advertisements?section=header`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "section": "header",
      "title": "Advertisement Title",
      "image_url": "http://localhost/cms-backend/uploads/advertisements/ad_1234567890.jpg",
      "cropped_image_url": "http://localhost/cms-backend/uploads/advertisements/ad_1234567890_cropped.jpg",
      "link_url": "https://example.com",
      "display_order": 0
    }
  ]
}
```

### Get Advertisement by ID
**GET** `/api/admin/advertisements/:id`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": 1,
    "section": "header",
    "title": "Advertisement Title",
    "image_path": "uploads/advertisements/ad_1234567890.jpg",
    "image_url": "http://localhost/cms-backend/uploads/advertisements/ad_1234567890.jpg",
    "cropped_image_path": "uploads/advertisements/ad_1234567890_cropped.jpg",
    "cropped_image_url": "http://localhost/cms-backend/uploads/advertisements/ad_1234567890_cropped.jpg",
    "link_url": "https://example.com",
    "is_active": 1,
    "display_order": 0,
    "created_at": "2024-01-15 10:00:00",
    "updated_at": "2024-01-15 10:00:00"
  }
}
```

### Toggle Advertisement Active Status
**POST** `/api/admin/advertisements/:id/toggle-active`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Advertisement status updated successfully",
  "data": {
    "id": 1,
    "is_active": 0,
    "updated_at": "2024-01-15 11:00:00"
  }
}
```

### Delete Advertisement
**DELETE** `/api/admin/advertisements/:id`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Advertisement deleted successfully",
  "data": null
}
```

---

## 🔒 Error Responses

### Validation Error (422)
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

### Unauthorized (401)
```json
{
  "success": false,
  "message": "Unauthorized",
  "data": null
}
```

### Forbidden (403)
```json
{
  "success": false,
  "message": "Access denied. Required role: admin",
  "data": null
}
```

### Not Found (404)
```json
{
  "success": false,
  "message": "Not Found",
  "data": null
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "Internal server error",
  "data": null
}
```

---

## 📝 Notes

1. **JWT Token Expiration**: Tokens expire after 24 hours. Re-login to get a new token.

2. **File Uploads**: 
   - Maximum file size: 5MB
   - Allowed image types: JPEG, PNG, GIF, WebP
   - Images are stored in `uploads/news/` and `uploads/advertisements/`

3. **CORS**: CORS is enabled for the frontend URL specified in `config/app.php`

4. **Password Security**: 
   - All passwords are hashed using bcrypt
   - Operator passwords are auto-generated and shown only once during creation

5. **News Status Flow**:
   - Operators create news with status `pending`
   - Admin approves → status becomes `approved`
   - Admin rejects → status becomes `rejected`
   - Only `approved` news is visible to public frontend

6. **Slug Generation**: 
   - Slugs are auto-generated from titles
   - Duplicate slugs are automatically suffixed with numbers
