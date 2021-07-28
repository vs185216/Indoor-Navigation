import {useEffect, useState} from 'react';
import { alpha, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import StoreIcon from '@material-ui/icons/Store';
import { NavLink, Redirect } from 'react-router-dom';
import './NavBar.css';
import { Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
const baseUrl = 'http://127.0.0.1:5000'
const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
    height: "100%"
  },
  home:{
    display: "flex",
    flexDirection:"row",
    alignItems:"center"
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'flex',
    justifyContent:"flex-start",
    // [theme.breakpoints.up('sm')]: {
    //   display: 'block',
    // },
    width:"3rem"
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100px',
    [theme.breakpoints.up('md')]: {
      width: '80ch',
    },
  },
  searchData:{
    position: "absolute",
    backgroundColor:"rgba(0,0,0,0.5)",
    width: '100%',
    zIndex:'100'
  },
  sectionDesktop: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  }
}));

let  NavBar = (props) => {
  const {navD,setNavD} = props;
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);

  const isMenuOpen = Boolean(anchorEl);
// my states
  const [searchTerm,setSearchTerm] = useState(null);
  const [showSearchResults,setShowSearchResults] = useState(false);
  const [searchData,setSearchData] = useState({stores:[{storeId:"s1",storeName:"electronics"},{storeId:"s2",storeName:"pulses"},{storeId:"s3",storeName:"clothes"},{storeId:"s4",storeName:"liquor"},{storeId:"s5",storeName:"tools"},{storeId:"s6",storeName:"kitchen-utensis"}],products:[{productId:'p1',productName:'jam'},{productId:'p2',productName:'maggi'},{productId:'p3',productName:'mariegold'},{productId:'p4',productName:'parle-g'}]});
  const [filteredData,setFilteredData] = useState({stores:[],products:[]});
  const [redirect,setRedirect] = useState(false);
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );
// my functions
  const handleSearchInput = (evt) => {
    setShowSearchResults(true);
    setSearchTerm(evt.target.value);
  }
  const getSearchResults = async() => {
    const config = {
      url:`${baseUrl}/storeList`,
      method:'get',
      // params:{
      //   dataType: 'both'
      // }
    };
    await axios(config).then(
      res=>{
        setSearchData({stores:[...res.data.storeList],products:[...res.data.productList]})
      },
    err=>{
      console.log(err);
    }
    )
  }
  const matchedResults = () => {
    let content = {stores:[],products:[]};
    if(searchTerm!==null){
      const regEx = new RegExp('^('+searchTerm.toLowerCase()+'.+)');
      searchData.stores.filter(val=>{
        if(regEx.test(val.storeName.toLowerCase())){
          return val;
        }
      }).map((val,key)=>{
        content.stores.push(<li key={key} onClick={()=>{setNavD({end:val.storeId,start:null}); setRedirect(true)}}>{val.storeName}</li>);
      });
      searchData.products.filter(val=>{
        if(regEx.test(val.productName.toLowerCase())){
          return val;
        }
      }).map((val,key)=>{
        content.products.push(<li key={key} onClick={()=>{setNavD({end:val.productId,start:null}); setRedirect(true)}}>{val.productName}</li>);
      })
    }
    setFilteredData({stores:content.stores,products:content.products});
  }


  useEffect(()=>{
    getSearchResults();
  },[])
  useEffect(()=>{
    if(searchTerm===''){
      setShowSearchResults(false);
    }
    matchedResults();
  },[searchTerm,redirect])

  return (
    <div className={classes.grow}>
      {redirect && <Redirect to="/map" />}
      <AppBar position="static">
        <Toolbar>
          <NavLink to="/" style={{textDecoration:'none',color:'white',fontFamily:"Helvetica, sans-serif",fontWeight:'bold'}}>
            <div className={classes.home}>
              <StoreIcon />
              <Typography className={classes.title} variant="h6" noWrap>
                IN
              </Typography>
            </div>
          </NavLink>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
              onChange={handleSearchInput}
              autoComplete="off"
            />
            {
              showSearchResults &&
                <div className={classes.searchData}>
                  <Container>
                    <Row>
                      <Col sm={3}>
                        <div className="searchData-Categories">
                          <p>Categories</p>
                          <ul>
                            {/* <li>Electronics</li>
                            <li>Vegetables</li>
                            <li>Pulses</li> */}
                            {filteredData.stores}
                          </ul>
                        </div>
                      </Col>
                      <Col sm={9}>
                        <div className="searchData-Products">
                          <p>Products</p>
                          <ul>
                            {/* <li>Jam 1</li>
                            <li>Jam 2</li>
                            <li>Jam 3</li> */}
                            {filteredData.products}
                          </ul>
                        </div>
                      </Col>
                    </Row>
                  </Container>
                </div>
            }
          </div>
          <div className={classes.sectionDesktop}>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMenu}
    </div>
  );
}

export default NavBar;