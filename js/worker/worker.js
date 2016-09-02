importScripts('ellipses.js')

const getRawEllipses = data => {
  self.postMessage(data)
}

self.addEventListener('message', function(e) {
  if (e.data.cmd === 'getRawEllipses') {
    buildEllipsesLines(e.data.row, e.data.columns, e.data.tile)
  }
}, false)
