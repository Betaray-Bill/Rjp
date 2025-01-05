module.exports = {
  apps : [{
    name   : "server",
    script : "./server/server.js"
  },
  {
    name   : "dashboard-src",
    script : "./dashboard/dist/index.html",
    interpreter:'none'
  },
  {
    name   : "client-trainer-src",
    script : "./client-trainer/dist/index.html"
  }]
}
