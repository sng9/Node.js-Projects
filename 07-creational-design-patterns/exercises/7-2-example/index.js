import { request } from 'https'
import { URL } from 'url'
// Use Builder pattern
// around the builtin http.request()
// builder must be able to provide basic facilities to specify HTTP method, the URL, query component of the URL,
// the header parameters, and the eventual body data to be sent
// to send the request provide invoke() method that returns a Promise for the invocation

export class RequestBuilder {
    setHttpMethod(method, postData){
        if (method === 'POST'){
            this.postData = JSON.stringify(postData)
        }
        this.method = method
        return this
    }

    setUrl(url) {
        this.url = new URL(url)
        return this
    }

    setQueryParams(query) {
        Object.entries(query).forEach(([key, val]) => this.url.searchParams.set(key, val))
        return this
    }

    setHeaders(headers) {
        this.headers = headers
        return this
    }

    setBody(body) {
        this.body = JSON.stringify(body) || ''
        return this
    }

    setPort(port) {
        this.port = port
        return this
    }

    invoke() {
        this.options = {
            host: this.url.host,
            path: `${this.url.pathname}?${this.url.searchParams.toString()}`,
            method: this.method,
            headers: {
                Accept: 'application/json',
                ...this.headers,
            }
        }

        return new Promise ((resolve, reject) => {
            const req = request(this.options, (res) => {
                let data = ''
                res.on('data', (chunk) => {
                    data += chunk.toString()
                })
                res.on('end', () => resolve(data))
                res.on('error', reject)
            })

            req.on('error', reject)
            // req.on('write', this.body)
            req.end()
        })

    }


}

// Usage
new RequestBuilder() 
    .setHttpMethod('GET')
    .setUrl('https://api.urbandictionary.com/v0/define')
    .setQueryParams({term : 'wat'})
    .invoke()
    .then((res) => {
        console.log(`Response: ${res}`)
    })


