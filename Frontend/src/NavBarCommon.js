import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import StoreIcon from '@material-ui/icons/Store';
import { NavLink } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  grow:{
    flexGrow:1
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
}));

export default function NavBar() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
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
            <div className={classes.grow}></div>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}
