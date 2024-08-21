// Using a javascript Proxy, 
// create a wrapper for adding pre-initilaization queues to any object
// You shoulkd allow the consumer of the wrapper to augment and name of the property/event
// that indicates if the component is initialized

export class DB {
    constructor() {
        this.isConnected = false
    }
    async query() {
        console.log('save query executed!')
        return Promise.resolve()
    } 

    async checkStatus() {
        console.log(`Connection: ${this.isConnected}`)
    }
}

const proxyInitializedObj = (db) => {
    let queue = []
    return new Proxy (db, {
        get: (target, property) => {
            if(property === 'query' && !target.isConnected){
                // return type must be a function, as it calls get()
                return (...args) => {
                    return new Promise((resolve, reject) => {
                        const command = () => {
                            target[property](...args).then(resolve,reject)
                        }
                         queue.push(command)
                    })
                }
                
            } else if (property === 'query' && target.isConnected) {
                return (...args) => {
                    target[property](...args) 
                    for (const cmd of queue) {
                        cmd()
                    }
                    queue = []
                }
                
            } 
            return target[property]
        }
    })
    
}
const db = new DB()
const proxyObj = proxyInitializedObj(db)
proxyObj.checkStatus()
proxyObj.query()

setTimeout(() => {
    db.isConnected = true
    proxyObj.checkStatus()
    proxyObj.query()
}, 1000)
