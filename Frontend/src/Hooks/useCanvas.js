import { useEffect, useRef } from "react";
const useCanvas = (draw,image) => {
    const canvasRef = useRef(null);
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
    const getNodePosition = (evt) => {
        const {top,left} = canvasRef.current.getBoundingClientRect();
        const nodePosX = Math.floor((evt.clientX-left)/20);
        const nodePosY = Math.floor((evt.clientY-top)/20);
        console.log(nodePosX,nodePosY);
    }
    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        let frameCount = 0;
        let animationFrameId;
        // const render = () => {
        //     frameCount++;
        //     draw(context,frameCount);
        //     animationFrameId = window.requestAnimationFrame(render);
        // }
        const render = () => {
            context.drawImage(image,0,0);
            drawGrid(image.width,image.height,20,context);
            draw(context,image,frameCount);
        }
        render();
        return(()=> {
            // window.cancelAnimationFrame(animationFrameId);
        })
    },[draw])

    return {canvasRef,getNodePosition};
}

export default useCanvas;