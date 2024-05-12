// Task Queue to async/await
export class TaskQueue {
    constructor (concurrency) {
        this.concurrency = concurrency
        this.running = 0
        this.queue = []
    }

    runTask (task) {

        return new Promise((resolve, reject) => {
            this.queue.push(async () => {
                try {
                    let curr =  await task()
                    return resolve(curr)

                } catch(e) {
                    return reject(e)
                }
                
            }) 
            this.next()
        })
    }

    next() {
        
        while(this.running < this.concurrency && this.queue.length) {
            try {
                const promise = this.queue.shift()
                promise()

            } finally {
                this.running--
                this.next()
            }
            this.running++
        }
    }
    
}

function delay(ms, task) {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(task), ms)
    })
}

const taskA = async () => {
    console.log('starting task A')
    return await delay(1000, 'a')
}

const taskB = async () => {
    console.log('starting task B')
    return await delay(2000, 'b')
}

const taskC = async () => {
    console.log('starting task C')
    return await delay(3000, 'c')
}

const taskQueue = new TaskQueue(2)
taskQueue.runTask(taskA).then(data => console.log(data))
taskQueue.runTask(taskB).then(data => console.log(data))
taskQueue.runTask(taskC).then(data => console.log(data))