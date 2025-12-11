# Deployment Guide

## Environment Setup

1. Create Supabase project for database
2. Configure OAuth apps for production
3. Set up Resend for email service
4. Add all environment variables to Vercel

## Deployment Process

1. Push code to main branch
2. Vercel automatically deploys
3. Verify health check endpoint
4. Test all authentication flows

## Monitoring

- Health: /api/health
- Errors: Vercel logs
- Performance: Vercel analytics

## Troubleshooting

- Check Vercel logs for errors
- Verify environment variables
- Test database connection
- Check OAuth callback URLs

## Production Checklist

- [ ] All environment variables configured
- [ ] Database connected and migrated
- [ ] OAuth providers updated for production
- [ ] Email service working
- [ ] HTTPS working correctly
- [ ] All functionalities tested
- [ ] Monitoring configured