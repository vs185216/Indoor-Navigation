import { useState } from 'react';
import NavBar from './NavBarHomePage';
import EbayCarousel from './Carousel';

let HomePage = (props) => {
    return(
        <>
            <NavBar {...props} />
            <div className="HomePage">
                <EbayCarousel />
            </div>
        </>
    )
}

export default HomePage;