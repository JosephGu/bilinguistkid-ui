import https from 'https';
import fs from 'fs';
import next from 'next';

const app = next({
  dev: false
});

const handle = app.getRequestHandler();

const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/bilinguistkid.cn/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/bilinguistkid.cn/fullchain.pem'),
  minVersion: 'TLSv1.2',
  maxVersion: 'TLSv1.3',
  ciphers: 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384',
};

app.prepare()
  .then(() => {
    const httpsServer = https.createServer(options, (req, res) => {
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'DENY');
      res.setHeader('X-XSS-Protection', '1; mode=block');
      
      handle(req, res);
    });

    httpsServer.listen(443, (err) => {
      if (err) {
        console.error('HTTPS 服务启动失败:', err);
        process.exit(1);
      }
      console.log('✅ 生产环境 HTTPS 服务已启动: https://bilinguistkid.cn');
    });

    process.on('SIGTERM', () => {
      console.log('收到 SIGTERM 信号，正在关闭服务器...');
      httpsServer.close();
      console.log('服务器已关闭');
      process.exit(0);
    });
  })
  .catch((err) => {
    console.error('应用初始化失败:', err);
    process.exit(1);
  });
    