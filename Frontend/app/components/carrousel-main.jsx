'use client';

import { useState, useRef, useEffect } from 'react';
import { styled } from '@/app/components/utils/rutas';
import Carrousel from '@/app/components/carrousel';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const PrevArrow = ({ onClick }) => (
    <button className="custom-arrow center prev-arrow wrapper-shadow-button" onClick={onClick}>
        <IoIosArrowBack />
    </button>
);

const NextArrow = ({ onClick }) => (
    <button className="custom-arrow center next-arrow wrapper-shadow-button" onClick={onClick}>
        <IoIosArrowForward />
    </button>
);

export default function CarrouselMain({ boxes = [], tittle = "", description = "" }) {
    const sliderRef = useRef(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 480);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const shouldCarouselMove = boxes.length > 5;
    const slidesToShow = Math.min(5, boxes.length);
    const totalPages = shouldCarouselMove ? Math.ceil(boxes.length / 1) : 1;

    const settings = {
        dots: false,
        infinite: shouldCarouselMove,
        speed: 1000,
        slidesToShow,
        slidesToScroll: shouldCarouselMove ? 1 : 0,
        autoplay: shouldCarouselMove,
        autoplaySpeed: 5000,
        pauseOnHover: true,
        draggable: shouldCarouselMove,
        cssEase: "ease-in-out",
        arrows: false,
        afterChange: (currentSlideIndex) => {
            const newPage = Math.ceil((currentSlideIndex + 1) / 1);
            setCurrentPage(Math.min(newPage, totalPages));
        },
    };

    return (
        <Componente>
            <div className="container-subjects">
                <div className="description-subjects center">
                    <div className="content-subjects">
                        <span className="title-content-subjects">{tittle}</span>
                        <span className="description-content-subjects">{description}</span>
                    </div>

                    {!isMobile && shouldCarouselMove && (
                        <div className="botones-carrousel-subjects mr-10 center">
                            <div className="center mr-20">{`${currentPage}/${totalPages}`}</div>
                            <div className="navigation-controls top-controls center">
                                <PrevArrow onClick={() => sliderRef.current?.slickPrev()} />
                                <NextArrow onClick={() => sliderRef.current?.slickNext()} />
                            </div>
                        </div>
                    )}
                </div>

                <div className={`carousel-container ${!isMobile ? 'carousel-active' : ''} ${boxes.length < 5 ? 'center-slides' : ''}`}>
                    {isMobile ? (
                        <div className="mobile-list">
                            {boxes.map((box) => (
                                <div className="mobile-card" key={box.id}>
                                    <div className="card-wrapper">
                                        <div className="carousel-card card-content">
                                            <a href={`/ovacademy/estudiante/unidad/${box.id}`}>
                                                <div className="card-imagen" style={{
                                                    background: "linear-gradient(to right, #79aec5, #296ab9)",
                                                    height: "120px",
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    borderRadius: "8px 8px 0 0"
                                                }}>
                                                    <IoIosArrowForward style={{ fontSize: "80px", color: "#efefef" }} />
                                                </div>
                                                <div className="card-content-description">
                                                    <h3 className="card-title">{box.modulo}</h3>
                                                    <p className="card-type">{box.nombre}</p>
                                                </div>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <Carrousel boxes={boxes} settings={settings} sliderRef={sliderRef} />
                    )}
                </div>
            </div>
        </Componente>
    );
}

const Componente = styled.div`
    .container-subjects {
        max-width: 95rem;
        margin: 2rem auto;
        padding: 0 1rem;
    }

    .description-subjects {
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 1rem;
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
        max-width: 600px;
    }

    .botones-carrousel-subjects {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .navigation-controls {
        display: flex;
        gap: 0.5rem;
    }

    .carousel-container {
        margin-top: 30px;
    }

    .carousel-active .slick-slide > div {
        display: flex;
        justify-content: center;
    }

    .carousel-active.center-slides .slick-track {
        display: flex !important;
        justify-content: center;
        align-items: stretch;
    }

    .carousel-active.center-slides .slick-slide {
        display: flex !important;
        justify-content: center;
        align-items: stretch;
    }

    .mobile-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-top: 1rem;
    }

    .mobile-card {
        width: 100%;
        padding: 0 1rem;
    }

    .card-wrapper {
        width: 100%;
        max-width: 100% !important;
    }

    .carousel-card {
        width: 100%;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        overflow: hidden;
    }

    .card-content-description {
        padding: 1rem;
        color: #555;
    }

    .card-title {
        font-weight: bold;
        font-size: 1.1rem;
        margin-bottom: 0.5rem;
    }

    .card-type {
        font-size: 0.95rem;
        color: #777;
    }

    .custom-arrow {
        background: white;
        color: black;
        padding: 0.7rem;
        border-radius: 5px;
        font-size: 1.2rem;
        border: 1px solid #ccc;
        transition: background 0.3s;
    }

    .custom-arrow:hover {
        cursor: pointer;
        background: #ebebeb;
    }

    /* Móviles */
    @media (max-width: 480px) {
        .title-content-subjects {
            font-size: 1rem;
        }

        .description-content-subjects {
            font-size: 0.9rem;
        }

        .card-title {
            font-size: 1rem;
        }

        .card-type {
            font-size: 0.85rem;
        }

        .custom-arrow {
            font-size: 1rem;
            padding: 0.5rem;
        }
    }
`;
