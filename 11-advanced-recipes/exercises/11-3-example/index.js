//Extend the CreateAsyncCancellable() function so that its possible to 
// invoke other cancellable functions from within the main cancellable function
// canceling the main operation should also cancel all the nested operations
// Hint: Allow to yield the result of an asyncCancelable() from within the 
// generator function 

// 1. generator function
// 2. async function

export class CancelError extends Error {
    constructor() {
        super('Cancelled')
    }
}

export function createAsyncCancelable (generatorFunction) {
    return function asyncCancelable (...args) {
        const generatorObject = generatorFunction(...args)
        let cancelRequested = false

        function cancel () {
            console.log(`Initial: ${cancelRequested}`)
            cancelRequested = true
        }

        const promise = new Promise((resolve, reject) => {
            async function nextStep (prevResult) {
                if (cancelRequested) {
                    return reject(new CancelError())
                }
    
                if (prevResult.done) {
                    return resolve(prevResult.value)
                }

                try {
                    nextStep(generatorObject.next(await prevResult.value))
                } catch (err) {
                    try {
                        nextStep(generatorObject.throw(err))
                    } catch (err2) {
                        reject(err2)
                    }
                }
            }

            nextStep({})
           
        })

        return { promise, cancel}

    }
}

// defining async function
function asyncRoutine(label) {
    return new Promise ((resolve) => {
        console.log(`Async function ${label} started`)
        setTimeout(() => {
            resolve(`Async function ${label} result`)
        },500)
    })
}


const cancelableNested = createAsyncCancelable(function * () {
    const resD = yield asyncRoutine('D') 
    console.log(resD)
    const resE = yield asyncRoutine('E')
    console.log(resE)
    const resF = yield asyncRoutine('F')
    console.log(resF) 
})

const cancelable = createAsyncCancelable(function * () {
    const { promise, cancel } = cancelableNested()
    setTimeout(()=> {
        console.log('cancelableNested()')
        cancel() 
    }, 1000)
    try {
        let res = yield promise
        console.log(`res ${res}`)
    } catch (err) {
        console.error(`Error from nested function, program should continue`)
    }
  
    const resA = yield asyncRoutine('A') 
    console.log(resA)
    const resB = yield asyncRoutine('B')
    console.log(resB)
    const resC = yield asyncRoutine('C')
    console.log(resC)
})

const  { promise, cancel } = cancelable()

promise.catch(err => {
    if(err instanceof CancelError) {
        console.log('Error from main(), All Nested Function should be cancelled')
    } else {
        console.error(err)
    }
})

setTimeout(() => {
    console.log('cancelable()')
    cancel()
}, 1000)