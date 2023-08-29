import React from 'react';
import styles from '../styles/form.module.css'

export default function BusinessRegister() {

  return(
    <div className={styles.userRegisterContainer}>

    <form className={styles.form}>
    <label>
        Business Name:
        <input type="text" name="businessName" />
      </label>
      <label>
        Business Address:
        <input type="text" name="businessAddresss" />
      </label>
      <label>
        Email:
        <input type="email" name="email" />
      </label>
      <label>
        Password:
        <input type="password" name="password" />
      </label>
      <input type="submit" name="submit" />
    </form>
    </div>
  )
}