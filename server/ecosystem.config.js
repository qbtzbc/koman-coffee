/**
 * PM2 生态系统配置文件
 * 用于生产环境进程管理
 */
module.exports = {
  apps: [
    {
      name: 'koman-coffee-api',
      script: './app.js',
      
      // 实例配置
      instances: 2,  // 使用集群模式，启动2个实例
      exec_mode: 'cluster',  // 集群模式支持负载均衡
      
      // 自动重启配置
      autorestart: true,
      watch: false,  // 生产环境关闭文件监听
      max_memory_restart: '500M',  // 内存超过500M自动重启
      max_restarts: 10,  // 最大重启次数
      min_uptime: '10s',  // 最小运行时间
      restart_delay: 4000,  // 重启延迟
      
      // 环境变量
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
        LOG_LEVEL: 'debug'
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
        LOG_LEVEL: 'info'
      },
      env_test: {
        NODE_ENV: 'test',
        PORT: 3001,
        LOG_LEVEL: 'warn'
      },
      
      // 日志配置
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      merge_logs: true,
      log_type: 'json',
      
      // 进程管理
      kill_timeout: 5000,  // 强制杀死前的等待时间
      listen_timeout: 3000,  // 监听超时时间
      shutdown_with_message: true,
      
      // 高级配置
      cron_restart: '0 3 * * *',  // 每天凌晨3点重启（可选）
      // vizion: false,  // 禁用版本控制元数据
      
      // 监控配置
      instance_var: 'INSTANCE_ID',
      
      // 源映射支持（用于调试）
      source_map_support: true,
      
      // 进程标题
      // name: 'koman-coffee-api'
    }
  ],
  
  // 部署配置（可选）
  deploy: {
    production: {
      user: 'nodeuser',
      host: ['your-production-server.com'],
      ref: 'origin/main',
      repo: 'git@github.com:yourusername/koman-coffee.git',
      path: '/var/www/koman-coffee',
      'post-deploy': 'cd server && npm install && pm2 reload ecosystem.config.js --env production',
      env: {
        NODE_ENV: 'production'
      }
    },
    staging: {
      user: 'nodeuser',
      host: ['your-staging-server.com'],
      ref: 'origin/develop',
      repo: 'git@github.com:yourusername/koman-coffee.git',
      path: '/var/www/koman-coffee-staging',
      'post-deploy': 'cd server && npm install && pm2 reload ecosystem.config.js --env staging',
      env: {
        NODE_ENV: 'staging'
      }
    }
  }
};
