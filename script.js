const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

const print = (value) => console.log(value)

//[---------------------<Setting>---------------------]

//[---------------------<Main>---------------------]
/*function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    requestAnimationFrame(render)
}*/
//render()

const OperatorList = {
    "load" : 11,
    "sta" : 12,
    "add" : 13,
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
Memory[101] = 12000

var PC = 100
var MAR = 0
var MBR = 0
var IR = 0

var CU = 0
var AC = 0

function displayState(){
    result = `[ Register ]\n`
    result+= `PC\t: {PC}\n`
    result+= `MAR\t: {MAR}\n`
    result+= `MBR\t: {MBR}\n`
    result+= `IR\t: {IR}\n\n`
    result+= `CU\t: {CU}\n`
    result+= `AC\t: {AC}\n`
    print(result)
}