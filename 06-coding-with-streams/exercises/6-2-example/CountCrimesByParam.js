import {Transform} from 'stream'

// transform
// records push else flush it
// in index.js -> const csvParser = parse({ columns: true })


export class CountCrimesByParam extends Transform {
    constructor(options){
        options.objectMode = true
        super({...options})
        this.param = options.param
        this.crimesByParam = {}

    }

    _transform(record, encoding, cb) {
        // skip the header
        try { 

            if (!record || record.year === 'year') return cb()
            const paramVal = record[this.param]

            if (! this.crimesByParam[paramVal]) {
                this.crimesByParam[paramVal] = 0
            }

            this.crimesByParam[paramVal] += Number(record.value)
            cb()

        } catch (e) {
            cb(e)
        }
    }

    _flush(cb) {
        try {
            this.push(Object.entries(this.crimesByParam))
            cb()
        } catch (e) {
            cb(e)
        }
        
        
    }
}