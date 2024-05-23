import { Transform } from 'stream'

    // {
    //     'borough1' : {
    //         'major-category1': '3 (value)',
    //         'major-category2': '3 (value)'
    //     },
    //     "borough2" : {
    //         'major-category1': '3 (value)',
    //         'major-category2': '3 (value)'
    //     }
    // }

export class TopCategoryPerArea extends Transform {
    constructor(options = {}) {
        options.objectMode = true
        super({...options})
        this.countByCategoryByArea = {}
    }

    _transform(record, encoding, cb) {

        if(!record || record.year === 'year') return cb() // skip header

        try {

            const area = this.countByCategoryByArea[record.borough]

            if (area) {
                if (!area[record.major_category]) area[record.major_category] = 0 
                area[record.major_category] += Number(record.value)
            } else {

                this.countByCategoryByArea[record.borough] = {
                    [record.major_category] : Number(record.value),
                }
            }
            cb()
             
        } catch (e) {
            cb(e)
        }

    } 

    _flush(cb) {
        try {
            const res = Object.entries(this.countByCategoryByArea).map(([key,val]) => {
                const maxVal = Object.entries(val).sort(([,a], [,b]) => b - a)[0]
                return [key, maxVal[0], maxVal[1]]
            })
            this.push(res)
            cb()
        } catch(err) {
            cb(err)
        }
    
    }
}