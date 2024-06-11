import chalk from 'chalk'
import fs from 'fs'

// Template Pattern
export class Logger {
    debug(msg) {
        return `${chalk.cyan('DEBUG')} ${msg}\n`
    }

    info(msg) {
        return `${chalk.green('INFO')} ${msg}\n`
    }

    warn(msg) {
        return `${chalk.yellow('WARN')} ${msg}\n`
    }

    error(msg) {
        return `${chalk.red('ERROR')} ${msg}\n`
    }

}


export class ConsoleLogger extends Logger {
    debug(msg) {
        const log = super.debug(msg)
        console.debug(log)
    }

    info(msg) {
        const log = super.info(msg)
        console.info(log)
    }

    warn(msg) {
        const log = super.warn(msg)
        console.warn(log)
    }

    error(msg) {
        const log = super.error(msg)
        console.error(log)
    }
}

export class FileLogger extends Logger {
    constructor(filepath) {
        super()
        this.filepath = filepath
    }

    debug(msg) {
        const log = super.debug(msg)
        fs.appendFileSync(this.filepath, log)
    }

    info(msg) {
        const log = super.info(msg)
        fs.appendFileSync(this.filepath, log)
    }

    warn(msg) {
        const log = super.warn(msg)
        fs.appendFileSync(this.filepath, log)
    }

    error(msg) {
        const log = super.error(msg)
        fs.appendFileSync(this.filepath, log)
    }

}

const consoleLogger = new ConsoleLogger()
const fileLogger = new FileLogger('./output.txt')

consoleLogger.info('Please be advised today there is no class')
consoleLogger.debug(JSON.stringify({a: 12, b: 13}))
consoleLogger.warn('Package is deprecated')
consoleLogger.error('OutofbondException, check the array size')


fileLogger.info('Please be advised today there is no class')
fileLogger.debug(JSON.stringify({a: 12, b: 13}))
fileLogger.warn('Package is deprecated')
fileLogger.error('OutofbondException, check the array size')