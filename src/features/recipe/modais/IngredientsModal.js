import React, { useEffect, useState } from "react";
import ProdutoService from "../../home/service/ProdutoService";

const IngredientsModal = ({ isOpen, onClose, onAddIngredients, ingredientesAtuais }) => {
  const [produtos, setProdutos] = useState([]);
  const [quantidades, setQuantidades] = useState({});
  const [loading, setLoading] = useState(false);

  // 🔍 Filtros
  const [filtroNome, setFiltroNome] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");

  const [ingredientes, setIngredientes] = useState([]);

  const adicionarIngredientes = (listaFinal) => {
    setIngredientes(listaFinal);
  };

  // Buscar produtos ao abrir o modal
  useEffect(() => {
    if (isOpen) {
      fetchProdutos();
    }
  }, [isOpen]);

  const fetchProdutos = async () => {
    setLoading(true);
    try {
      const response = await ProdutoService.GetProducts();
      setProdutos(response);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Atualiza quantidade digitada
  const handleQuantidadeChange = (id, value) => {
    setQuantidades((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleAdd = () => {
    const listaProdutos = Array.isArray(produtos) ? produtos : [];

    const selecionados = listaProdutos
      .filter((produto) => {
        const qtd = Number(quantidades[produto.id]);
        return !isNaN(qtd) && qtd > 0;
      })
      .map((produto) => ({
        id: produto.id,
        nomeProduto: produto.nome || "Sem nome",
        categoria: produto.categoria || "Sem categoria",
        quantidadeAdicionar: Number(quantidades[produto.id])
      }));

    if (selecionados.length === 0) {
      alert("⚠️ Informe a quantidade para pelo menos um produto.");
      return;
    }

    // 🔥 Mesclar com ingredientes já existentes (vindo do pai)
    const ingredientesMesclados = [...ingredientesAtuais];

    selecionados.forEach((novo) => {
      const existente = ingredientesMesclados.find((i) => i.id === novo.id);

      if (existente) {
        // Se o ingrediente já existe, apenas somar a quantidade
        existente.quantidadeAdicionar += novo.quantidadeAdicionar;
      } else {
        // Se não existe, adicioná-lo
        ingredientesMesclados.push(novo);
      }
    });

    // Envia a lista final ao componente pai
    onAddIngredients(ingredientesMesclados);

    // Resetar valores
    setQuantidades({});
    onClose();
  };




  if (!isOpen) return null;

  // Aplicar filtros
  const produtosFiltrados = Array.isArray(produtos)
    ? produtos.filter((p) => {
      const nome = p?.nome?.toLowerCase() || "";
      const categoria = p?.categoria?.toLowerCase() || "";
      const filtroNomeLower = filtroNome.toLowerCase().trim();
      const filtroCategoriaLower = filtroCategoria.toLowerCase().trim();

      const nomeMatch =
        !filtroNomeLower || nome.includes(filtroNomeLower);

      const categoriaMatch =
        !filtroCategoriaLower ||
        categoria.replace(/\s+/g, "").toLowerCase() ===
        filtroCategoriaLower.replace(/\s+/g, "").toLowerCase();

      return nomeMatch && categoriaMatch;
    })
    : [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg p-6 relative">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Adicionar Ingredientes à Receita
        </h2>

        {/* Filtros */}
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-4">
          <input
            type="text"
            placeholder="Buscar por nome..."
            value={filtroNome}
            onChange={(e) => setFiltroNome(e.target.value)}
            className="border border-gray-300 rounded-md p-2 text-sm w-full md:w-1/2"
          />

          <select
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            className="border border-gray-300 rounded-md p-2 text-sm w-full md:w-1/2 mt-2 md:mt-0"
          >
            <option value="">Todas as categorias</option>
            <option value="acougues">Açougues</option>
            <option value="estocaveis">Estocáveis</option>
            <option value="hortifruti">Hortifruti</option>
            <option value="laticinios">Laticínios</option>
          </select>
        </div>

        {/* Tabela */}
        {loading ? (
          <p className="text-gray-500 text-center">Carregando produtos...</p>
        ) : (
          <div className="max-h-80 overflow-y-auto border rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left px-4 py-2">Produto</th>
                  <th className="text-left px-4 py-2">Categoria</th>
                  <th className="text-center px-4 py-2">Quantidade</th>
                </tr>
              </thead>
              <tbody>
                {produtosFiltrados.length > 0 ? (
                  produtosFiltrados.map((produto) => (
                    <tr key={produto.id} className="border-t hover:bg-gray-50">
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
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      className="text-center text-gray-500 py-4 italic"
                    >
                      Nenhum produto encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Botões */}
        <div className="flex justify-end mt-6 space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
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

export default IngredientsModal;
