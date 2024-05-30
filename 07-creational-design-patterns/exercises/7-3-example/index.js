// A tamper free Queue
// create a queue class: has one publicly accessible method dequeue(): Such a method returns a Promise
// that resolves with a new element extracted from an internal queue data structure
// if the queue is empty, then the promise is resolved when new item is added
// The Queue class must also have a revealing constructor that provides a function called enqueue() to the executor
// that pushes a new element to the end of the internal queue.
// The enqueue() function can be invoked asynchronously and it must also take care of unblocking any eventual Promises
// returned by dequeue method   

// to check whether a promise is blocked or not, keep the running variable, inside dequeue inc
// this variable and when its done decreement it
// if the value is not zero unblock the promise

class Queue {


    constructor(executor) {
        // The Queue class must also have a revealing constructor that provides a 
        // function called enqueue() to the executor
        // that pushes a new element to the end of the internal queue.
        // The enqueue() function can be invoked asynchronously and it must also take care of 
        // unblocking any eventual Promises returned by dequeue method 

        this.queue = []
        this.unresolvedPromises = []

        const enqueue = (element) => {
            this.queue.push(element)

            if(this.unresolvedPromises.length > 0) {
                const resolvedPromise = this.unresolvedPromises.shift()
                return resolvedPromise(this.queue.shift())
            }
        }

        executor(enqueue)

    }

    dequeue() {
        //Such a method returns a Promise
        // that resolves with a new element extracted from an internal queue data structure
        // if the queue is empty, then the promise is resolved when new item is added

        return new Promise((resolve, reject) => {
            try {
                if (this.queue.length > 0) {
                    // FIFO
                    resolve(this.queue.shift())
                } else {
                    this.unresolvedPromises.push(resolve)
                }
            } catch(e) {
                reject(e)
            }   
        })
    }

}

async function run() {
    const queue = new Queue((enqueue) => {
        enqueue(1)
        enqueue(2)
    
        setTimeout(() => {
            enqueue(4)
        }, 5000)
        setTimeout(() => {
            enqueue(3)
        }, 2000)
    })
    
    
    for (let i=0; i<6; i++) {
        const ele = await queue.dequeue()
        console.log('dequeued element: ',ele)
    }
}

run()


