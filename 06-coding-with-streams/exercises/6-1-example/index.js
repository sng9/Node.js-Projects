import { createGzip, createBrotliCompress, createDeflate } from 'zlib'
import { createReadStream, createWriteStream } from 'fs'
import { PassThrough, Transform, pipeline } from 'stream'



//createGzip()

// 1. timetakento zip
// 2. size of the zipped file

const filename = process.argv[2]
const outputStream = createWriteStream('./output.txt')

function compressAndCalculate(algorithmName, algorithm) {
    const placeholder = new PassThrough()
    let size = 0
    let totalTime = 0

    return new Promise((resolve, reject) => {
        const startTime = new Date().getTime()
        pipeline(
            createReadStream(filename),
            algorithm(),
            new Transform({
                objectMode: true,
                transform(chunk, encoding, callback) {
                    size += chunk.length
                    console.log(`${filename}.gz size: ${size}` )
                    callback()
                }
            }),
            (err) => {
                if(err) {
                    reject()
                }
                
                totalTime = new Date().getTime() - startTime
                outputStream.write(`Algorithm: ${algorithmName}, time taken: ${totalTime} ms, size: ${size} bytes\n`)
                resolve()
            }
        )
    })

}

const algorithms = {
    gzip: createGzip,
    BrotliCompress: createBrotliCompress,
    Deflate: createDeflate
}

    
const runAlgorithms = async () => {
    for (const key in algorithms){
        await compressAndCalculate(key, algorithms[key])
    }
    outputStream.end()
}

runAlgorithms()