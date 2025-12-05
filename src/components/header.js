import React from "react";
import styles from '../css/header.module.css';

function Header() {
    return(
        <div className={styles.headContainer}>
<h1 className={styles.head}>
  Jam<span className={styles.accentText}>mm</span>ing
</h1>

        </div>
    )
}

export default Header;