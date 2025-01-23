'use client';

import React from 'react';
import styled from 'styled-components';
import '@/app/globals.css';

import Logo_Name from '@/app/components/logo-name';
import BurguerButton from '@/app/components/header/BurguerButton';
import IconGroup from '@/app/components/header/IconGroup';

export default function Header({ handleClick, status }) {
    
    return (
        <Componente>
        <div className='container-header-welcome'>
            <div className='header-menu-logo'>
                <div className='menu-options center'>
                    <BurguerButton status={status} handleClick={handleClick}/>
                </div>
                <div className='header-main-elements center-right pl-20'>
                    <div className='header-logo'>
                        <Logo_Name size_logo={40} size_name={1.5} />
                    </div>
                </div>
            </div>
            <nav className='header-navigation'>
                <div className='header-navigation-test'></div>
                <div className='header-navigation-group'>
                    <div className='header-navigation-group-test'></div>
                    <div className='header-navigation-group center'>
                        <IconGroup/>
                    </div>
                </div>
            </nav>
        </div>
        </Componente>
    );
}

const Componente = styled.div`

    .container-header-welcome {
        height: var(--size--header);
        display: flex;
        justify-content: space-between;
    }

    .header-menu-logo{
        display:flex;
        flex-direction: row;
    }

    .menu-options{

    }

    .header-main-elements {
        width: auto;
    }

    .header-logo {
        width: 100%;
    }

    .header-navigation {
        display: flex;
        justify-content: space-between;
        width: 22rem;
    }

    .header-navigation-test {
        flex-grow: 1;
    }

    .header-navigation-group {
        display: flex;
        flex-grow: 2;
    }

    .header-navigation-group-test {
        flex: 1;
    }

    .header-navigation-group {
        padding-top: 0.4rem;
        justify-content: flex-end;
        
    }

    .group-signIn-button {
        color: var(--ui-color-button-label-negative);
        padding: 0.5rem 1rem;
        background-color: var(--color-azul-vibrante);
        border-radius: 2px;
    }
`;
