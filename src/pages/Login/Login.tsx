import classes from "./Login.module.css";

//Logo
import Logo from "@/assets/logo-lumini.png";

//Components
import {Button} from "@/components/ui";

const Login = () => {
  return (
    <div className={classes.login_container}>
      <img src={Logo} alt="Logo Lumini" />
    <div className={classes.login}>
      <h3>Login</h3>
      <div className={classes.users}>
        <label>Email:</label>
        <input type="text" placeholder="Digite o seu email"/>
      </div>
      <div className={classes.password}>
        <div className={classes.password_forgot}>
        <label>Senha:</label>
        <a href="#">Esqueceu a sua senha?</a>
        </div>
        <input type="password" placeholder="Digite a sua senha"/> 
      </div>
          <Button title="Entrar"/>
    </div>

    </div>
  )
}

export default Login
