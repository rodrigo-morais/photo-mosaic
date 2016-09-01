import * as builder from './builder.js'
import getTilesLine from './getTilesLine.js'

const setImageCanvas = (image) => {
  const canvas = document.querySelector('#imgCanvas');
  const ctx = canvas.getContext('2d');

  canvas.width = image.width
  canvas.height = image.height
  ctx.drawImage(image, 0, 0)
}

const loadFile = (e) => {
  const img = new Image();

  img.onload = e => setImageCanvas(e.target)
  img.src = e.target.result;
}

const upload = (e) => {
  const reader = new FileReader();
  const file = event.target.files[0];

  reader.onload = loadFile
  reader.readAsDataURL(file);
}

const addMosaicLines = (source, destination, row) => {
  const context = destination.getContext('2d')
  const rows = (source.height / TILE_HEIGHT) - 1
  const tile = getTilesLine(source, row)
  const svg = builder.buildSVG({'width': source.width, 'height': TILE_HEIGHT})
  const columns = (source.width / tile.width) - 1
  const multiplicator = 0
  const speed = TILE_HEIGHT >= 16 ? 2000 : TILE_HEIGHT >= 8 ? 8000 : 90000

  if (window.Worker) {
    const worker = new Worker('js/worker/worker.js')

    worker.addEventListener('message', e => {
      builder.buildEllipses(e.data, tile, multiplicator)
        .map(ellipse => svg.appendChild(ellipse))

      context.drawImage(builder.buildImage(svg), 0, row * TILE_HEIGHT)
      worker.terminate()
    }, false)

    worker.postMessage({'cmd': 'getRawEllipses', 'tile': tile, 'columns': columns});

    if(row < rows) {
      setTimeout(
      addMosaicLines(source, destination, row + 1), speed)
    }
  }
}

const createMosaic = () => {
  const canvas = document.querySelector('#imgCanvas')
  const mosaic = document.querySelector('#mosaicCanvas')

  mosaic.width = canvas.width
  mosaic.height = canvas.height

  addMosaicLines(canvas, mosaic, 0)
}

const main = () => {
  document.querySelector('#files').onchange = upload
  document.querySelector('#createMosaic').onclick = createMosaic
}

main()
