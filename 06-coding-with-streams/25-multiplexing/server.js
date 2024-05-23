import { randomBytes } from 'crypto'
import { createWriteStream } from 'fs'
import { createServer } from 'net'


const iv = randomBytes(16)
const secret = randomBytes(24)
console.log(`IV generated: ${iv.toString('hex')}`)
console.log(`generated secret: ${secret.toString('hex')}`)

function demultiplexChannel (source, destinations) {
  let currentChannel = null
  let currentLength = null

  source
    .on('readable', () => { // ①
      let chunk
      if (currentChannel === null) { // ②
        chunk = source.read(1)
        currentChannel = chunk && chunk.readUInt8(0)
      }

      if (currentLength === null) { // ③
        chunk = source.read(4)
        currentLength = chunk && chunk.readUInt32BE(0)
        if (currentLength === null) {
          return null
        }
      }

      chunk = source.read(currentLength) // ④
      if (chunk === null) {
        return null
      }

      console.log(`Received packet from: ${currentChannel}`)
      destinations[currentChannel].write(chunk) // ⑤
      currentChannel = null
      currentLength = null
    })
    .on('end', () => { // ⑥
      destinations.forEach(destination => destination.end())
      console.log('Source channel closed')
    })
}

const server = createServer((socket) => {
  const stdoutStream = createWriteStream('stdout.log')
  const stderrStream = createWriteStream('stderr.log')
  demultiplexChannel(socket, [stdoutStream, stderrStream])
})
server.listen(3000, () => console.log('Server started'))
