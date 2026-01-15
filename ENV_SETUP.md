# Environment Variables Setup

> **For Azure deployments**: Use Azure Application Settings instead of `.env` files. See `AZURE_CONFIG.md` for details.

## Backend Environment Variables (`server/.env` - Local Development Only)

For local development, you can optionally create `server/.env` with the following variables:

```env
# Server Configuration
PORT=4000

# CORS Configuration
# For Azure deployment, set this to your frontend URL
# Example: https://your-app.azurestaticapps.net
# For local development, use http://localhost:5173
ALLOWED_ORIGIN=http://localhost:5173

# MySQL Database Configuration
# For Azure Database for MySQL Flexible Server, use the connection details from Azure Portal
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=birthday_fund_tracker
```

### Azure App Service Configuration

When deploying to Azure App Service, set these in **Configuration** → **Application settings**:

- `PORT`: Azure sets this automatically (usually 8080), but you can override
- `ALLOWED_ORIGIN`: Your frontend URL (e.g., `https://your-app.azurestaticapps.net`)
- `DB_HOST`: Your MySQL server hostname (e.g., `your-server.mysql.database.azure.com`)
- `DB_PORT`: `3306`
- `DB_USER`: Your MySQL admin username
- `DB_PASSWORD`: Your MySQL password
- `DB_NAME`: `birthday_fund_tracker`

## Frontend Environment Variables (`.env` - Local Development Only)

For local development, you can optionally create `.env` in the project root with:

```env
# Frontend Configuration
# Set this to your Azure backend API URL after deployment
# Example: https://your-backend.azurewebsites.net
# For local development, use http://localhost:4000
VITE_API_URL=http://localhost:4000
```

### Azure Static Web Apps Configuration

When deploying to Azure Static Web Apps, set this in **Configuration** → **Application settings**:

- `VITE_API_URL`: Your backend API URL (e.g., `https://your-backend.azurewebsites.net`)

**Important**: After setting `VITE_API_URL`, you must rebuild your frontend for the change to take effect, as Vite embeds environment variables at build time.

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

**For Azure deployments, use Application Settings instead of `.env` files:**

- **Backend**: Configure in Azure App Service → Configuration → Application Settings
- **Frontend**: Configure in Azure Static Web Apps → Configuration → Application Settings

See `AZURE_CONFIG.md` for complete Azure configuration guide.

## Security Notes

- `.env` files are in `.gitignore` and should never be committed
- `.env.example` files are templates and can be committed
- **For Azure**: Use Application Settings (encrypted at rest) instead of `.env` files
- Consider using Azure Key Vault for sensitive production credentials
- The code automatically uses Azure Application Settings in production and falls back to `.env` files for local development

