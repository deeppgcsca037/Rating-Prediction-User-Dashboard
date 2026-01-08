# User Dashboard

Public-facing dashboard for submitting reviews.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Set `VITE_API_URL` to your backend API URL

4. Run development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

## Deployment

### Vercel
1. Connect your GitHub repository
2. Set framework preset to "Vite"
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Add environment variable: `VITE_API_URL`

The `vercel.json` file is already configured.


