import { TotalSales as TotalSalesEmitter } from './totalSalesNoPromise.js'
import { EventEmitter } from 'events';
import { ResultEmitter } from './ResultEmitter.js'

const CACHE_TTL = 60 * 1000 // 30 seconds TTL
const cache = new Map()


export class TotalSales extends EventEmitter {

  constructor() {
    super()
    this.isCached = false
  }

  totalSales (product) {
    
    if (cache.has(product)) {
      console.log('Cache hit') 
      this.isCached =  true
      return { isResult: this.isCached, ...cache.get(product)}
    } 

    let totalSalesEmitter = new TotalSalesEmitter()
    totalSalesEmitter.totalSales(product)
    totalSalesEmitter
      .on('done',(data) => {
        cache.set(product, data)
        this.emit('done', data)
        setTimeout(() => {
          cache.delete(product)
          this.isCached = false
        }, CACHE_TTL)
      })
      .on('err', () => {
        cache.delete(product)
        this.isCached = false
        throw err
      })

      return totalSalesEmitter
  }

}

  
