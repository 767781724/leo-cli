/**
 * hot热更新配置
 */
// require('eventsource-polyfill')
var hotClient = require('webpack-hot-middleware/client?noInfo=true&reload=true')
hotClient.subscribe(function(event) {
    // if (event.action === 'reload') {
    //     window.location.reload()
    // }
})