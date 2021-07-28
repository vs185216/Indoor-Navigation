import NavBar from './NavBarCommon';
import {Carousel} from 'react-bootstrap';
import { makeStyles, TextField } from '@material-ui/core';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
// const stores = ["electronics","pulses","clothes","liquor","tools","kitchen-utensis"];
const baseUrl = 'http://127.0.0.1:5000';
const useStyles = makeStyles({
    root:{

    },
    MapPageBody:{
        marginTop:"2rem",
        display:"flex",
        flexDirection:"column",
        alignItems:"center"
    },
    searchComponent:{
        marginTop: "2rem"
    },
    search:{
        width: "40rem",
        border: "none"
    },
    results:{
        position: "absolute",
        zIndex:"100",
        width:"40rem",
        backgroundColor:"rgba(255,255,255,1)",
        border: "1px solid grey",
        borderRadius: "5px"
    },
    carousel:{
        marginTop: "2rem"
    }
})
let MapPage = (props) => {
    const {navD,setNavD,imageSrc} = props;
    const classes = useStyles();
    const [searchInput,setSearchInput] = useState('');
    const [storeList,setStoreList] = useState({stores:[{storeId:"s1",storeName:"electronics"},{storeId:"s2",storeName:"pulses"},{storeId:"s3",storeName:"clothes"},{storeId:"s4",storeName:"liquor"},{storeId:"s5",storeName:"tools"},{storeId:"s6",storeName:"kitchen-utensis"}]});
    const [redirect,setRedirect] = useState(false);
    const stores = useRef(null);
    //methods
    const handleSearchInput = (evt) => {
        setSearchInput(evt.target.value);
    }

    const matchedResults = () => {
        let filterData =[];
        if(searchInput !== ''){
            const regEx = new RegExp('^('+searchInput.toLowerCase()+'.+)');
            console.log(storeList)
            storeList.filter(val=> {
                if(regEx.test(val.storeName.toLowerCase())){
                    return val;
                  }
            }).map((val,key) => {
                filterData.push(
                <div className={classes.storeName} key={key} onClick={()=>{setNavD({end:navD.end,start:val.storeId});setRedirect(true)}}>
                    <p>{val.storeName}</p>
                </div>
                )
            })
        }
        return filterData;
        console.log(filterData);
    }
    useEffect(() => {
        const config = {
            url:`${baseUrl}/storeList`,
            method: "get",
            // params:{
            //     dataType: "storeList"
            // }
        }
        axios(config).then(res => {
            setStoreList(res.data.storeList);
            stores.current = res.data.storeList;
            console.log(stores.current);
        },error => {
            console.log(error);
        })
    },[])
    return(
        <>
            <NavBar />
            <div className={classes.MapPageBody}>
                {navD.end===null && <Redirect to="/"/> || redirect && <Redirect to="/navigation" />}
                <h1>Enter nearby store</h1>
                <div className={classes.searchComponent}>
                    <TextField 
                        className={classes.search} 
                        id="outlined-basic" 
                        label="Enter Store" 
                        variant="outlined" 
                        value={searchInput}
                        onChange={handleSearchInput}
                        autoComplete="off"
                    />
                    <div className={classes.results}>
                        {matchedResults()}
                    </div>
                </div>
                <Carousel className={classes.carousel}>
                <Carousel.Item>
                  <img src={imageSrc} />
                  <Carousel.Caption>
                    <h1>Floor one</h1>
                    <p>It is the floor one</p>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                  <img src={imageSrc}/>
                  <Carousel.Caption>
                    <h1>Floor Two</h1>
                    <p>It is the floor two</p>
                  </Carousel.Caption>
                </Carousel.Item>
            </Carousel>
            </div>
        </>
    )
}

export default MapPage;