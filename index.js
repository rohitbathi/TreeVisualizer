// global constants
const NODE_RADIUS = 20
const LINE_X = 30
const LINE_Y = 30
const OFFSET = 2

//global variables
var CURR_PEN_POS = []

// on load draw function
function buttonHandler(){
    const canvas = document.getElementById('viz-board')
    if (canvas.getContext) {
        const board = canvas.getContext("2d");
        board.font = "28px serif";

        let treeR = genTree()
        console.log(treeR);
        console.log(JSON.stringify(treeR));
        console.log(JSON.parse(JSON.stringify(treeR)));
        let treeJson = document.getElementById('tree-json').value
        let treeRoot = JSON.parse(treeJson)
        
        
        let treeDepth = measureDepth(treeRoot, 0)
        let canvasHeight = 2*NODE_RADIUS + (treeDepth-1)*(LINE_Y+2*NODE_RADIUS) + OFFSET+1
        let canvasWidth = Math.pow(2,(treeDepth-1))*(LINE_X+NODE_RADIUS)
        CURR_PEN_POS = [canvasWidth/2, OFFSET]

        canvas.setAttribute('height', canvasHeight)
        canvas.setAttribute('width', canvasWidth)

        drawTree(board, treeRoot, CURR_PEN_POS, canvasWidth/2)
    }
}

// main draw tree function
function drawTree(context, treeRoot, currCoords, deviation){
    if(treeRoot==null){
        return
    }
    CURR_PEN_POS = currCoords
    let newCoords = null
    drawNode(context, treeRoot.nodeVal)
    let tmp = CURR_PEN_POS
    
    if(treeRoot.left){
        newCoords = drawLine(context, false, deviation/2)
        drawTree(context, treeRoot.left, newCoords, deviation/2)
    }
    CURR_PEN_POS = tmp
    if(treeRoot.right){
        newCoords = drawLine(context, true, deviation/2)
        drawTree(context, treeRoot.right, newCoords, deviation/2)
    }
}

// drawing helper functions
function drawNode(context, nodeVal){
    context.beginPath()
    context.arc(CURR_PEN_POS[0], CURR_PEN_POS[1]+NODE_RADIUS, NODE_RADIUS, 0, Math.PI*2, false)
    context.fillText(String(nodeVal), CURR_PEN_POS[0]-3, CURR_PEN_POS[1]+NODE_RADIUS+2)
    context.stroke()
    context.closePath()
    CURR_PEN_POS = [CURR_PEN_POS[0], CURR_PEN_POS[1]+2*NODE_RADIUS]
    
}

function drawLine(ctx, isRightChild, deviation){
    ctx.beginPath()
    ctx.moveTo(...CURR_PEN_POS)
    if(!isRightChild){
        ctx.lineTo(CURR_PEN_POS[0]-deviation, CURR_PEN_POS[1]+LINE_Y)
        CURR_PEN_POS = [CURR_PEN_POS[0]-deviation, CURR_PEN_POS[1]+LINE_Y]
    }else{
        ctx.lineTo(CURR_PEN_POS[0]+deviation, CURR_PEN_POS[1]+LINE_Y)
        CURR_PEN_POS = [CURR_PEN_POS[0]+deviation, CURR_PEN_POS[1]+LINE_Y]
    }
    ctx.stroke()
    ctx.closePath()

    return CURR_PEN_POS
}

// logic helper functions
class CustomTreeNode{
    constructor(nodeVal, left=null, right=null){
        this.nodeVal = nodeVal
        this.left = left
        this.right = right
    }
}

function genTree(){
    let rootNode = new CustomTreeNode(nodeVal=1)
    rootNode.left = new CustomTreeNode(nodeVal=2)
    rootNode.right = new CustomTreeNode(nodeVal=3)
    temp = rootNode.right
    temp.left = new CustomTreeNode(nodeVal=4)
    temp.right = new CustomTreeNode(nodeVal=5)
    temp = temp.left
    temp.left = new CustomTreeNode(nodeVal=6)
    temp.right = new CustomTreeNode(nodeVal=7)
    temp = rootNode.left
    temp.left = new CustomTreeNode(nodeVal=8)
    temp.right = new CustomTreeNode(nodeVal=9)
    
    return rootNode
}

function measureDepth(root, level){
    if(root==null){
        return level
    }

    return measureDepth(root.left, level+1)>=measureDepth(root.right, level+1)?
    measureDepth(root.left, level+1):
    measureDepth(root.right, level+1)
}

// function genTreeJson(root, jsonString){
//     if(!root){
//         return jsonString
//     }

//     jsonString = '{}'
// }