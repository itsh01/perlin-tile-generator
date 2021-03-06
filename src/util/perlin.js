
import RNG from './RNG'

const MAX_HEX = 2 ** 8 - 1
const lerp = (v0, v1, t) => (1 - t) * v0 + t * v1
const indentity = x => x
const invert = x => MAX_HEX - x
const withinLimits = (x, min, max) => Math.max(min, Math.min(max, x))
const amplitude = (x, amp) => 0.5 + ((x - 0.5) * amp)
const toHex = (x, f = indentity) => f(Math.floor(x * MAX_HEX)).toString(16).padStart(2, 0)

const generateCanvas = (width, height) => {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    return {canvas, ctx: canvas.getContext('2d')}
}

const generate2dGradient = (width, height, rng) => Array
  .from(new Array(width + 2))
  .map(() => Array
       .from(new Array(height + 2))
       .map(() => [rng.nextFloat() * 2 - 1, rng.nextFloat() * 2 - 1]))

const perlin = (width, height, seed, octaves, layers, amp, isInvert) => {
    const partLength = width / octaves
    const rng = new RNG(seed)
    const [gradWidth, gradHeight] = [parseInt(width / partLength, 10), parseInt(height / partLength, 10)]
    const grad2d = generate2dGradient(gradWidth, gradHeight, rng)
    const {canvas, ctx} = generateCanvas(width, height)

    const dotGrad = (ix, iy, x, y) => {
        const [dx, dy] = [x - ix, y - iy]
        const [gx, gy] = [ix % gradWidth, iy % gradHeight]
        return (dx*grad2d[gx][gy][0] + dy*grad2d[gx][gy][1])
    }

    const perlinPoint = (x, y) => {
        const [x0, y0] = [Math.floor(x), Math.floor(y)]
        const [x1, y1] = [x0 + 1, y0 + 1]
        const [dx, dy] = [x - x0, y - y0]
        const [sx, sy] = [dx**2 * (3.0 - 2.0 * dx), dy**2 * (3.0 - 2.0 * dy)]

        const ix0 = lerp(dotGrad(x0, y0, x, y), dotGrad(x1, y0, x, y), sx)
        const ix1 = lerp(dotGrad(x0, y1, x, y), dotGrad(x1, y1, x, y), sx)

        return (1 + lerp(ix0, ix1, sy)) / 2
    }

    const layeredPerlinPoint = (x, y) => {
        return Array
            .from(new Array(layers))
            .map((v, i) => {
                const n = 2 ** i
                const norm = i > 0 ? 0.5 : 0
                return (perlinPoint(x / partLength * n, y / partLength * n) - norm) / n
            })
            .reduce((a, b) => a + b, 0)
    }

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const v = withinLimits(amplitude(layeredPerlinPoint(x, y), amp), 0, 1)
        const h = toHex(v, isInvert ? invert : indentity)
        ctx.fillStyle = `#${h}${h}${h}`
        ctx.fillRect(x, y, 1, 1)
      }
    }

    return canvas.toDataURL()
}

export default perlin
