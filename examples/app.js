
import SongDisplay from '../src/'
import FullScreenCanvas from '../src/full-screen-canvas'

const songCanvas = new FullScreenCanvas()
const songDisplay = new SongDisplay()
const render = () => {
  songDisplay.render({
    ctx: songCanvas.canvas.getContext('2d'),
    width: songCanvas.canvas.width,
    height: songCanvas.canvas.height
  })
}

songCanvas.addEventListener('resize', render)
render()
