import chalk from 'chalk'
// Create a class ColorConsole ->log(){}
// three sub classes -> 1. RedConsole 2. BlueConsole 3. GreenConsole
// log (color string) => if red then return redClass and so on
// Factory function that takes color as input, such as red, and returns that ColorConsole subclass

class ColorConsole {
    log() {}
}

export class RedConsole extends ColorConsole {

    log(colorName) {
        console.log(`color ${chalk.red(colorName)}`)
    }
}

export class BlueConsole extends ColorConsole {
    log(colorName) {
        console.log(`color ${chalk.blue(colorName)}`)
    }
}

export class GreenConsole extends ColorConsole {
    log(colorName) {
        console.log(`color ${chalk.green(colorName)}`)
    }
}

function createColorConsole(colorName) {
    
    if (colorName && colorName === 'red') {
        return new RedConsole().log(colorName)
    } else if (colorName && colorName === 'blue') {
        return new BlueConsole().log(colorName)
    } else if(colorName && colorName === 'green') {
        return new GreenConsole().log(colorName)
    } else {
        console.log(`Please provide colorname as red, blue or green`)
    }
}
    
createColorConsole(process.argv[2])