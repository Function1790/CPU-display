const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

const print = (value) => console.log(value)

//[---------------------<Setting>---------------------]
const OperatorList = {
    "load": 11,
    "sta": 12,
    "add": 13,
}

var Memory = []
for (var i = 0; i < 1000; i++) {
    Memory.push(0)
}
Memory[0] = 4
Memory[1] = 4
Memory[2] = 4
Memory[100] = 11001
Memory[101] = 13002
Memory[102] = 12000

var PC = 100
var MAR = 0
var MBR = 0
var IR = 0

var CU = 0
var AC = 0

//Function
function displayState() {
    result = `[ Register ]\n`
    result += `PC\t: ${PC}\n`
    result += `MAR\t: ${MAR}\n`
    result += `MBR\t: ${MBR}\n`
    result += `IR\t: ${IR}\n\n`
    result += `CU\t: ${CU}\n`
    result += `AC\t: ${AC}\n`
    print(result)
}

function splitOperator(data) {
    var strData = `${data}`
    var op = ""
    var addr = ""
    for (var i in strData) {
        if (i < 2) {
            op += strData[i]
        } else {
            addr += strData[i]
        }
    }
    return [Number(op), Number(addr)]
}

function FetchCycle() {
    //Cycle 1
    MAR = PC
    //Cycle 2
    MBR = Memory[MAR]
    PC += 1
    //Cycle 3
    IR = MBR
}

function ExecutionCycle() {
    splitedData = splitOperator(IR)
    op = splitedData[0]
    addr = splitedData[1]

    MAR = addr
    if (op == OperatorList['load']) {
        MBR = Memory[MAR]
        AC = MBR
    }
    else if (op == OperatorList['sta']) {
        MBR = AC
        Memory[MAR] = MBR
    }
    else if (op == OperatorList['add']) {
        MBR = Memory[MAR]
        AC = AC + MBR
    }
}

function InstructionCycle() {
    FetchCycle()
    ExecutionCycle()
    displayState()
}

//[---------------------<Main>---------------------]
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.stroke()
    requestAnimationFrame(render)
}
//render()