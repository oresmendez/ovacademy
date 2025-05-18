// ------------------REACT------------------- 

"use client";
// import {
//     useState, useEffect, useRef, useContext, createContext,
//     useParams, useRouter, usePathname, useSearchParams,
//     FaStar, IoCloseSharp,
//     PropTypes, styled, Link, toast, Cookies,
//     Select, EditorContent, Crucigrama, Quiz, TrueFalseQuiz

// } from '@/app/components/utils/rutas';

export { useState, useEffect, useRef, useContext, createContext } from 'react';
export { useParams, useRouter, usePathname, useSearchParams } from 'next/navigation';
export { FaStar } from "react-icons/fa";
export { IoCloseSharp} from "react-icons/io5";

import PropTypes from "prop-types";
export { PropTypes };

import Select from "react-select";
export { Select };

export { styled } from 'styled-components';

import Image from "next/image";
export { Image };

import Link from 'next/link';
export { Link };

import { toast, Toaster } from 'sonner';
export { toast, Toaster };

import Cookies from 'js-cookie';
export { Cookies };

// ------------------COMPONENTS------------------- 

import EditorContent from '@/app/components/editor-content';
export { EditorContent };

import DataTableIndex from '@/app/components/DataTableIndex';
export { DataTableIndex };

import Profile from '@/app/components/profile';
export { Profile };

import BannerMateria from '@/app/components/banner-materia';
export { BannerMateria };

import BannerMateriaUnidades from '@/app/components/banner-materia-unidades';
export { BannerMateriaUnidades };

import CarrouselMain from '@/app/components/carrousel-main';
export { CarrouselMain };

// ------------------UTILIS------------------- 

import { startSession } from '@/app/components/utils/login';
export { startSession };

import * as gestorCookie from "@/app/components/utils/gestorCookie";
export { gestorCookie };

//elimnina este componente mas adelant
import * as export_file from "@/app/components/utils/export_file";
export { export_file };


import * as apiRest from '@/app/components/utils/apiRest';
export { apiRest };

import * as utils from "@/app/components/utils/utils";
export { utils };

import * as utilsExport from "@/app/components/utils/utils-export";
export { utilsExport };

import { textBarHeader, HeaderProvider }  from '@/app/components/utils/HeaderContext';
export { textBarHeader, HeaderProvider };

import Spinner from '@/app/components/utils/spinnerLoading';
export { Spinner };


// ------------------BOVEDA COMPONENTS------------------- 

import ModalField from '@/app/components/utils/boveda-components/modal-field';
export { ModalField };

import ButtonSave from '@/app/components/utils/boveda-components/button-save';
export { ButtonSave };

import ButtonAccion from '@/app/components/utils/boveda-components/button-accion';
export { ButtonAccion };

import ButtonLabelEstatus from '@/app/components/utils/boveda-components/button-label-estatus';
export { ButtonLabelEstatus };

import InputField from '@/app/components/utils/boveda-components/input-field';
export { InputField };

import InputSearch from '@/app/components/utils/boveda-components/input-search';
export { InputSearch };

import TextAreaField from '@/app/components/utils/boveda-components/textArea-field';
export { TextAreaField };

import SelectField from '@/app/components/utils/boveda-components/select-field';
export { SelectField };

import WrapperTitleRegister from '@/app/components/utils/boveda-components/wrapper-title-register';
export { WrapperTitleRegister };

import MessageError from '@/app/components/utils/boveda-components/message-error';
export { MessageError };


// ------------------HEADER------------------- 

import LogoName from '@/app/components/logo/logo-name';
export { LogoName };

import LogoNameWhite from '@/app/components/logo/logo-name-white';
export { LogoNameWhite };

import BurguerButton from '@/app/components/header/BurguerButton';
export { BurguerButton };

import IconGroup from '@/app/components/header/IconGroup';
export { IconGroup };

import HeaderPrincipal from "@/app/components/header/main";
export { HeaderPrincipal };

import HeaderSearchBar from '@/app/components/header/header-search-bar';
export { HeaderSearchBar };

import Header from '@/app/components/header/header-app';
export { Header };

import Nav from '@home/components/header/nav/main';
export { Nav };

// ------------------FOOTER------------------- 

import Footer from '@home/components/footer/footer';
export { Footer };

// ------------------NAVEGACION------------------- 

import NavHeader from '@/app/components/header/nav/elementos/nav-header';
export { NavHeader };

import NavUser from '@/app/components/header/nav/elementos/nav-user';
export { NavUser };

import MenuElements from '@/app/components/header/nav/elementos/nav-enlaces';
export { MenuElements };

import NavFooter from '@/app/components/header/nav/elementos/nav-footer';
export { NavFooter };


// ---------------ADMINISTRADOR---------------  {/* <EditarMateria /> */}

import CrearProfesor from '@/app/components/administrador/crear-profesor';
export { CrearProfesor };

import ListarProfesores from '@/app/components/administrador/listar-profesores';
export { ListarProfesores };

import EditarMateria from '@/app/components/administrador/editar-materia';
export { EditarMateria };

import CrearSemestre from '@/app/components/administrador/crear-semestre';
export { CrearSemestre };

import ListarSemestres from '@/app/components/administrador/listar-semestres';
export { ListarSemestres };

import CrearAula from '@/app/components/administrador/crear-aula';
export { CrearAula };

import AsignarAulaSemestre from '@/app/components/administrador/asignar-aula-semestre';
export { AsignarAulaSemestre };

// -----------------PROFESOR----------------- 

import CrearEstudiante from '@/app/components/profesor/crear-estudiante';
export { CrearEstudiante };

import ListarEstudiantes from '@/app/components/profesor/listar-estudiantes';
export { ListarEstudiantes };

import ListarEstudianteSeccion from '@/app/components/profesor/listar-estudiantes-secciones';
export { ListarEstudianteSeccion };

import AsociarEstudianteSemestre from '@/app/components/profesor/asociar-estudiante-semestre';
export { AsociarEstudianteSemestre };

import CrearUnidades from '@/app/components/profesor/crear-unidades';
export { CrearUnidades };

import ListarUnidades from '@/app/components/profesor/listar-unidades';
export { ListarUnidades };

import ListarNotasEstudiantes from '@/app/components/profesor/listar-notas-estudiantes';
export { ListarNotasEstudiantes };

import CrearContenidos from '@/app/components/profesor/crear-contenidos';
export { CrearContenidos };

import ListarContenidos from '@/app/components/profesor/listar-contenidos';
export { ListarContenidos };

import EditarContenido from '@/app/components/profesor/editar-contenido';
export { EditarContenido };

import CrearEvaluaciones from '@/app/components/profesor/crear-evaluaciones';
export { CrearEvaluaciones };

import CrearSopaDeLetras from '@/app/components/profesor/crear-sopadeletras';
export { CrearSopaDeLetras };

import CrearCuestionario from '@/app/components/profesor/crear-cuestionario';
export { CrearCuestionario };

import CrearPreguntasAbiertas from '@/app/components/profesor/crear-preguntas-abiertas';
export { CrearPreguntasAbiertas };

import ListarEvaluaciones from '@/app/components/profesor/listar-evaluaciones';
export { ListarEvaluaciones };

// -----------------ESTUDIANTE----------------- 

import GenerarSopaDeLetras from '@/app/components/estudiante/generar-sopa-de-letras';
export { GenerarSopaDeLetras };

import SopaDeLetras from '@/app/components/estudiante/listar-sopa-de-letras';
export { SopaDeLetras };

import GenerarCuestionario from '@/app/components/estudiante/generar-cuestionario';
export { GenerarCuestionario };

import Cuestionario from '@/app/components/estudiante/listar-cuestionario';
export { Cuestionario };

import GenerarPreguntasAbiertas from '@/app/components/estudiante/generar-preguntas-abiertas';
export { GenerarPreguntasAbiertas };

import PreguntasAbiertas from '@/app/components/estudiante/listar-preguntas-abiertas';
export { PreguntasAbiertas };