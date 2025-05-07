# my-site

This is my private personal website repository. Built using the [Moon Site](https://github.com/mirkotrotta/moon-site) template, it's used to power my portfolio, blog, and resume at [https://my-domain.com](https://my-domain.com).

---

For the open-source template version, visit:
👉 [github.com/mirkotrotta/moon-site](https://github.com/mirkotrotta/moon-site)

---

Note: compose.test.yaml is CI‑only (no Traefik, HTTP on ports 4000/8000).
Production stack still uses compose.yaml with Traefik on 80/443.


## Environment Variables

This project uses environment variables for configuration. Two template files are provided:

### .env.example

Contains all available environment variables with documentation and example values. Copy this file to create your own `.env` file:

```bash
cp .env.example .env
```

Then edit the `.env` file with your specific configuration values.

### .env.production

Contains production-specific environment variable settings. Use this as a template when deploying to production:

```bash
cp .env.production .env
```

Then replace the placeholder values with actual production values before deployment.

### Key Variables

- **DOMAIN**: Your application domain name (e.g., example.com)
- **GITHUB_TOKEN**: GitHub API token for repository access
- **NEXT_PUBLIC_API_URL**: URL for the frontend to access the API
- **ACME_EMAIL**: Email for Let's Encrypt SSL certificates (production only)

### Local Development

For local development, set `DISABLE_HTTPS=true` and use `localhost` as your domain.

### Security Note

Never commit your `.env` file with actual secrets to version control. The `.env` file is included in `.gitignore` to prevent accidental commits.
