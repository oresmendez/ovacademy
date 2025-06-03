'use client';

import { styled, Link } from '@/app/components/utils/rutas';
import Slider from "react-slick";
import { MdOutlineLocalLibrary } from "react-icons/md";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Carrousel({ boxes, settings, sliderRef }) {
    return (
        <Componente>
            <Slider ref={sliderRef} {...settings}>
                {boxes.map((box) => (
                    <div key={box.id}>
                        <div className="carousel-card card-wrapper">
                            <div className="card-content">
                                <Link href={`/ovacademy/estudiante/unidad/${box.id}`} passHref>
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
                                        <h3 className="card-title">{box.modulo}</h3>
                                        <p className="card-type">{box.nombre}</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
        </Componente>
    );
}

const Componente = styled.div`
    .carousel-card {
        width: 100%;
        max-width: 100%;
        padding: 10px;
        overflow: hidden;
        font-family: var(--font-lexend);
        font-weight: 400;
        font-size: 1rem;
    }

    .card-content {
        display: flex;
        flex-direction: column;
        width: 100%;
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
        flex-direction: column;
        align-items: flex-start;
        min-height: 300px;
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
        line-height: 1.5;
    }

    /* Forzar ancho completo del slide */
    .slick-slide > div {
        width: 100%;
        display: flex;
        justify-content: center;
    }
`;
