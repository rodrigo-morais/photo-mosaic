const buildSVG = (size) => {
  let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
  svg.setAttribute("width", size.width)
  svg.setAttribute("height", size.height)

  return svg
}

const buildEllipse = (color, tile, multiplicator) => {
  const ellipse = document
                  .createElementNS("http://www.w3.org/2000/svg", 'ellipse');

  ellipse.setAttribute('cx', (((tile.width / 2) * multiplicator) + tile.width))
  ellipse.setAttribute('cy', tile.height / 2)
  ellipse.setAttribute('fill', color)
  ellipse.setAttribute('rx', tile.width / 2)
  ellipse.setAttribute('ry', tile.height / 2)

  return ellipse
}

const convertSVGtoIMG = (svg) => {
  const xml = new XMLSerializer().serializeToString(svg)
  const svg64 = btoa(xml)
  const b64Start = 'data:image/svg+xml;base64,'
  const image64 = b64Start + svg64
  const img = new Image()

  img.src = image64

  return img
}

const buildEllipses = (tile, column, multiplicator) => {
  const color = tile.colors[column]

  if(column > 0) {
    return  [...buildEllipses(tile, column - 1, multiplicator + 2)
            , buildEllipse(color, tile, multiplicator)
            ]
  }
  else {
    return buildEllipse(color, tile, multiplicator)
  }
}

const buildImageLine = (row, tile) => {
  const svg = buildSVG(row)
  const columns = (row.width / tile.width) - 1

  buildEllipses(tile, columns, 0).forEach(ellipse => {
    svg.appendChild(ellipse)
  })

  return convertSVGtoIMG(svg)
}

export default buildImageLine
