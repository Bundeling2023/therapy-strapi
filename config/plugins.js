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
    'navigation': { enabled: true },
    seo: {
      enabled: true,
    },
    graphql: {
      config: {
        endpoint: '/graphql',
        shadowCRUD: true,
        playgroundAlways: false,
        depthLimit: 20,
        amountLimit: 100,
        apolloServer: {
          tracing: false,
        },
      },
    },
    "video-field":{
      enabled: true,
    },
  });
