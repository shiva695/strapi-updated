module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int( 'PORT', 1337 ),
  url: 'https://cms.svassessments.fxgetactive.com',
  admin: {
    auth: {
      secret: env('ADMIN_JWT_SECRET', '513c9b2778e480ea22aee672a029bf12'),
    },
  },
});
