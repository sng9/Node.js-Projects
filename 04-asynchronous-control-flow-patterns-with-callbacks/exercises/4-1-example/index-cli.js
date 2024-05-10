import { concatFiles } from './index.js'

const srcFiles = process.argv[2].replace(/[\[\]']+/g,'').split(',')
const destinationFile = process.argv[process.argv.length-1]

concatFiles(srcFiles, destinationFile, (err) => {
    if (err) {
        console.error(err)
    }

    console.log('Concat complete')
})