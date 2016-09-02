const getEllipse = color => {
  const newColor = color.split('#')[1]
  const url =  'http://localhost:8765/color/' + (newColor.length === 6 ? newColor : '000000')

  return url
}

const getEllipses = (tile, column) => {
  const color = tile.colors[column]

  if(column > 0) {
    return  [ getEllipse(color)
            , ...getEllipses(tile, column - 1)
            ]
  }
  else {
    return [getEllipse(color, tile)]
  }
}

const joinEllipses = (tile, columns) => {

  const options = { method: 'GET'
                  , headers: new Headers({'Content-Type': 'image/svg+xml'})
                  , mode: 'cors'
                  , cache: 'default'
                  }

  return Promise.all(getEllipses(tile, columns)
                .map(url => fetch(url, options)
                              .then(response => response.text())
                              .then(data => data)
                )
  )
}

const buildEllipsesLines = (row, columns, tile) => {
    joinEllipses(tile, columns)
      .then(svgs => getRawEllipses( { 'svgs': svgs
                                    , 'tile': tile
                                    , 'row': row
                                    }
                    )
      )
}
