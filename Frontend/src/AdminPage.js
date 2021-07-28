import { useEffect, useState } from "react";
import { Container,Table } from "react-bootstrap";
import { TextField, Card, CardContent, CardActions, Input, FormControl, Button } from "@material-ui/core";
import {makeStyles} from '@material-ui/core/styles';
import axios from 'axios';
import Canvas from './Canvas';
import NavBar from './NavBarCommon';
import 'bootstrap/dist/css/bootstrap.min.css';
const baseUrl = 'http://127.0.0.1:5000';
const image = new Image();
const useStyles = makeStyles((theme) =>({
    // root: {
    //     '& > *':{
    //         margin: theme.spacing(1),
    //         width: '25ch'
    //     }
    // },
    tables:{
        marginTop: "2rem",
        display: "flex",
        flexDirection: "row",
    },
    table:{
        color: "white",
    },
    AdminPage:{
        // position: "relative",
        // width: "100vw",
        // height: "100vh",
        height:"100vh",
        backgroundColor: "#060316",
        color: "white",
    },
    AdminNav:{
        height: "7vh"
    },
    AdminBody:{
        backgroundColor: "inherit",
        height: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems:"center"
    },
    canvasGroup:{
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    uploadButton:{
        margin: "2rem 0"
    }
}))
let AdminPage = (props) => {
    let [nodes,setNodes] = useState({storeNodes:[],corridorNodes:[]});
    let [imageSrc, setImageSrc] = useState("");
    let [showCanvas, setShowCanvas] = useState(true);

    const addStoreNodes = (storeNode) => {
        setNodes({storeNodes:[...nodes.storeNodes, storeNode],corridorNodes:nodes.corridorNodes});
    }

    const addCorridorNodes = (cNode) => {
        setNodes({corridorNodes: nodes.corridorNodes.concat(cNode),storeNodes: nodes.storeNodes});
    }
    
    const classes = useStyles();
    const getTableData =(tableType) =>{
        let tableData = [];
        if(tableType === 'storeTable'){
            nodes.storeNodes.map(node => {
                tableData.push(<tr>
                                <td>{node.storeName}</td>
                                <td>{node.x}</td>
                                <td>{node.y}</td>
                                </tr>);
                                return null;
            })
        }else{
            nodes.corridorNodes.map(node => {
                tableData.push(<tr>
                    <td>{node.cNodeID}</td>
                    <td>{node.x}</td>
                    <td>{node.y}</td>
                    </tr>);
                    return null;
            })
        }
        return tableData;
    }
    let showStoreIdInput;
    // let [floorMap,setFloorMap] = useState('');
    // let [displayMap,setDisplayMap] = useState('');
    const getProcessedImage = async () => {
        setShowCanvas(true);

        let config = {
            method: 'get',
            url: `${baseUrl}/getGrayScaleImage`,
            timeout: 4000,
        }
        await axios(config).then(
            res => {
                setImageSrc(res.data.path);
            },
            err => {
                console.log(err);
            }
        )
        // setImageSrc(URL.createObjectURL(image));
        setShowCanvas(true);

    }

    const handleFile = async (evt) =>{
        setImageSrc(URL.createObjectURL(evt.target.files[0]));
        setShowCanvas(false);
        const formData = new FormData();
        formData.append('image',evt.target.files[0]);
        let config ={
            method: 'post',
            url: `${baseUrl}/getGrayScaleImage`,
            timeout: 4000,
            headers: { 'Content-Type': 'multipart/form-data' },
            data: formData,
            // responseType: 'blob'
        }
        await axios(config).then(res=>{
            getProcessedImage();
            // setShowCanvas(true);
        },err=> console.log(err));
    }
    
    const uploadNodes = async () => {
        const config = {
            method: 'post',
            url: `${baseUrl}/createGraph`,
            timeout: 4000,
            data: {
                storeNodes: nodes['storeNodes'],
                corridorNodes:nodes['corridorNodes']
            }
        };
        await axios(config).then(res => {
            console.log(res)
        },err=>console.log(err));
    }
    useEffect(() => {
        image.src = imageSrc;
    },[imageSrc]);
    console.log("AdminPage is rendered");
    return(
        <div className={classes.AdminPage}>
            <div className={classes.AdminNav}>
            <NavBar />
            </div>
            <div className={classes.AdminBody}>
                {showCanvas && 
                    <div className={classes.canvasGroup}>
                        <Canvas image={image} addStoreNodes={addStoreNodes} addCorridorNodes={addCorridorNodes} nodes={nodes} />
                        <Button className={classes.uploadButton} variant="contained" color="primary" onClick={uploadNodes}>Upload Nodes</Button>
                    </div>
                }
                <form >
                    <FormControl>
                        <Input variant="contained" color="secondary" type="file" name="image" accept=".jpeg, .png, .jpg" onChange={handleFile}/>
                    </FormControl>
                </form>
                
                {showStoreIdInput &&
                        <div className={classes.storeIdInput}>
                            <Card className={classes.card}>
                                <CardContent>
                                    <form className={classes.root} noValidate autoComplete="off">
                                        <TextField id="outlined-basic" label="Outlined" variant="outlined"/>
                                    </form>
                                </CardContent>
                                <CardActions className={classes.cardActions}>
                                    <Button variant="success">Upload</Button>
                                </CardActions>
                            </Card>
                        </div>
                }
                <div className={classes.tables}>
                    <Table className={classes.table} bordered>
                        <thead>
                            <tr>
                                <th rowSpan="2">Store Name</th>
                                <th colSpan="2">Position</th>
                            </tr>
                            <tr>
                                <th>X Pos</th>
                                <th>Y Pos</th>
                            </tr>
                        </thead>
                        <tbody>{getTableData('storeTable')}</tbody>
                    </Table>
                    <Table className={classes.table} bordered>
                        <thead>
                            <tr>
                                <th rowSpan="2">Corridor node number</th>
                                <th colSpan="2">Position</th>
                            </tr>
                            <tr>
                                <th>X Pos</th>
                                <th>Y Pos</th>
                            </tr>
                        </thead>
                        <tbody>{getTableData('corridorTable')}</tbody>
                    </Table>
                </div>
            </div>
        </div>
    )
}

export default AdminPage;