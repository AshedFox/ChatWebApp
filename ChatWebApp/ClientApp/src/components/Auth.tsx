import React, {SyntheticEvent, useState} from 'react';
import styles from "../css/RegAuth.module.css";
import {routes} from "../routes";
import CryptoJS from "crypto-js";
import {LoginDTO} from "../DTOs/LoginDTO";
import {useAppSelector} from "../hooks/useAppSelector";
import CustomLoading from "./CustomLoading";
import {connect} from "react-redux";
import {userActions} from "../store/action-creators/userActions";
import {AppDispatch} from "../store/store";
import {bindActionCreators} from "@reduxjs/toolkit";

type DispatchProps = {
    authorize: typeof userActions.authorize
}

const Auth = ({authorize}:DispatchProps) => {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const {loading} = useAppSelector(state => state.user);

    const submitForm = async (e:SyntheticEvent) => {
        e.preventDefault();
        let loginData:LoginDTO = {
            login: login,
            passwordHash: CryptoJS.SHA512(password).toString(CryptoJS.enc.Hex),
        }

        authorize(loginData);
    }

    return (
        <React.Fragment>
            {loading && <CustomLoading height={"20%"} width={"20%"}/>}
            <div className={styles.container}>
                <div className={styles.content}>
                    <form className={styles.form}
                          onSubmit={(e:SyntheticEvent)=>submitForm(e)}
                    >
                        <legend className={styles.title}>{"Авторизация"}</legend>
                        <fieldset className={styles.fields}>
                            <input className={styles.input} value={login}
                                   name={"login"} type={"text"}
                                   placeholder={"Имя пользователя или email"}
                                   onChange={e => setLogin(e.target.value)}
                            />
                            <input className={styles.input} value={password}
                                   name={"password"} type={"password"}
                                   placeholder={"Пароль"}
                                   onChange={e => setPassword(e.target.value)}
                            />
                        </fieldset>
                        <div className={styles.links}>
                            <a className={styles.link} href={routes.regRoute}>
                                {"Нет аккаунта?"}
                            </a>
                            <button className={styles.button} type={"submit"}>
                                {"Войти"}
                            </button>
                        </div>
                    </form>
                    <div className={styles.separator}>
                        <div className={styles.line}/>
                        <div className={styles.text}>{"Или войдите с помощью"}</div>
                        <div className={styles.line}/>
                    </div>
                    <div className={styles.additional_auth}>
                        <div className={ `${styles.button} ${styles.vk_button}`}>{"Вконтакте"}</div>
                        <div className={`${styles.button} ${styles.google_button}`}>{"Google"}</div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

const mapDispatchToProps = (dispatch:AppDispatch) => {
    return bindActionCreators({authorize: userActions.authorize}, dispatch);
}

export default connect(null, mapDispatchToProps)(Auth);
