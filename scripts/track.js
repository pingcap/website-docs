exports.pageView = function () {
  _reportLog('pageview', {
    dl: document.location.href,
    dr: document.referrer,
    ts: _getCurrentTS(),
    ul: navigator.language || navigator.userLanguage,
    dt: document.title,
  })
}

function _getCurrentTS() {
  return new Date().getTime()
}

function _getCookie(cname) {
  var name = cname + '='
  var ca = document.cookie.split(';')
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i].trim()
    if (c.indexOf(name) === 0) return c.substring(name.length, c.length)
  }
  return ''
}

function _reportLog(logType, params) {
  var eventUrl = 'https://accounts.pingcap.com/_analytics/event?'
  var uid = _getCookie('uid')

  if (uid) {
    params.uid = uid
  }

  params.e = logType
  // version
  params.v = 1

  var paramsArr = []
  Object.keys(params).forEach(item => {
    if (typeof params[item] !== 'undefined') {
      paramsArr.push(item + '=' + encodeURIComponent(params[item]))
    }
  })
  eventUrl += paramsArr.join('&')

  var oReq = new XMLHttpRequest()
  oReq.open('GET', eventUrl)
  oReq.withCredentials = true
  oReq.send()
}
