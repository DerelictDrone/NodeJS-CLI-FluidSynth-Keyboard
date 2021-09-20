const { readFileSync, writeFileSync, readdirSync, mkdirSync } = require('fs')
const path = require('path')
const {tmpdir} = require('os')
const fsExec = 'fluidsynth.exe'

const filePath = path.join(__dirname, '/fs');
let temp
    temp = tmpdir()
    tempMain = path.join(temp+'/Phpminor');
    tempCheck = readdirSync(temp).indexOf('Phpminor')
    if(tempCheck === -1) {
        mkdirSync(tempMain)
    } else {
        setupCheck = readdirSync(tempMain).indexOf(fsExec)
        if(setupCheck === -1) {
            list = readdirSync(filePath)
            for(let i = 0; i < list.length; i++) {
            copy = readFileSync(filePath+'\\'+list[i])
            writeFileSync(tempMain+'\\'+list[i],copy,{encoding:'ascii'})
            }
        }
    }

setTimeout(function(){

const {
    spawn
} = require('child_process')




synth = spawn(tempMain+'\\fluidsynth.exe', [tempMain+'\\soundfont.sf2'], {
    stdio: ['pipe']
})


process.stdin.setRawMode(true);
process.stdin.resume()
process.stdin.setEncoding('utf-8')

synth.stdout.on('data', function (data) {
    if (instrumentCheck === true) {
        split = data.toString().split('\n')
        for (let i = 0; i < split.length; i++) {
            instruments.push(split[i].slice(8))
        }
    } else {
        process.stdout.write(data)
    }
})

synth.stdin.on('data', function (data) {
    process.stdout.write(data)
})

let instrumentCheck = false
setTimeout(function () {
    instrumentCheck = true
    synth.stdin.write('inst 1\n')
}, 600)
setTimeout(function () {
    instrumentCheck = false
}, 900)

let delay = 5;
let volume = 100;
let channel = 1;
let instrumentNum = 1;
let instruments = []
let channelInstruments = []



process.stdin.on('data', function (data) {

    note = Buffer.from(data)[0]

    if (note === 27) {
        switch (Buffer.from(data)[2]) {
            case 0x41: {
                volume = volume + 1;
                process.stdout.write('Volume: ' + volume + '\n')
                break;
            }
            case 0x42: {
                volume = volume - 1;
                process.stdout.write('Volume: ' + volume + '\n')
                break;
            }
            case 0x43: {
                channel = channel + 1
                process.stdout.write('Channel: ' + channel + '\n')
                break;
            }
            case 0x44: {
                channel = channel - 1;
                instrumentNum = channelInstruments[channel]
                process.stdout.write('Channel: ' + channel + '\n')
                break;
            }
            case 0x31: {
                delay = delay + 5
                process.stdout.write('Hold notes for: ' + delay + 'MS\n')
                break;
            }

            case 0x34: {
                delay = delay - 5
                process.stdout.write('Hold notes for: ' + delay + 'MS\n')
                break;
            }
            case 0x35: {
                instrumentNum = instrumentNum + 1
                channelInstruments[channel] = instrumentNum
                synth.stdin.write(`prog ${channel} ${instrumentNum}\n`)
                process.stdout.write('Channel Instrument: ' + instruments[instrumentNum] + `\n`)
                break;
            }
            case 0x36: {
                instrumentNum = instrumentNum - 1
                channelInstruments[channel] = instrumentNum
                synth.stdin.write(`prog ${channel} ${instrumentNum}\n`)
                process.stdout.write('Channel Instrument: ' + instruments[instrumentNum] + `\n`)
                break;
            }
            default: {
                synth.stdin.write(`noteon ${channel} ${note} ${volume}\n`)
                process.stdout.write(`noteon ${channel} ${note} ${volume}\n`)
                synth.stdin.write(`noteoff ${channel} ${note} 1\n`)
                break;
            }
        }
    } else {

        synth.stdin.write(`noteon ${channel} ${note} ${volume}\n`)
        process.stdout.write(`noteon ${channel} ${note} ${volume}\n`)
        setTimeout(function(){
            synth.stdin.write(`noteoff ${channel} ${note} 1\n`)
        },delay)

        if (note === 3) {
            process.exit(0)
        }

    }
})


process.on('SIGTERM', function () {
    synth.exit()
})
},300)