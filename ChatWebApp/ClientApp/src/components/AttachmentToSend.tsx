import React from 'react';
import styles from '../css/AttachmentToSend.module.css'

type AttachmentToSendProps = {
    index: number
    file: File
    handleFileRemove: (index:number) => void
}

const AttachmentToSend = ({index, file, handleFileRemove}:AttachmentToSendProps) => {
    return (
        <div className={styles.container}>
            <div className={styles.name}>{file.name}</div>
            <div className={styles.remove_button} onClick={() => handleFileRemove(index)}>&#10006;</div>
        </div>
    );
};

export default AttachmentToSend;
