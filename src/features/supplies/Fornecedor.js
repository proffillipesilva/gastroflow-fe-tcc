import React, { useState } from "react";
import LogoGastroFlow from "../../assets/LogoGastroFlow.png";
import FornecedorService from "./Service/FornecedorService";
import { useStatusModalStore } from "../../shared/store/modal-store";

const Fornecedor = () => {
  const [formState, setFormState] = useState({
    razaoSocial: "",
    nomeFantasia: "",
    telefone: "",
    endereco: "",
    email: "",
  });

  const { showLoading, showSuccess, showError } = useStatusModalStore();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "telefone") {
      let v = value.replace(/\D/g, "");
      v = v.replace(/^(\d{2})(\d)/g, "($1) $2");
      v = v.replace(/(\d{5})(\d{4})$/, "$1-$2");
      setFormState((prev) => ({ ...prev, telefone: v }));
    } else {
      setFormState((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { razaoSocial, telefone, endereco, email } = formState;

    if (!razaoSocial || !telefone || !endereco || !email) {
      showError("Preencha todos os campos obrigatórios!");
      return;
    }

    try {
      showLoading("Cadastrando fornecedor...");

      await FornecedorService.RegisterFornecedor(formState);

      showSuccess(`Fornecedor "${razaoSocial}" cadastrado com sucesso!`);

      setFormState({
        razaoSocial: "",
        nomeFantasia: "",
        telefone: "",
        endereco: "",
        email: "",
      });
    } catch (err) {
      console.error(err);

      if (err.response?.status === 403) {
        showError("Acesso negado! Verifique suas credenciais.");
      } else if (err.response?.status === 400) {
        showError("Dados inválidos! Verifique as informações preenchidas.");
      } else {
        showError("Erro ao cadastrar fornecedor. Tente novamente.");
      }
    }
  };

  return (
    <div className="flex w-full min-h-screen bg-[#ffffff] text-gray-800 font-sans overflow-x-hidden">

      {/* Área direita */}
      <div className="flex-1 flex flex-col bg-orange-100">

        {/* Topbar FIXA SOMENTE NO MOBILE */}
        <div className="h-28 shrink-0 bg-gradient-to-r from-orange-400 via-yellow-500 to-orange-600 
                        flex flex-col items-center justify-center text-white rounded-b-3xl
                        md:relative fixed top-0 left-0 w-full z-3 shadow-md">
          <h2 className="text-base md:text-2xl font-bold">Cadastrar Fornecedor</h2>
        </div>

        {/* Conteúdo */}
        <div className="pt-32 md:pt-0 flex-1 flex items-center justify-center p-4 md:p-6 overflow-hidden">

          <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row gap-8 
                          md:mr-[100px] lg:mr-[110px]">

            {/* Formulário */}
            <div className="w-full md:w-[520px] bg-white rounded-2xl p-8 shadow-lg flex flex-col">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">
                Cadastro de Fornecedor
              </h3>

              <form onSubmit={handleSubmit} className="space-y-5 w-full">

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Razão Social
                  </label>
                  <input
                    type="text"
                    name="razaoSocial"
                    value={formState.razaoSocial}
                    onChange={handleChange}
                    placeholder="Ex: Itaú Unibanco Banco Múltiplo S.A."
                    className="block w-full rounded-lg border border-gray-300 shadow-sm 
                               focus:ring-2 focus:ring-orange-400 p-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Fantasia (opcional)
                  </label>
                  <input
                    type="text"
                    name="nomeFantasia"
                    value={formState.nomeFantasia}
                    onChange={handleChange}
                    placeholder="Ex: Itaú"
                    className="block w-full rounded-lg border border-gray-300 shadow-sm 
                               focus:ring-2 focus:ring-orange-400 p-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone
                  </label>
                  <input
                    type="text"
                    name="telefone"
                    maxLength="15"
                    value={formState.telefone}
                    onChange={handleChange}
                    placeholder="(11) 98765-4321"
                    className="block w-full rounded-lg border border-gray-300 shadow-sm 
                               focus:ring-2 focus:ring-orange-400 p-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Endereço
                  </label>
                  <input
                    type="text"
                    name="endereco"
                    value={formState.endereco}
                    onChange={handleChange}
                    placeholder="Rua das Flores, 123"
                    className="block w-full rounded-lg border border-gray-300 shadow-sm 
                               focus:ring-2 focus:ring-orange-400 p-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formState.email}
                    onChange={handleChange}
                    placeholder="fornecedor@gmail.com"
                    className="block w-full rounded-lg border border-gray-300 shadow-sm 
                               focus:ring-2 focus:ring-orange-400 p-2 text-sm"
                  />
                </div>

                <div className="flex flex-col space-y-3 pt-2">
                  <button
                    type="submit"
                    className="py-2 px-4 rounded-lg shadow-md text-sm font-medium 
                               text-white bg-orange-500 hover:bg-orange-600 focus:ring-2 focus:ring-orange-400 transition"
                  >
                    Cadastrar Fornecedor
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setFormState({
                        razaoSocial: "",
                        nomeFantasia: "",
                        telefone: "",
                        endereco: "",
                        email: "",
                      })
                    }
                    className="py-2 px-4 rounded-lg shadow-md text-sm font-medium 
                               text-gray-700 bg-gray-200 hover:bg-gray-300 transition"
                  >
                    Cancelar
                  </button>
                </div>

              </form>
            </div>

            {/* Logo (só no desktop) */}
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

export default Fornecedor;
