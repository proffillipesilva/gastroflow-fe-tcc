import React, { useState } from "react";
import LogoGastroFlow from "../../assets/LogoGastroFlow.png";
import { FaPlusCircle, FaTrashAlt } from "react-icons/fa";
import StockModal from "./modais/CompraProdModal";
import FornecedorModal from "./modais/FornecedorModal";
import api from "../../shared/utils/api";
import { useStatusModalStore } from "../../shared/store/modal-store";

const CadastroCompra = () => {
  const [formState, setFormState] = useState({
    dataEntrada: "",
    fornecedorId: "",
    fornecedorNome: "",
    observacao: "",
    produtos: [],
  });

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isFornecedorModalOpen, setIsFornecedorModalOpen] = useState(false);

  const { showLoading, showSuccess, showError } = useStatusModalStore();

  // FUNÇÕES
  const openProductModal = () => setIsProductModalOpen(true);
  const closeProductModal = () => setIsProductModalOpen(false);

  const openFornecedorModal = () => setIsFornecedorModalOpen(true);
  const closeFornecedorModal = () => setIsFornecedorModalOpen(false);

  const handleAddProducts = (produtosSelecionados) => {
    setFormState((prev) => ({
      ...prev,
      produtos: [...prev.produtos, ...produtosSelecionados],
    }));
    closeProductModal();
  };

  const handleSelectFornecedor = (fornecedor) => {
    setFormState((prev) => ({
      ...prev,
      fornecedorId: fornecedor.id,
      fornecedorNome: fornecedor.razaoSocial,
    }));
    closeFornecedorModal();
  };

  const handleRemoveProduct = (indexToRemove) => {
    setFormState((prev) => ({
      ...prev,
      produtos: prev.produtos.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formState.fornecedorId) {
      showError("Selecione um fornecedor.");
      return;
    }
    if (formState.produtos.length === 0) {
      showError("Adicione pelo menos um produto.");
      return;
    }
    if (!formState.dataEntrada) {
      showError("Selecione a data.");
      return;
    }

    const entradaDTO = {
      dataEntrada: formState.dataEntrada,
      observacao: formState.observacao || "Compra registrada via sistema",
      fornecedorId: Number(formState.fornecedorId),
      produtos: formState.produtos.map((p) => ({
        produtoId: Number(p.id),
        quantidade: Number(p.quantidadeEstoque),
        preco: Number(p.valor),
      })),
    };

    try {
      showLoading("Registrando compra...");

      await api.post("/v1/api/entradas", entradaDTO);

      showSuccess("Compra registrada com sucesso!");

      setFormState({
        dataEntrada: "",
        fornecedorId: "",
        fornecedorNome: "",
        observacao: "",
        produtos: [],
      });
    } catch (error) {
      console.error("Erro ao registrar entrada:", error);
      showError("Erro ao registrar a compra.");
    }
  };

  return (
    <div className="flex w-full min-h-screen bg-[#ffffff] text-gray-800 font-sans overflow-x-hidden">

      {/* CONTEÚDO PRINCIPAL */}
      <div className="flex-1 flex flex-col bg-orange-100">

        {/* Topbar */}
        <div className="h-28 shrink-0 bg-gradient-to-r from-orange-400 via-yellow-500 to-orange-600 
                        flex flex-col items-center justify-center text-white rounded-b-3xl overflow-hidden">
          <h2 className="text-2xl font-bold">Cadastrar Compra</h2>
        </div>

        {/* Wrapper */}
        <div className="flex-1 flex items-center justify-center p-4 md:p-6 overflow-hidden">

          <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row gap-8 
                md:mr-[100px] lg:mr-[110px]">

            {/* CARD DO FORM */}
            <div className="w-full md:w-[520px] bg-white rounded-2xl p-8 shadow-lg flex flex-col">

              <h3 className="text-xl font-semibold text-gray-800 mb-6">
                Cadastro de Compra
              </h3>

              <form onSubmit={handleSubmit} className="space-y-5">

                {/* DATA */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data da Entrada
                  </label>
                  <input
                    type="date"
                    name="dataEntrada"
                    value={formState.dataEntrada}
                    onChange={handleChange}
                    className="block w-full rounded-lg border border-gray-300 shadow-sm 
                               focus:ring-2 focus:ring-orange-400 focus:border-orange-400 p-2 text-sm"
                  />
                </div>

                {/* OBSERVAÇÃO */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Observação
                  </label>
                  <textarea
                    name="observacao"
                    value={formState.observacao}
                    onChange={handleChange}
                    className="block w-full rounded-lg border border-gray-300 shadow-sm 
                               focus:ring-2 focus:ring-orange-400 focus:border-orange-400 p-2 text-sm resize-none"
                  />
                </div>

                {/* FORNECEDOR */}
                <div>
                  <button
                    type="button"
                    onClick={openFornecedorModal}
                    className="py-2 px-4 rounded-lg shadow-md text-sm font-medium 
                               text-white bg-blue-600 hover:bg-blue-700 w-full"
                  >
                    Selecionar Fornecedor
                  </button>

                  {formState.fornecedorNome && (
                    <p className="mt-2 p-2 bg-gray-100 rounded-lg text-sm border">
                      <strong>Selecionado:</strong> {formState.fornecedorNome}
                    </p>
                  )}
                </div>

                {/* PRODUTOS */}
                <div className="flex flex-col space-y-3">

                  <button
                    type="button"
                    onClick={openProductModal}
                    className="py-2 px-4 rounded-lg shadow-md text-sm font-medium 
                               text-white bg-green-600 hover:bg-green-700 flex items-center justify-center"
                  >
                    <FaPlusCircle className="mr-2" /> Adicionar Produtos
                  </button>

                  {formState.produtos.length > 0 && (
                    <ul className="divide-y border rounded-lg p-3 bg-gray-50 max-h-52 overflow-y-auto">
                      {formState.produtos.map((item, index) => (
                        <li key={index} className="flex justify-between items-center py-3">
                          <div className="flex-1">
                            <span className="font-medium text-sm">{item.nomeProduto}</span>
                            <p className="text-xs text-gray-600">
                              Qtd: <strong>{item.quantidadeEstoque}</strong> | Preço:
                              <strong> R$ {Number(item.valor).toFixed(2)}</strong>
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveProduct(index)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <FaTrashAlt size={16} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* BOTÃO SUBMIT */}
                <div className="flex flex-col space-y-3 pt-2">
                  <button
                    type="submit"
                    className="py-2 px-4 rounded-lg shadow-md text-sm font-medium 
                               text-white bg-orange-500 hover:bg-orange-600"
                  >
                    Registrar Entrada
                  </button>
                </div>

              </form>
            </div>

            {/* LOGO AO LADO */}
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

      {/* MODAIS */}
      <StockModal
        isOpen={isProductModalOpen}
        onClose={closeProductModal}
        onAddIngredients={handleAddProducts}
      />

      <FornecedorModal
        isOpen={isFornecedorModalOpen}
        onClose={closeFornecedorModal}
        onSelect={handleSelectFornecedor}
      />
    </div>
  );
};

export default CadastroCompra;
