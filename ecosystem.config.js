module.exports = {
  apps: [{
    name: 'dev',
    script: 'react-scripts start',
    watch: false,
    env: {
      NODE_ENV: 'development',
      PORT: 3000
    }
  }]
}
