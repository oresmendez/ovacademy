'use client';

import { useState, useRef } from "react";
import styled from 'styled-components';
import Carrousel from '@/app/components/carrousel';
import '@/app/globals.css';

import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

// Botones personalizados
const PrevArrow = ({ onClick }) => (
    <button
        className="custom-arrow center prev-arrow wrapper-shadow-button"
        onClick={onClick}
        aria-label="Previous Slide"
    >
        <IoIosArrowBack />
    </button>
);

const NextArrow = ({ onClick }) => (
    <button
        className="custom-arrow center next-arrow wrapper-shadow-button"
        onClick={onClick}
        aria-label="Next Slide"
    >
        <IoIosArrowForward />
    </button>
);

export default function Carrousel_main({ boxes = [], tittle = "", description = "" }) {
    const sliderRef = useRef(null);
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 5;
    const slidesToScroll = 1;

    // Calcula el total de páginas (asegura al menos 1 página)
    const totalPages = Math.max(1, Math.ceil((boxes.length || 0) / itemsPerPage));

    // Configuración del carrusel
    const settings = {
        dots: false,
        infinite: true,
        speed: 1000,
        slidesToShow: boxes.length > 0 ? Math.min(itemsPerPage, boxes.length) : 1, // Asegura valores válidos
        slidesToScroll: Math.min(slidesToScroll, boxes.length > 0 ? boxes.length : 1), // Evita errores
        autoplay: false,
        autoplaySpeed: 5000,
        pauseOnHover: true,
        draggable: true,
        cssEase: "ease-in-out",
        arrows: false,
        afterChange: (currentSlideIndex) => {
            const newPage = Math.ceil((currentSlideIndex + 1) / slidesToScroll);
            setCurrentPage(Math.min(newPage, totalPages)); // Limitar al máximo totalPages
        },
    };

    return (
        <Componente>
            <div className="container-subjects">
                {/* Descripción y controles */}
                <div className="description-subjects center">
                    <div className="content-subjects">
                        <span className="title-content-subjects">{tittle}</span>
                        <span className="description-content-subjects">{description}</span>
                    </div>
                    <div className="botones-carrousel-subjects mr-10 center">
                        <div className="center mr-20">{`${currentPage}/${totalPages}`}</div>
                        <div className="navigation-controls top-controls center">
                            <PrevArrow onClick={() => sliderRef.current?.slickPrev()} />
                            <NextArrow onClick={() => sliderRef.current?.slickNext()} />
                        </div>
                    </div>
                </div>
                {/* Contenedor del carrusel */}
                <div className="carousel-container">
                    <Carrousel boxes={boxes} settings={settings} sliderRef={sliderRef} />
                </div>
            </div>
        </Componente>
    );
}

// Estilizado
const Componente = styled.div`
    .container-subjects {
        max-width: 95rem;
        margin: 2rem auto;
    }

    .description-subjects {
        justify-content: space-between;
    }

    .content-subjects {
        display: flex;
        flex-direction: column;
        font-family: var(--font-lexend);
        font-weight: 400;
    }

    .title-content-subjects {
        font-size: 1.2rem;
    }

    .description-content-subjects {
        margin-top: 0.5rem;
        font-weight: 300;
    }

    .botones-carrousel-subjects {
        justify-content: space-between;
    }

    .navigation-controls {
        margin: 10px 0;
        gap: 10px;
    }

    .top-controls {
        margin-bottom: 10px;
    }

    .carousel-container {
        margin-top: 30px;
    }

    .custom-arrow {
        background: white;
        color: black;
        padding: 0.7rem;
        border-radius: 5px;
        font-size: 1.2rem;
    }

    .custom-arrow:hover {
        cursor: pointer;
        background: #ebebeb;
    }
`;

