import React, { useState, useEffect } from "react";
import { FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import AulaService from "./service/AulaService";
import AulaModal from "./modais/Aulamodal";

const MostrarAulas = () => {
  const [aulas, setAulas] = useState([]);
  const [aulasFiltradas, setAulasFiltradas] = useState([]);

  const [pendingFiltro, setPendingFiltro] = useState(""); // <- texto digitado
  const [filtroNome, setFiltroNome] = useState("");
  const [filtroAtivo, setFiltroAtivo] = useState("");       // <- só aplica com ENTER

  const [loadingAulas, setLoadingAulas] = useState(true);

  // PAGINAÇÃO
  const [paginaAtual, setPaginaAtual] = useState(1);
  const aulasPorPagina = 10;

  // MODAL
  const [aulaSelecionada, setAulaSelecionada] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const abrirModal = (aula) => {
    setAulaSelecionada(aula);
    setIsModalOpen(true);
  };

  const fecharModal = () => {
    setAulaSelecionada(null);
    setIsModalOpen(false);
  };

  // CARREGAR AULAS
  const fetchAulas = async () => {
    setLoadingAulas(true);
    try {
      const data = await AulaService.GetAula();
      setAulas(data);
      setAulasFiltradas(data);
    } catch (err) {
      console.error("Erro ao carregar aulas:", err);
    } finally {
      setLoadingAulas(false);
    }
  };

  useEffect(() => {
    fetchAulas();
  }, []);

  // FILTRO (só roda quando pressionar ENTER)
  useEffect(() => {
    const termo = filtroAtivo.toLowerCase();

    const filtradas = aulas.filter((a) =>
      !termo ? true : a.nome?.toLowerCase().includes(termo)
    );

    setAulasFiltradas(filtradas);
  }, [filtroAtivo, aulas]);

  // PAGINAÇÃO
  const indiceUltima = paginaAtual * aulasPorPagina;
  const indicePrimeira = indiceUltima - aulasPorPagina;
  const aulasDaPagina = aulasFiltradas.slice(indicePrimeira, indiceUltima);

  const totalPaginas = Math.ceil(aulasFiltradas.length / aulasPorPagina);

  const paginaAnterior = () =>
    setPaginaAtual((p) => Math.max(1, p - 1));

  const proximaPagina = () =>
    setPaginaAtual((p) => Math.min(totalPaginas, p + 1));

  return (
    <div className="flex w-screen h-screen overflow-hidden bg-orange-100 text-gray-800 font-sans">

      <div className="flex-1 flex flex-col min-w-0">

        {/* HEADER */}
        <div className="h-28 shrink-0 bg-gradient-to-r from-orange-400 via-yellow-500 to-orange-600 flex flex-col items-center justify-center text-white rounded-b-3xl overflow-hidden">
          <h2 className="text-base md:text-2xl font-bold">Aulas Cadastradas</h2>
        </div>

        {/* CONTENT */}
        <div className="flex-1 flex p-6 items-center justify-center overflow-auto">

          {/* DESKTOP */}
          <div className="hidden md:flex w-full max-w-3xl bg-white rounded-lg shadow-md p-6 flex-col space-y-4">

            <h3 className="text-xl font-semibold text-gray-800">Minhas Aulas</h3>

            {/* Filtro */}
            <div className="flex space-x-3 items-center">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Filtrar por nome da aula..."
                  value={filtroNome}
                  onChange={(e) => {
                    const valor = e.target.value;
                    setFiltroNome(valor);

                    // Se usuário apagar tudo → resetar filtro automaticamente
                    if (valor.trim() === "") {
                      setFiltroAtivo("");
                      setPaginaAtual(1);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setFiltroAtivo(filtroNome.trim());
                      setPaginaAtual(1);
                    }
                  }}
                  className="block w-full rounded-md border border-gray-300 focus:border-orange-500 p-2 pl-10 text-sm"
                />
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div className="overflow-x-auto border border-gray-200 rounded-md flex-1">
              {loadingAulas ? (
                <div className="p-4 text-center text-gray-500 animate-pulse">
                  Carregando aulas...
                </div>
              ) : aulasDaPagina.length > 0 ? (
                <>
                  <table className="w-full text-sm border">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left">Aula</th>
                        <th className="px-4 py-2 text-left">Instrutor</th>
                        <th className="px-4 py-2 text-left">Data</th>
                        <th className="px-4 py-2 text-left">Matéria</th>
                      </tr>
                    </thead>
                    <tbody>
                      {aulasDaPagina.map((aula) => (
                        <tr
                          key={aula.id}
                          className="hover:bg-[#fff5e6] cursor-pointer transition"
                          onClick={() => abrirModal(aula)}
                        >
                          <td className="px-4 py-2">{aula.nome}</td>
                          <td className="px-4 py-2">{aula.instrutor}</td>
                          <td className="px-4 py-2">
                            {new Date(aula.data).toLocaleDateString("pt-BR")}
                          </td>
                          <td className="px-4 py-2">{aula.materia}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* PAGINAÇÃO */}
                  <div className="flex justify-between items-center p-4 border-t border-gray-200">
                    <button
                      onClick={paginaAnterior}
                      disabled={paginaAtual === 1}
                      className="flex items-center space-x-1 px-3 py-1 text-sm text-orange-600 font-medium rounded-md hover:text-orange-800 disabled:text-gray-400"
                    >
                      <FaChevronLeft />
                      <span>Anterior</span>
                    </button>

                    <span className="text-sm">
                      Página {paginaAtual} de {totalPaginas}
                    </span>

                    <button
                      onClick={proximaPagina}
                      disabled={paginaAtual === totalPaginas}
                      className="flex items-center space-x-1 px-3 py-1 text-sm text-orange-600 font-medium rounded-md hover:text-orange-800 disabled:text-gray-400"
                    >
                      <span>Próxima</span>
                      <FaChevronRight />
                    </button>
                  </div>
                </>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  Nenhuma aula encontrada.
                </div>
              )}
            </div>
          </div>

          {/* MOBILE — cards igual receitas */}
          <div className="md:hidden w-full h-full flex flex-col p-2">

            {/* Filtro Mobile */}
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
              {loadingAulas ? (
                <div className="text-center text-gray-500 animate-pulse">
                  Carregando aulas...
                </div>
              ) : aulasDaPagina.length > 0 ? (
                aulasDaPagina.map((aula) => (
                  <div
                    key={aula.id}
                    onClick={() => abrirModal(aula)}
                    className="border rounded-lg p-4 shadow-sm bg-white cursor-pointer hover:bg-orange-100 transition"
                  >
                    <p><strong>Aula:</strong> {aula.nome}</p>
                    <p><strong>Instrutor:</strong> {aula.instrutor}</p>
                    <p><strong>Data:</strong> {new Date(aula.data).toLocaleDateString("pt-BR")}</p>
                    <p><strong>Matéria:</strong> {aula.materia}</p>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500">
                  Nenhuma aula encontrada.
                </div>
              )}
            </div>

            {/* PAGINAÇÃO MOBILE */}
            <div className="flex justify-between items-center py-4">
              <button
                onClick={paginaAnterior}
                disabled={paginaAtual === 1}
                className="px-3 py-1 text-sm text-orange-600 font-medium rounded-md bg-white disabled:text-gray-400"
              >
                <FaChevronLeft />
              </button>

              <span className="text-sm">
                Página {paginaAtual} de {totalPaginas}
              </span>

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

      <AulaModal
        isOpen={isModalOpen}
        onClose={fecharModal}
        aulaSelecionada={aulaSelecionada}
        onUpdated={fetchAulas}
      />
    </div>
  );
};

export default MostrarAulas;
