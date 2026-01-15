# Environment Variables Setup

> **Note**: Environment variables can be set via `.env` files or system environment variables. For Azure deployments, you can use Azure Application Settings (which work like system env vars) or `.env` files. See `AZURE_CONFIG.md` for Azure-specific details.

## Backend Environment Variables (`bday-fund-server/.env`)

Create `bday-fund-server/.env` with the following variables:

```env
# Environment Mode (development or production)
# Controls which CORS origin and other settings to use
APP_ENV=development

# Server Configuration
PORT=4000

# CORS Configuration
# Production CORS origin (used when APP_ENV=production)
ALLOWED_ORIGIN=https://your-app.azurestaticapps.net

# Development CORS Origin (used when APP_ENV=development, optional - defaults to http://localhost:5173)
DEV_ORIGIN=http://localhost:5173

# MySQL Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=birthday_fund_tracker
```

### Azure App Service Configuration

When deploying to Azure App Service, set these in **Configuration** → **Application settings** (or use `.env` file):

- `APP_ENV`: Set to `production` for production deployments
- `PORT`: Azure sets this automatically (usually 8080), but you can override
- `ALLOWED_ORIGIN`: Your frontend URL (e.g., `https://your-app.azurestaticapps.net`)
- `DEV_ORIGIN`: Development CORS origin (optional, defaults to `http://localhost:5173`)
- `DB_HOST`: Your MySQL server hostname (e.g., `your-server.mysql.database.azure.com`)
- `DB_PORT`: `3306`
- `DB_USER`: Your MySQL admin username
- `DB_PASSWORD`: Your MySQL password
- `DB_NAME`: `birthday_fund_tracker`

## Frontend Environment Variables (`.env`)

Create `.env` in the project root with:

```env
# Environment Mode (development or production)
# Controls which API URL to use
VITE_ENV=development

# Development API URL (used when VITE_ENV=development, optional - defaults to http://localhost:4000)
VITE_API_URL_DEV=http://localhost:4000

# Production API URL (used when VITE_ENV=production)
# Example: https://your-backend.azurewebsites.net
VITE_API_URL=https://your-backend.azurewebsites.net
```

### Azure Static Web Apps Configuration

When deploying to Azure Static Web Apps, set these in **Configuration** → **Application settings** (or use `.env` file):

- `VITE_ENV`: Set to `production` for production deployments
- `VITE_API_URL_DEV`: Development API URL (optional, defaults to `http://localhost:4000`)
- `VITE_API_URL`: Production API URL (e.g., `https://your-backend.azurewebsites.net`)

**Important**: After setting environment variables, you must rebuild your frontend for the change to take effect, as Vite embeds environment variables at build time.

## Quick Setup Commands

### Local Development

**Backend:**
```bash
cd server
cp .env.example .env
# Edit .env with your local MySQL credentials
npm install
npm run dev
```

**Frontend:**
```bash
cp .env.example .env
# Edit .env with http://localhost:4000
npm install
npm run dev
```

### Azure Deployment

1. **Backend**: Set environment variables in Azure App Service → Configuration → Application settings
2. **Frontend**: Set `VITE_API_URL` in Azure Static Web Apps → Configuration → Application settings, then rebuild and redeploy

## Azure Deployment

**For Azure deployments, you can use either:**

- **Option 1**: `.env` files (works the same as local development)
- **Option 2**: Azure Application Settings (set in Azure Portal → Configuration → Application Settings)

Both methods work identically - the code loads `.env` files first, then system environment variables override them.

See `AZURE_CONFIG.md` for complete Azure configuration guide.

## Security Notes

- `.env` files are in `.gitignore` and should never be committed
- `.env.example` files are templates and can be committed
- **For Azure**: You can use `.env` files or Azure Application Settings (encrypted at rest)
- Consider using Azure Key Vault for sensitive production credentials
- The code loads `.env` files first, then system environment variables (including Azure Application Settings) override them

