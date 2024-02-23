// server.js
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use('/api', createProxyMiddleware({ 
  target: 'http://newcorewebservice.somee.com', 
  changeOrigin: true 
}));

const port = 3000; // You can choose a different port if needed

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
