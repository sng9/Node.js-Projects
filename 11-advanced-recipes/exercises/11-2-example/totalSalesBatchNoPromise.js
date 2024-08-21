import { TotalSales as TotalSalesEmitter } from './totalSalesNoPromise.js'
import { EventEmitter } from 'events';

const runningRequests = new Map()

export class TotalSales extends EventEmitter {

  constructor() {
    super()
    this.isBatched = false
  }

  totalSales (product) {
    if (runningRequests.has(product)) {
      console.log('Batching')
      this.isBatched = true
      return { isResult: this.isBatched, ...runningRequests.get(product)}
    }
    
    let totalSalesEmitter = new TotalSalesEmitter()
    totalSalesEmitter.totalSales(product)
    totalSalesEmitter
      .on('done', (data) => {
        this.emit('done', data)
        runningRequests.set(product, data)
        setTimeout(() => {
          runningRequests.delete(product)
        }, 5000)
      })
      .on('error',() => {
        runningRequests.delete(product)
      })  

    return totalSalesEmitter

  }
}


