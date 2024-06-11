import axios from 'axios'

const cache = {}

// Use Proxy method

const axiosCache = new Proxy(axios, {
    get: (target, prop) => {
        if(prop !== 'get') {
            return target[prop]
        }

        return async (url, config) => {
            if(cache[url]) {
                console.log(`${url} found in cache`)
                return Promise.resolve(cache[url])
            }
            const { data } = await target.get(url, config)
            cache[url] = JSON.stringify(data) 
            return cache[url] 
        }
    }
})

console.log(await axiosCache.get('https://api.urbandictionary.com/v0/define?term=wat', {}))
console.log(await axiosCache.get('https://api.urbandictionary.com/v0/define?term=wat', {}))