import { useEffect, useState } from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import axios from 'axios';
import AdminPage from './AdminPage';
import './App.css';
import HomePage from './HomePage';
import MapPage from './MapPage';
import NavigationPage from './NavigationPage';
const baseUrl = 'http://127.0.0.1:5000';
let  App = () => {
  const [navDestinations,setNavDestinations] = useState({start:null,end:null});
  const [imageSrc,setImageSrc] = useState("https://wcs.smartdraw.com/planogram/img/store-layout-example.png?bn=15100111799");
  
  useEffect(()=>{
    let config = {
      method: 'get',
      url: `${baseUrl}/getProcessedImage`,
      timeout: 4000,
    };
    const getProcessedImage = async() =>{
      await axios(config).then(
        res => {
            console.log(res);
            setImageSrc(res.data.path);
        },
        err => {
            console.log(err);
        }
      )
    }
    getProcessedImage();
  },[])
  // const handleNavDestinations = (destination,isStart) =>{
  //   isStart?
  //     setNavDestinations({start:destination,...navDestinations}):
  //       setNavDestinations({...navDestinations,end:destination});
  // }
  return (
      <Switch>
        <Route exact path="/" render={(props)=><HomePage {...props} navD={navDestinations} setNavD={setNavDestinations}/>} />
        <Route exact path="/map" render={(props)=><MapPage {...props} navD={navDestinations} setNavD={setNavDestinations} imageSrc={imageSrc}/>}/>
        <Route exact path="/admin" render={(props)=><AdminPage/>} />
        <Route exact path="/navigation" render={(props)=><NavigationPage navD={navDestinations} imageSrc={imageSrc}/>} />
        <Route render={()=><Redirect to='/'/>}/>
      </Switch>
  );
}

export default App;
