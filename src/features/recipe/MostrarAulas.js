import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import AulaService from "./service/AulaService";
import AulaModal from "./modais/Aulamodal";

const MostrarAulas = () => {
  const [aulas, setAulas] = useState([]);
  const [aulasFiltradas, setAulasFiltradas] = useState([]);
  const [filtroNome, setFiltroNome] = useState("");
  const [loadingAulas, setLoadingAulas] = useState(true);

  // PAGINAÇÃO
  const [paginaAtual, setPaginaAtual] = useState(1);
  const aulasPorPagina = 10;

  // MODAL (opcional)
  const [aulaSelecionada, setAulaSelecionada] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAbrirModal = (aula) => {
    setAulaSelecionada(aula);
    setIsModalOpen(true);
  };

  const handleFecharModal = () => {
    setIsModalOpen(false);
    setAulaSelecionada(null);
  };

  // CARREGAR AULAS
  const fetchAulas = async () => {
    setLoadingAulas(true);
    try {
      const data = await AulaService.GetAula(); // ajuste o nome se necessário
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

  // FILTRO POR NOME
  useEffect(() => {
    const listaFiltrada = aulas.filter((aula) =>
      aula.nome && filtroNome
        ? aula.nome.toLowerCase().includes(filtroNome.toLowerCase())
        : true
    );

    setAulasFiltradas(listaFiltrada);
    setPaginaAtual(1);
  }, [filtroNome, aulas]);

  // PAGINAÇÃO
  const indiceUltimaAula = paginaAtual * aulasPorPagina;
  const indicePrimeiraAula = indiceUltimaAula - aulasPorPagina;
  const aulasDaPagina = aulasFiltradas.slice(
    indicePrimeiraAula,
    indiceUltimaAula
  );
  const totalPaginas = Math.ceil(aulasFiltradas.length / aulasPorPagina);

  const irParaPaginaAnterior = () =>
    setPaginaAtual((prev) => Math.max(prev - 1, 1));

  const irParaProximaPagina = () =>
    setPaginaAtual((prev) => Math.min(prev + 1, totalPaginas));

  return (
    <div className="flex w-screen h-screen overflow-hidden bg-orange-100 text-gray-800 font-sans">

      <div className="flex-1 flex flex-col min-w-0 ">
        {/* HEADER */}
        <div className="h-28 shrink-0 bg-gradient-to-r from-orange-400 via-yellow-500 to-orange-600 flex flex-col items-center justify-center text-white rounded-b-3xl overflow-hidden">
          <h2 className="text-2xl font-bold">Aulas Cadastradas</h2>
        </div>

        {/* CONTEÚDO */}
        <div className="flex-1 flex p-6 bg-orange-100 items-center justify-center overflow-auto">
          <div className="w-full max-w-3xl bg-white rounded-lg shadow-md p-6 flex flex-col space-y-4">

            <h3 className="text-xl font-semibold text-gray-800">
              Minhas Aulas
            </h3>

            {/* FILTRO */}
            <div className="flex space-x-3 items-center">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Filtrar por nome da aula..."
                  value={filtroNome}
                  onChange={(e) => setFiltroNome(e.target.value)}
                  className="block w-full rounded-md border border-gray-300 focus:border-orange-500 p-2 pl-10 text-sm"
                />
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* TABELA */}
            <div className="overflow-x-auto border border-gray-200 rounded-md flex-1">
              {loadingAulas ? (
                <div className="p-4 text-center text-gray-500">
                  Carregando aulas...
                </div>
              ) : aulasFiltradas.length > 0 ? (
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
                          onClick={() => handleAbrirModal(aula)}
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
                      onClick={irParaPaginaAnterior}
                      disabled={paginaAtual === 1}
                      className="flex items-center space-x-1 px-3 py-1 text-sm text-orange-600 font-medium rounded-md hover:text-orange-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                      <FaChevronLeft className="w-3 h-3" />
                      <span>Anterior</span>
                    </button>

                    <span className="text-sm text-gray-600">
                      Página {paginaAtual} de {totalPaginas}
                    </span>

                    <button
                      onClick={irParaProximaPagina}
                      disabled={
                        paginaAtual === totalPaginas || totalPaginas === 0
                      }
                      className="flex items-center space-x-1 px-3 py-1 text-sm text-orange-600 font-medium rounded-md hover:text-orange-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                      <span>Próxima</span>
                      <FaChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  {aulas.length === 0
                    ? "Nenhuma aula cadastrada."
                    : "Nenhuma aula encontrada com esse filtro."}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {aulaSelecionada && (
        <AulaModal
          isOpen={isModalOpen}
          onClose={handleFecharModal}
          aulaSelecionada={aulaSelecionada}
          onUpdated={fetchAulas}
        />
      )}
     
    </div>
  );
};

export default MostrarAulas;
