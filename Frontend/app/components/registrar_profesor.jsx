'use client'; import {toast, apiRest} from '@/app/utils/hooks';

import { styled } from '@/app/utils/hooks';
import React, { useState } from "react";
import Modal from "react-awesome-modal";

export default function Registrar_profesor({ modal_teacher, closeModal_teacher }) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [verifyPassword, setVerifyPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!password?.trim() || !verifyPassword?.trim()) {
            return toast.error('Las contraseñas no pueden estar vacías.');
        }
        
        if (password !== verifyPassword) {
            setPassword("");
            setVerifyPassword("");
            return toast.error('Las contraseñas no coinciden.');
        }

        const response = await apiRest.fetchPost('http://localhost:3333/ovacademy/user', {
            email,
            password,
            type_id: 2,
        });

        if (response.status === 200) {
            toast.success("Usuario registrado existamente");
            
        }else{
            toast.error("Ocurrió un error");
        }

        setEmail("");
        setPassword("");
        setVerifyPassword("");
        setError("");
        closeModal_teacher();
    };

    return (
        <StyledModal>
            <Modal
                visible={modal_teacher}
                width="500"
                height="500"
                effect="fadeInUp"
                onClickAway={closeModal_teacher}
            >
                <div className="modal-container">
                    <h2>Registrar Profesor</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="input"
                            />
                        </div>
                        <div className="form-group">
                            <label>Contraseña</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="input"
                            />
                        </div>
                        <div className="form-group">
                            <label>Confirmar Contraseña</label>
                            <input
                                type="password"
                                value={verifyPassword}
                                onChange={(e) => setVerifyPassword(e.target.value)}
                                required
                                className="input"
                            />
                        </div>
                        {error && <div className="error">{error}</div>}
                        <button type="submit" className="submit-button">
                            Registrar
                        </button>
                    </form>
                    <button onClick={closeModal_teacher} className="close-button">
                        Cerrar
                    </button>
                </div>
            </Modal>
        </StyledModal>
    );
}

const StyledModal = styled.div`
    .modal-container {
        background-color: #ffffff;
        padding: 20px;
        border-radius: 20px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        text-align: center;
        font-family: 'Roboto', sans-serif;
        position: relative;
    }

    h2 {
        font-size: 22px;
        font-weight: 600;
        color: #333;
        margin-bottom: 20px;
    }

    .form-group {
        margin-bottom: 15px;
        text-align: left;
    }

    label {
        font-size: 14px;
        color: #555;
        margin-bottom: 5px;
        display: block;
    }

    .input {
        width: 100%;
        padding: 12px 15px;
        font-size: 14px;
        border: 1px solid #ddd;
        border-radius: 10px;
        background-color: #f7f9fc;
        box-sizing: border-box;
        transition: box-shadow 0.3s ease, border 0.3s ease;
    }

    .input:focus {
        border: 1px solid #6c63ff;
        box-shadow: 0 0 5px rgba(108, 99, 255, 0.5);
        outline: none;
    }

    .error {
        color: #ff4d4d;
        font-size: 12px;
        margin-bottom: 10px;
    }

    .submit-button {
        width: 100%;
        background-color: #6c63ff;
        color: white;
        border: none;
        padding: 12px;
        border-radius: 10px;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    .submit-button:hover {
        background-color: #574bda;
    }

    .close-button {
        background-color: transparent;
        color: #333;
        font-size: 14px;
        font-weight: bold;
        border: none;
        cursor: pointer;
        margin-top: 15px;
        transition: color 0.3s ease;
    }

    .close-button:hover {
        color: #ff4d4d;
    }
`;
