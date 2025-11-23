import React, { useState, useEffect } from "react";
import { FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import FornecedorService from "./Service/FornecedorService";
import ListarFornModal from "./modais/ListarFornModal";

const MostrarFornecedores = () => {
  const [fornecedores, setFornecedores] = useState([]);
  const [fornecedoresFiltrados, setFornecedoresFiltrados] = useState([]);
  const [filtroNome, setFiltroNome] = useState("");
  const [loading, setLoading] = useState(true);

  // Paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const fornecedoresPorPagina = 10;

  // Modal
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const abrirModal = (fornecedor) => {
    setFornecedorSelecionado(fornecedor);
    setIsModalOpen(true);
  };

  const fecharModal = () => {
    setFornecedorSelecionado(null);
    setIsModalOpen(false);
  };

  // Buscar fornecedores
  const fetchFornecedores = async () => {
    setLoading(true);
    try {
      const data = await FornecedorService.GetFornecedores();
      setFornecedores(data);
      setFornecedoresFiltrados(data);
    } catch (error) {
      console.error("Erro ao carregar fornecedores:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFornecedores();
  }, []);

  // Filtro
  useEffect(() => {
    const termo = filtroNome.trim().toLowerCase();
    const filtrados = fornecedores.filter((f) =>
      !termo ? true : f.nomeFantasia?.toLowerCase().includes(termo)
    );
    setFornecedoresFiltrados(filtrados);
    setPaginaAtual(1);
  }, [filtroNome, fornecedores]);

  // Paginação
  const indiceUltima = paginaAtual * fornecedoresPorPagina;
  const indicePrimeira = indiceUltima - fornecedoresPorPagina;
  const fornecedoresDaPagina = fornecedoresFiltrados.slice(indicePrimeira, indiceUltima);
  const totalPaginas = Math.ceil(fornecedoresFiltrados.length / fornecedoresPorPagina);

  const paginaAnterior = () => setPaginaAtual((p) => Math.max(1, p - 1));
  const proximaPagina = () =>
    setPaginaAtual((p) => Math.min(totalPaginas, p + 1));

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

            {/* Filtro */}
            <div className="relative">
              <input
                type="text"
                placeholder="Filtrar por nome"
                value={filtroNome}
                onChange={(e) => setFiltroNome(e.target.value)}
                className="block w-full rounded-md border border-gray-300 focus:border-orange-500 p-2 pl-10 text-sm"
              />
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>

            {/* Tabela */}
            <div className="overflow-x-auto border border-gray-200 rounded-md flex-1">
              {loading ? (
                <div className="p-4 text-center text-gray-500">Carregando fornecedores...</div>
              ) : fornecedoresDaPagina.length > 0 ? (
                <>
                  <table className="w-full text-sm border">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left">Nome Fantasia</th>
                        <th className="px-4 py-2 text-left">Email</th>
                      </tr>
                    </thead>

                    <tbody>
                      {fornecedoresDaPagina.map((f) => (
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

                  {/* Paginação Desktop */}
                  <div className="flex justify-between items-center p-4 border-t border-gray-200">
                    <button
                      onClick={paginaAnterior}
                      disabled={paginaAtual === 1}
                      className="flex items-center space-x-1 px-3 py-1 text-sm text-orange-600 font-medium hover:text-orange-800 disabled:text-gray-400"
                    >
                      <FaChevronLeft />
                      <span>Anterior</span>
                    </button>

                    <span className="text-sm">Página {paginaAtual} de {totalPaginas}</span>

                    <button
                      onClick={proximaPagina}
                      disabled={paginaAtual === totalPaginas}
                      className="flex items-center space-x-1 px-3 py-1 text-sm text-orange-600 font-medium hover:text-orange-800 disabled:text-gray-400"
                    >
                      <span>Próxima</span>
                      <FaChevronRight />
                    </button>
                  </div>
                </>
              ) : (
                <div className="p-4 text-center text-gray-500">Nenhum fornecedor encontrado.</div>
              )}
            </div>
          </div>

          {/* MOBILE — Cards */}
          <div className="md:hidden w-full h-full flex flex-col p-2">

            {/* Filtro */}
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Filtrar por nome..."
                value={filtroNome}
                onChange={(e) => setFiltroNome(e.target.value)}
                className="block w-full rounded-md border border-gray-300 focus:border-orange-500 p-2 pl-10 text-sm bg-white"
              />
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>

            {/* Cards */}
            <div className="flex-1 overflow-y-auto flex flex-col gap-3">
              {loading ? (
                <div className="text-center text-gray-500 animate-pulse">Carregando fornecedores...</div>
              ) : fornecedoresDaPagina.length > 0 ? (
                fornecedoresDaPagina.map((f) => (
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

            {/* Paginação Mobile */}
            <div className="flex justify-between items-center py-4">
              <button
                onClick={paginaAnterior}
                disabled={paginaAtual === 1}
                className="px-3 py-1 text-sm text-orange-600 font-medium rounded-md bg-white disabled:text-gray-400"
              >
                <FaChevronLeft />
              </button>

              <span className="text-sm">Página {paginaAtual} de {totalPaginas}</span>

              <button
                onClick={proximaPagina}
                disabled={paginaAtual === totalPaginas}
                className="px-3 py-1 text-sm text-orange-600 font-medium rounded-md bg-white disabled:text-gray-400"
              >
                <FaChevronRight />
              </button>
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
          onUpdated={fetchFornecedores}
        />
      )}
    </div>
  );
};

export default MostrarFornecedores;
