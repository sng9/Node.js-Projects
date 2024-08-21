import { createServer } from 'http'
import { TotalSales } from './totalSalesBatchNoPromise.js'
// import { TotalSales } from './totalSalesCacheNoPromise.js'

createServer((req, res) => {
  const totalSalesEmitter = new TotalSales()
  const url = new URL(req.url, 'http://localhost')
  const product = url.searchParams.get('product')
  console.log(`Processing query: ${url.search}`)
  // check zalgo effect
  let result = totalSalesEmitter.totalSales(product)
  
  if(result.isResult) {
    res.setHeader('Content-Type', 'application/json')
    res.writeHead(200)
    res.end(JSON.stringify({
      product: result.product,
      sum: result.sum
    }))
  } else {
    totalSalesEmitter.on('done', ({product, sum}) => {
      res.setHeader('Content-Type', 'application/json')
      res.writeHead(200)
      res.end(JSON.stringify({
        product,
        sum
      }))
    }) 
  }
  

}).listen(8000, () => console.log('Server started'))
