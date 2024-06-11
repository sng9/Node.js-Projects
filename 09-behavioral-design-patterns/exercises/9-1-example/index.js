import { LoggingComponent } from "./LoggingComponent.js";
import { consoleStrategy, fileStrategy } from "./LoggingComponent.js"

const consoleLog = new LoggingComponent(consoleStrategy)
const fileLog = new LoggingComponent(fileStrategy)

consoleLog.info('Please be advised today there is no class')
consoleLog.debug(JSON.stringify({a: 12, b: 13}))
consoleLog.warn('Package is deprecated')
consoleLog.error('OutofbondException, check the array size')


fileLog.info('Please be advised today there is no class')
fileLog.debug(JSON.stringify({a: 12, b: 13}))
fileLog.warn('Package is deprecated')
fileLog.error('OutofbondException, check the array size')