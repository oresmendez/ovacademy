"use client";

import React from 'react';
import styled from "styled-components";
import { IoMdMenu } from "react-icons/io";
import '@/app/globals.css';


export default function BurguerButton(props) {
    return (
            <Componente>
                <div className="icon-hamburger center">
                    <div    onClick={props.handleClick} 
                            className="icono">
                        <IoMdMenu size={28}/>
                    </div> 
                </div>
            </Componente>

    );
}

const Componente = styled.div`

    .icon-hamburger {  
        padding: 0.8rem 1rem 0 1rem;
        
    }
        
    .icono{

        cursor: pointer;
        font-size: var(--ui-size-icon-md);
        color: var(--ui-color-icon-neutral);
        transition: color 0.3s ease;
    }

`;

