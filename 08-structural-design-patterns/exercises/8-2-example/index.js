import chalk from 'chalk'
const logMethods = ['log', 'debug', 'info', 'error' ]

const consoleProxy = new Proxy(console, {
    get: (target, prop) => {
        if (!logMethods.includes(prop)) {
            return target[prop]
        }

        return (...args) => {
            const dateTime = chalk.green(new Date().toLocaleString())
            target[prop](dateTime, ...args)
        }
        
    }
})


consoleProxy.log('Foo','bar', 'baz')
consoleProxy.error('Random error')