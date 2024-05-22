import { createReadStream } from 'fs'
import { connect } from 'net'
import { createCipheriv, randomBytes, scryptSync } from 'crypto'



// client.js takes multiple files as streams it to server over tcp
// Send file over a network
// Use mux/demux
const password = "mypassword"
const key = scryptSync(password, "salt", 24)
// const secret = Buffer.from(process.argv[2], 'hex')
// const iv = Buffer.from(process.argv[3], 'hex')
const iv = randomBytes(16)

function multiplexChannels(sources, destination) {
    console.log('length', sources.length)
    let openChannels = sources.length
    for (let i=0; i < sources.length; i++){
        sources[i]
            .on('readable', function () {
                let chunk
                while ((chunk = this.read()) !== null) {
                     // encrypt the data
                    // u need password , create a key, need IV, createCipher iv on the 
                    const cipher = createCipheriv('aes192', key, iv)
                    chunk = cipher.update(chunk)
                    chunk = Buffer.concat([chunk, cipher.final()])
                    const outBuff = Buffer.alloc( 1 + 4 + 16 + chunk.length)
                    outBuff.writeUInt8(i, 0)
                    outBuff.writeUInt32BE(chunk.length, 1)
                    iv.copy(outBuff,5)
                    chunk.copy(outBuff, 21)
                    console.log(`Sending packet to channel: ${i}`)
                   
                    destination.write(outBuff)
                }
            })
            .on('end', () => {
                if (--openChannels === 0) {
                    destination.end()
                }
            })
    } 
}

const socket = connect(3000, () => {
    const readStream = []
    const files = process.argv.slice(2)
    console.log('files ', files)
    for (let i = 0; i < files.length; i++) {
        readStream.push(createReadStream(files[i]))
    }
    multiplexChannels(readStream, socket)
})


