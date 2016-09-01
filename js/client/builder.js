const buildSVG = (size) => {
  let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
  svg.setAttribute("width", size.width)
  svg.setAttribute("height", size.height)

  return svg
}

const getEllipse = color => {
  const newColor = color.split('#')[1]
  const url =  'http://localhost:8765/color/' + (newColor.length === 6 ? newColor : '000000')

  return url
}

const buildEllipse = (ellipse, tile, multiplicator) => {
  const newEllipse = ellipse.cloneNode(true)

  newEllipse.setAttribute('cx', (((tile.width / 2) * multiplicator) + tile.width))
  newEllipse.setAttribute('cy', tile.height / 2)
  newEllipse.setAttribute('rx', tile.width / 2)
  newEllipse.setAttribute('ry', tile.height / 2)

  return newEllipse
}

const buildImage = (svg) => {
  const xml = new XMLSerializer().serializeToString(svg)
  const svg64 = btoa(xml)
  const b64Start = 'data:image/svg+xml;base64,'
  const image64 = b64Start + svg64
  const img = new Image()

  img.src = image64

  return img
}

const getEllipses = (tile, column) => {
  const color = tile.colors[column]

  if(column > 0) {
    return  [...getEllipses(tile, column - 1)
            , getEllipse(color)
            ]
  }
  else {
    return [getEllipse(color, tile)]
  }
}

const buildEllipses = (rawEllipses, tile, multiplicator) =>  rawEllipses
                                          .map(element => (new DOMParser()).parseFromString(element, "text/xml").querySelector('ellipse'))
                                          .map((ellipse, index) => buildEllipse(ellipse, tile, multiplicator + ((index + 1) * 2)))


export { buildEllipses, buildSVG, buildImage }
