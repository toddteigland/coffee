import React, {useEffect} from "react";
import styles from "../styles/footer.module.css";

export default function Footer() {


    //DARK MODE TOGGLE //
    useEffect(() => {
      const toggleSwitch = document.getElementById("checkbox");
  
      function switchTheme(e) {
        const isDarkMode = e.target.checked;
  
        if (isDarkMode) {
          document.documentElement.setAttribute("data-theme", "dark");
          document.getElementById("lightDark").innerHTML = "Enable Light Mode";
        } else {
          document.documentElement.setAttribute("data-theme", "light");
          document.getElementById("lightDark").innerHTML = "Enable Dark Mode";
        }
  
        localStorage.setItem("theme", isDarkMode ? "dark" : "light");
      }
  
      if (toggleSwitch !== null) {
        toggleSwitch.addEventListener("change", switchTheme);
      }
  
      const currentTheme = localStorage.getItem("theme");
      if (currentTheme === "dark") {
        toggleSwitch.checked = true;
      }
  
      return () => {
        if (toggleSwitch !== null) {
          toggleSwitch.removeEventListener("change", switchTheme);
        }
      };
    }, []);

  return (
    <footer className={styles.footerContainer}>
    <div className={styles.themeswitchwrapper}>
    <label className={styles.themeswitch} htmlFor="checkbox">
      <input type="checkbox" id="checkbox" />
      <div className={styles.slider}></div>
    </label>
    <em id="lightDark" className={styles.em}>
      Enable Dark Mode!
    </em>
  </div>
    </footer>
  )

}