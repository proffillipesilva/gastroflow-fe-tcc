import React, { useState, useEffect } from "react";
import { FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import LogoGastroFlow from "../../assets/LogoGastroFlow.png";
import ReceitaService from "./service/ReceitaService";
import ListarReceitasModal from "./modais/ListarReceitasModal";

const MostrarReceitas = () => {
  const [receitas, setReceitas] = useState([]);
  const [receitasFiltradas, setReceitasFiltradas] = useState([]);
  const [filtroNome, setFiltroNome] = useState("");
  const [loadingReceitas, setLoadingReceitas] = useState(true);

  const [paginaAtual, setPaginaAtual] = useState(1);
  const receitasPorPagina = 10;

  const [receitaSelecionada, setReceitaSelecionada] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const abrirModal = (receita) => {
    setReceitaSelecionada(receita);
    setIsModalOpen(true);
  };

  const fecharModal = () => {
    setReceitaSelecionada(null);
    setIsModalOpen(false);
  };

  const fetchReceitas = async () => {
    setLoadingReceitas(true);
    try {
      const data = await ReceitaService.GetRecipes();
      setReceitas(data);
      setReceitasFiltradas(data);
    } catch (err) {
      console.error("Erro ao carregar receitas:", err);
    } finally {
      setLoadingReceitas(false);
    }
  };

  useEffect(() => {
    fetchReceitas();
  }, []);

  useEffect(() => {
    const termo = filtroNome.trim().toLowerCase();
    const filtradas = receitas.filter((r) =>
      !termo ? true : r.nome?.toLowerCase().includes(termo)
    );

    setReceitasFiltradas(filtradas);
    setPaginaAtual(1);
  }, [filtroNome, receitas]);

  const indiceUltima = paginaAtual * receitasPorPagina;
  const indicePrimeira = indiceUltima - receitasPorPagina;
  const receitasDaPagina = receitasFiltradas.slice(indicePrimeira, indiceUltima);

  const totalPaginas = Math.ceil(receitasFiltradas.length / receitasPorPagina);

  const paginaAnterior = () => setPaginaAtual((p) => Math.max(1, p - 1));
  const proximaPagina = () => setPaginaAtual((p) => Math.min(totalPaginas, p + 1));

  return (
    <div className="flex w-screen h-screen overflow-hidden bg-orange-100 text-gray-800 font-sans">

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Header */}
        <div className="h-28 shrink-0 bg-gradient-to-r from-orange-400 via-yellow-500 to-orange-600 flex flex-col items-center justify-center text-white rounded-b-3xl overflow-hidden">
          <h2 className="text-base md:text-2xl font-bold">Receitas Cadastradas</h2>
        </div>

        {/* Container principal */}
        <div className="flex-1 flex p-6 items-center justify-center overflow-auto">

          {/* DESKTOP — mantém EXATAMENTE como estava */}
          <div className="hidden md:flex w-full max-w-3xl bg-white rounded-lg shadow-md p-6 flex-col space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">Minhas Receitas</h3>

            {/* Filtro */}
            <div className="flex space-x-3 items-center">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Filtrar por nome da receita..."
                  value={filtroNome}
                  onChange={(e) => setFiltroNome(e.target.value)}
                  className="block w-full rounded-md border border-gray-300 focus:border-orange-500 p-2 pl-10 text-sm"
                />
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Tabela Desktop */}
            <div className="overflow-x-auto border border-gray-200 rounded-md flex-1">
              {loadingReceitas ? (
                <div className="p-4 text-center text-gray-500 animate-pulse">
                  Carregando receitas...
                </div>
              ) : receitasFiltradas.length > 0 ? (
                <>
                  <table className="w-full text-sm border">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left">Nome</th>
                        <th className="px-4 py-2 text-left">Tipo</th>
                        <th className="px-4 py-2 text-left">Rendimento</th>
                        <th className="px-4 py-2 text-left">Professor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {receitasDaPagina.map((receita) => (
                        <tr
                          key={receita.id}
                          className="hover:bg-[#fff5e6] cursor-pointer transition"
                          onClick={() => abrirModal(receita)}
                        >
                          <td className="px-4 py-2">{receita.nome}</td>
                          <td className="px-4 py-2">{receita.tipo ?? "-"}</td>
                          <td className="px-4 py-2">{receita.rendimento ?? "-"}</td>
                          <td className="px-4 py-2">{receita.professorReceita ?? "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Paginação Desktop */}
                  <div className="flex justify-between items-center p-4 border-t border-gray-200">
                    <button
                      onClick={paginaAnterior}
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
                      onClick={proximaPagina}
                      disabled={paginaAtual === totalPaginas}
                      className="flex items-center space-x-1 px-3 py-1 text-sm text-orange-600 font-medium rounded-md hover:text-orange-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                      <span>Próxima</span>
                      <FaChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  {receitas.length === 0
                    ? "Nenhuma receita cadastrada."
                    : "Nenhuma receita corresponde ao filtro."}
                </div>
              )}
            </div>
          </div>

          {/* MOBILE — FULL SCREEN */}
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

            {/* Lista em Cards - Mobile */}
            <div className="flex-1 overflow-y-auto flex flex-col gap-3">
              {loadingReceitas ? (
                <div className="text-center text-gray-500 animate-pulse">
                  Carregando receitas...
                </div>
              ) : receitasDaPagina.length > 0 ? (
                receitasDaPagina.map((receita) => (
                  <div
                    key={receita.id}
                    onClick={() => abrirModal(receita)}
                    className="border rounded-lg p-4 shadow-sm bg-white cursor-pointer hover:bg-orange-100 transition"
                  >
                    <p><strong>Nome:</strong> {receita.nome}</p>
                    <p><strong>Tipo:</strong> {receita.tipo ?? "-"}</p>
                    <p><strong>Rendimento:</strong> {receita.rendimento ?? "-"}</p>
                    <p><strong>Professor:</strong> {receita.professorReceita ?? "-"}</p>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500">
                  Nenhuma receita encontrada.
                </div>
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

        {/* Logo Desktop */}
        <div className="hidden md:flex items-center justify-center rounded-2xl p-6">
          <img
            src={LogoGastroFlow}
            alt="Logo"
            className="hidden md:block absolute right-10 bottom-10 w-40 opacity-80"
          />
        </div>
      </div>

      {/* Modal */}
      <ListarReceitasModal
        isOpen={isModalOpen}
        onClose={fecharModal}
        receitaSelecionada={receitaSelecionada}
        onUpdated={fetchReceitas}
      />
    </div>
  );
};

export default MostrarReceitas;
