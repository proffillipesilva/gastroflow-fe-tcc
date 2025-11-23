import React, { useState } from "react";
import Sidebar from "../../shared/components/Sidebar";
import ReceitaService from "./service/ReceitaService";
import { FaPlusCircle, FaTrashAlt } from "react-icons/fa";
import IngredientsModal from "./modais/IngredientsModal";

// === MODAL GLOBAL ===
import { useStatusModalStore } from "../../shared/store/modal-store";
import StatusModal from "../../shared/components/StatusModal";

const CadastroDeReceita = () => {
  const [formState, setFormState] = useState({
    nome: "",
    descricao: "",
    produtos: [], // { produtoId, quantidade, nomeProduto, categoria }
    tempoPreparo: "",
    rendimento: "",
    tipo: "",
    professorReceita: "",
  });

  // usamos errors apenas para controlar as bordas vermelhas
  const [errors, setErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  // === GLOBAL MODAL STORE ===
  const { showLoading, showSuccess, showError } = useStatusModalStore();

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Campos que devem aceitar apenas números
    const numericFields = ["tempoPreparo", "rendimento"];

    const newValue = numericFields.includes(name)
      ? value.replace(/\D/g, "") // remove tudo que não for número
      : value;

    setFormState((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Se já havia erro naquele campo, remove para atualizar borda
    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  // Validação que retorna objeto com possíveis erros (mantemos ordem lógica)
  const collectValidationErrors = () => {
    const newErrors = {};

    if (!formState.nome.trim()) newErrors.nome = "O nome da receita é obrigatório.";
    if (!formState.descricao.trim()) newErrors.descricao = "A descrição é obrigatória.";
    if (formState.produtos.length === 0) newErrors.produtos = "Adicione pelo menos um ingrediente.";
    if (!formState.tempoPreparo.trim()) newErrors.tempoPreparo = "Informe o tempo de preparo.";
    if (!formState.rendimento.trim()) newErrors.rendimento = "Informe o rendimento.";
    if (!formState.tipo.trim()) newErrors.tipo = "Informe o tipo.";
    if (!formState.professorReceita.trim()) newErrors.professorReceita = "Informe o autor.";

    return newErrors;
  };

  // === SUBMIT ===
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = collectValidationErrors();
    setErrors(validationErrors);

    // se houver erro, mostra apenas o primeiro no modal e aborta
    const keys = Object.keys(validationErrors);
    if (keys.length > 0) {
      const firstErrorMessage = validationErrors[keys[0]];
      showError(firstErrorMessage);
      return;
    }

    const receitaData = {
      nome: formState.nome,
      descricao: formState.descricao,
      tempoPreparo: formState.tempoPreparo,
      rendimento: formState.rendimento,
      tipo: formState.tipo,
      professorReceita: formState.professorReceita,
      produtos: formState.produtos.map((p) => ({
        produtoId: p.produtoId,
        quantidade: p.quantidade,
      })),
    };

    try {
      showLoading("Salvando receita...");

      await ReceitaService.RegisterRecipe(receitaData);

      showSuccess("Receita cadastrada com sucesso!");

      setFormState({
        nome: "",
        descricao: "",
        produtos: [],
        tempoPreparo: "",
        rendimento: "",
        tipo: "",
        professorReceita: "",
      });
      setErrors({});
    } catch (err) {
      console.error(err);

      showError(
        err?.response && err.response.status === 403
          ? "Acesso negado! Verifique suas credenciais."
          : "Erro ao cadastrar receita!"
      );
    }
  };

  const openAdjustStockModal = () => setIsModalOpen(true);
  const closeAdjustStockModal = () => setIsModalOpen(false);

  const handleAddIngredients = (ingredientesSelecionados) => {
    const novos = ingredientesSelecionados.map((ing) => ({
      produtoId: ing.id,
      quantidade: ing.quantidadeAdicionar,
      nomeProduto: ing.nomeProduto,
      categoria: ing.categoria,
    }));

    setFormState((prev) => ({
      ...prev,
      produtos: [...prev.produtos, ...novos],
    }));

    setIsModalOpen(false);

    // ao adicionar ingredientes, removemos erro relacionado (se houver)
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy.produtos;
      return copy;
    });
  };

  const handleRemoveIngredient = (indexToRemove) => {
    setFormState((prev) => ({
      ...prev,
      produtos: prev.produtos.filter((_, i) => i !== indexToRemove),
    }));

    // se removendo deixa vazio e havia erro, mostramos esse erro na próxima validação automaticamente
  };

  return (
    <div className="flex w-screen h-screen overflow-hidden bg-orange-100 text-gray-800 font-sans">
      <div className="flex-1 min-w-0 flex flex-col">
        <div
          className="h-28 bg-gradient-to-r from-orange-400 via-yellow-500 to-orange-600 
                        flex flex-col items-center justify-center text-white rounded-b-3xl shadow-lg"
        >
          <h2 className="text-base md:text-2xl font-extrabold tracking-tight">Cadastro de Receitas</h2>
          <p className="hidden md:block text-sm opacity-90">GastroFlow</p>
        </div>

        <div className="flex-1 flex items-start justify-center md:p-6 overflow-y-auto">
          <div className="w-full max-w-3xl bg-white rounded-xl shadow-2xl p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Nome */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Nome da Receita
                </label>
                <input
                  type="text"
                  name="nome"
                  value={formState.nome}
                  onChange={handleChange}
                  placeholder="Ex: Pão de Queijo"
                  className="w-full border border-gray-300 p-3 rounded-lg"
                />
              </div>

              {/* Ingredientes */}
              <div>
                <label className="text-xl text-gray-800">Ingredientes</label>

                <button
                  type="button"
                  onClick={openAdjustStockModal}
                  className="flex items-center py-2 px-4 mt-2 rounded-md text-white bg-green-500 hover:bg-green-600"
                >
                  <FaPlusCircle className="mr-2" /> Adicionar Ingredientes
                </button>

                {formState.produtos.length > 0 && (
                  <div className="mt-4 border rounded-xl p-4 bg-gray-50">
                    <h3 className="text-lg font-semibold mb-2">Selecionados</h3>

                    <div className="max-h-56 overflow-y-auto pr-2">
                      <ul className="divide-y">
                        {formState.produtos.map((item, index) => (
                          <li key={index} className="flex justify-between py-2">
                            <div>
                              <span className="font-bold">{item.nomeProduto}</span>
                              <p className="text-xs text-gray-600">
                                Categoria: {item.categoria} | Quantidade: {item.quantidade}
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleRemoveIngredient(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <FaTrashAlt />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-sm font-semibold mb-1">Descrição</label>
                <textarea
                  name="descricao"
                  value={formState.descricao}
                  onChange={handleChange}
                  placeholder="Adicione uma breve descrição..."
                  className="w-full border border-gray-300 p-3 rounded-lg"
                />
              </div>

              {/* Tempo e Rendimento */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold">Tempo de Preparo (min)</label>
                  <input
                    type="text"
                    name="tempoPreparo"
                    value={formState.tempoPreparo}
                    onChange={handleChange}
                    placeholder="Ex: 45"
                    className="w-full border border-gray-300 p-3 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold">Rendimento (porções)</label>
                  <input
                    type="text"
                    name="rendimento"
                    value={formState.rendimento}
                    onChange={handleChange}
                    placeholder="Ex: 8 porções"
                    className="w-full border border-gray-300 p-3 rounded-lg"
                  />
                </div>
              </div>

              {/* Tipo */}
              <div>
                <label className="block text-sm font-semibold">Tipo da Receita</label>
                <input
                  type="text"
                  name="tipo"
                  value={formState.tipo}
                  onChange={handleChange}
                  placeholder="Ex: Sobremesa, Prato Principal..."
                  className="w-full border border-gray-300 p-3 rounded-lg"
                />
              </div>

              {/* Professor */}
              <div>
                <label className="block text-sm font-semibold">Professor/Autor</label>
                <input
                  type="text"
                  name="professorReceita"
                  value={formState.professorReceita}
                  onChange={handleChange}
                  placeholder="Nome do professor / autor"
                  className="w-full border border-gray-300 p-3 rounded-lg"
                />
              </div>

              {/* Botões */}
              <div className="flex flex-col space-y-3 pt-2">
                <button
                  type="submit"
                  className="py-3 px-4 rounded-lg text-white bg-orange-600 hover:bg-orange-700 transition"
                >
                  Cadastrar Receita
                </button>

                <button
                  type="button"
                  onClick={() => console.log("Cancelar")}
                  className="py-3 px-4 rounded-lg bg-orange-300 text-gray-800"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* === STATUS MODAL GLOBAL === */}
      <StatusModal />

      {/* === MODAL DE INGREDIENTES === */}
      <IngredientsModal
        isOpen={isModalOpen}
        onClose={closeAdjustStockModal}
        onAddIngredients={handleAddIngredients}
      />
    </div>
  );
};

export default CadastroDeReceita;
