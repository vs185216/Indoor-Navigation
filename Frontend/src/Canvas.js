import useCanvas from './Hooks/useCanvas';
// import './Canvas.css';
import { useEffect, useRef, useState } from 'react';
import { makeStyles, Card, CardContent, TextField, CardActions, Button } from '@material-ui/core';
const useStyles = makeStyles((theme)=> ({
    root:{
        display: "flex",
        flexDirection:"column",
        alignItems:"center"
    },
    canvas:{
        margin: "2%"
    },
    storeIdInput:{
        position: "absolute",
        top: "0px",
        left: "0px",
        width: "100vw",
        height: "93vh",
        // height: "100%",
        backgroundColor:"rgba(255,255,255,0.2)",
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
        marginTop: "7vh"
    },
    card:{
        width: "25%",
        margin: "10px"
    },
    cardActions:{
        display: "flex",
        justifyContent: "center"
    }
}))
let Canvas = (props) => {
    const classes = useStyles();
    const {image,addStoreNodes,addCorridorNodes,nodes} = props;
    const nodeRef = useRef(null);
    const prevNodePos = useRef(null);
    const canvasRef = useRef(null);
    const node = useRef({x:null,y:null});
    let [showForm,setShowForm] = useState(false);
    let [enterStoreNodes,setEnterStoreNodes] = useState(true);
    let [corridorNodeNum,setCorridorNodeNum] = useState(1);
    const drawGrid = (width, height, grid_size, canvas) => {
        for (var x = 0; x <= width; x += grid_size) {
            canvas.moveTo(x, 0);
            canvas.lineTo(x, height);
        }
    
        for (var y = 0; y <= height; y += grid_size) {
            canvas.moveTo(0, y);
            canvas.lineTo(width, y);
        }
        canvas.strokeStyle = "black";
        canvas.stroke();
    }
    const toggleShowForm = () => {
        setShowForm(!showForm);
    }
    const toggleEnterStoreNodes = () => {
        setEnterStoreNodes(!enterStoreNodes);
        node.current = null;
        prevNodePos.current = null;
        //setNode({x:null,y:null});
    }
    const handleForm = (evt) => {
        evt.preventDefault();
        node.current = {storeName:evt.target[0].value,...node.current};
        addStoreNodes(node.current);
        toggleShowForm();
    }
    const handleCorridorNode = () => {
        setCorridorNodeNum(corridorNodeNum+1);
        node.current = {cNodeId:corridorNodeNum,...node.current};
        addCorridorNodes(node.current);
    }
    const getNodePosition = (evt) => {
        const {top,left} = canvasRef.current.getBoundingClientRect();
        let nodePosX = Math.floor((evt.clientX-left)/20);
        let nodePosY = Math.floor((evt.clientY-top)/20);
        if(prevNodePos.current){
            const pnodePosX = prevNodePos.current.x;
            const pnodePosY = prevNodePos.current.y;
            if(nodePosX === pnodePosX+1 || nodePosX === pnodePosX-1){
                nodePosX = pnodePosX;
            }
            if(nodePosY === pnodePosY+1 || nodePosY === pnodePosY-1){
                nodePosY = pnodePosY;
            }
        }
        // setNode({x:nodePosX,y:nodePosY});
        node.current = {x:nodePosX,y:nodePosY};
        enterStoreNodes ? toggleShowForm() : handleCorridorNode();
        prevNodePos.current = node.current;

    }
    const drawNodes = (ctx,nodes) => {
        let gridBox = 20;
        // ctx.beginPath();
        nodes.map(node => {
            let nodePosX = node.x;
            let nodePosY = node.y;
            let displayText = enterStoreNodes? node.storeName: 'C'+node.cNodeId;
            ctx.beginPath();
            ctx.arc(nodePosX * gridBox + 10, nodePosY * gridBox + 10, 7, 0, 2 * Math.PI);
            ctx.strokeStyle = "black";
            ctx.stroke();
            ctx.fillStyle = "red";
            ctx.fill();
            ctx.font = 'bold 15px Arial';
            ctx.fillStyle ='black';
            ctx.fillText(displayText, nodePosX * gridBox - 10, nodePosY * gridBox - 10);
        })
       
    }
    useEffect(() => {
        nodeRef.current = null;
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        const render = () => {
            context.drawImage(image,0,0);
            drawGrid(image.width, image.height,20,context);
            if(node.x !== null){
                enterStoreNodes? drawNodes(context,nodes.storeNodes): drawNodes(context,nodes.corridorNodes)
            }
        }
        render();
    },[node.current])
    return(
        <div className={classes.root}>
            <h1>{enterStoreNodes?'Select store nodes':'Enter corridor nodes'}</h1>
            <canvas className={classes.canvas} ref={canvasRef} width={image.width} height={image.height} onClick={getNodePosition}/>
            <Button variant="contained" color="primary" onClick={toggleEnterStoreNodes}>{enterStoreNodes?"Add Stores":"Add Corridors"}</Button>
            {showForm &&
                        <div className={classes.storeIdInput} onClick={toggleShowForm}>
                            <Card className={classes.card} onClick={evt => evt.stopPropagation()}>
                                <form className={classes.root} noValidate autoComplete="off" onSubmit={handleForm}>
                                    <CardContent>
                                            <TextField id="outlined-basic" label="Outlined" variant="outlined"/>
                                    </CardContent>
                                    <CardActions className={classes.cardActions}>
                                        <Button type="submit" variant="contained" color="primary">Upload</Button>
                                    </CardActions>
                                </form>
                            </Card>
                        </div>
                }
        </div>
    )
}

export default Canvas;