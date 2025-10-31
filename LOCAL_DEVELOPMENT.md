# Local Development Setup

This guide explains how to run the UFC Fight Analytics marketplace locally for development.

## Prerequisites

- Node.js 18+ installed
- AWS account with credentials configured
- Git installed

## Project Structure

```
software-marketplace-v2/
├── backend/          # Node.js + Express API (AWS Lambda)
│   ├── src/         # Source code
│   ├── scripts/     # Database utility scripts
│   └── .env         # Backend environment variables
└── frontend/        # React application
    ├── src/         # Source code
    ├── public/      # Static files
    └── .env         # Frontend environment variables (for local dev)
```

## Backend Setup

### 1. Navigate to backend directory

```bash
cd backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Your `.env` file should contain:

```
STRIPE_SECRET_KEY=sk_live_...
S3_BUCKET_NAME=software-marketplace-files
DYNAMODB_PRODUCTS_TABLE=dev-products
DYNAMODB_ORDERS_TABLE=dev-orders
CORS_ORIGIN=http://localhost:3000
```

### 4. Start the backend server

```bash
npm start
```

The API will run on `http://localhost:3001`

### 5. Test the API

```bash
curl http://localhost:3001/health
curl http://localhost:3001/products
```

## Frontend Setup

### 1. Open a NEW terminal and navigate to frontend directory

```bash
cd frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env` file for local development

Create `frontend/.env` (NOT `.env.production`):

```
REACT_APP_API_URL=http://localhost:3001
REACT_APP_STRIPE_PUBLIC_KEY=pk_live_51Pim6QFjUyw3riC1PvvFrVDtupRJehryxDIs1jbalY1Dn7KHQmKiuIjGTrEKfLTIZ1nUMIItEW12NkFJSJBKIJ2c00OcdTi4Hf
```

### 4. Start the React development server

```bash
npm start
```

The app will open automatically at `http://localhost:3000`

## Making Changes

### Frontend Changes

1. Edit files in `frontend/src/`
2. Changes will automatically reload in the browser (Hot Module Replacement)
3. Check the browser console for any errors

### Backend Changes

1. Edit files in `backend/src/`
2. Restart the backend server manually (Ctrl+C, then `npm start` again)
3. Or install `nodemon` for auto-restart:
   ```bash
   npm install -g nodemon
   nodemon src/server.js
   ```

### Styling Changes

1. Edit `frontend/src/App.css` for global styles
2. Changes reload automatically
3. Use browser DevTools to inspect and debug CSS

## Testing Your Changes

### 1. Test in Browser

- Open `http://localhost:3000`
- Check that products load
- Click to expand/collapse products
- Test navigation to product detail page

### 2. Check Console

- Open browser DevTools (F12)
- Check Console tab for JavaScript errors
- Check Network tab for API calls

### 3. Test API Directly

```bash
# Get all products
curl http://localhost:3001/products

# Get specific product
curl http://localhost:3001/products/{PRODUCT_ID}
```

## Common Issues

### Port Already in Use

**Frontend (port 3000):**
```
Would you like to run the app on another port instead? (Y/n)
```
Type `Y` to use port 3001 instead

**Backend (port 3001):**
Change in `backend/src/server.js`:
```javascript
const PORT = process.env.PORT || 3002;  // Change to 3002
```

### CORS Errors

Make sure:
1. Backend `.env` has `CORS_ORIGIN=http://localhost:3000`
2. Backend server is running
3. Frontend `.env` has correct `REACT_APP_API_URL`

### Products Not Loading

1. Check backend is running: `curl http://localhost:3001/health`
2. Check products exist: `curl http://localhost:3001/products`
3. Check browser Console for errors

## Database Management Scripts

### Clear all products
```bash
cd backend
node scripts/clear-products.js
```

### Seed products
```bash
cd backend
node scripts/seed-products.js
```

## Deploying Your Changes

### 1. Test locally first!

Make sure everything works at `http://localhost:3000`

### 2. Commit your changes

```bash
git add .
git commit -m "Your commit message"
```

### 3. Push to GitHub

```bash
git push
```

### 4. Automatic Deployment

- **Frontend**: AWS Amplify automatically rebuilds (2-5 minutes)
- **Backend**: Redeploy manually with `npx serverless deploy --stage dev`

## File Locations for Common Tasks

| Task | File to Edit |
|------|-------------|
| Product list layout | `frontend/src/pages/ProductList.js` |
| Product detail page | `frontend/src/pages/ProductDetail.js` |
| Global styles | `frontend/src/App.css` |
| API endpoints | `backend/src/server.js` |
| Product data | `backend/scripts/seed-products.js` |
| Product queries | `backend/src/handlers/products.js` |

## Tips

- Always test locally before deploying
- Use browser DevTools to debug CSS and JavaScript
- Check the browser Console for errors
- Keep backend and frontend running in separate terminals
- Use `Ctrl+C` to stop servers
- Frontend changes reload automatically
- Backend changes require manual restart

## Need Help?

1. Check browser Console for errors
2. Check terminal output for backend errors
3. Make sure both servers are running
4. Verify environment variables are correct
5. Try clearing browser cache (Ctrl+Shift+R)
