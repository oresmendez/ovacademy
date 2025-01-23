"use client";

import React from "react";
import styled from "styled-components";
import Slider from "react-slick";
import Link from 'next/link';
import { MdOutlineLocalLibrary } from "react-icons/md";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Carrousel({ boxes, settings, sliderRef }) {
    return (
        <Componente>
            <Slider ref={sliderRef} {...settings}>
                {boxes.map((box, index) => {
                    return (
                        <div key={index} className="carousel-card card">
                            <div className="card-content">
                                <Link href={`/ovacademy/materias/${box.id}`} passHref>
                                    <div
                                        className="card-imagen center"
                                        style={{
                                            background: "linear-gradient(to right, #79aec5, #296ab9)",
                                            width: "100%",
                                            height: "150px",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            borderRadius: "8px 8px 0 0"
                                        }}
                                    >
                                        <MdOutlineLocalLibrary style={{ fontSize: "100px", color: "#efefef" }} />
                                    </div>
                                    <div className="card-content-description">
                                        <h3 className="card-title">{box.nombre}</h3>
                                        <p className="card-type">{box.descripcion}</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </Slider>
        </Componente>
    );
}

const Componente = styled.div`
    .carousel-card {
        padding: 10px;
        max-width: 350px;
        width: 350px; /* Ancho fijo */
        overflow: hidden;

        font-family: var(--font-lexend);
        font-weight: 400;
        font-size: 1rem;
    } 

    .card-content {
        display: flex;
        flex-direction: column;
        background-color: #fff;
        border-radius: 8px;
        border: 1px solid #ddd;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease-in-out;
    }

    .card-content:hover {
        transform: scale(1.05);
        box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
        cursor: pointer;
    }

    .card-imagen {
        width: 100%;
        height: 150px;
        overflow: hidden;
        border-radius: 8px 8px 0 0;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .card-content-description {
        padding: 0.5rem 1rem;
        font-size: 0.9rem;
        color: #555;
        display: flex;
        flex-direction: column; /* Permite que los elementos internos se apilen */
        align-items: flex-start; /* Asegura alineación con el texto */
        min-height: 300px; /* Ajusta al contenido */
        height: 100%;
        max-height: 400px;
    }

    .card-title {
        font-size: 1.2rem;
        font-weight: bold;
        margin: 0.5rem 0;
    }

    .card-type {
        font-size: 1rem;
        color: #777;
        margin: 1rem 0;
        text-align: justify;
        line-height: 1.5; /* Mejora la legibilidad */
    }
`;

