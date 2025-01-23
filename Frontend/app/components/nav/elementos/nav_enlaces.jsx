"use client";

import React from "react";
import styled from "styled-components";
import '@/app/globals.css';



export default function MenuElements(props) {
    return (
        <Componente>
            <li>
                
                <i className="color-icono">
                    {props.icon}
                </i>
                <span>
                    {props.title} 
                </span>
            
            </li>
        </Componente>
    );
}

const Componente = styled.div`

    li{
        
        cursor: pointer;
        display: flex;
        flex-direction: row;
        padding: 1rem 1.5rem;
        color: #4c535e;
    }

    li:hover {
        background-color: #ebebeb;
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); 
        

    }

    li:hover i {
        color:var(--color-azul-vibrante);
    }

    span {
        font-weight: 400;
        font-size: 1rem;
        transition: color 0.3s ease;
    }

    li:hover span {
       color: var(--color-azul-vibrante);
       font-weight: 500;
    }

    i{
        margin-right: 0.5rem;
    }

`;