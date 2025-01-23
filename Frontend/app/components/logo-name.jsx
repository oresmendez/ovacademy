"use client";

import React from "react";
import styled from "styled-components";
import Image from "next/image";
import Link from "next/link";

export default function Logo_Name({ size_logo, size_name }) {
    return (
        <Componente $size_name={size_name}>
            <Link href="/" passHref>
                <div className="container-logo center">
                    <div className="logo">
                        <Image
                            src="/logo-color.svg"
                            alt="Logo de la empresa"
                            width={size_logo}
                            height={size_logo}
                            style={{ height: "auto", width: size_logo }}
                            priority
                        />
                    </div>
                    <div
                        className="logo-name"
                        style={{ fontSize: `${size_name}rem` }}
                    >
                        OVA
                        <span className="letter-strong">CADEMY</span>
                    </div>
                </div>
            </Link>
        </Componente>
    );
}

const Componente = styled.div`
    .container-logo {
        align-items: flex-end;
        cursor: pointer;
    }

    .logo {
        font-family: var(--font-lexend);
        color: var(--color-azul-oscuro-profundo);
        text-transform: uppercase;
        letter-spacing: 1.2px;
        position: relative;
        display: inline-block;
        line-height: 1.2;

        img {
            display: block;
            height: auto;
            max-width: 100%;
        }
    }

    .logo-name {
        margin-left: 1rem;
        color: #374f71;
        font-family: var(--font-lexend);
        font-weight: 400;
        text-transform: uppercase;
        padding-bottom: 0.1rem;
        letter-spacing: 1.2px;
        font-size: ${(props) => props.$size_name}rem;
    }

    .letter-strong {
        color: #1b365d;
        font-weight: 200;
        text-shadow: 1px 0.5px 1px rgba(2, 107, 149, 0.4);
    }
`;
