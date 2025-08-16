# OpenID Connect (OIDC) Setup for Secure npm Publishing

This guide explains how to set up OpenID Connect (OIDC) to securely publish the `hooks-belt` package to npm without storing sensitive credentials in your repository.

## What is OIDC?

OpenID Connect (OIDC) is an authentication protocol that allows GitHub Actions to securely authenticate with npm using short-lived, automatically rotated tokens instead of long-lived personal access tokens.

## Benefits of OIDC

- ✅ **No secrets to manage** - No need to store npm tokens in repository secrets
- ✅ **Automatic token rotation** - Tokens are generated fresh for each workflow run
- ✅ **Enhanced security** - Reduces risk of token exposure
- ✅ **Simplified CI/CD** - Cleaner workflow files without secret management

## Step-by-Step Setup

### Step 1: Add Trusted Publisher on npmjs.com

1. **Navigate to your package settings:**
   - Go to [npmjs.com](https://www.npmjs.com)
   - Sign in to your account
   - Navigate to your `hooks-belt` package
   - Click on "Settings" tab

2. **Find the Trusted Publisher section:**
   - Scroll down to "Trusted Publisher" section
   - Click on the **"GitHub Actions"** button (since we're using GitHub)

3. **Configure the trusted publisher:**
   - **Organization or user:** `oleksandrmorozov` (your GitHub username)
   - **Repository:** `hooks-belt` (your repository name)
   - **Workflow filename:** `publish-oidc.yml` (the workflow file we created)
   - **Environment name:** (leave blank for now)

4. **Save the configuration:**
   - Click "Save" to establish the trust relationship

### Step 2: Verify Workflow File

The workflow file `.github/workflows/publish-oidc.yml` is already configured with:

- **Trigger:** Pushes to version tags (e.g., `v1.0.0`, `v1.1.0`)
- **Permissions:** `id-token: write` (required for OIDC)
- **Steps:** Install, test, build, and publish

### Step 3: Publishing Process

Once OIDC is set up, publishing is simple:

1. **Create and push a version tag:**
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

2. **GitHub Actions automatically:**
   - Runs tests
   - Builds the library
   - Publishes to npm using OIDC authentication

## Workflow Details

### Trigger
The workflow triggers when you push a tag starting with `v` (e.g., `v1.0.0`, `v1.2.3`).

### Security Permissions
```yaml
permissions:
  id-token: write  # Required for OIDC
  contents: read   # Read repository contents
```

### Publishing Steps
1. **Checkout** - Get the code
2. **Setup Node.js** - Configure Node.js 18
3. **Install dependencies** - Run `npm ci`
4. **Run tests** - Ensure all tests pass
5. **Build library** - Create production build
6. **Publish** - Deploy to npm

## Alternative Workflow

We also provide a traditional workflow (`.github/workflows/publish.yml`) that uses `NPM_TOKEN` secret for cases where OIDC might not be available.

## Troubleshooting

### Common Issues

1. **"Workflow not found" error:**
   - Ensure the workflow file exists at `.github/workflows/publish-oidc.yml`
   - Check that the filename matches exactly in npm settings

2. **Permission denied:**
   - Verify `id-token: write` permission is set in the workflow
   - Check that the trusted publisher is correctly configured

3. **Authentication failed:**
   - Ensure the workflow filename in npm matches exactly
   - Verify the repository and organization names are correct

### Verification

To verify OIDC is working:

1. Check the GitHub Actions logs for successful authentication
2. Verify the package appears on npm after a successful run
3. Check that no `NODE_AUTH_TOKEN` errors occur

## Security Best Practices

- ✅ **Use OIDC** instead of personal access tokens
- ✅ **Limit permissions** to only what's necessary
- ✅ **Trigger on tags** to control when publishing occurs
- ✅ **Run tests** before publishing
- ✅ **Build verification** ensures code quality

## Next Steps

After setting up OIDC:

1. **Test the workflow** by creating a test tag
2. **Monitor the first publish** to ensure everything works
3. **Update package version** when ready for release
4. **Create and push version tags** for releases

## Resources

- [npm OIDC Documentation](https://docs.npmjs.com/about-openid-connect)
- [GitHub Actions OIDC](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect)
- [npm Trusted Publishers](https://docs.npmjs.com/about-trusted-publishers)

---

**Note:** This setup provides enterprise-grade security for your npm package publishing while maintaining simplicity and automation. 