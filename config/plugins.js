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
        },
      },
    },
    'update-static-content': {
      enabled: true,
      config: {
        githubToken: env('GITHUB_TOKEN'), // accessing personal github token from env file
        owner: 'Bundeling2023', // owner of the repo
        repo: 'therapy-front', // name of the repo
        workflowId: 'railway-deploy.yml', // workflowId OR filename
        branch: 'main', // branch name
      },
    },
    "video-field":{
      enabled: true,
    },
  });
