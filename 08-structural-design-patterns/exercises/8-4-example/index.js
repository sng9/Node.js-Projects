import {resolve} from 'path'

class Cache {
    constructor() {
        this.cache = new Map()
    }

    get(key, options, callback) { 
        try {
            const val = this.cache.get(key)
            if(!val) {
                const err = new Error(`ENOENT, open "${key}"`)
                err.code = 'ENOENT'
                err.errno = 34
                err.path = key
                throw err
            }
            return callback(null, val)
        } catch (e) {
           callback(e)
        }
       
    }

    putEntry(key, value, callback) {
        this.cache.set(key, value)
        return callback()
    }
        
}

// FS adapter

function createFSAdapter(cache) {
    return ({
        readFile (filename, options, callback) {
            if (typeof options === 'function') {
                callback = options
                options = {}
            } else if (typeof options === 'string') {
                options = { encoding: options }
            }

            cache.get(resolve(filename), options, 
            (err, value) => {
                if (err) {
                    return callback && callback(err)
                }
                callback && callback(null, value)

            })
        },
        writeFile (filename, contents, options , callback) {
            if (typeof options === 'function') {
                callback = options
                options = {}
            } else if (typeof options === 'string') {
                options = { encoding: options }
            }

            cache.putEntry(resolve(filename), contents, (err, val) => {
                if (err) return callback && callback(err)

                return callback(null, val)
            }) 
        } 
    })
}

const cache = new Cache()
const fs = createFSAdapter(cache)
fs.writeFile('sample.txt', 'hi, how are you!', () => {
    fs.readFile('sample.txt', { encoding: 'utf8'}, (err, res) => {
        if (err) return console.error(err)

        console.log(res)
    })
})

// try to read a missing file
fs.readFile('missing.txt', { encoding: 'utf8'}, (err, res) => {
   console.error(err)
      
})