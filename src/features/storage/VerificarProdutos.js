import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";

import ProdutoService from "../home/service/ProdutoService";
import EstoqueModal from "./modais/EstoqueModal";


const VerificarProdutos = () => {
  const [produtos, setProdutos] = useState([]);
  const [produtosFiltrados, setProdutosFiltrados] = useState([]);

  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [pageSize, setPageSize] = useState(5);
  const [pageNumber, setPageNumber] = useState(0);

  const [filtroNome, setFiltroNome] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("TODAS_AS_CATEGORIAS");

  const [loadingProdutos, setLoadingProdutos] = useState(true);

  // MODAL
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [inputNome, setInputNome] = useState("");

  const handleAbrirModal = (produto) => {
    setProdutoSelecionado(produto);
    setIsModalOpen(true);
  };

  const handleFecharModal = () => {
    setProdutoSelecionado(null);
    setIsModalOpen(false);
  };

  // 📌 Buscar produtos da API (com paginação)
  const fetchProdutos = async (nome, categoria) => { // <-- Receber filtros como argumento
    setLoadingProdutos(true);
    // IMPORTANTE: Resetar para a primeira página ao aplicar um novo filtro
    // se o filtro não for o mesmo da busca atual.
    const pageToFetch = pageNumber;

    try {
      // Altere o ProdutoService.GetProductsPages para aceitar mais parâmetros
      const data = await ProdutoService.GetProductsPages(
        pageSize,
        pageToFetch,
        nome,          // Novo
        categoria      // Novo
      );

      const lista = Array.isArray(data.produtos) ? data.produtos : [];

      // Ao buscar do servidor, a lista 'data.produtos' JÁ VEM FILTRADA e PAGINADA
      setProdutos(lista);
      // Não precisamos mais de 'produtosFiltrados' e o filtro local
      setProdutosFiltrados(lista); // Pode ser removido, ou manter para simplificação

      setTotal(data.total ?? 0);
      setTotalPages(data.totalPages ?? 0);

    } catch (err) {
      console.error("Erro ao carregar produtos:", err);
      setProdutos([]);
      setProdutosFiltrados([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setLoadingProdutos(false);
    }
  };

  // 🔄 Atualiza quando mudar pageSize ou pageNumber


  // 🎯 FILTRAGEM POR NOME + CATEGORIA
  useEffect(() => {


    fetchProdutos(filtroNome, filtroCategoria);


  }, [pageSize, pageNumber, filtroNome, filtroCategoria]);



  // 🔼 Página anterior
  const prevPage = () => {
    if (pageNumber > 0) {
      setPageNumber(pageNumber - 1);
    }
  };

  // 🔽 Próxima página
  const nextPage = () => {
    if (pageNumber < totalPages - 1) {
      setPageNumber(pageNumber + 1);
    }
  };

  useEffect(() => {
    // Caso o usuário apague o texto → ativar filtro automático
    if (inputNome.trim() === "") {
      setFiltroNome("");   // remove filtro
      setPageNumber(0);    // reset pagina
    }
  }, [inputNome]);


  return (
    <div className="flex w-screen h-screen overflow-hidden bg-orange-100 text-gray-800 font-sans">
      <div className="flex-1 min-w-0 flex flex-col">

        {/* HEADER */}
        <div className="h-28 bg-gradient-to-r from-orange-400 via-yellow-500 to-orange-600 flex items-center justify-center text-white rounded-b-3xl">
          <h2 className="text-2xl font-bold">Listar Estoque</h2>
        </div>

        {/* CONTEÚDO */}
        <div className="flex-1 flex p-6 bg-orange-100 items-center justify-center overflow-auto">
          <div className="w-full max-w-3xl bg-white rounded-lg shadow-md p-6 space-y-4">

            <h3 className="text-xl font-semibold">Produtos Cadastrados</h3>

            {/* FILTROS */}
            <div className="flex space-x-3 items-center">

              {/* FILTRO POR NOME */}
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Filtrar por nome..."
                  value={inputNome}
                  onChange={(e) => setInputNome(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setFiltroNome(inputNome);
                    }
                  }}
                  className="w-full rounded-md border p-2 pl-10"
                />
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>

              {/* FILTRO POR CATEGORIA */}
              <select
                value={filtroCategoria}
                onChange={(e) => {
                  setFiltroCategoria(e.target.value)
                  setPageNumber(0)

                }}
                className="py-2 px-4 rounded-md bg-orange-500 text-white cursor-pointer"
              >
                <option value="TODAS_AS_CATEGORIAS">Todas as categorias</option>
                <option value="estocaveis">Estocáveis</option>
                <option value="hortifruti">Hortifruti</option>
                <option value="acougues">Açougues</option>
                <option value="laticinios">Laticínios</option>
              </select>
            </div>

            {/* TABELA */}
            <div className="overflow-x-auto border rounded-md">
              {loadingProdutos ? (
                <div className="p-4 text-center text-gray-500">Carregando…</div>
              ) : produtosFiltrados.length > 0 ? (
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left">Produto</th>
                      <th className="px-4 py-2 text-left">Categoria</th>
                      <th className="px-4 py-2 text-left">Estoque</th>
                    </tr>
                  </thead>
                  <tbody>
                    {produtosFiltrados.map((produto) => (
                      <tr
                        key={produto.id}
                        onClick={() => handleAbrirModal(produto)}
                        className="hover:bg-[#fff5e6] cursor-pointer"
                      >
                        <td className="px-4 py-2">{produto.nome}</td>
                        <td className="px-4 py-2">{produto.categoria || "Sem categoria"}</td>
                        <td className="px-4 py-2">{produto.quantidadeEstoque ?? "0"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  Nenhum produto encontrado.
                </div>
              )}
            </div>

            {/* PAGINAÇÃO */}
            {totalPages > 0 && (
              <div className="flex justify-between items-center pt-4">
                <button
                  onClick={prevPage}
                  disabled={pageNumber === 0}
                  className="px-4 py-2 bg-gray-300 rounded disabled:opacity-40"
                >
                  Anterior
                </button>

                <span className="text-sm">
                  Página {pageNumber + 1} de {totalPages}
                </span>

                <button
                  onClick={nextPage}
                  disabled={pageNumber >= totalPages - 1}
                  className="px-4 py-2 bg-gray-300 rounded disabled:opacity-40"
                >
                  Próxima
                </button>
              </div>
            )}


          </div>
        </div>

      </div>

      

      {/* MODAL */}
      {produtoSelecionado && (
        <EstoqueModal
          isOpen={isModalOpen}
          onClose={handleFecharModal}
          produtoSelecionado={produtoSelecionado}
          onUpdated={() => fetchProdutos(filtroNome, filtroCategoria)}
        />
      )}
    </div>
  );
};

export default VerificarProdutos;
