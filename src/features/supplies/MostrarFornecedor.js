import React, { useState, useEffect } from "react";
import { FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import FornecedorService from "./Service/FornecedorService";
import ListarFornModal from "./modais/ListarFornModal";

const MostrarFornecedores = () => {
  const [fornecedores, setFornecedores] = useState([]);
  const [fornecedoresFiltrados, setFornecedoresFiltrados] = useState([]);

  const [inputNome, setInputNome] = useState("");
  const [filtroNome, setFiltroNome] = useState("");

  const [loading, setLoading] = useState(true);

  // Paginação
  const [pageNumber, setPageNumber] = useState(0);
  const pageSize = 5;
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

  // === BUSCA NORMAL (SEM FILTRO) – PAGINADA ===
  const fetchPaginado = async () => {
    setLoading(true);
    try {
      const data = await FornecedorService.GetFornecedoresPage(
        pageNumber,
        pageSize,
        "", // sem filtro aqui
        ""
      );

      const lista = Array.isArray(data?.content) ? data.content : [];

      setFornecedores(lista);
      setFornecedoresFiltrados(lista);
      setTotalPages(data?.totalPages ?? 0);
    } catch (error) {
      console.error("Erro ao carregar fornecedores (paginado):", error);
      setFornecedores([]);
      setFornecedoresFiltrados([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  // === BUSCA COMPLETA (FILTRADA) – SEM PAGINAÇÃO DO BACKEND ===
  const fetchFiltrado = async () => {
    setLoading(true);
    try {
      // puxamos tudo do backend com pageSize gigante
      const data = await FornecedorService.GetFornecedores(
        0,
        9999, // força retornar tudo
        "",
        ""
      );

      const lista = Array.isArray(data?.content) ? data.content : [];

      const filtrados = lista.filter((f) =>
        f.nomeFantasia?.toLowerCase().includes(filtroNome.toLowerCase())
      );

      setFornecedores(lista);
      setFornecedoresFiltrados(filtrados);

      // recalcula paginas com base no filtro
      setTotalPages(Math.ceil(filtrados.length / pageSize));

      // sempre volta pra página 0 quando filtra
      setPageNumber(0);

    } catch (error) {
      console.error("Erro ao carregar fornecedores (filtrado):", error);
      setFornecedores([]);
      setFornecedoresFiltrados([]);
    } finally {
      setLoading(false);
    }
  };

  // Decide qual busca usar
  useEffect(() => {
    if (filtroNome.trim() === "") {
      fetchPaginado();
    } else {
      fetchFiltrado();
    }
  }, [pageNumber, filtroNome]);

  // Reset quando input volta a vazio
  useEffect(() => {
    if (inputNome.trim() === "") {
      setFiltroNome("");
      setPageNumber(0);
    }
  }, [inputNome]);

  const nextPage = () => {
    if (pageNumber < totalPages - 1) {
      setPageNumber(pageNumber + 1);
    }
  };

  const prevPage = () => {
    if (pageNumber > 0) {
      setPageNumber(pageNumber - 1);
    }
  };

  // Paginação LOCAL para quando tem filtro
  const itensDaPagina = () => {
    if (filtroNome.trim() === "") {
      return fornecedoresFiltrados;
    }

    const start = pageNumber * pageSize;
    const end = start + pageSize;
    return fornecedoresFiltrados.slice(start, end);
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
          <div className="hidden md:flex w-full max-w-3xl bg-white rounded-lg shadow-md p-6 flex-col space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">Meus Fornecedores</h3>

            {/* FILTRO */}
            <div className="relative">
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
                className="block w-full rounded-md border border-gray-300 focus:border-orange-500 p-2 pl-10 text-sm"
              />
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>

            {/* TABELA */}
            <div className="overflow-x-auto border border-gray-200 rounded-md flex-1">
              {loading ? (
                <div className="p-4 text-center text-gray-500">Carregando fornecedores...</div>
              ) : itensDaPagina().length > 0 ? (
                <>
                  <table className="w-full text-sm border">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left">Nome Fantasia</th>
                        <th className="px-4 py-2 text-left">Email</th>
                      </tr>
                    </thead>

                    <tbody>
                      {itensDaPagina().map((f) => (
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

                  {/* PAGINAÇÃO */}
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
        </div>
      </div>

      {/* MODAL */}
      {fornecedorSelecionado && (
        <ListarFornModal
          isOpen={isModalOpen}
          onClose={fecharModal}
          fornecedorSelecionado={fornecedorSelecionado}
          onUpdated={() => fetchPaginado()}
        />
      )}
    </div>
  );
};

export default MostrarFornecedores;
