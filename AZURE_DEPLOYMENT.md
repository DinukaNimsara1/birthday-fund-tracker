# Azure Deployment Guide

This guide will help you deploy the Birthday Fund Tracker to Azure.

## Prerequisites

- Azure account with active subscription
- Azure CLI installed (optional, but recommended)
- MySQL database (Azure Database for MySQL Flexible Server)

## Architecture

- **Frontend**: Deploy as Azure Static Web Apps or Azure Storage + CDN
- **Backend**: Deploy as Azure App Service (Node.js)
- **Database**: Azure Database for MySQL Flexible Server

## Step 1: Create Azure Database for MySQL

1. Go to Azure Portal → Create a resource → Azure Database for MySQL Flexible Server
2. Configure:
   - **Server name**: `birthday-fund-mysql` (or your preferred name)
   - **Region**: Choose closest to your App Service
   - **MySQL version**: 8.0 or later
   - **Compute tier**: Burstable (B1s) for development, or higher for production
   - **Storage**: 20 GB minimum
   - **Admin username**: Create a username (e.g., `adminuser`)
   - **Password**: Create a strong password
3. After creation, note:
   - **Server name** (e.g., `birthday-fund-mysql.mysql.database.azure.com`)
   - **Admin username**
   - **Password**
   - **Database name**: Create a database called `birthday_fund_tracker`

## Step 2: Deploy Backend (Azure App Service)

### Option A: Using Azure Portal

1. Go to Azure Portal → Create a resource → Web App
2. Configure:
   - **Name**: `birthday-fund-backend` (must be globally unique)
   - **Runtime stack**: Node 20 LTS
   - **Operating System**: Linux
   - **Region**: Same as your MySQL server
3. After creation, go to **Configuration** → **Application settings**
4. Add these environment variables:
   ```
   PORT=8080
   ALLOWED_ORIGIN=https://your-frontend-url.azurestaticapps.net
   DB_HOST=birthday-fund-mysql.mysql.database.azure.com
   DB_PORT=3306
   DB_USER=adminuser
   DB_PASSWORD=your_mysql_password
   DB_NAME=birthday_fund_tracker
   ```
5. Go to **Deployment Center** → **Local Git** or **GitHub Actions**
6. Deploy your `server` folder code

### Option B: Using Azure CLI

```bash
# Login to Azure
az login

# Create resource group
az group create --name birthday-fund-rg --location eastus

# Create App Service plan
az appservice plan create --name birthday-fund-plan --resource-group birthday-fund-rg --sku B1 --is-linux

# Create Web App
az webapp create --resource-group birthday-fund-rg --plan birthday-fund-plan --name birthday-fund-backend --runtime "NODE:20-lts"

# Set environment variables
az webapp config appsettings set --resource-group birthday-fund-rg --name birthday-fund-backend --settings \
  PORT=8080 \
  ALLOWED_ORIGIN=https://your-frontend-url.azurestaticapps.net \
  DB_HOST=birthday-fund-mysql.mysql.database.azure.com \
  DB_PORT=3306 \
  DB_USER=adminuser \
  DB_PASSWORD=your_mysql_password \
  DB_NAME=birthday_fund_tracker

# Deploy code (from server directory)
cd server
az webapp up --name birthday-fund-backend --resource-group birthday-fund-rg --runtime "NODE:20-lts"
```

## Step 3: Configure MySQL Firewall

1. Go to your MySQL server in Azure Portal
2. Navigate to **Networking**
3. Add firewall rule:
   - **Rule name**: AllowAzureServices
   - **Start IP**: 0.0.0.0
   - **End IP**: 0.0.0.0
   - Or add your App Service's outbound IP addresses

## Step 4: Deploy Frontend (Azure Static Web Apps)

### Option A: Using Azure Portal

1. Go to Azure Portal → Create a resource → Static Web App
2. Configure:
   - **Name**: `birthday-fund-frontend`
   - **Region**: Same as backend
   - **Framework preset**: React
   - **App location**: `/` (root)
   - **Output location**: `dist`
3. Connect to your GitHub repository
4. Configure build:
   - **Build presets**: Custom
   - **App location**: `/`
   - **Api location**: Leave empty (backend is separate)
   - **Output location**: `dist`
5. Add environment variable in **Configuration**:
   ```
   VITE_API_URL=https://birthday-fund-backend.azurewebsites.net
   ```

### Option B: Using Azure CLI

```bash
# Create Static Web App
az staticwebapp create \
  --name birthday-fund-frontend \
  --resource-group birthday-fund-rg \
  --location eastus2 \
  --sku Free

# Set environment variable
az staticwebapp appsettings set \
  --name birthday-fund-frontend \
  --resource-group birthday-fund-rg \
  --setting-names VITE_API_URL=https://birthday-fund-backend.azurewebsites.net
```

## Step 5: Configure Azure Application Settings

**No `.env` files needed!** Configure everything through Azure Portal Application Settings.

### Backend (Azure App Service Application Settings)

Go to Azure App Service → **Configuration** → **Application settings** and add:

```
PORT=8080
ALLOWED_ORIGIN=https://your-frontend-url.azurestaticapps.net
DB_HOST=your-mysql-server.mysql.database.azure.com
DB_PORT=3306
DB_USER=your_admin_user
DB_PASSWORD=your_mysql_password
DB_NAME=birthday_fund_tracker
NODE_ENV=production
```

### Frontend (Azure Static Web Apps Application Settings)

Go to Azure Static Web Apps → **Configuration** → **Application settings** and add:

```
VITE_API_URL=https://your-backend.azurewebsites.net
```

**Important**: After setting `VITE_API_URL`, you must **rebuild and redeploy** your frontend for the change to take effect, as Vite embeds environment variables at build time.

See `AZURE_CONFIG.md` for detailed configuration instructions.

## Step 6: Build and Deploy

### Backend
```bash
cd server
npm install
npm run build  # If you have a build script
# Deploy to Azure App Service
```

### Frontend
```bash
# Update .env with your backend URL
VITE_API_URL=https://your-backend.azurewebsites.net

# Build
npm install
npm run build

# Deploy dist folder to Azure Static Web Apps
```

## Troubleshooting

### Backend Issues

1. **Connection refused to MySQL**:
   - Check firewall rules in MySQL server
   - Verify DB_HOST, DB_USER, DB_PASSWORD are correct
   - Check App Service logs: `az webapp log tail --name birthday-fund-backend --resource-group birthday-fund-rg`

2. **CORS errors**:
   - Ensure `ALLOWED_ORIGIN` matches your frontend URL exactly
   - Check browser console for CORS error details

### Frontend Issues

1. **API calls failing**:
   - Verify `VITE_API_URL` is set correctly
   - Rebuild frontend after changing environment variables
   - Check browser network tab for API call URLs

2. **Build errors**:
   - Ensure all dependencies are installed
   - Check for TypeScript/ESLint errors

## Security Notes

- Never commit `.env` files to git (they're in `.gitignore`)
- Use Azure Key Vault for sensitive credentials in production
- Enable HTTPS only in Azure App Service
- Use managed identity for database connections when possible
- Regularly rotate database passwords

## Cost Optimization

- Use **Free tier** for Azure Static Web Apps (frontend)
- Use **B1 Basic** tier for App Service (backend) - ~$13/month
- Use **Burstable B1s** for MySQL - ~$12/month
- Total: ~$25/month for development/testing

For production, consider:
- Standard tier App Service
- General Purpose MySQL tier
- Azure CDN for frontend

## Next Steps

1. Set up CI/CD pipelines for automatic deployments
2. Configure custom domains
3. Set up monitoring and alerts
4. Implement backup strategy for MySQL database

