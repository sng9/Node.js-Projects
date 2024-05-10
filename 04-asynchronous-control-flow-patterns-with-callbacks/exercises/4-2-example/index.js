import fs from 'fs'
// listNestedFiles -> cb style function
// arguments: path to the dir and asynchronously iterates over all the subdirectories
// and eventually returns the files discovered
// note: distinguish between files and folder
// append the name to the list and send the list in the recurrsion


// use iterator to iterate over files array

let recurse = 1

function listNestedFiles (dirPath, listOfFiles, cb) {

    fs.readdir(dirPath, { withFileTypes: true, encoding: 'utf8' }, (err, files) => {

        if (err) {

            if (!err.code === 'ENOTDIR') {  
                return cb(err)
            }
    
            if (files.length === 0) {
                return process.nextTick(cb)
            } 

        }
            
        files.forEach(file => {
            if (file.isDirectory()) {
                recurse++
            } else {
                listOfFiles.push(file)
                return
            }
                
            listNestedFiles(`${file.path}/${file.name}`, listOfFiles, cb)    
        })

        recurse--

        finish(recurse, listOfFiles, cb)

    })

}

function finish(operation, listOfFiles, cb) {
    if (!operation)
        return cb(null, listOfFiles)
}

listNestedFiles('.', [], (err, listOfFiles) => {
    if (err)
        console.error(err)

    console.log("file listing complete: ",listOfFiles)
})