// AsyncQueue class -> which has runTask(), next() -> check concurrency here

// enqueue() to append new otem sto queue
// then expose an @@asyncIterable method -> concurrency is 1
// return done: true when no elements in the queue
// make queue static in nature

export class AsyncQueue {
    constructor() {
        this.queue = []
    }

    enqueue(task) {
        this.queue.push(async () => {
            try {
                let curr = await task()
                return {
                    done: false,
                    value: curr,
                }
            } catch (err) {
                return {
                    done : false,
                    error: err.message
                }
            }
        })
    }

    [Symbol.asyncIterator] () {
        const tasksIterator = this.queue[Symbol.iterator]()

        return {
            async next () {
                
                try {
                    const iteratorResult = tasksIterator.next()
                    
                    if (iteratorResult.done){
                        return {
                            done: true
                        }
                    }

                    const task = iteratorResult.value
                    const result = await task()

                    return {
                        done: false,
                        value: result, 
                    }

                } catch (err){
                    return {
                        done: false,
                        error: err.message
                    }
                } 
            }
        }
    }

}

function delay(ms, task) {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(task), ms)
    })
}

const taskA = async () => {
    console.log('Starting task A')
    return await delay(1000, 'A')
} 

const taskB = async () => {
    console.log('Starting task B')
    return await delay(2000, 'B')
} 

const asyncQ = new AsyncQueue(1)

asyncQ.enqueue(taskA)
asyncQ.enqueue(taskB)

for await (const value of asyncQ) {
    console.log(value)
}