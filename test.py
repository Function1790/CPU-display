Memory = [0 for i in range(999)]
Memory[0] = 4
Memory[1] = 1
Memory[2] = 2
Memory[3] = 7
Memory[100] = 11001
Memory[101] = 13002
Memory[102] = 12000

PC = 100
MAR = 0
MBR = 0
IR = 0

CU = 0
AC = 0

OperatorList = {
    "load" : 11,
    "sta" : 12,
    "add" : 13,
}

def displayState():
    result = "[ Register ]\n"
    result+= f"PC\t: {PC}\n"
    result+= f"MAR\t: {MAR}\n"
    result+= f"MBR\t: {MBR}\n"
    result+= f"IR\t: {IR}\n\n"
    result+= f"CU\t: {CU}\n"
    result+= f"AC\t: {AC}\n"
    print(result)

def displayMemory(addr):
    print(f"[{addr}]\t: {Memory[addr]}")

def splitOperator(data):
    dataStr = str(data)
    return (int(dataStr[:2]), int(dataStr[2:]))

def FetchCycle():
    global PC, MAR, MBR, IR
    #Cycle 1
    MAR = PC
    #Cycle 2
    MBR = Memory[MAR]
    PC+=1
    #Cycle 3
    IR = MBR

def ExecutionCycle():
    global MAR, MBR, IR, AC
    op, addr = splitOperator(IR)
    MAR = addr
    if op == OperatorList['load']:
        MBR = Memory[MAR]
        AC = MBR
    elif op == OperatorList['sta']:
        MBR = AC
        Memory[MAR] = MBR
    elif op == OperatorList['add']:
        MBR = Memory[MAR]
        AC = AC + MBR
        
    
def InstructionCycle():
    FetchCycle()
    ExecutionCycle()
    displayState()
    
InstructionCycle()
InstructionCycle()
InstructionCycle()
displayMemory(0)