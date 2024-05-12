export class TaskQueuePC {
    constructor (concurrency) {
      this.taskQueue = []
      this.consumerQueue = []
  
      // spawn consumers
      for (let i = 0; i < concurrency; i++) {
        this.consumerP()
      }
    }
  
    consumerP () {
        const _this = this
        return new Promise ((resolve, reject) => {
            (function internalLoop () {
                _this.getNextTask()
                    .then((currTask) => {
                        currTask()
                        internalLoop()
                    })
                    .catch(e => reject(e))    
            })()
        })
    }
  
    // getNextTask() returns the task popped from task queue in Promise
    // if task queue is empty meaning no more tasks are there it will store the 
    // resolve callback in consumerQueue. Which means the consumer (which is an async method) 
    // is put to sleep and will be awake once the Promise is returned or resolved
    getNextTask () {
      return new Promise((resolve) => {
        if (this.taskQueue.length !== 0) {
          return resolve(this.taskQueue.shift())
        }
  
        this.consumerQueue.push(resolve) //dummy promise,to keep the consumer asleep.
      })
    }
  
    // runTask() it takes task as an argument , runs it and returns the Promise to consumer
    // which was waiting for the resolve callback. The consumer is awake now and executes the
    // next task in the queue. 
    // if there are no waiting consumer, perhaps all the consumers are busy; it adds the task to task queue.
    runTask (task) {
      return new Promise((resolve, reject) => {
        const taskWrapper = () => {
          const taskPromise = task()
          taskPromise.then(resolve, reject)
          return taskPromise
        }
  
        if (this.consumerQueue.length !== 0) {
          // there is a sleeping consumer available, use it to run our task
          const consumerP = this.consumerQueue.shift()
          consumerP(taskWrapper)
        } else {
          // all consumers are busy, enqueue the task
          this.taskQueue.push(taskWrapper)
        }
      })
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
    await delay(3000, 'c')
    return Promise.reject(new Error('Some error occurred while resolving task C'))
}

const taskQueuePC = new TaskQueuePC(2)
taskQueuePC.runTask(taskA).then(data => console.log(data))
taskQueuePC.runTask(taskB).then(data => console.log(data))
taskQueuePC.runTask(taskC).then(data => console.log(data)).catch(e => console.error(e))