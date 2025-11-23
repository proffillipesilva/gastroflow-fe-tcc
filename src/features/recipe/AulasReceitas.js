import React, { useState } from "react";
import Sidebar from "../../shared/components/Sidebar";
import RecipeModal from "./modais/RecipeModal";
import AulaService from "./service/AulaService";

// Modal global
import { useStatusModalStore } from "../../shared/store/modal-store";
import StatusModal from "../../shared/components/StatusModal";

// Ícone de remover
const XIcon = ({ className = "w-5 h-5" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

const AulasReceitas = () => {
  const [formState, setFormState] = useState({
    nome: "",
    descricao: "",
    data: "",
    instrutor: "",
    materia: "",
    semestre: "",
    modulo: "",
    periodo: "",
    receitasSelecionadas: [],
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Modal de status
  const { showLoading, showSuccess, showError } = useStatusModalStore();

  // Atualiza campos
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  // Adiciona receitas
  const handleAddReceitas = (novas) => {
    setFormState((prev) => ({
      ...prev,
      receitasSelecionadas: [...prev.receitasSelecionadas, ...novas],
    }));
  };

  // Remove receita
  const handleRemoveReceita = (index) => {
    setFormState((prev) => {
      const copia = [...prev.receitasSelecionadas];
      copia.splice(index, 1);
      return { ...prev, receitasSelecionadas: copia };
    });
  };

  // ============================
  // 🔍 VALIDAÇÃO DOS CAMPOS
  // ============================
  const validarFormulario = () => {
    if (!formState.nome.trim())
      return "O nome da aula é obrigatório.";

    if (!formState.descricao.trim())
      return "A descrição é obrigatória.";

    if (!formState.data)
      return "A data é obrigatória.";

    const dataValida = !isNaN(new Date(formState.data).getTime());
    if (!dataValida)
      return "A data informada não é válida.";

    if (!formState.instrutor.trim())
      return "O nome do instrutor é obrigatório.";

    if (!formState.materia.trim())
      return "A matéria é obrigatória.";

    if (!formState.semestre)
      return "Selecione um semestre.";

    if (!formState.modulo)
      return "Selecione um módulo.";

    if (!formState.periodo)
      return "Selecione um período.";

    if (formState.receitasSelecionadas.length === 0)
      return "Selecione pelo menos uma receita.";

    return null; // Sem erros
  };

  // ============================
  // 🚀 SUBMIT
  // ============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔥 Executa validação
    const erroValidacao = validarFormulario();
    if (erroValidacao) {
      showError(erroValidacao);
      return;
    }

    try {
      showLoading("Cadastrando aula...");

      const receitas = formState.receitasSelecionadas.map((r) => ({
        receitaId: r.id,
        quantidade: r.quantidade ?? 1,
      }));

      await AulaService.RegisterAula({
        nome: formState.nome,
        descricao: formState.descricao,
        data: formState.data,
        instrutor: formState.instrutor,
        materia: formState.materia,
        semestre: formState.semestre,
        modulo: formState.modulo,
        periodo: formState.periodo,
        receitas: receitas,
      });

      showSuccess("Aula cadastrada com sucesso!");

      // Limpa formulário
      setFormState({
        nome: "",
        descricao: "",
        data: "",
        instrutor: "",
        materia: "",
        semestre: "",
        modulo: "",
        periodo: "",
        receitasSelecionadas: [],
      });
    } catch (err) {
      console.error("❌ Erro no cadastro:", err);

      const backendMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.response?.data ||
        "Erro inesperado ao cadastrar aula.";

      showError(backendMsg);
    }
  };

  return (
    <div className="flex w-screen h-screen overflow-hidden bg-gray-50 text-gray-800 font-sans">
      <div className="flex-1 flex flex-col bg-orange-100">

        {/* Topbar */}
        <div className="h-28 shrink-0 bg-gradient-to-r from-orange-500 via-yellow-400 to-orange-600
                        flex flex-col items-center justify-center text-white rounded-b-3xl shadow-xl px-4">
          <h2 className="text-2xl font-extrabold tracking-tight">Cadastro de Aulas e Receitas</h2>
          <p className="text-sm mt-1 opacity-90">Organize o currículo da sua escola com GastroFlow.</p>
        </div>

        {/* Form */}
        <div className="flex-1 flex items-start justify-center p-6 overflow-y-auto">
          <div className="w-full max-w-3xl bg-white rounded-xl shadow-2xl p-6 border border-orange-200">

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Nome */}
              <div>
                <label className="block text-sm font-semibold mb-2">Nome</label>
                <input
                  type="text"
                  name="nome"
                  value={formState.nome}
                  onChange={handleChange}
                  className="block w-full rounded-lg border-2 border-gray-300 p-3 shadow-inner focus:border-orange-500 transition"
                />
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-sm font-semibold mb-2">Descrição</label>
                <input
                  type="text"
                  name="descricao"
                  value={formState.descricao}
                  onChange={handleChange}
                  className="block w-full rounded-lg border-2 border-gray-300 p-3 shadow-inner focus:border-orange-500 transition"
                />
              </div>

              {/* Data / Instrutor */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Data</label>
                  <input
                    type="date"
                    name="data"
                    value={formState.data}
                    onChange={handleChange}
                    className="block w-full rounded-lg border-2 border-gray-300 p-3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Instrutor</label>
                  <input
                    type="text"
                    name="instrutor"
                    value={formState.instrutor}
                    onChange={handleChange}
                    className="block w-full rounded-lg border-2 border-gray-300 p-3"
                  />
                </div>
              </div>

              {/* Matéria */}
              <div>
                <label className="block text-sm font-semibold mb-2">Matéria</label>
                <input
                  type="text"
                  name="materia"
                  value={formState.materia}
                  onChange={handleChange}
                  className="block w-full rounded-lg border-2 border-gray-300 p-3"
                />
              </div>

              {/* Semestre / Módulo / Período */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Semestre</label>
                  <select
                    name="semestre"
                    value={formState.semestre}
                    onChange={handleChange}
                    className="w-full rounded-lg border-2 border-gray-300 p-3"
                  >
                    <option value="">Selecione</option>
                    <option value="1">1º</option>
                    <option value="2">2º</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Módulo</label>
                  <select
                    name="modulo"
                    value={formState.modulo}
                    onChange={handleChange}
                    className="w-full rounded-lg border-2 border-gray-300 p-3"
                  >
                    <option value="">Selecione</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Período</label>
                  <select
                    name="periodo"
                    value={formState.periodo}
                    onChange={handleChange}
                    className="w-full rounded-lg border-2 border-gray-300 p-3"
                  >
                    <option value="">Selecione</option>
                    <option value="Matutino">Matutino</option>
                    <option value="Vespertino">Vespertino</option>
                    <option value="Noturno">Noturno</option>
                  </select>
                </div>
              </div>

              {/* Receitas */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Receitas Associadas
                </label>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="w-full py-3 rounded-lg bg-orange-200 border-2 border-orange-300 text-orange-800 font-bold hover:bg-orange-300 transition"
                >
                  Selecionar Receitas ({formState.receitasSelecionadas.length})
                </button>

                {/* Lista */}
                <div className="mt-3 space-y-2 max-h-40 overflow-y-auto p-2 border border-dashed border-gray-300 rounded-lg bg-gray-50">
                  {formState.receitasSelecionadas.length > 0 ? (
                    formState.receitasSelecionadas.map((rec, index) => (
                      <div
                        key={`${rec.id}-${index}`}
                        className="flex justify-between items-center bg-white p-2 rounded shadow"
                      >
                        <span>{rec.nome}</span>

                        <button
                          type="button"
                          onClick={() => handleRemoveReceita(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <XIcon className="w-6 h-6" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 text-sm italic">
                      Nenhuma receita selecionada.
                    </p>
                  )}
                </div>
              </div>

              {/* Botão submit */}
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="py-3 px-6 bg-orange-600 text-white rounded-lg font-bold shadow hover:bg-orange-700 transition"
                >
                  Cadastrar Aula
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Modal de Receitas */}
      <RecipeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddReceitas={handleAddReceitas}
      />
    </div>
  );
};

export default AulasReceitas;
