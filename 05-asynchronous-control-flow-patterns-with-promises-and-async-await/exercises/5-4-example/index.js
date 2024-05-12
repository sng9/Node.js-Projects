export class TaskQueueNew {
    constructor (concurrency) {
        this.consumerQueue = []
        this.taskQueue = []

        for (let i=0; i<concurrency; i++) {
            this.consumer()
        }
    }

    consumer () {
        const _this = this
        return new Promise ((resolve, reject) => {
            (function internalLoop () {
                _this.getNewTask()
                    .then((currTask) => {
                        currTask()
                        internalLoop()
                    })
                    .catch (e => reject(e))
            })()
        })
    }

    getNewTask () {
        return new Promise ((resolve, reject) => {
            if (this.taskQueue.length !== 0) {
                return resolve(this.taskQueue.shift())
            }
            this.consumerQueue.push(resolve)
        })
    }

    runTask (task) {
        return new Promise ((resolve, reject) => {
            const taskWrapper = () => {
                const taskPromise = task()
                taskPromise.then(resolve, reject)
                return taskPromise
            }

            if (this.consumerQueue.length !== 0) {
                const consumerResolve = this.consumerQueue.shift()
                consumerResolve(taskWrapper)
            } else {
                this.taskQueue.push(taskWrapper)
            }
        })
    }

}

function mapAsync(array, concurrency) {
    const taskQ = new TaskQueueNew(concurrency) 
    const promiseArray = []
    return new Promise(async (resolve, reject) => {
        try{
            let promise;
            // sequential asynchronous execution
            for (const element of array) {
                promise = await taskQ.runTask(element)
                promiseArray.push(promise)    
            }

        } catch (e) {
            return reject(e)
        }
        
        resolve(promiseArray)
    
    })
    
    
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
    await delay(3000, 'c')
    return Promise.reject(new Error('Some error occurred while resolving task C'))
}

 mapAsync([taskA,taskB, taskC], 2)
    .then(data => console.log(data))
    .catch(e => console.error(e))

