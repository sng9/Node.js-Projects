import { EventEmitter } from 'events'

// a function that accepts a "number" abd a callback .. funct1(int, cb)
// returnn an event emitter
// .emit("tick") .. it emit s an event evry 50 ms until "number of milliseconds have passed"
// once the number of milliseconds have passed -> function  calls a callback with the result as the count of the tick events 

function recurse(number, event, count, callback){
    // base condition this return 
    if (number <= 0){
        return callback(null, count)
    }
    setTimeout((err) => {
        if (err) {
            return console.log(`error: ${err}`)
        }
        event.emit('ticker')
        recurse(number - 50, event, count + 1, callback)

    }, 50)

}

function tickerEvent (number) {
    const event = new EventEmitter()
    
    recurse(number, event, 0, (err, count) => {
        if(err)
            return console.log(`error: ${err}`)
        else
            console.log(`ticker count: ${count}`)
        
    })

    return event

}

tickerEvent(450)
.on('ticker', () => console.log(`listner for ticker event`))