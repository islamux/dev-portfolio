# Deployment to Hostinger Static Hosting Plan

## Overview
This document outlines the plan to deploy the Next.js portfolio application to Hostinger's static hosting service.

## Current Status
- The application is built with Next.js 16.0.10
- Uses static site generation (SSG) for all pages
- Output directory: `out/` (contains static HTML, CSS, JS files)

## Deployment Plan

### Phase 1: Preparation
1. **Verify static export compatibility**
   - Ensure all pages use `generateStaticParams` for dynamic routes
   - Confirm no server-side rendering or API routes are required
   - Check that all content is pre-rendered

2. **Build optimization**
   - Run `pnpm build` to generate static files
   - Verify the `out/` directory contains all necessary files
   - Test locally with `pnpm start` or `serve out/`

3. **Create deployment branch**
   - Create branch: `feature/hostinger-deployment`
   - This branch will contain deployment-specific configurations

### Phase 2: Hostinger Setup
1. **Account preparation**
   - Ensure Hostinger account is active
   - Verify domain is properly configured
   - Check DNS settings

2. **Static hosting configuration**
   - Set up static hosting in Hostinger panel
   - Configure custom domain if needed
   - Set up SSL certificate

### Phase 3: Deployment Process
1. **Build and export**
   ```bash
   pnpm install
   pnpm build
   ```

2. **Upload static files**
   - Compress the `out/` directory
   - Upload via FTP/SFTP to Hostinger
   - Alternative: Use Hostinger's file manager

3. **Configuration**
   - Set document root to point to uploaded files
   - Configure proper MIME types
   - Set up redirects if needed

### Phase 4: Testing and Validation
1. **Functional testing**
   - Test all pages load correctly
   - Verify navigation works
   - Check language switching
   - Test contact form (if applicable)

2. **Performance testing**
   - Check load times
   - Verify asset loading
   - Test on different devices

3. **SEO validation**
   - Verify meta tags
   - Check OpenGraph tags
   - Test structured data

### Phase 5: Monitoring and Maintenance
1. **Set up monitoring**
   - Configure uptime monitoring
   - Set up error tracking

2. **Update process**
   - Document update procedure
   - Create script for future deployments

## Technical Considerations

### Static Export Requirements
- All dynamic routes must be pre-rendered
- No server-side code execution
- All API calls must be to external services

### Hostinger Limitations
- No Node.js backend
- No server-side rendering
- Limited to static assets only

### Workarounds
- Use client-side JavaScript for dynamic features
- Implement form handling via external services
- Use static site generators for content

## Timeline
- **Day 1**: Preparation and branch creation
- **Day 2**: Hostinger setup and initial upload
- **Day 3**: Testing and validation
- **Day 4**: Final adjustments and go-live

## Success Criteria
- All pages load without errors
- Navigation works seamlessly
- Performance metrics meet expectations
- SEO requirements are satisfied
- Contact form functions properly (if applicable)

## Rollback Plan
- Keep previous version backup
- Document rollback procedure
- Test rollback process before deployment

## Post-Deployment Tasks
- Update documentation
- Monitor performance
- Gather user feedback
- Plan for future updates
