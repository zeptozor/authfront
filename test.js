const readline = require('node:readline/promises')
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

const hhh = async () => {
    const answer = await rl.question('')
    console.log(answer)
    rl.close();
}

hhh()