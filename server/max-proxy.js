// server/map-proxy.js
const express = require('express');
const app = express();

app.use(express.json());

// 提供地图HTML页面
app.post('/api/map-config', (req, res) => {
  const { portals, userLocation } = req.body;
  
  const html = generateMapHTML(portals, userLocation);
  res.send(html);
});

function generateMapHTML(portals, userLocation) {
  // 从环境变量获取密钥
  const apiKey = process.env.AMAP_API_KEY;
  
  // 生成与前端类似的HTML，但密钥受到保护
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>高德地图</title>
        <script src="https://webapi.amap.com/maps?v=2.0&key=${apiKey}"></script>
    </head>
    <body>
        <div id="container" style="width:100%;height:100%;"></div>
        <script>
            // 地图初始化代码...
        </script>
    </body>
    </html>
  `;
}

app.listen(3001, () => {
  console.log('地图代理服务运行在端口 3001');
});