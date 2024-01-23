const registerCanvas = document.getElementById("register")
const rctx = registerCanvas.getContext("2d")

const memoryCanvas = document.getElementById("memory")
const mctx = memoryCanvas.getContext("2d")

const sourceCanvas = document.getElementById("source")
const sctx = sourceCanvas.getContext('2d')

const print = (value) => console.log(value)

//[---------------------<Setting>---------------------]
const OperatorList = {
    "load": 11,
    "sta": 12,
    "add": 13,
}

//Function
function displayState() {
    result = `[ Register ]\n`
    result += `PC\t: ${PC.value}\n`
    result += `MAR\t: ${MAR.value}\n`
    result += `MBR\t: ${MBR.value}\n`
    result += `IR\t: ${IR.value}\n\n`
    result += `CU\t: ${CU.value}\n`
    result += `AC\t: ${AC.value}\n`
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
    MAR.value = PC.value
    //Cycle 2
    MBR.value = Memory[MAR.value]
    PC.value += 1
    //Cycle 3
    IR.value = MBR.value
}

function ExecutionCycle() {
    splitedData = splitOperator(IR.value)
    op = splitedData[0]
    addr = splitedData[1]

    MAR.value = addr
    if (op == OperatorList['load']) {
        MBR.value = Memory[MAR.value]
        AC.value = MBR.value
    }
    else if (op == OperatorList['sta']) {
        MBR.value = AC.value
        Memory[MAR.value] = MBR.value
    }
    else if (op == OperatorList['add']) {
        MBR.value = Memory[MAR.value]
        AC.value = AC.value + MBR.value
    }
}

function InstructionCycle() {
    FetchCycle()
    ExecutionCycle()
    displayState()
}

function fillRect(ctx, x, y, w, h) {
    ctx.fillRect(x - w / h, y - h / 2 - 7, w, h)
}

function strokeRect(ctx, x, y, w, h) {
    ctx.strokeRect(x - w / h, y - h / 2 - 7, w, h)
}

//Class
class Register {
    constructor(x, y, name, value = 0) {
        this.x = x
        this.y = y
        this.name = name
        this.value = value
    }
    draw() {
        rctx.beginPath()
        rctx.strokeStyle = "tgray"
        strokeRect(rctx, this.x, this.y, 150, 50)
        rctx.font = "20px Arial, sans-serif"
        rctx.fillStyle = "black"
        rctx.fillText(`${this.name} : ${this.value}`, this.x, this.y)
        rctx.closePath()
    }
}

//[---------------------<Main>---------------------]

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
Memory[103] = 13000
Memory[104] = 12005

var PC = new Register(10, 50, "PC", 100)
var MAR = new Register(10, 125, "MAR", 0)
var MBR = new Register(10, 200, "MBR", 0)
var IR = new Register(10, 275, "IR", 0)

var CU = new Register(200, 50, "CU", 0)
var AC = new Register(200, 125, "AC", 0)

const renderList = [
    PC, MAR, MBR, IR, CU, AC
]

tick = 20
step = 0
function render() {
    rctx.clearRect(0, 0, registerCanvas.width, registerCanvas.height)
    mctx.clearRect(0, 0, memoryCanvas.width, memoryCanvas.height)
    sctx.clearRect(0, 0, sourceCanvas.width, sourceCanvas.height)
    if (tick > 0) {
        tick--
    }
    if(tick==0){
        if(step==0){
            //Cycle 1
            MAR.value = PC.value
        } else if(step==1){
            //Cycle 2
            MBR.value = Memory[MAR.value]
            PC.value += 1
        } else if(step==2){
            //Cycle 3
            IR.value = MBR.value
        } else if(step==3){
            ExecutionCycle()
        }
        tick = 100
        step = (step + 1 ) % 4
    }
    for (var i in renderList) {
        renderList[i].draw()
    }
    mctx.font = "20px Arial, sans-serif"
    for (var i = 0; i < 10; i++) {
        mctx.fillText(`[${i}] : ${Memory[i]}`, 10, 25 + i * 30)
    }

    sctx.font = "20px Arial, sans-serif"
    for (var i = 0; i < 7; i++) {
        var n = 100 + i
        sctx.fillStyle = "black"
        if (PC.value == n) {
            sctx.fillStyle = "red"
        }
        splitedData = splitOperator(Memory[n])
        var opName = "0"
        for (var j in OperatorList) {
            if (OperatorList[j] == splitedData[0]) {
                opName = `${j}`
                break
            }
        }
        sctx.fillText(`[${n}] : ${opName} ${splitedData[1]}`, 10, 25 + i * 30)
    }
    requestAnimationFrame(render)
}
render()