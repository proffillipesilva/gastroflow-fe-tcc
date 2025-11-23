import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import LogoGastroFlow from "../../assets/LogoGastroFlow.png";
import ReceitaService from "./service/ReceitaService";
import ListarReceitasModal from "./modais/ListarReceitasModal";

const MostrarReceitas = () => {
  const [receitas, setReceitas] = useState([]);
  const [receitasFiltradas, setReceitasFiltradas] = useState([]);
  const [filtroNome, setFiltroNome] = useState("");
  const [loadingReceitas, setLoadingReceitas] = useState(true);

  // Paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const receitasPorPagina = 10;

  // Modal
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

  // Buscar receitas
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

  // Filtro de nome
  useEffect(() => {
    const lista = receitas.filter((r) => {
      if (!filtroNome.trim()) return true;
      return r.nome?.toLowerCase().includes(filtroNome.toLowerCase());
    });

    setReceitasFiltradas(lista);
    setPaginaAtual(1);
  }, [filtroNome, receitas]);

  // Paginação
  const indiceUltima = paginaAtual * receitasPorPagina;
  const indicePrimeira = indiceUltima - receitasPorPagina;
  const receitasDaPagina = receitasFiltradas.slice(indicePrimeira, indiceUltima);
  const totalPaginas = Math.ceil(receitasFiltradas.length / receitasPorPagina);

  const paginaAnterior = () =>
    setPaginaAtual((prev) => Math.max(prev - 1, 1));

  const proximaPagina = () =>
    setPaginaAtual((prev) => Math.min(prev + 1, totalPaginas));

  

  return (
    <div className="flex w-screen h-screen overflow-hidden bg-orange-100 text-gray-800 font-sans">

      {/* Conteúdo */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Header */}
        <div className="h-28 shrink-0 bg-gradient-to-r from-orange-400 via-yellow-500 to-orange-600 flex flex-col items-center justify-center text-white rounded-b-3xl overflow-hidden">
          <h2 className="text-2xl font-bold">Receitas Cadastradas</h2>
        </div>

        {/* Caixa principal */}
        <div className="flex-1 flex p-6 bg-orange-100 items-center justify-center overflow-auto">
          <div className="w-full max-w-3xl bg-white rounded-lg shadow-md p-6 flex flex-col space-y-4">

            <h3 className="text-xl font-semibold text-gray-800">Minhas Receitas</h3>

            {/* FILTRO */}
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

            {/* TABELA */}
            <div className="overflow-x-auto border border-gray-200 rounded-md flex-1">
              {loadingReceitas ? (
                <div className="p-4 text-center text-gray-500">Carregando receitas...</div>
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

                  {/* PAGINAÇÃO */}
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
        </div>

        {/* Logo */}
        <div className="hidden md:flex items-center justify-center rounded-2xl p-6">
          <img
            src={LogoGastroFlow}
            alt="Logo"
            className="hidden md:block absolute right-10 bottom-10 w-40 opacity-80"
          />
        </div>
      </div>

      {/* MODAL SEM CONDICIONAL */}
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
