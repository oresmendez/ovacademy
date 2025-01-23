"use client";

import React from "react";
import styled from "styled-components";

export default function Nav_footer() {
    return (
        <Componente>
            <div className="user-menu-footer-wrapper">
                Cookie Policy
            </div>
        </Componente>
    );
}

const Componente = styled.div`

    .user-menu-footer-wrapper {
        border-top: 1px solid black;
        height: 3.75rem;
        color:var(--color-azul-vibrante);
        font-weight: 500;
        padding: 1rem 2rem;
    }
`;