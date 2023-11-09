module.exports = ({ env }) => ({
  'users-permissions': {
    config: {
      jwtSecret: env('JWT_SECRET'),
    },
  },
  upload: {
    config: {
      provider: 'cloudinary',
      providerOptions: {
        cloud_name: env('CLOUDINARY_NAME'),
        api_key: env('CLOUDINARY_KEY'),
        api_secret: env('CLOUDINARY_SECRET'),
      },
      actionOptions: {
        upload: {},
        delete: {},
      },
    },
  },
  'strapi-plugin-populate-deep': {
    config: {
      defaultDepth: 20,
    }
  },
  'navigation': {
    enabled: true,
  },
  seo: {
    enabled: true,
  },
  'sitemap': {
    enabled: true,
    config: {
      autoGenerate: true,
      allowedFields: ['id', 'url'],
      excludedTypes: [],
    },
  },
  graphql: {
    config: {
      endpoint: '/graphql',
      shadowCRUD: true,
      playgroundAlways: env('ENABLE_GRAPHQL_PLAYGROUND', 'false') === 'true',
      depthLimit: 20,
      amountLimit: 100,
      apolloServer: {
        tracing: false,
        introspection: env('ENABLE_GRAPHQL_PLAYGROUND', 'false') === 'true',
      },
    },
  },
  "netlify-deployments": {
    enabled: true,
    config: {
      accessToken: env('NETLIFY_TOKEN', 'false'),
      sites: [
        {
          name: env('NETLIFY_SITE_NAME', ''),
          id: env('NETLIFY_SITE_ID', ''),
          buildHook: env('NETLIFY_BUILD_HOOK', ''),
          branch: env('NETLIFY_BRANCH', ''),
        }
      ]
    },
  },
  "video-field": {
    enabled: true,
  },
});
