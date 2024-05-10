import fs from 'fs'
// a function takes the path to dir and keyword and searches the keyword in the all the files of that directory
// returns the string of array in an callback ['file1.txt','file2.txt']
// bonus : recurses the sub directories paralelly

//readDir, open file -> match the keyword in the file, if found add in the array output
// use regex match

let iterate = 0

function recursiveFind(dir, keyword, listOfFiles, cb) {

    fs.readdir(dir, {withFileTypes: true, encoding: 'utf8'}, (err, files) => {

        if (err) {
            return cb(err)
        }

        if (!files) {
            return cb(null, [])
        }

        files.forEach(file  => {
            fs.readFile(`${dir}/${file.name}`, 'utf8',(err, data) => {
                if (err)
                    return cb(err)
                
                if (data.includes(keyword)) {

                    listOfFiles.push(file.name)
                }
                if (file.isFile())
                    iterate++
    
                if (iterate === files.length) {
                    return cb(null, listOfFiles)
                }
                           
            })

        })
        
    })

}

let keyword = 'weather'

recursiveFind('./folder0', keyword, [], (err, data) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }

    console.log(`keyword ${keyword} present in ${data.length > 0 ? data : "0 file"} `)
})