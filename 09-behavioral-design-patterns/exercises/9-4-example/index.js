import chalk from 'chalk'
import fs from 'fs'

export class LogMiddlewareManager {
    constructor() {
        this.inboundMessages = []
    }

    use(middleware) {
        if (middleware.inbound) {
            this.inboundMessages.push(middleware.inbound)
        }
    }

    async executeMiddleware(middlewares, initialMessage) {
        let message = initialMessage
        for await (const middlewareFunc of middlewares) {
            message = middlewareFunc.call(this, message)
        }
        return message
    }

    async log(message) {
        const finalMessage = await this.executeMiddleware(this.inboundMessages, message)
        return finalMessage
    } 
}

const formatter = function() {
    return {
        inbound (message) {
            if (message.debug) {
                return `${chalk.cyan('DEBUG')} ${message.text}\n`
            }

            if (message.info) {
                return `${chalk.green('INFO')} ${message.text}\n`
            }

            if (message.warn) {
                return `${chalk.yellow('WARN')} ${message.text}\n`
            }

            if (message.error) {
                return `${chalk.red('ERROR')} ${message.text}\n`
            }
        }
    }
}

const serailize = function() {
    return {
        inbound (message) {
            return message.toString()
        }
    }
}

const preppendTimestamp = function() {
    return {
        inbound (message) {
            return `${new Date().toLocaleString()} ${message}`
        }
    }
}

const saveToFile = (path) => {
    return {
        inbound (message) {
            fs.appendFileSync(path, message)
            return message
        }
    }
}

const logMM = new LogMiddlewareManager()
logMM.use(formatter())
logMM.use(serailize())
logMM.use(preppendTimestamp())
logMM.use(saveToFile('./output.txt'))
logMM.use({
    inbound (message) {
        console.log(message)
    }
})

logMM.log({ info: 'INFO', text: 'Please be advised today there is no class'})
logMM.log({ warn: 'WARN', text: 'Package is deprecated'})
logMM.log({ debug: 'DEBUG', text: JSON.stringify({a: 12, b: 13})})
