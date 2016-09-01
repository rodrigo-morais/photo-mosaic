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

const getTilesLines = (source, rows, row) => {
  if(row < rows) {
    return  [  getTilesLine(source, row)
            , ...getTilesLines(source, rows, row + 1)
            ]
  }
  else {
    return [getTilesLine(source, row)]
  }
}

const addMosaicLines = (source, destination) => {
  const context = destination.getContext('2d')
  const rows = (source.height / TILE_HEIGHT) - 1
  const tiles = getTilesLines(source, rows, 0)
  const svg = builder.buildSVG({'width': source.width, 'height': TILE_HEIGHT})
  const columns = (source.width / tiles[0].width) - 1
  const multiplicator = 0

  if (window.Worker) {
    const worker = new Worker('js/worker/worker.js')

    worker.addEventListener('message', e => {
      builder.buildEllipses(e.data.svgs, e.data.tile, multiplicator)
        .map(ellipse => svg.appendChild(ellipse))

      context.drawImage(builder.buildImage(svg), 0, e.data.row * TILE_HEIGHT)
    }, false)

    worker.postMessage({'cmd': 'getRawEllipses', 'rows': rows, 'tiles': tiles, 'columns': columns});
  }
}

const createMosaic = () => {
  const canvas = document.querySelector('#imgCanvas')
  const mosaic = document.querySelector('#mosaicCanvas')

  mosaic.width = canvas.width
  mosaic.height = canvas.height

  addMosaicLines(canvas, mosaic)
}

const main = () => {
  document.querySelector('#files').onchange = upload
  document.querySelector('#createMosaic').onclick = createMosaic
}

main()
