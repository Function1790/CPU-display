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
    "jump": 14,
    "call": 15,
    "ret": 16,
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
    switch (op) {
        case OperatorList['load']:
            MBR.value = Memory[MAR.value]
            AC.value = MBR.value
            break
        case OperatorList['sta']:
            MBR.value = AC.value
            Memory[MAR.value] = MBR.value
            break
        case OperatorList['add']:
            MBR.value = Memory[MAR.value]
            AC.value = AC.value + MBR.value
            break
        case OperatorList['jump']:
            PC.value = addr
            break
        case OperatorList['call']:
            MBR.value = PC.value
            MAR.value = StackPointer
            PC.value = addr
            Memory[MAR.value] = MBR.value
            StackPointer -= 1
            break
        case OperatorList['ret']:
            MAR.value = StackPointer + 1
            MBR.value = Memory[MAR.value]
            PC.value = MBR.value
            StackPointer += 1
            break
    }
}

function InstructionCycle() {
    FetchCycle()
    ExecutionCycle()
    //displayState()
}

function fillRect(ctx, x, y, w, h) {
    ctx.fillRect(x - w / h, y - h / 2 - 7, w, h)
}

function strokeRect(ctx, x, y, w, h) {
    ctx.strokeRect(x - w / h, y - h / 2 - 7, w, h)
}

function autoExcute() {
    if (tick > 0) {
        tick--
    }
    if (tick == 0) {
        if (step == 0) {
            //Cycle 1
            MAR.value = PC.value
        } else if (step == 1) {
            //Cycle 2
            MBR.value = Memory[MAR.value]
            PC.value += 1
        } else if (step == 2) {
            //Cycle 3
            IR.value = MBR.value
        } else if (step == 3) {
            ExecutionCycle()
        }
        tick = 50
        step = (step + 1) % 4
    }
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
        rctx.strokeStyle = "gray"
        strokeRect(rctx, this.x, this.y, 250, 70)
        rctx.font = "35px Arial, sans-serif"
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
Memory[100] = 11000
Memory[101] = 13001
Memory[102] = 12000
Memory[103] = 15110
Memory[110] = 13001
Memory[111] = 12004
Memory[112] = 16000

var PC = new Register(10, 50, "PC", 100)
var MAR = new Register(10, 150, "MAR", 0)
var MBR = new Register(10, 250, "MBR", 0)
var IR = new Register(10, 350, "IR", 0)

var CU = new Register(300, 50, "CU", 0)
var AC = new Register(300, 150, "AC", 0)

var CurrentPos = PC.value
var StackPointer = Memory.length - 1

const renderList = [
    PC, MAR, MBR, IR, CU, AC
]

tick = 20
step = 0
function render() {
    rctx.clearRect(0, 0, registerCanvas.width, registerCanvas.height)
    mctx.clearRect(0, 0, memoryCanvas.width, memoryCanvas.height)
    sctx.clearRect(0, 0, sourceCanvas.width, sourceCanvas.height)
    //autoExcute()
    for (var i in renderList) {
        renderList[i].draw()
    }
    mctx.font = "35px Arial, sans-serif"
    for (var i = 0; i < 10; i++) {
        mctx.fillStyle = "black"
        mctx.fillText(`[${i}] : ${Memory[i]}`, 10, 50 + i * 50)
        var j = Memory.length - 1 - i
        if (j == StackPointer) {
            mctx.fillStyle = "red"
        }
        mctx.fillText(`[${j}] : ${Memory[j]}`, 150, 50 + i * 50)
    }

    sctx.font = "35px Arial, sans-serif"
    for (var i = 0; i < 15; i++) {
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
        sctx.fillText(`[${n}] : ${opName} [${splitedData[1]}]`, 10, 50 + i * 50)
    }
    requestAnimationFrame(render)
}
render()