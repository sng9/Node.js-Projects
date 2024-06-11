import chalk from 'chalk'

const decoratorConsole = (console) => {
    console.red = message => console.log(chalk.red(message))
    console.yellow = message => console.log(chalk.yellow(message))
    console.green = message => console.log(chalk.green(message))
}

decoratorConsole(console)

console.red('I am red')
console.green('grass is green')
console.yellow('warning message')