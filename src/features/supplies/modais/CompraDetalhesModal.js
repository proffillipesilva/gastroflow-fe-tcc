import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import FornecedorModal from "./FornecedorModal";

import CompraService from "../Service/CompraService";
import FornecedorService from "../Service/FornecedorService";

import { useStatusModalStore } from "../../../shared/store/modal-store";

const CompraDetalhesModal = ({ isOpen, onClose, compra, produtosMap, onUpdated }) => {
  const [modoEdicao, setModoEdicao] = useState(false);
  const [isFornecedorModalOpen, setIsFornecedorModalOpen] = useState(false);

  const { showLoading, showSuccess, showError } = useStatusModalStore();

  const [formData, setFormData] = useState({
    observacao: "",
    dataEntrada: "",
    fornecedorId: null,
    fornecedorRazaoSocial: "",
    fornecedorNomeFantasia: "",
    produtos: [],
  });

  // 🔥 Carrega fornecedor
  async function loadFornecedor(id) {
    try {
      const fornecedor = await FornecedorService.GetFornecedorById(id);

      setFormData((prev) => ({
        ...prev,
        fornecedorRazaoSocial: fornecedor.razaoSocial || "",
        fornecedorNomeFantasia: fornecedor.nomeFantasia || "",
      }));
    } catch (error) {
      console.error("Erro ao carregar fornecedor:", error);
      showError("Erro ao carregar fornecedor.");
    }
  }

  // 🔥 Carregar dados iniciais
  useEffect(() => {
    if (compra) {
      setFormData({
        observacao: compra.observacao || "",
        dataEntrada: compra.dataEntrada?.split("T")[0] || "",
        fornecedorId: compra.fornecedorId || null,
        fornecedorRazaoSocial: compra.fornecedorNome || "",
        fornecedorNomeFantasia: "",
        produtos:
          compra.produtos?.map((p) => ({
            ...p,
            quantidade: p.quantidade,
            preco: p.preco,
          })) || [],
      });

      if (compra.fornecedorId) loadFornecedor(compra.fornecedorId);
    }
  }, [compra]);

  if (!isOpen || !compra) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleProdutoChange = (index, field, value) => {
    const updated = [...formData.produtos];
    updated[index][field] = field === "preco" || field === "quantidade"
      ? Number(value)
      : value;

    setFormData((prev) => ({ ...prev, produtos: updated }));
  };

  const handleSelectFornecedor = (fornecedor) => {
    setFormData((prev) => ({
      ...prev,
      fornecedorId: fornecedor.id,
      fornecedorRazaoSocial: fornecedor.razaoSocial,
      fornecedorNomeFantasia: fornecedor.nomeFantasia,
    }));
    setIsFornecedorModalOpen(false);
  };

  const handleSubmit = async () => {
    try {
      showLoading("Atualizando compra...");

      const payload = {
        observacao: formData.observacao,
        dataEntrada: formData.dataEntrada,
        fornecedorId: formData.fornecedorId,
        produtos: formData.produtos.map((p) => ({
          produtoId: p.produtoId,
          quantidade: Number(p.quantidade),
          preco: Number(p.preco),
        })),
      };

      await CompraService.UpdateEntrada(compra.id, payload);

      showSuccess("Compra atualizada com sucesso!");

      if (onUpdated) onUpdated(); // mesma lógica do AulaModal

      setModoEdicao(false);
      onClose();

    } catch (error) {
      console.error(error);
      showError("Erro ao atualizar compra.");
    }
  };

  return (
    <>
      {/* Modal Principal */}
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white w-full max-w-3xl rounded-xl shadow-lg p-6 relative">

          {/* Fechar */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          >
            <FaTimes size={30} />
          </button>

          {/* Título */}
          <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">
            Detalhes da Compra
          </h2>

          {/* Informações principais */}
          <div className="flex flex-col gap-4 text-gray-700 mb-6">

            {/* Data */}
            <div>
              <span className="font-semibold">Data da Entrada:</span>
              {modoEdicao ? (
                <input
                  type="date"
                  name="dataEntrada"
                  value={formData.dataEntrada}
                  onChange={handleChange}
                  className="border ml-2 px-2 py-1 rounded"
                />
              ) : (
                <span className="ml-1">{compra.dataFormatada}</span>
              )}
            </div>

            {/* Fornecedor */}
            <div className="flex flex-col gap-1">
              <div>
                <span className="font-semibold">Fornecedor (Razão Social):</span>
                {modoEdicao ? (
                  <>
                    <span className="px-2 py-1 bg-gray-100 rounded border ml-2">
                      {formData.fornecedorRazaoSocial || "—"}
                    </span>
                    <button
                      onClick={() => setIsFornecedorModalOpen(true)}
                      className="ml-3 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Alterar
                    </button>
                  </>
                ) : (
                  <span className="ml-1">{formData.fornecedorRazaoSocial || "—"}</span>
                )}
              </div>

              <div>
                <span className="font-semibold">Nome Fantasia:</span>
                <span className="ml-1">{formData.fornecedorNomeFantasia || "—"}</span>
              </div>
            </div>

            {/* Observação */}
            <div className="flex flex-col">
              <span className="font-semibold">Observação:</span>
              {modoEdicao ? (
                <textarea
                  name="observacao"
                  value={formData.observacao}
                  onChange={handleChange}
                  className="border rounded px-2 py-1 mt-1 w-full"
                />
              ) : (
                <span className="ml-1">{formData.observacao || "—"}</span>
              )}
            </div>
          </div>

          {/* Tabela */}
          <div className="overflow-x-auto border rounded-lg max-h-64 overflow-y-auto">
            <table className="min-w-full text-sm divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold">Produto</th>
                  <th className="px-4 py-2 text-left font-semibold">Quantidade</th>
                  <th className="px-4 py-2 text-left font-semibold">Preço (un)</th>
                  <th className="px-4 py-2 text-left font-semibold">Total</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {formData.produtos.map((item, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-2">
                      {produtosMap[item.produtoId] || `Produto #${item.produtoId}`}
                    </td>

                    <td className="px-4 py-2">
                      {modoEdicao ? (
                        <input
                          type="number"
                          value={item.quantidade}
                          onChange={(e) =>
                            handleProdutoChange(idx, "quantidade", e.target.value)
                          }
                          className="border px-2 py-1 rounded w-20"
                        />
                      ) : (
                        item.quantidade
                      )}
                    </td>

                    <td className="px-4 py-2">
                      {modoEdicao ? (
                        <input
                          type="number"
                          step="0.01"
                          value={item.preco}
                          onChange={(e) =>
                            handleProdutoChange(idx, "preco", e.target.value)
                          }
                          className="border px-2 py-1 rounded w-24"
                        />
                      ) : (
                        `R$ ${item.preco.toFixed(2)}`
                      )}
                    </td>

                    <td className="px-4 py-2 font-semibold">
                      R$ {(item.preco * item.quantidade).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Botões */}
          <div className="flex justify-end mt-6 gap-3">
            {modoEdicao ? (
              <button
                onClick={handleSubmit}
                className="px-5 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Salvar
              </button>
            ) : (
              <button
                onClick={() => setModoEdicao(true)}
                className="px-5 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Editar
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Modal de fornecedor */}
      <FornecedorModal
        isOpen={isFornecedorModalOpen}
        onClose={() => setIsFornecedorModalOpen(false)}
        onSelect={handleSelectFornecedor}
      />
    </>
  );
};

export default CompraDetalhesModal;
