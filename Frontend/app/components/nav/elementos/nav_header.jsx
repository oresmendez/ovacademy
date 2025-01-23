"use client";

import React from "react";
import PropTypes from 'prop-types';
import styled from "styled-components";

import Logo_Name from '@/app/components/logo-name';

import { IoCloseSharp} from "react-icons/io5";

export default function Nav_header({ handleClick, clicked }) {
    return (
        <Componente>

        <div className="user-menu-header center-left">
            <button className="nav-header-close-icon center" onClick={handleClick}>
                <IoCloseSharp className={`icon-exit ${clicked ? 'active' : ''}`} />
            </button>
            <div className="pt-01 ml-15">
                <Logo_Name size_logo={35} size_name={1.5} />
            </div>
        </div>
            
        </Componente>
    );
}

Nav_header.propTypes = {
    handleClick: PropTypes.func.isRequired,
    clicked: PropTypes.bool.isRequired,
};

const Componente = styled.div`

    .user-menu-header {
        text-decoration: none;
        height: var(--size--header);
        padding: 0 2rem 0 1rem;
        background-color: var(--color-blanco);
    }

    .nav-header-close-icon{
        background-color: var(--color-blanco);
        border: 0;
        width: 36px;
        height: 36px;
        border-radius: 25px;
    }

    .nav-header-close-icon:hover{
        background-color: #ebebeb;
    }

    .logo{
        font-size: 25px;
    }

    .icon-exit {
        color: var(--ui-color-icon-neutral);
        font-size: 20px;
    }

`;