import fs from 'fs'
import chalk from 'chalk'

// Strategy Pattern 
export class LoggingComponent {
    constructor(outputStrategy) {
        this.outputStrategy = outputStrategy
    }

    debug(message) {
        const msg = `${chalk.cyan('DEBUG')} ${message}\n`
        return this.outputStrategy.debug(msg)
    }

    info(message) {
        const msg = `${chalk.green('INFO')} ${message}\n`
        return this.outputStrategy.info(msg)
    }

    warn(message) {
        const msg = `${chalk.yellow('WARN')} ${message}\n`
        return this.outputStrategy.warn(msg)
    } 

    error(message) {
        const msg = `${chalk.red('ERROR')} ${message}\n`
        return this.outputStrategy.error(msg)
    }
}

export const consoleStrategy = {
    debug: message => {
        console.debug(message)
    },
    info: message => {
        console.info(message)
    },
    warn: message => {
        console.warn(message)
    },
    error: message => {
        console.error(message) 
    } 
}

const filepath = './output.txt'

export const fileStrategy = {
    debug: (message) => {
        fs.appendFileSync(filepath, message)
    },
    info: (message) => {
        fs.appendFileSync(filepath, message)
    },
    warn: (message) => {
        fs.appendFileSync(filepath, message)
    },
    error: (message) => {
        fs.appendFileSync(filepath, message)
    }
}

