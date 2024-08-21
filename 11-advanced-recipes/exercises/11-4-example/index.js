import http from 'http'
import { join } from 'path'
import { ThreadPool } from './ThreadPool.js'


// const workerFile = join(__dirname, 'workerThread.js')

const workers = new ThreadPool('./workerThread.js', 2)


http.createServer(async (req, res) => {
    if(req.method === 'POST'){
        const chunks = []
        req.on('data', (data) => {
            console.log("req", data)
            chunks.push(data)
        })
        const data = Buffer.concat(chunks)
        const obj = JSON.parse(data)
        console.log(obj)
        // const obj = {
        //     "input": "((a,b) => {return a + b })(a,b)",
        //     "args": "1, 2"
        // }

        const worker = await workers.acquire()
        worker.postMessage({inputFunc: obj.input, args: obj.args})

        worker.on('message',({ data }) => {
            workers.release(worker)
            res.end(data.toString())
        })

    }
})
.listen(8000, () => console.log('Server started on port 8000'))


// use the following to test:
/* 
curl --location --request POST 'localhost:8000' \
--header 'Content-Type: application/json' \
--data-raw '{
    "input": "((a, b) => { return a + b })(a, b)",
    "args": "1, 2"
}'
  */