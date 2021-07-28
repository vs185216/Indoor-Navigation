import {Container,Navbar,Nav,Form,FormControl,Button, NavDropdown} from 'react-bootstrap';
import {makeStyles} from '@material-ui/core';
import 'bootstrap/dist/css/bootstrap.min.css';
const useStyles = makeStyles({
    root: {
        display: "flex",
        flexDirection:"row",
        justifyContent:"space-between"
    },
    navCollapse:{
        marginRight: "5rem"
    },
    search:{
        display: 'flex',
        flexDirection:"row",
        justifyContent:"flex-start"
    }
})
let NavBar = (props) => {
    const classes = useStyles();
    return(
        <Navbar bg="dark" expand="lg" variant="dark" className={classes.root}>
            <Container>
                <Navbar.Brand href="#">Navbar scroll</Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll" bsPrefix={classes.navCollapse}>
                    <Nav
                    className="mr-auto my-2 my-lg-0"
                    style={{ maxHeight: '100px' }}
                    navbarScroll
                    >
                    <Nav.Link href="#action1">Home</Nav.Link>
                    <Nav.Link href="#action2">Link</Nav.Link>
                    <NavDropdown title="Link" id="navbarScrollingDropdown">
                        <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
                        <NavDropdown.Item href="#action4">Another action</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="#action5">Something else here</NavDropdown.Item>
                    </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
                <div className={classes.search}>
                    <Form className="d-flex">
                            <FormControl
                                type="search"
                                placeholder="Search"
                                className="mr-2"
                                aria-label="Search"
                            />
                    </Form>
                </div>
            </Container>
        </Navbar>
    )
}

export default NavBar;