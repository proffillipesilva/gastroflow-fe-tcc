import React, { useEffect, useState } from "react";
import ProdutoService from "../../home/service/ProdutoService";
import { useStatusModalStore } from "../../../shared/store/modal-store";

const CompraProdModal = ({ isOpen, onClose, onAddIngredients }) => {
  const [produtos, setProdutos] = useState([]);
  const [valores, setValores] = useState({});
  const [quantidades, setQuantidades] = useState({});
  const [filtroNome, setFiltroNome] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");

  const { showLoading, showError, closeModal } = useStatusModalStore();

  // Carregar produtos
  useEffect(() => {
    if (isOpen) fetchProdutos();
  }, [isOpen]);

  const fetchProdutos = async () => {
    showLoading("Carregando produtos...");
    try {
      const response = await ProdutoService.GetProducts();
      setProdutos(Array.isArray(response) ? response : response?.produtos || []);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      showError("Erro ao carregar produtos.");
    } finally {
      closeModal();
    }
  };

  const handleQuantidadeChange = (id, value) => {
    setQuantidades((prev) => ({ ...prev, [id]: value }));
  };

  const handleValorChange = (id, value) => {
    setValores((prev) => ({ ...prev, [id]: value }));
  };

  const handleAdd = () => {
    const selecionados = produtos
      .filter((p) => Number(quantidades[p.id]) > 0 && Number(valores[p.id]) > 0)
      .map((p) => ({
        id: p.id,
        nomeProduto: p.nome,
        categoria: p.categoria || "Sem categoria",
        quantidadeEstoque: Number(quantidades[p.id]),
        valor: Number(valores[p.id]),
      }));

    if (selecionados.length === 0) {
      showError("Selecione quantidade do produto ou valor");
      return;
    }

    onAddIngredients(selecionados);
    onClose();
  };

  if (!isOpen) return null;

  const produtosFiltrados = produtos.filter((p) => {
    const nomeMatch = p.nome?.toLowerCase().includes(filtroNome.toLowerCase());
    const categoriaMatch =
      filtroCategoria === "" ||
      p.categoria?.toLowerCase() === filtroCategoria.toLowerCase();
    return nomeMatch && categoriaMatch;
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Adicionar Produtos</h2>

        {/* Filtros */}
        <div className="flex flex-col md:flex-row md:space-x-4 mb-4">
          <input
            type="text"
            placeholder="Buscar por nome..."
            value={filtroNome}
            onChange={(e) => setFiltroNome(e.target.value)}
            className="border rounded-md p-2 text-sm w-full md:w-1/2"
          />

          <select
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            className="border rounded-md p-2 text-sm w-full md:w-1/2 mt-2 md:mt-0"
          >
            <option value="">Todas categorias</option>
            <option value="acougues">Açougues</option>
            <option value="estocaveis">Estocáveis</option>
            <option value="hortifruti">Hortifruti</option>
            <option value="laticinios">Laticínios</option>
          </select>
        </div>

        <div className="max-h-80 overflow-y-auto border rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Produto</th>
                <th className="px-4 py-2 text-left">Categoria</th>
                <th className="px-4 py-2 text-center">Qtd</th>
                <th className="px-4 py-2 text-center">Valor (R$)</th>
              </tr>
            </thead>
            <tbody>
              {produtosFiltrados.length > 0 ? (
                produtosFiltrados.map((produto) => (
                  <tr key={produto.id} className="border-t">
                    <td className="px-4 py-2">{produto.nome}</td>
                    <td className="px-4 py-2">
                      {produto.categoria || "Sem categoria"}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <input
                        type="number"
                        min="0"
                        value={quantidades[produto.id] || ""}
                        onChange={(e) =>
                          handleQuantidadeChange(produto.id, e.target.value)
                        }
                        placeholder="0"
                        className="w-20 border rounded-md p-1 text-center"
                      />
                    </td>
                    <td className="px-4 py-2 text-center">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={valores[produto.id] || ""}
                        onChange={(e) =>
                          handleValorChange(produto.id, e.target.value)
                        }
                        placeholder="0.00"
                        className="w-24 border rounded-md p-1 text-center"
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-gray-500">
                    Nenhum produto encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* botões */}
        <div className="flex justify-end mt-6 space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
          >
            Cancelar
          </button>

          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompraProdModal;
