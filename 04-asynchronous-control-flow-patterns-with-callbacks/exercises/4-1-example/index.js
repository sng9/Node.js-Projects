import fs from 'fs'
import process from 'process'
// Problem:
// function takes 2 or more files and a destination file, in where it concats the content -> foobar and stores in the destination file
// serial task execution, order is important

let destinationFile = ''
let files = [] 

export function concatFiles(srcFiles, destFile, cb) {
    
    files = srcFiles
    destinationFile = destFile
    if (files.length < 2) {
        console.log("Please provide more than 1 files for concatenation.")
        process.exit(1)
    }

    iterate(0,cb)
}

function iterate (index, cb) {
    if (index == files.length){
        return finish()
    }

    let srcFile = files[index]
    task(srcFile, destinationFile, (err) => {
        if (err)
            return console.error(err)
        cb()    
        iterate(index + 1, cb)
    }) 
}

function finish () {
    console.log('All files concatenated')
}

function task (srcFile, destinationFile, cb) {
    fs.readFile(srcFile,'utf8',(err, data) => {
        if (err)
            return cb(err)
        fs.appendFile(destinationFile, data, (err) => {
            if (err)
                return cb(err)
        
            console.log(`data is appended: ${data} to the ${destinationFile}`)
            cb()        
        })
    })
}