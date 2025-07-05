import React from "react";
import styles from '../css/header.module.css';

function Header() {
    return(
        <div className={styles.headContainer}>
        <h1 className={styles.head}>Jam<span style={{color: "#bb86fc"}}>mm</span>ing</h1>
        </div>
    )
}

export default Header;