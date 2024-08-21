// Implement batching and caching, for totalSales API examplesusing only callbacks, streams, and events

import level from 'level'
import sublevel from 'subleveldown'
import EventEmitter from 'events'

const db = level('example-db')
const salesDb = sublevel(db, 'sales', { valueEncoding: 'json'})

export class TotalSales extends EventEmitter{

    constructor() {
        super()
    }

    totalSales (product) {
        const now = Date.now()
        let sum = 0
        const transactionStream = salesDb.createValueStream()
        transactionStream.on('data', (transaction) => {
            if(!product || transaction.product === product) {
                sum += transaction.amount
            }
        })
    
        transactionStream.on('end', () => {
            console.log(`totalSales() took: ${Date.now() - now}ms`)
            this.emit('done', { product, sum })
        })
        
    }
}

