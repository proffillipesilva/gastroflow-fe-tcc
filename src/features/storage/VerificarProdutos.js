import React, { useState, useEffect } from "react";
import { FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";

import ProdutoService from "../home/service/ProdutoService";
import EstoqueModal from "./modais/EstoqueModal";

const VerificarProdutos = () => {
  const [produtos, setProdutos] = useState([]);
  const [produtosFiltrados, setProdutosFiltrados] = useState([]);

  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [pageNumber, setPageNumber] = useState(0);

  const [filtroNome, setFiltroNome] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("TODAS_AS_CATEGORIAS");
  const [inputNome, setInputNome] = useState("");

  const [loadingProdutos, setLoadingProdutos] = useState(true);

  // MODAL
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAbrirModal = (produto) => {
    setProdutoSelecionado(produto);
    setIsModalOpen(true);
  };

  const handleFecharModal = () => {
    setProdutoSelecionado(null);
    setIsModalOpen(false);
  };

  const fetchProdutos = async (nome, categoria) => {
    setLoadingProdutos(true);

    try {
      const data = await ProdutoService.GetProductsPages(
        pageSize,
        pageNumber,
        nome,
        categoria
      );

      const lista = Array.isArray(data.produtos) ? data.produtos : [];

      setProdutos(lista);
      setProdutosFiltrados(lista);

      setTotalPages(data.totalPages ?? 0);

    } catch (err) {
      console.error("Erro ao carregar produtos:", err);
      setProdutos([]);
      setProdutosFiltrados([]);
    } finally {
      setLoadingProdutos(false);
    }
  };

  useEffect(() => {
    fetchProdutos(filtroNome, filtroCategoria);
  }, [pageNumber, filtroNome, filtroCategoria]);

  useEffect(() => {
    if (inputNome.trim() === "") {
      setFiltroNome("");
      setPageNumber(0);
    }
  }, [inputNome]);

  const nextPage = () => {
    if (pageNumber < totalPages - 1) setPageNumber(pageNumber + 1);
  };

  const prevPage = () => {
    if (pageNumber > 0) setPageNumber(pageNumber - 1);
  };

  return (
    <div className="flex w-screen h-screen overflow-hidden bg-orange-100 text-gray-800 font-sans">
      <div className="flex-1 flex flex-col min-w-0">

        {/* HEADER */}
        <div className="h-28 bg-gradient-to-r from-orange-400 via-yellow-500 to-orange-600 flex items-center justify-center text-white rounded-b-3xl">
          <h2 className="text-2xl font-bold">Listar Estoque</h2>
        </div>

        {/* CONTENT */}
        <div className="flex-1 flex p-6 items-center justify-center overflow-auto">

          {/* DESKTOP */}
          <div className="hidden md:flex w-full max-w-3xl bg-white rounded-lg shadow-md p-6 flex-col space-y-4">

            <h3 className="text-xl font-semibold">Produtos Cadastrados</h3>

            {/* FILTROS */}
            <div className="flex space-x-3 items-center">

              {/* FILTRO NOME */}
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Filtrar por nome..."
                  value={inputNome}
                  onChange={(e) => setInputNome(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") setFiltroNome(inputNome);
                  }}
                  className="w-full rounded-md border p-2 pl-10"
                />
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>

              {/* FILTRO CATEGORIA */}
              <select
                value={filtroCategoria}
                onChange={(e) => {
                  setFiltroCategoria(e.target.value);
                  setPageNumber(0);
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

            {/* PAGINAÇÃO DESKTOP */}
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

          {/* MOBILE — CARDS */}
          <div className="md:hidden w-full flex flex-col h-full p-2">

            {/* Filtro Nome */}
            <div className="relative mb-3">
              <input
                type="text"
                placeholder="Filtrar por nome..."
                value={inputNome}
                onChange={(e) => setInputNome(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") setFiltroNome(inputNome);
                }}
                className="w-full rounded-md border p-2 pl-10 bg-white"
              />
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>

            {/* Filtro Categoria */}
            <select
              value={filtroCategoria}
              onChange={(e) => {
                setFiltroCategoria(e.target.value);
                setPageNumber(0);
              }}
              className="mb-3 px-3 py-2 bg-orange-500 text-white rounded-md w-full"
            >
              <option value="TODAS_AS_CATEGORIAS">Todas as categorias</option>
              <option value="estocaveis">Estocáveis</option>
              <option value="hortifruti">Hortifruti</option>
              <option value="acougues">Açougues</option>
              <option value="laticinios">Laticínios</option>
            </select>

            {/* Cards */}
            <div className="flex-1 overflow-y-auto flex flex-col gap-3">
              {loadingProdutos ? (
                <div className="text-center text-gray-500">Carregando…</div>
              ) : produtosFiltrados.length > 0 ? (
                produtosFiltrados.map((produto) => (
                  <div
                    key={produto.id}
                    onClick={() => handleAbrirModal(produto)}
                    className="bg-white p-4 rounded-lg shadow-sm border cursor-pointer hover:bg-orange-50"
                  >
                    <p><strong>Produto:</strong> {produto.nome}</p>
                    <p><strong>Categoria:</strong> {produto.categoria || "Sem categoria"}</p>
                    <p><strong>Estoque:</strong> {produto.quantidadeEstoque ?? 0}</p>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500">Nenhum produto encontrado.</div>
              )}
            </div>

            {/* PAGINAÇÃO MOBILE */}
            {totalPages > 0 && (
              <div className="flex justify-between items-center py-4">
                <button
                  onClick={prevPage}
                  disabled={pageNumber === 0}
                  className="px-3 py-1 bg-white text-orange-600 rounded-md disabled:text-gray-400"
                >
                  <FaChevronLeft />
                </button>

                <span className="text-sm">
                  Página {pageNumber + 1} de {totalPages}
                </span>

                <button
                  onClick={nextPage}
                  disabled={pageNumber >= totalPages - 1}
                  className="px-3 py-1 bg-white text-orange-600 rounded-md disabled:text-gray-400"
                >
                  <FaChevronRight />
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
