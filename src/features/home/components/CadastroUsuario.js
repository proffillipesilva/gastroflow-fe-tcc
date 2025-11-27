import React from 'react';
import LogoGastroFlow from "../../../assets/LogoGastroFlow.png";
import { useNavigate } from "react-router-dom";
import LoginService from '../service/LoginService';


import { useStatusModalStore } from "../../../shared/store/modal-store";


export default function CadastroUsuario() {

    const navigate = useNavigate();

    const { showLoading, showSuccess, showError } = useStatusModalStore();

    const [form, setForm] = React.useState({
        usuario: '',
        email: '',
        senha: '',
        confirmarSenha: ''
    });

    const [error, setError] = React.useState('');

    const handleForm = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    };

    const validarEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        return regex.test(email.trim());
    };

    const sendData = async (e) => {
        e.preventDefault();

        if (!form.usuario || !form.email || !form.senha || !form.confirmarSenha) {
            setError('Todos os campos são obrigatórios!');
            return;
        }

        if (!validarEmail(form.email)) {
            setError('Digite um e-mail válido!');
            return;
        }

        if (form.senha !== form.confirmarSenha) {
            setError('As senhas não coincidem!');
            return;
        }

        if (form.senha.length < 6) {
            setError("A senha deve ter pelo menos 6 caracteres.");
            return;
        }

        try {
            showLoading("Criando conta...");

            await LoginService.registerUser({
                name: form.usuario,
                email: form.email,
                password: form.senha,
                picture: null
            });

            showSuccess("Usuário cadastrado com sucesso!");

            setForm({ usuario: '', email: '', senha: '', confirmarSenha: '' });

            setTimeout(() => navigate("/"), 1200);

        } catch (err) {
            console.log(err);

            if (err.response?.status === 409) {
                showError("Este e-mail já está cadastrado!");
            } else {
                showError("Erro ao cadastrar usuário.");
            }
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen overflow-x-hidden overflow-y-auto
                bg-gradient-to-br from-orange-500/80 via-yellow-500/70 to-orange-600/80">


            <div className="w-full max-w-md p-8 rounded-2xl bg-white shadow-2xl">
                
                <section className="flex justify-center items-center mb-4">
                    <img
                        src={LogoGastroFlow}
                        alt="Logo GastroFlow"
                        className="w-4/4 max-w-lg h-auto p-4"
                    />
                </section>

                {error && <p className="text-red-600 text-center font-semibold">{error}</p>}

                <form onSubmit={sendData} className="flex flex-col gap-5">

                    <input
                        id="usuario"
                        name="usuario"
                        type="text"
                        value={form.usuario}
                        onChange={handleForm}
                        placeholder="Usuário"
                        className="p-3 rounded-xl border-2 border-orange-300 outline-none transition
                        focus:ring-2 focus:ring-orange-500"
                    />

                    <input
                        id="email"
                        name="email"
                        type="text"
                        value={form.email}
                        onChange={handleForm}
                        placeholder="Email"
                        className="p-3 rounded-xl border-2 border-orange-300 outline-none transition
                        focus:ring-2 focus:ring-orange-500"
                    />

                    <input
                        id="senha"
                        name="senha"
                        type="password"
                        value={form.senha}
                        onChange={handleForm}
                        placeholder="Senha"
                        className="p-3 rounded-xl border-2 border-orange-300 outline-none transition
                        focus:ring-2 focus:ring-orange-500"
                    />

                    <input
                        id="confirmarSenha"
                        name="confirmarSenha"
                        type="password"
                        value={form.confirmarSenha}
                        onChange={handleForm}
                        placeholder="Confirmar Senha"
                        className="p-3 rounded-xl border-2 border-orange-300 outline-none transition
                        focus:ring-2 focus:ring-orange-500"
                    />

                    <button
                        type="submit"
                        className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl
                        shadow-lg transition transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                        Cadastrar
                    </button>
                </form>

                <div className="flex items-center gap-2 my-6">
                    <hr className="flex-1 border-gray-300" />
                    <span className="text-gray-500 text-sm">ou</span>
                    <hr className="flex-1 border-gray-300" />
                </div>

                <button
                    onClick={() => navigate("/")}
                    className="block mx-auto mt-6 text-orange-600 font-bold cursor-pointer 
                    hover:text-orange-500 hover:underline"
                >
                    Já possui cadastro? Clique aqui
                </button>
            </div>
        </div>
    );
}
