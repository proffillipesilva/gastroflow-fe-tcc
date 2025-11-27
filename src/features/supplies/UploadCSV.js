import React, { useState } from "react";
import LogoGastroFlow from "../../assets/LogoGastroFlow.png";
import ProdutoService from "../home/service/ProdutoService";

import { useStatusModalStore } from "../../shared/store/modal-store";
import { useNavigate } from "react-router-dom";

const EnviarCSV = () => {
    const navigate = useNavigate();
    const { showLoading, showSuccess, showError } = useStatusModalStore();

    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) {
            showError("Selecione um arquivo CSV!");
            return;
        }

        try {
            showLoading("Enviando arquivo CSV...");

            const formData = new FormData();
            formData.append("inputFile", file);

            await ProdutoService.UploadCSV(formData);

            showSuccess("Arquivo CSV enviado com sucesso!");
            setFile(null);
        } catch (err) {
            console.error(err);
            showError("Erro ao enviar o arquivo CSV!");
        }
    };


    return (
        <div className="flex w-screen h-screen overflow-hidden bg-white text-gray-800 font-sans">

            {/* Conteúdo principal */}
            <div className="flex-1 min-w-0 flex flex-col overflow-hidden bg-orange-100 ml-64">

                {/* Topbar */}
                <div className="h-28 shrink-0 bg-gradient-to-r from-orange-400 via-yellow-500 to-orange-600 
                        flex flex-col items-center justify-center text-white rounded-b-3xl shadow-md">
                    <h2 className="text-2xl font-bold">Enviar arquivo CSV</h2>
                </div>

                {/* Conteúdo */}
                <div className="flex-1 flex items-center justify-center p-4 md:p-6">

                    <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row gap-8">

                        {/* Card */}
                        <div className="w-full md:w-[520px] bg-white rounded-2xl p-8 shadow-lg flex flex-col">

                            <h3 className="text-xl font-semibold text-gray-800 mb-6">
                                Upload de Produtos via CSV
                            </h3>

                            <form onSubmit={handleSubmit} className="space-y-5 w-full">

                                {/* Input File */}
                                {/* Selecionar CSV estilizado */}
                                <div className="flex flex-col gap-2">

                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Selecionar CSV
                                    </label>

                                    {/* Input invisível */}
                                    <input
                                        id="inputFile"
                                        type="file"
                                        accept=".csv"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />

                                    {/* Botão bonito */}
                                    <button
                                        type="button"
                                        onClick={() => document.getElementById("input-csv").click()}
                                        className="w-full py-3 px-4 rounded-lg border border-orange-400 bg-orange-50 
               text-orange-700 font-medium shadow-sm hover:bg-orange-100 
               hover:border-orange-500 transition flex items-center justify-center gap-2"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.8}
                                            stroke="currentColor"
                                            className="w-5 h-5"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M12 16.5v-9m0 0L7.5 12m4.5-4.5L16.5 12M6 19.5h12a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0018 4.5H6A2.25 2.25 0 003.75 6.75v10.5A2.25 2.25 0 006 19.5z"
                                            />
                                        </svg>

                                        Selecionar arquivo CSV
                                    </button>

                                    {/* Exibe nome do arquivo */}
                                    {file && (
                                        <p className="text-xs text-gray-600">
                                            Arquivo selecionado: <span className="font-medium">{file.name}</span>
                                        </p>
                                    )}
                                </div>


                                {/* Botões */}
                                <div className="flex flex-col space-y-3 pt-2">
                                    <button
                                        type="submit"
                                        className="py-2 px-4 rounded-lg shadow-md text-sm font-medium 
                               text-white bg-orange-500 hover:bg-orange-600 
                               focus:ring-2 focus:ring-orange-400 transition"
                                    >
                                        Enviar CSV
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => navigate("/CadastroDeProdutos")}
                                        className="py-2 px-4 rounded-lg shadow-md text-sm font-medium 
                               text-gray-700 bg-gray-200 hover:bg-gray-300 transition"
                                    >
                                        Voltar
                                    </button>
                                </div>

                            </form>
                        </div>

                        {/* Logo */}
                        <div className="hidden md:flex flex-1 items-center justify-center rounded-2xl p-6">
                            <img
                                src={LogoGastroFlow}
                                alt="Logo"
                                className="flex-1 w-full h-[21rem] object-contain"
                            />
                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default EnviarCSV;
