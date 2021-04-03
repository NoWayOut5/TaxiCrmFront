// const { createProxyMiddleware } = require('http-proxy-middleware');
//
// module.exports = function(app) {
//   app.use(
//     '/api',
//     createProxyMiddleware({
//       target: 'https://taxicrmcommon.herokuapp.com/',
//       changeOrigin: true,
//       pathRewrite: function (path, req) {
//         return path.replace('/api', '')
//       },
//       headers: {
//         Cookie: 'JSESSIONID=7724BD25B81C8E0FE3AF4E637117D693'
//       },
//     }
//   ));
// };