import React from 'react';


import{
    Link
  
  } from "react-router-dom";

function Menu() {
  return ( 
    <nav
        role="navigation"
        aria-label="Main menu"
        itemScope
        itemType="https://schema.org/SiteNavigationElement"


    >  
         <ul>
                <li><Link itemProp="url" to="/" title=" Home Budget">Home</Link></li>
                <li><Link itemProp="url" to="/about">About</Link></li>
                <li><Link itemProp="url" to="/login">Login</Link></li>
                <li><Link itemProp="url" to="https://google.com" title=" Search google for interesting things">Google</Link></li>
       
        </ul>
    </nav>
  );
}

export default Menu;
