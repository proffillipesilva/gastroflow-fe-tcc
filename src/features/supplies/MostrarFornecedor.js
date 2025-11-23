import React, { useState, useEffect } from "react";
import { FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import FornecedorService  from "./Service/FornecedorService";
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

  // Filtro por nomeFantasia
  useEffect(() => {
    const lista = fornecedores.filter((f) =>
      filtroNome
        ? f.nomeFantasia?.toLowerCase().includes(filtroNome.toLowerCase())
        : true
    );

    setFornecedoresFiltrados(lista);
    setPaginaAtual(1);
  }, [filtroNome, fornecedores]);

  // Paginação
  const indiceUltima = paginaAtual * fornecedoresPorPagina;
  const indicePrimeira = indiceUltima - fornecedoresPorPagina;
  const fornecedoresDaPagina = fornecedoresFiltrados.slice(indicePrimeira, indiceUltima);
  const totalPaginas = Math.ceil(fornecedoresFiltrados.length / fornecedoresPorPagina);

  return (
    <div className="flex w-screen h-screen overflow-hidden bg-orange-100 text-gray-800 font-sans">
      <div className="flex-1 flex flex-col min-w-0">

        {/* Header */}
        <div className="h-28 shrink-0 bg-gradient-to-r from-orange-400 via-yellow-500 to-orange-600 flex flex-col items-center justify-center text-white rounded-b-3xl">
          <h2 className="text-2xl font-bold">Fornecedores Cadastrados</h2>
        </div>

        <div className="flex-1 flex p-6 bg-orange-100 items-center justify-center overflow-auto">
          <div className="w-full max-w-3xl bg-white rounded-lg shadow-md p-6 flex flex-col space-y-4">

            <h3 className="text-xl font-semibold text-gray-800">Meus Fornecedores</h3>

            {/* FILTRO */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Filtrar por nome fantasia..."
                value={filtroNome}
                onChange={(e) => setFiltroNome(e.target.value)}
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

                  {/* PAGINAÇÃO */}
                  <div className="flex justify-between items-center p-4 border-t border-gray-200">
                    <button
                      onClick={() => setPaginaAtual((prev) => Math.max(prev - 1, 1))}
                      disabled={paginaAtual === 1}
                      className="flex items-center space-x-1 px-3 py-1 text-sm text-orange-600 font-medium hover:text-orange-800 disabled:text-gray-400"
                    >
                      <FaChevronLeft className="w-3 h-3" />
                      <span>Anterior</span>
                    </button>

                    <span className="text-sm text-gray-600">
                      Página {paginaAtual} de {totalPaginas}
                    </span>

                    <button
                      onClick={() => setPaginaAtual((prev) => Math.min(prev + 1, totalPaginas))}
                      disabled={paginaAtual === totalPaginas}
                      className="flex items-center space-x-1 px-3 py-1 text-sm text-orange-600 font-medium hover:text-orange-800 disabled:text-gray-400"
                    >
                      <span>Próxima</span>
                      <FaChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  Nenhum fornecedor localizado.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
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
