import { parse } from 'csv-parse'
import { createReadStream } from 'fs'
import { pipeline } from 'stream'
import { CountCrimesByParam } from './CountCrimesByParam.js'
import { ResultToString } from './ResultToString.js'
import { TopCategoryPerArea } from './TopCategoryPerArea.js'
import { SortAndLimit } from './SortAndLimit.js'

// use csv parser to parse the columns

const inputStream = createReadStream('london_crime_by_lsoa.csv')
const csvParser = parse({columns: true, skip_records_with_error: true})


const cb = (e) => {
    console.log('Error occurred in the pipeline ', e)
}

// Did the number of crimes go up or down over the years?

inputStream
    .pipe(csvParser)
    .pipe(new CountCrimesByParam({ param: 'year' }))
    .on('error', (err) => {
        console.log(err)
        process.exit(1)
    })
    .pipe(new ResultToString({ label: 'Number of crimes by year' }))
    .pipe(process.stdout)

// What are the most dangerous areas of London?

inputStream
    .pipe(csvParser)
    .pipe(new CountCrimesByParam({ param: 'borough'}))
    .on('error', (err) => {
        console.log(err)
        process.exit(1)
    })
    .pipe(new SortAndLimit({sortDirection: 'desc', limit: 20}))
    .pipe(new ResultToString({ label: 'Most dangerous areas in London' }))
    .pipe(process.stdout)


// What is the least common crime?

inputStream
    .pipe(csvParser)
    .pipe(new CountCrimesByParam({ param: 'major_category'}))
    .on('error', (err) => {
        console.log(err)
        process.exit(1)
    })
    .pipe(new SortAndLimit({sortDirection: 'asc', limit: 20}))
    .pipe(new ResultToString({ label: 'Top Least common crimes' }))
    .pipe(process.stdout)
    
// What is the most common crime per area?

inputStream
    .pipe(csvParser)
    .pipe(new TopCategoryPerArea())
    .on('error', (err) => {
        console.log(err)
        process.exit(1)
    })
    .pipe(new ResultToString({ label: 'Most common crime per area' }))
    .pipe(process.stdout)