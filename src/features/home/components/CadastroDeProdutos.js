import React, { useState } from "react";
import LogoGastroFlow from "../../../assets/LogoGastroFlow.png";
import ProdutoService from "../service/ProdutoService";

import { useStatusModalStore } from "../../../shared/store/modal-store";
import { useNavigate } from "react-router-dom";

const CadastroDeProdutos = () => {

  const navigate = useNavigate();

  const [formState, setFormState] = useState({
    nome: "",
    unidadeMedida: "",
    categoria: "",
  });

  // === STATUS MODAL (GLOBAL) ===
  const { showLoading, showSuccess, showError } = useStatusModalStore();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formState.nome || !formState.unidadeMedida || !formState.categoria) {
      showError("Preencha todos os campos!");
      return;
    }

    try {
      showLoading("Cadastrando produto...");

      await ProdutoService.RegisterProduct({
        nome: formState.nome,
        unidadeMedida: formState.unidadeMedida,
        categoria: formState.categoria,
        quantidadeEstoque: 0
      });

      showSuccess("Produto cadastrado com sucesso!");

      setFormState({
        nome: "",
        unidadeMedida: "",
        categoria: "",
        quantidadeEstoque: 0
      });

    } catch (err) {
      console.error(err);

      if (err.response && err.response.status === 403) {
        showError("Acesso negado! Verifique suas credenciais.");
      } else {
        showError("Erro ao cadastrar produto!");
      }
    }
  };

  return (
    <div className="flex w-full min-h-screen bg-[#ffffff] text-gray-800 font-sans overflow-x-hidden">

      <div className="flex-1 flex flex-col bg-orange-100">

        {/* Topbar */}
        <div className="h-28 shrink-0 bg-gradient-to-r from-orange-400 via-yellow-500 to-orange-600 
                        flex flex-col items-center justify-center text-white rounded-b-3xl overflow-hidden">
          <h2 className="text-base md:text-2xl font-bold">Cadastrar Produtos</h2>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 flex items-center justify-center p-4 md:p-6 overflow-hidden">

          <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row gap-8 
                md:mr-[100px] lg:mr-[110px]">

            {/* Formulário */}
            <div className="w-full md:w-[520px] bg-white rounded-2xl p-8 shadow-lg flex flex-col">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">
                Cadastrar novo ingrediente
              </h3>

              <form onSubmit={handleSubmit} className="space-y-5 w-full">

                {/* Nome */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Ingrediente
                  </label>
                  <input
                    type="text"
                    name="nome"
                    value={formState.nome}
                    onChange={handleChange}
                    placeholder="Ex: Arroz Branco"
                    className="block w-full rounded-lg border border-gray-300 shadow-sm 
                               focus:ring-2 focus:ring-orange-400 focus:border-orange-400 p-2 text-sm"
                  />
                </div>

                {/* Unidade + Categoria */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Unidade de Medida
                    </label>
                    <select
                      name="unidadeMedida"
                      value={formState.unidadeMedida}
                      onChange={handleChange}
                      className="block w-full rounded-lg border border-gray-300 shadow-sm 
                                 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 p-2 text-sm"
                    >
                      <option value="">Selecione a medida</option>
                      <option value="g">Gramas</option>
                      <option value="ml">Mililitros (ml)</option>
                      <option value="unidades">Unidades (un)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Categoria
                    </label>
                    <select
                      name="categoria"
                      value={formState.categoria}
                      onChange={handleChange}
                      className="block w-full rounded-lg border border-gray-300 shadow-sm 
                                 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 p-2 text-sm"
                    >
                      <option value="">Selecione a categoria</option>
                      <option value="estocaveis">Estocáveis</option>
                      <option value="hortifruti">Hortifrúti</option>
                      <option value="acougues">Açougues</option>
                      <option value="laticinios">Laticínios</option>
                    </select>
                  </div>

                </div>

                {/* Botões */}
                <div className="flex flex-col space-y-3 pt-2">
                  <button
                    type="submit"
                    className="py-2 px-4 rounded-lg shadow-md text-sm font-medium 
                               text-white bg-orange-500 hover:bg-orange-600 focus:ring-2 focus:ring-orange-400 transition"
                  >
                    Cadastrar Ingrediente
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setFormState({ nome: "", unidadeMedida: "", categoria: "" })
                    }
                    className="py-2 px-4 rounded-lg shadow-md text-sm font-medium 
                               text-gray-700 bg-gray-200 hover:bg-gray-300 transition"
                  >
                    Cancelar
                  </button>
                </div>

              </form>
              <div className="flex items-center my-4">
                <div className="flex-1 h-px bg-gray-300"></div>
                <span className="px-3 text-gray-500 text-sm">ou</span>
                <div className="flex-1 h-px bg-gray-300"></div>
              </div>

              {/* Link para página de upload CSV */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => navigate("/EnviarCSV")}
                  className="text-orange-600 font-medium hover:underline hover:text-orange-700 transition"
                >
                  Enviar arquivo CSV
                </button>
              </div>
            </div>

            {/* Logo */}
            <div className="hidden md:flex flex-1 items-center justify-center rounded-2xl p-6">
              <img
                src={LogoGastroFlow}
                alt="Logo"
                className="w-full max-w-sm h-[21rem] object-contain"
              />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CadastroDeProdutos;
