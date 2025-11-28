import React, { useState, useEffect } from "react";
import { FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import FornecedorService from "./Service/FornecedorService";
import ListarFornModal from "./modais/ListarFornModal";

const MostrarFornecedores = () => {
  const [fornecedores, setFornecedores] = useState([]);
  const [fornecedoresFiltrados, setFornecedoresFiltrados] = useState([]);
  const [filtroNome, setFiltroNome] = useState("");
  const [inputNome, setInputNome] = useState("");
  const [loading, setLoading] = useState(true);

  // Paginação semelhante a Produtos
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);

  // Modal
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const abrirModal = (f) => {
    setFornecedorSelecionado(f);
    setIsModalOpen(true);
  };

  const fecharModal = () => {
    setFornecedorSelecionado(null);
    setIsModalOpen(false);
  };

  // Buscar com paginação igual ao Produtos
  // ⚛️ Seu Componente React
  const fetchFornecedores = async (nomeFantasia, email) => {
    setLoading(true);

    try {
      const data = await FornecedorService.GetFornecedores(
        // CORREÇÃO 1: Inverter a ordem dos parâmetros para corresponder à assinatura da função
        pageNumber,
        pageSize,
        nomeFantasia,
        email
      );

      // CORREÇÃO 2: Desestruturar a resposta (data é o objeto Page completo)
      // O array de fornecedores está em data.content (se o backend retornar 'content')
      const lista = Array.isArray(data.content) ? data.content : [];

      setFornecedores(lista);
      // Não precisa mais de fornecedoresFiltrados se o filtro for feito no backend
      setFornecedoresFiltrados(lista);

      // CORREÇÃO 3: Atualizar totalPages
      setTotalPages(data.totalPages ?? 0);

    } catch (error) {
      console.error("Erro ao carregar fornecedores:", error);
      setFornecedores([]);
      setFornecedoresFiltrados([]);
      // Você pode querer resetar a paginação em caso de erro grave
      // setPageNumber(0); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFornecedores(filtroNome);
  }, [pageNumber, filtroNome]);

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
        <div className="h-28 shrink-0 bg-gradient-to-r from-orange-400 via-yellow-500 to-orange-600 flex flex-col items-center justify-center text-white rounded-b-3xl">
          <h2 className="text-base md:text-2xl font-bold">Fornecedores Cadastrados</h2>
        </div>

        {/* CONTEÚDO */}
        <div className="flex-1 flex p-6 items-center justify-center overflow-auto">

          {/* DESKTOP */}
          <div className="hidden md:flex w-full max-w-3xl bg-white rounded-lg shadow-md p-6 flex-col space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">Meus Fornecedores</h3>

            {/* Filtro Nome */}
            <div className="relative">
              <input
                type="text"
                placeholder="Filtrar por nome..."
                value={inputNome}
                onChange={(e) => setInputNome(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") setFiltroNome(inputNome);
                }}
                className="block w-full rounded-md border border-gray-300 focus:border-orange-500 p-2 pl-10 text-sm"
              />
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>

            {/* TABELA */}
            <div className="overflow-x-auto border border-gray-200 rounded-md flex-1">
              {loading ? (
                <div className="p-4 text-center text-gray-500">Carregando fornecedores...</div>
              ) : fornecedoresFiltrados.length > 0 ? (
                <>
                  <table className="w-full text-sm border">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left">Nome Fantasia</th>
                        <th className="px-4 py-2 text-left">Email</th>
                      </tr>
                    </thead>

                    <tbody>
                      {fornecedoresFiltrados.map((f) => (
                        <tr
                          key={f.id}
                          className="hover:bg-[#fff5e6] cursor-pointer transition"
                          onClick={() => abrirModal(f)}
                        >
                          <td className="px-4 py-2">{f.nomeFantasia}</td>
                          <td className="px-4 py-2">{f.email ?? "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* PAGINAÇÃO DESKTOP */}
                  {totalPages > 0 && (
                    <div className="flex justify-between items-center p-4 border-t border-gray-200">
                      <button
                        onClick={prevPage}
                        disabled={pageNumber === 0}
                        className="px-4 py-1 bg-gray-200 rounded disabled:opacity-40"
                      >
                        Anterior
                      </button>

                      <span className="text-sm">
                        Página {pageNumber + 1} de {totalPages}
                      </span>

                      <button
                        onClick={nextPage}
                        disabled={pageNumber >= totalPages - 1}
                        className="px-4 py-1 bg-gray-200 rounded disabled:opacity-40"
                      >
                        Próxima
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-4 text-center text-gray-500">Nenhum fornecedor encontrado.</div>
              )}
            </div>
          </div>

          {/* MOBILE — CARDS */}
          <div className="md:hidden w-full h-full flex flex-col p-2">

            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Filtrar por nome..."
                value={inputNome}
                onChange={(e) => setInputNome(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") setFiltroNome(inputNome);
                }}
                className="block w-full rounded-md border border-gray-300 focus:border-orange-500 p-2 pl-10 text-sm bg-white"
              />
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>

            <div className="flex-1 overflow-y-auto flex flex-col gap-3">
              {loading ? (
                <div className="text-center text-gray-500">Carregando fornecedores...</div>
              ) : fornecedoresFiltrados.length > 0 ? (
                fornecedoresFiltrados.map((f) => (
                  <div
                    key={f.id}
                    onClick={() => abrirModal(f)}
                    className="border rounded-lg p-4 shadow-sm bg-white cursor-pointer hover:bg-orange-100 transition"
                  >
                    <p><strong>Nome:</strong> {f.nomeFantasia}</p>
                    <p><strong>Email:</strong> {f.email ?? "-"}</p>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500">Nenhum fornecedor encontrado.</div>
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
      {fornecedorSelecionado && (
        <ListarFornModal
          isOpen={isModalOpen}
          onClose={fecharModal}
          fornecedorSelecionado={fornecedorSelecionado}
          onUpdated={() => fetchFornecedores(filtroNome)}
        />
      )}
    </div>
  );
};

export default MostrarFornecedores;
