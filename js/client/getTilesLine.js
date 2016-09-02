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

const getColor = data =>  '#'.concat(
                            getAverageRGB(data)
                            .split(',')
                            .map(color => color.length === 1
                                          ? '0'.concat(color)
                                          : parseInt(color).toString(16)
                            )
                            .join('')
                          )

const getColors = (canvas, row) => {
  const ctx = canvas.getContext('2d');
  const columns = Math.floor(canvas.width / TILE_WIDTH)

  return  Array
            .from(Array(columns).keys())
            .map(column => getColor(ctx.getImageData(column * TILE_WIDTH, row * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT)))
            .reverse()
  
}

const getTilesLine = (canvas, row) => {
  return  { 'width': TILE_WIDTH
          , 'height': TILE_HEIGHT
          , 'colors': getColors(canvas, row)
          }
}

export default getTilesLine
