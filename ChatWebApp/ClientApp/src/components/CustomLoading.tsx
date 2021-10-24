import React from 'react';
import Loading from "react-loading";
import styles from '../css/CustomLoader.module.css';

export type CustomLoadingProps = {
    width?: string|number,
    height?: string|number
}

const CustomLoading = ({width, height}:CustomLoadingProps) => {
    return (
        <div className={styles.container}>
            <Loading className={styles.loader} width={width} height={height}
                     type={"spinningBubbles"}/>
        </div>
    );
};

export default CustomLoading;
