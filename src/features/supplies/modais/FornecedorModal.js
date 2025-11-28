import React, { useEffect, useState } from "react";
import FornecedorService from "../Service/FornecedorService";

const FornecedorModal = ({ isOpen, onClose, onSelect }) => {
  const [fornecedores, setFornecedores] = useState([]);
  const [filtroNome, setFiltroNome] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) fetchFornecedores();
  }, [isOpen]);

  const fetchFornecedores = async () => {
    setLoading(true);
    try {
      const data = await FornecedorService.GetFornecedores(0, 999);

      setFornecedores(Array.isArray(data.content) ? data.content : []);
    } catch (err) {
      console.warn("Backend OFF → usando fornecedores mockados.");
      setFornecedores([
        { id: 1, razaoSocial: "Fornecedor Teste LTDA" },
        { id: 2, razaoSocial: "Distribuidora Brasil" },
        { id: 3, razaoSocial: "Alimentos Bom Sabor" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const filtrados = fornecedores.filter((f) =>
    f.razaoSocial.toLowerCase().includes(filtroNome.toLowerCase().trim())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-xl rounded-lg shadow-lg p-6 relative">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Selecionar Fornecedor
        </h2>

        {/* 🔎 Campo de busca */}
        <input
          type="text"
          placeholder="Buscar fornecedor..."
          value={filtroNome}
          onChange={(e) => setFiltroNome(e.target.value)}
          className="border border-gray-300 rounded-md p-2 text-sm w-full mb-4 focus:ring-orange-500 focus:border-orange-500"
        />

        {loading ? (
          <p className="text-gray-500 text-center">Carregando fornecedores...</p>
        ) : (
          <div className="max-h-80 overflow-y-auto border rounded-lg">
            <ul className="divide-y">
              {filtrados.length > 0 ? (
                filtrados.map((f) => (
                  <li
                    key={f.id}
                    className="p-3 hover:bg-orange-100 cursor-pointer"
                    onClick={() => {
                      onSelect(f);
                      onClose();
                    }}
                  >
                    <span className="font-medium">{f.razaoSocial}</span>
                  </li>
                ))
              ) : (
                <li className="text-center text-gray-500 py-4 italic">
                  Nenhum fornecedor encontrado.
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Botões */}
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default FornecedorModal;
