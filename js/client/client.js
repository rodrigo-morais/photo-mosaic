import * as builder from './builder.js'
import getTilesLine from './getTilesLine.js'

const setImageCanvas = (image) => {
  const canvas = document.querySelector('#imgCanvas')
  const ctx = canvas.getContext('2d');

  canvas.style.display = 'block'
  canvas.width = image.width
  canvas.height = image.height
  ctx.drawImage(image, 0, 0)
}

const loadFile = (e) => {
  const img = new Image();

  img.onload = e => setImageCanvas(e.target)
  img.src = e.target.result;

  document.querySelector('#createMosaic').onclick = createMosaic
}

const upload = (e) => {
  const reader = new FileReader();
  const file = event.target.files[0];

  reader.onload = loadFile
  reader.readAsDataURL(file);
}

const addMosaicLines = (source, destination) => {
  const context = destination.getContext('2d')
  const rows = (source.height / TILE_HEIGHT) - 1
  const svg = builder.buildSVG({'width': source.width, 'height': TILE_HEIGHT})
  const multiplicator = 0

  if (window.Worker) {
    const worker = new Worker('js/worker/worker.js')

    worker.addEventListener('message', e => {
      builder
        .buildEllipses(e.data.svgs, e.data.tile, multiplicator)
          .map(ellipse => svg.appendChild(ellipse))

      context.drawImage(builder.buildImage(svg), 0, e.data.row * TILE_HEIGHT)
    }, false)

    Array.from(Array(rows).keys()).map((row, index) => {
      const tile = getTilesLine(source, row)
      const columns = (source.width / tile.width) - 1

      setTimeout(() =>
        worker.postMessage({'cmd': 'getRawEllipses', 'row': row, 'tile': tile, 'columns': columns})
      , (index * ((16 / TILE_WIDTH) * 100))
      )
    })
  }
}

const createMosaic = () => {
  const canvas = document.querySelector('#imgCanvas')
  const mosaic = document.querySelector('#mosaicCanvas')

  document.querySelector('#createMosaic').onclick = null

  mosaic.width = canvas.width
  mosaic.height = canvas.height

  canvas.style.display = 'none'

  addMosaicLines(canvas, mosaic)
}

const main = () => {
  document.querySelector('#loadImage').onclick = () => document.querySelector('#files').click()
  document.querySelector('#files').onchange = upload
}

main()
