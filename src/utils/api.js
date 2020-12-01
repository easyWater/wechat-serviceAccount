const http = require('./http')

module.exports = {
  getAccessToken: (query) => http({ method: 'get', url: `/token`, query }),
  createMenu: (query, body) => http({ method: 'post', url: `/menu/create`, query, body }),
  deleteMenu: (query) => http({ method: 'get', url: `/menu/delete`, query }),
  getTicket: (query) => http({ method: 'get', url: `/ticket/getticket`, query })
}

