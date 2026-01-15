# Azure Configuration Guide

This project is designed to use **Azure Application Settings** instead of `.env` files for production deployments. Environment variables are configured directly in Azure Portal.

## Backend Configuration (Azure App Service)

The backend automatically reads from `process.env`, which Azure App Service populates from Application Settings.

### Required Application Settings

Go to your Azure App Service → **Configuration** → **Application settings** and add:

| Setting Name | Value | Description |
|-------------|-------|-------------|
| `PORT` | `8080` (or leave empty - Azure sets this automatically) | Server port |
| `ALLOWED_ORIGIN` | `https://your-frontend.azurestaticapps.net` | Frontend URL for CORS |
| `DB_HOST` | `your-server.mysql.database.azure.com` | MySQL server hostname |
| `DB_PORT` | `3306` | MySQL port |
| `DB_USER` | `your_admin_user` | MySQL admin username |
| `DB_PASSWORD` | `your_password` | MySQL password |
| `DB_NAME` | `birthday_fund_tracker` | Database name |
| `NODE_ENV` | `production` | Environment mode |

### Using Azure CLI

```bash
az webapp config appsettings set \
  --resource-group your-resource-group \
  --name your-app-service-name \
  --settings \
    PORT=8080 \
    ALLOWED_ORIGIN=https://your-frontend.azurestaticapps.net \
    DB_HOST=your-server.mysql.database.azure.com \
    DB_PORT=3306 \
    DB_USER=your_admin_user \
    DB_PASSWORD=your_password \
    DB_NAME=birthday_fund_tracker \
    NODE_ENV=production
```

## Frontend Configuration (Azure Static Web Apps)

The frontend supports two methods for configuring the API URL:

### Method 1: Build-Time Environment Variable (Recommended)

Set `VITE_API_URL` as a build environment variable in Azure Static Web Apps:

1. Go to Azure Static Web Apps → **Configuration** → **Application settings**
2. Add:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-backend.azurewebsites.net`

3. **Important**: After adding this setting, you must **rebuild and redeploy** your frontend for the change to take effect, as Vite embeds environment variables at build time.

### Method 2: Runtime Configuration (Alternative)

If you need to change the API URL without rebuilding, you can use runtime configuration:

1. Add a script tag in your `index.html` before the app loads:
```html
<script>
  window.APP_CONFIG = {
    API_URL: 'https://your-backend.azurewebsites.net'
  };
</script>
```

2. The app will automatically use `window.APP_CONFIG.API_URL` if `VITE_API_URL` is not set.

### Using Azure CLI

```bash
az staticwebapp appsettings set \
  --name your-static-web-app-name \
  --resource-group your-resource-group \
  --setting-names VITE_API_URL=https://your-backend.azurewebsites.net
```

## Local Development

For local development, you can still use `.env` files:

- **Backend**: `server/.env` (optional - only loads if `NODE_ENV !== 'production'`)
- **Frontend**: `.env` (optional - fallback to `http://localhost:4000`)

The `.env` files are in `.gitignore` and are only used for local development convenience.

## Benefits of Azure Application Settings

✅ **No `.env` files needed** - Configuration is managed in Azure Portal  
✅ **Secure** - Values are encrypted at rest  
✅ **Easy updates** - Change settings without redeploying code  
✅ **Environment-specific** - Different settings for dev/staging/production  
✅ **Version control friendly** - No secrets in your repository  

## Migration from .env Files

If you're currently using `.env` files:

1. **Backend**: Copy values from `server/.env` to Azure App Service Application Settings
2. **Frontend**: Copy `VITE_API_URL` from `.env` to Azure Static Web Apps Application Settings
3. Remove `.env` files (they're already in `.gitignore`)

The code will automatically use Azure Application Settings in production and fall back to `.env` files (or defaults) in local development.

## Troubleshooting

### Backend can't connect to MySQL
- Verify all database settings are correct in Application Settings
- Check MySQL firewall rules allow Azure App Service IPs
- Ensure `NODE_ENV=production` is set (so dotenv doesn't try to load `.env`)

### Frontend can't reach backend
- Verify `VITE_API_URL` is set correctly in Azure Static Web Apps
- **Rebuild and redeploy** frontend after setting `VITE_API_URL`
- Check CORS settings - ensure `ALLOWED_ORIGIN` matches your frontend URL exactly
- Check browser console for CORS errors

### Environment variables not working
- For backend: Restart the App Service after changing Application Settings
- For frontend: Rebuild and redeploy after changing `VITE_API_URL`
- Verify variable names match exactly (case-sensitive)

