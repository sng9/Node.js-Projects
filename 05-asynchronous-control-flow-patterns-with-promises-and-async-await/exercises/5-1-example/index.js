// implement Promise.all -> it must be a sequential operation,
// Use promise, async/await
// if any error throw and exit the array
// It takes the array input and iterates ,use for can be used, handle error which should be thrown

// Promise
function promiseAll2(promises) {
    return new Promise(async (resolve, reject) => {
        let arr = []
        try{
            let promise;

            for (let i=0; i<promises.length; i++) {
                promise = await promises[i]
                arr.push(promise)
            }

        } catch (err) {
            return reject(err)
        }

        resolve(arr)
        
    })
}

const a = () => {
    return Promise.resolve('a')
}

const b = () => {
    return Promise.resolve('b')
}

const c = () => {
    return Promise.reject('Some error')
}


promiseAll2([a(), b(), c()])
    .then((val) => {
        val.forEach(ele => {
            console.log(ele)
        });
    })
    .catch(e => console.error(e))
