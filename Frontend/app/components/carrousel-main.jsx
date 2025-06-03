'use client';

import { useState, useRef, styled } from '@/app/components/utils/rutas';
import Carrousel from '@/app/components/carrousel';
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

export default function CarrouselMain({ boxes = [], tittle = "", description = "" }) {
    const sliderRef = useRef(null);
    const [currentPage, setCurrentPage] = useState(1);

    const shouldCarouselMove = boxes.length > 5;
    const slidesToShow = Math.min(5, boxes.length);
    const totalPages = shouldCarouselMove
        ? Math.ceil(boxes.length / 1)
        : 1;

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
                {/* Descripción y controles */}
                <div className="description-subjects center">
                    <div className="content-subjects">
                        <span className="title-content-subjects">{tittle}</span>
                        <span className="description-content-subjects">{description}</span>
                    </div>

                    {shouldCarouselMove && (
                        <div className="botones-carrousel-subjects mr-10 center">
                            <div className="center mr-20">{`${currentPage}/${totalPages}`}</div>
                            <div className="navigation-controls top-controls center">
                                <PrevArrow onClick={() => sliderRef.current?.slickPrev()} />
                                <NextArrow onClick={() => sliderRef.current?.slickNext()} />
                            </div>
                        </div>
                    )}
                </div>

<div className={`carousel-container ${boxes.length < 5 ? 'center-slides' : ''}`}>
  <Carrousel boxes={boxes} settings={settings} sliderRef={sliderRef} />
</div>



            </div>
        </Componente>
    );
}

// Estilos con styled-components
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

    .carousel-container .slick-slide > div {

        display: flex;
        justify-content: center;
    }

.card-wrapper {
    width: 100%;
    max-width: 350px;
}

.carousel-card {
    width: 100%;
}
.carousel-container.less-than-five .slick-track {
    display: flex !important;
    justify-content: center;
    gap: 1rem; /* opcional, para separar un poco las tarjetas */
}

.carousel-container.center-slides .slick-track {
  display: flex !important;
  justify-content: center;
  align-items: stretch;
}

.carousel-container.center-slides .slick-slide {
  display: flex !important;
  justify-content: center;
  align-items: stretch;
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
