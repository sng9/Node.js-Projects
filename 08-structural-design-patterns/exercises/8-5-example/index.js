
const createLazyBuffer = (size) => {
    let actualBuffer = null
    return new Proxy(Buffer,{
        get: (target, prop) => {
            if (actualBuffer)
                return actualBuffer[prop].bind(actualBuffer)
            
            if (prop !== 'write') {
                return () => {
                    throw new Error(` ${prop} method cannot be called. Please first write to the buffer`)
                }
            }   
            actualBuffer = Buffer.allocUnsafe(size)
            return (data) => {
                actualBuffer.write(data)
            }
        }
    })
}

const lazyBuffer = createLazyBuffer(20)

try {
    console.log('Log buffer: ', lazyBuffer.toString())
} catch (e) {
    console.log(e)
}

lazyBuffer.write('Hello Nodejs!') 

console.log('Log buffer: ', lazyBuffer.toString())

