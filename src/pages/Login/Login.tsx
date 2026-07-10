import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext/useAuth";
import classes from "./Login.module.css";

//Logo
import Logo from "@/assets/logo-lumini.png";

//Components
import {Button} from "@/components/ui";

const Login = () => {

const { signIn } = useAuth();
const navigate = useNavigate();

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState<string | null>(null);
const [isSubmitting, setIsSubmitting] = useState(false);

const handleSubmit = async () => {
  if (isSubmitting) return;
  setError(null);

  if(!email || !password) {
    setError("Por favor, preencha todos os campos.");
    return;
  }

  setIsSubmitting(true);

   try {
      const { data, error: signInError } = await signIn(email, password);

      if (signInError) {
        if (signInError.status === 400) {
          setError("Credenciais inválidas. Verifique seu e-mail e senha.");
        } else {
          setError(signInError.message);
        }
        return;
      }

      if(data.user){
        navigate("/"); 
      }

  } catch(err){
    setError("Ocorreu um erro inesperado. Tente novamente mais tarde.");
    console.error(err);
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className={classes.login_container}>
      <img src={Logo} alt="Logo Lumini" />
    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className={classes.login}>
      <h3>Login</h3>

    {error && <div className={classes.error_message}>{error}</div>}

      <div className={classes.users}>
        <label htmlFor="email">Email:</label>
        <input 
        id="email"
        type="email" placeholder="Digite o seu email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isSubmitting}
        required />
      </div>

      <div className={classes.password}>
        <div className={classes.password_forgot}>
        <label htmlFor="password">Senha:</label>
        <a href="#">Esqueceu a sua senha?</a>
        </div>
        <input id="password"
        type="password" placeholder="Digite a sua senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)} 
        disabled={isSubmitting}
        required/> 
      </div>
          <Button
          type="submit"
          title={isSubmitting ? "Carregando..." : "Entrar"}
          padding=".6rem"
          width="80%"
          disabled={isSubmitting}
        />
    </form>

    </div>
  )
}

export default Login
