import { EventEmitter } from 'events'
import { nextTick } from 'process'
class TickerEventEmitter extends EventEmitter {
    constructor() {
        super()
    }    

recurse(number, count, callback){
    // base condition this return 
    if (number <= 0){
        return callback(null, count)
    }
    // guaranteeing asynchronicity with deferred execution
    nextTick(() => this.emit('ticker on invocation'))
    
    setTimeout((err) => {
        if (err) {
           return console.log(`error: ${err}`)
        }
        this.emit('ticker')
        this.recurse(number - 50, count + 1, callback)

    }, 50)

}

tickerEvent (number) {
    this.recurse(number, 0, (err, count) => {
        if(err)
            return console.log(`error: ${err}`)
        else
            console.log(`ticker count: ${count}`)
        
    })

    return this

}

}

const tickerEmitter = new TickerEventEmitter()

tickerEmitter
.tickerEvent(150)
.on('ticker', () => console.log('listens ticker'))
.on('ticker on invocation', () => console.log('listens ticker on function invocation'))

