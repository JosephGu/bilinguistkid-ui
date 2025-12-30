module.exports = {
  apps: [{
    name: 'bilinguistkid-prod',
    script: './server.js', // 指向项目根目录的 JS 文件
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 443,
      NODE_OPTIONS: '--max-old-space-size=2048'
    },
    // 日志配置
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    out_file: './logs/out.log',
    error_file: './logs/error.log',
    merge_logs: true,
    // 自动重启策略
    autorestart: true,
    max_restarts: 10,
    restart_delay: 3000,
    // 启动超时设置
    kill_timeout: 5000,
    wait_ready: true,
    // 前置启动命令（编译 TypeScript）
    pre_start: 'npm run build'
  },{
    name:'peerjs',
    script:'peerjs',
    args:'--port 9000 --path /peer',
    env:{
      NODE_ENV:'production',
      PORT: 9000,
    }
  }]
};
    