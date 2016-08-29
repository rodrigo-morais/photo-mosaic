const buildCanvas = (width, height) => {
  const canvas = document.createElement('canvas')

  canvas.width = width
  canvas.height = height

  return canvas
}

const setImageCanvas = (imageData) => {
  const img = new Image()
  img.setAttribute('src', imageData)

  const canvas = buildCanvas(img.width, img.height)
  const ctx = canvas.getContext('2d');

  ctx.drawImage(img, 0, 0, TILE_WIDTH, TILE_HEIGHT, 0, 0, TILE_WIDTH, TILE_HEIGHT)

  return ctx.getImageData(0, 0, TILE_WIDTH, TILE_HEIGHT)
}

const getColor = data =>  '#'.concat(
                            getAverageRGB(data)
                            .split(',')
                            .map(color => color.length === 1
                                          ? '0'.concat(color)
                                          : parseInt(color).toString(16)
                            )
                            .join('')
                          )

const getAverageRGB = (data) => {
  const blockSize = 5 * 4
  const length = data.data.length
  const rgbs = Math.floor(length / blockSize)
  const initial = blockSize - 4

  let rgb = {'red':0,'green':0,'blue':0}
  let counter = -4

  while((counter = counter + blockSize) < length) {
        rgb.red += data.data[counter]
        rgb.green += data.data[counter + 1]
        rgb.blue += data.data[counter + 2]
    }

    rgb.red = ~~(rgb.red/rgbs)
    rgb.green = ~~(rgb.green/rgbs)
    rgb.blue = ~~(rgb.blue/rgbs)

    return ''.concat(rgb.red).concat(',')
              .concat(rgb.green).concat(',')
              .concat(rgb.blue)
}

const getTiles = (img, column, row) => {
  const piecesAmount = img.width / TILE_WIDTH
  const canvas = buildCanvas(TILE_WIDTH, TILE_HEIGHT)
  const context = canvas.getContext('2d')

  context.drawImage(  img, column * TILE_WIDTH
                    , row * TILE_HEIGHT
                    , TILE_WIDTH
                    , TILE_HEIGHT
                    , 0
                    , 0
                    , canvas.width
                    , canvas.height
  )

  if(column === piecesAmount) {
    return [canvas.toDataURL()]
  }
  else {
    return [...getTiles(img, column + 1, row), canvas.toDataURL()]
  }
}

const getTilesLine = (canvas, row) => {
  const img = new Image()
  img.setAttribute('src', canvas.toDataURL())

  return  { 'width': TILE_WIDTH
          , 'height': TILE_HEIGHT
          , 'colors': getTiles(img, 1, row)
                      .map(tile => setImageCanvas(tile))
                      .map(imageData => getColor(imageData))

          }
}

export default getTilesLine