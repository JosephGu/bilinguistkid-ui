import https from 'https';
import fs from 'fs';
import next from 'next';
import http from 'http';
import { IncomingMessage, ServerResponse } from 'http';

const app = next({
  dev: false
});

const handle = app.getRequestHandler();

const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/bilinguistkid.cn/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/bilinguistkid.cn/fullchain.pem')
};

app.prepare()
  .then(() => {
    // 启动 HTTPS 服务（443 端口，生产环境标准）
    const httpsServer = https.createServer(options, (req: IncomingMessage, res: ServerResponse) => {
      // 生产环境安全头配置
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'DENY');
      res.setHeader('X-XSS-Protection', '1; mode=block');
      
      handle(req, res);
    });

    httpsServer.listen(443, (err?: Error) => {
      if (err) {
        console.error('HTTPS 服务启动失败:', err);
        process.exit(1);
      }
      console.log('✅ 生产环境 HTTPS 服务已启动: https://bilinguistkid.cn');
    });

    // HTTP 自动重定向到 HTTPS（生产环境必需）
    const httpServer = http.createServer((req: IncomingMessage, res: ServerResponse) => {
      if (req.headers.host) {
        res.writeHead(301, { 
          Location: `https://${req.headers.host}${req.url || ''}` 
        });
      }
      res.end();
    });

    httpServer.listen(80, (err?: Error) => {
      if (err) {
        console.warn('HTTP 重定向服务启动失败:', err);
      } else {
        console.log('🔄 HTTP 已重定向到 HTTPS');
      }
    });

    // 处理进程退出
    process.on('SIGTERM', () => {
      console.log('收到 SIGTERM 信号，正在关闭服务器...');
      httpsServer.close();
      httpServer.close(() => {
        console.log('服务器已关闭');
        process.exit(0);
      });
    });
  })
  .catch((err: Error) => {
    console.error('应用初始化失败:', err);
    process.exit(1);
  });
    