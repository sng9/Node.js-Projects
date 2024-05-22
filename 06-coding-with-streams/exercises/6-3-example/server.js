import { createServer } from 'net'
import { createWriteStream } from 'fs'
import { randomBytes, createDecipheriv, scryptSync } from 'crypto'

const password = "mypassword"
const key = scryptSync(password, "salt", 24)

function demultiplexChannel (source) {
    let currentChannel = null
    let currentLength = null
    let destinations = []

    source
        .on('readable', () => {
            let chunk
            
            if (currentChannel === null) {
                chunk = source.read(1)
                currentChannel = chunk && chunk.readUInt8(0)
            }

            if (currentLength === null) {
                chunk = source.read(4)
                currentLength = chunk && chunk.readUInt32BE(0)
                if (currentLength === null) {
                    return null
                }

                if (!destinations[currentChannel]){
                    destinations[currentChannel] = createWriteStream(`received_file${currentChannel}`)
                }

            }
            const iv = source.read(16)
            chunk = source.read(currentLength)
            if (chunk === null) {
                return null
            }

            console.log(`Received packet from: ${currentChannel}`)
            console.log('currentChannel: ', currentChannel)
            const decipher = createDecipheriv('aes192', key, iv)
            chunk = Buffer.concat([decipher.update(chunk), decipher.final()]);
            destinations[currentChannel].write(chunk)
            currentChannel = null
            currentLength = null
        })
        .on('end', () => {
            destinations.forEach(destination => destination.end())
            console.log('Source channel closed')
        })
}

const server = createServer((socket) => {
    demultiplexChannel(socket)
})

server.listen(3000, () => console.log('Server started'))