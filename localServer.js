import http from 'http';
import fs from 'fs';
import next from 'next';

const app = next({
  dev: false
});

const handle = app.getRequestHandler();

app.prepare()
  .then(() => {
    const httpServer = http.createServer((req, res) => {
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'DENY');
      res.setHeader('X-XSS-Protection', '1; mode=block');
      
      handle(req, res);
    });

    httpServer.listen(3000, (err) => {
      if (err) {
        console.error('HTTP 服务启动失败:', err);
        process.exit(1);
      }
      console.log('✅ 测试环境 HTTP 服务已启动: http://localhost:3000');
    });

    process.on('SIGTERM', () => {
      console.log('收到 SIGTERM 信号，正在关闭服务器...');
      httpServer.close();
      console.log('服务器已关闭');
      process.exit(0);
    });
  })
  .catch((err) => {
    console.error('应用初始化失败:', err);
    process.exit(1);
  });
    