import { parentPort } from 'worker_threads'


parentPort.on('message', ({inputFunc, args}) => {
  const operands = args.split(',')
  // local scope
  const a = parseInt(operands[0])
  const b = parseInt(operands[1])
  const res = eval(inputFunc)
  parentPort.postMessage({event: 'end', data: res})
})