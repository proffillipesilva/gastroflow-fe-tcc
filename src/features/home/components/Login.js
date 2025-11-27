import React from "react";
import LogoGastroFlow from "../../../assets/LogoGastroFlow.png";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import LoginService from "../service/LoginService";
import useAuthStore from "../../../shared/store/auth-store";

export default function Login() {
  const navigate = useNavigate();

  const { setAuthData, fetchUser, fcmToken } = useAuthStore();

  const [form, setForm] = React.useState({ email: "", password: "" });
  const [error, setError] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleForm = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setError("Preencha ambos os campos abaixo");
      return;
    }

    try {
      setLoading(true);

      const data = await LoginService.loginUser({
        email: form.email,
        password: form.password,
      });

      const receivedToken = data.token;

      // salva o token
      setAuthData(receivedToken);

      // carrega o usuário autenticado
      await fetchUser();

      // envia FCM se existir
      if (fcmToken) {
        try {
          await LoginService.sendToken({ fcmToken });
        } catch (fcErr) {
          console.warn("Falha ao enviar FCM token:", fcErr);
        }
      }

      navigate("/produtos", { replace: true });

    } catch (err) {
      console.error(err);

      if (err.response?.status === 401) {
        setError("Email ou senha incorretos!");
      } else if (err.response?.status === 403) {
        setError("Acesso negado! Verifique suas credenciais.");
      } else {
        setError("Erro ao tentar fazer login.");
      }

    } finally {
      setLoading(false);
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

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            id="email"
            name="email"
            type="text"
            value={form.email}
            onChange={handleForm}
            placeholder="Email"
            className="p-3 rounded-xl border-2 border-orange-300 outline-none transition focus:ring-2 focus:ring-orange-500"
          />

          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleForm}
              placeholder="Senha"
              className="p-3 rounded-xl border-2 border-orange-300 outline-none transition focus:ring-2 focus:ring-orange-500 w-full pr-10"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl shadow-lg transition transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="flex items-center gap-2 my-6">
          <hr className="flex-1 border-gray-300" />
          <span className="text-gray-500 text-sm">ou</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        <button
          onClick={() => navigate("/CadastroUsuario")}
          className="block mx-auto mt-6 text-orange-600 font-bold cursor-pointer hover:text-orange-500 hover:underline"
        >
          Ainda não possui uma conta? Cadastre-se!
        </button>
      </div>
    </div>
  );
}
