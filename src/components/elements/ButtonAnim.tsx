import React from 'react';
import "../ui/ButtonAnim.css"

const ButtonAnim = ( {text = "My Location"}) => {
    return(
        <div class="header--scroll-wrapper">
            <a class="button smaller yellow secondary-white animation-zoom-in" href="#colors">
            <span>{text}</span>
            </a>
        </div>
    );
}

export default ButtonAnim;