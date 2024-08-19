module.exports = {
  apps: [
    {
      name: 'election-server',
      script: './server.js',
      env_development: {
        NODE_ENV: 'development',
        PORT: 5000,
        IP:'192.168.68.119',
        LOG_FILE: 'server.log'
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 8080,
        LOG_FILE: 'server.log'
      }
    }
  ]
};
