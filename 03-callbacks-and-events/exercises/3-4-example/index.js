import { EventEmitter } from 'events'

const DivisibleByFive = new Error("Timestamp divisible by 5")

function recurse(number, event, count, dateDivisibleByFive, callback){

    if (dateDivisibleByFive === 0) {
        // deferred execution to satisfy async
        process.nextTick(() => event.emit('error', DivisibleByFive)) 
        return callback(DivisibleByFive)
    } 
    // base condition this return 
    if (number <= 0){
        return callback(null, count)
    }
    setTimeout((err) => {
        if (err) {
            return console.log(`error: ${err}`)
        }
        event.emit('ticker')
        recurse(number - 50, event, count + 1, dateDivisibleByFive, callback)

    }, 50)

}

function tickerEvent (number) {
    const event = new EventEmitter()
    let  dateDivisibleByFive = Date.now()%5
    
    recurse(number, event, 0, dateDivisibleByFive,(err, count) => {
        if(err)
            return console.log(`error returned in callback: ${err}`)
        else
            console.log(`ticker count: ${count}`)
        
    })

    return event

}

tickerEvent(450)
.on('ticker', () => console.log(`listner for ticker event`))
.on('error', (err) => console.error(`${err}`))