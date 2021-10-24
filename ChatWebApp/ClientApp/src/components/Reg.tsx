import React, {SyntheticEvent, useState} from 'react';
import styles from "../css/RegAuth.module.css";
import {routes} from "../routes";
import {UserDTO} from "../DTOs/UserDTO";
import CryptoJS from "crypto-js";
import {useAppSelector} from "../hooks/useAppSelector";
import CustomLoading from "./CustomLoading";
import {AppDispatch} from "../store/store";
import {bindActionCreators} from "@reduxjs/toolkit";
import {userActions} from "../store/action-creators/userActions";
import {connect} from "react-redux";

type DispatchProps = {
    register: typeof userActions.register
}

const Reg = ({register}:DispatchProps) => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordRepeat, setPasswordRepeat] = useState("");
    const {loading} = useAppSelector(state => state.user);

    const submitForm = async (e:SyntheticEvent) => {
        e.preventDefault();

        let userData:UserDTO = {
            username: username,
            email: email,
            passwordHash: CryptoJS.SHA512(password).toString(CryptoJS.enc.Hex),
            name: username,
        }

        if (password === passwordRepeat){
            register(userData)
        }
        else {
            alert("Значения в полях пароля не совпадают")
        }
    }

    return (
        <React.Fragment>
            {loading && <CustomLoading height={"20%"} width={"20%"}/>}
            <div className={styles.container}>
                <div className={styles.content}>
                    <form className={styles.form}
                          onSubmit={(e:SyntheticEvent)=>submitForm(e)}
                    >
                        <legend className={styles.title}>{"Регистрация"}</legend>
                        <fieldset className={styles.fields}>
                            <input className={styles.input} name={"username"}
                                   type={"text"} value={username}
                                   placeholder={"Имя пользователя"}
                                   onChange={e => setUsername(e.target.value)}
                            />
                            <input className={styles.input} name={"email"}
                                   type={"email"} value={email}
                                   placeholder={"Email"}
                                   onChange={e => setEmail(e.target.value)}
                            />
                            <input className={styles.input} name={"password"}
                                   type={"password"} value={password}
                                   placeholder={"Пароль"}
                                   onChange={e => setPassword(e.target.value)}
                            />
                            <input className={styles.input} name={"passwordRepeat"}
                                   type={"password"} value={passwordRepeat}
                                   placeholder={"Пароль (повторно)"}
                                   onChange={e => setPasswordRepeat(e.target.value)}
                            />
                        </fieldset>
                        <div className={styles.links}>
                            <a className={styles.link} href={routes.authRoute}>
                                {"Уже есть аккаунт?"}
                            </a>
                            <button className={styles.button} type={"submit"}>
                                {"Зарегистрироваться"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </React.Fragment>
    );
};

const mapDispatchToProps = (dispatch:AppDispatch) => {
    return bindActionCreators({authorize: userActions.register}, dispatch);
}

export default connect(null, mapDispatchToProps)(Reg);
