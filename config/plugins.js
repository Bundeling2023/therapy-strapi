module.exports = ({ env }) => ({
  ckeditor5: {
    enabled: true,
  },
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
    'strapi-5-sitemap-plugin': {
      enabled: true,
      config: {
        cronSchedule: '0 0 * * *', // daily at midnight
        sitemapBaseUrl: env('SITEMAP_BASE_URL', 'https://www.debundeling.nl'),
        includeDrafts: false,
        autoGenerate: true,
        allowedFields: ['id', 'url'], // array of fields to include
        exclude: [], // array of collection types to exclude
        customRoutes: [], // array of custom routes
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
      v4CompatibilityMode: false,
    },
  },
  "rest-cache": {
  enabled: true,
  config: {
    provider: {
      name: "memory",
    },
  },
},
});
