# Quick Fix for 500 Errors

Since login works but other endpoints return 500, follow these steps:

## Step 1: Test Authentication

After logging in, test if your token is being sent correctly:

1. Open browser DevTools → Console
2. Run this command:
   ```javascript
   console.log('Token:', localStorage.getItem('token'));
   ```
3. You should see your JWT token

## Step 2: Test Token Validation

Visit: `http://localhost:8000/test-auth.php`

This will show:
- If token is being sent
- If token can be decoded
- If token is valid
- User data from token

## Step 3: Check Actual Error

1. Open DevTools → Network tab
2. Make a request (e.g., load dashboard)
3. Click on the failed request
4. Go to "Response" tab
5. You should now see the actual error message (not just 500)

## Step 4: Common Issues & Fixes

### Issue: "Database connection failed"

**Fix:**
1. Check `.env` file exists in `cms-backend/`
2. Verify database credentials
3. Ensure MySQL is running
4. Test with: `http://localhost:8000/debug.php`

### Issue: "Class not found"

**Fix:**
```bash
cd cms-backend
composer install
```

### Issue: "JWT decode error"

**Fix:**
1. Check `JWT_SECRET` in `.env` matches the one used during login
2. Token might be corrupted - try logging out and logging in again

### Issue: "Authorization header is missing"

**Fix:**
- Check if token is in localStorage
- Check browser console for errors
- Verify axios interceptor is adding the header

## Step 5: Enable Detailed Errors

I've updated `index.php` to show detailed errors. The error response should now include:
- Error message
- File where error occurred
- Line number
- Stack trace

## Step 6: Test Individual Endpoints

Test these endpoints one by one to find which one fails:

1. **Test endpoint (no auth):**
   ```
   GET http://localhost:8000/api/test
   ```

2. **Dashboard (requires auth):**
   ```
   GET http://localhost:8000/api/admin/dashboard
   Authorization: Bearer YOUR_TOKEN
   ```

3. **Operators (requires auth):**
   ```
   GET http://localhost:8000/api/admin/operators
   Authorization: Bearer YOUR_TOKEN
   ```

## What to Check

1. ✅ Login works → Token is generated correctly
2. ❌ Other endpoints fail → Issue is likely:
   - Token not being sent
   - Token validation failing
   - Database connection in protected routes
   - Missing error handling

## Next Steps

After checking the actual error message in the Network tab, share it and I can provide a specific fix!
