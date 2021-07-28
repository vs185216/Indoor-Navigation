import NavBar from "./NavBarCommon";
import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';
import { makeStyles } from "@material-ui/core";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import context from "react-bootstrap/esm/AccordionContext";
const baseUrl = 'http://127.0.0.1:5000';
const useStyles = makeStyles({
  root:{
    width: "100vw",
    height: "90vh",
    marginTop: "10vh",
    display: 'flex',
    flexDirection: "column",
    alignItems:"center"
  },
  canvas:{
    marginTop: "3rem"
  }
})
let NavigationPage = (props) => {
    const {navD,imageSrc} = props;
    let [nodes,setNodes] = useState([[160,160],[660,160],[660,420],[160,420]]);
    const image = new Image();
    const canvasRef = useRef(null);
    image.src = imageSrc;
    useEffect(() => {
        const config = {
          url: `${baseUrl}/findPath`,
          method: 'post',
          headers: {},
          data: {
            start: navD.start,
            destination: navD.end
          }
        }
        axios(config).then(res => {
            setNodes(res.data.path);
            console.log(res.data.path);
        }, err => {console.log(err)});
    },[])
    
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const render = () => {
      ctx.drawImage(image,0,0);      
      // let prevNode = null;
      // nodes.map((node,i) => {
      //   if(i>0 && i<nodes.length){
      //     context.moveTo(prevNode[0],prevNode[1]);
      //     context.lineTo(node[0],node[1]);
      //     context.strokeStyle="rgba(0,255,0.1)";
      //     context.stroke();
      //     prevNode = node;
      //   }else{
      //     if()
      //     prevNode = node;
      //     context.beginPath();
      //     context.arc(node[0],node[1],);
      //   }
      // })
      ctx.font = 'bold 20px Arial';
      ctx.beginPath();
      ctx.arc(nodes[0][0],nodes[0][1],7,0,2*Math.PI);
      ctx.strokeStyle="rgba(0,255,0,1)";
      ctx.stroke();
      ctx.fillStyle="green";
      ctx.fillText('End',nodes[0][0]-10,nodes[0][1]-10);
      ctx.moveTo(nodes[0][0],nodes[0][1]);
      ctx.fill();
      nodes.map(node=>{
        ctx.lineTo(node[0],node[1]);
        ctx.stroke();
        ctx.moveTo(node[0],node[1]);
      })
      ctx.beginPath();
      ctx.arc(nodes[nodes.length-1][0],nodes[nodes.length-1][1],7,0,2*Math.PI);
      ctx.strokeStyle="rgba(0,255,0,1)";
      ctx.stroke();
      ctx.fillStyle="red";
      ctx.fillText('Start',nodes[nodes.length-1][0]-10,nodes[nodes.length-1][1]-10);
      ctx.fill();
    }
    render();
  },[nodes])
  const classes = useStyles();
    return(
        <>
          {navD.start===null? <Redirect to="/" />:navD.end===null? <Redirect to="/map"/>:<Redirect to="/navigation"/>}
          <NavBar />
          <div className={classes.root}>
            <h3>Please follow the Path</h3>
            {/* <Carousel className="carousel-dark">
                <Carousel.Item>
                  <img src="https://wcs.smartdraw.com/planogram/img/store-layout-example.png?bn=15100111799" />
                  <Carousel.Caption>
                    <h1>Floor one</h1>
                    <p>It is the floor one</p>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                  <img src="https://wcs.smartdraw.com/planogram/img/store-layout-example.png?bn=15100111799" />
                  <Carousel.Caption>
                    <h1>Floor Two</h1>
                    <p>It is the floor two</p>
                  </Carousel.Caption>
                </Carousel.Item>
            </Carousel> */}
            <canvas className={classes.canvas} ref={canvasRef} width={image.width} height={image.height}></canvas>
          </div>
        </>
    )
}

export default NavigationPage;