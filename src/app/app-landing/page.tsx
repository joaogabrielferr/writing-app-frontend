/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import styles from "./app-landing.module.css";
import { bokor } from "../layout";
import Button from "../_components/button/button";

export default function LandingPage(){

  return (
        <div className={styles.pageContainer}>
          <header className = {styles.header}>
            <div className = {styles.innerHeader}>
              <div>
                <span className={styles.detail2}>E</span>SCRITR
              </div>
              <div className = {styles.buttons}>
                <Button>Sign in</Button>
                <Button>Sign up</Button>
              </div>
              <div>

              </div>
            </div>
          </header>

      <section className={styles.heroSection}>
        <img
          src="/Saint_Jerome_Writing-Caravaggio.jpg" 
          alt="Inspiring background"
          className={styles.heroImage} 
          loading="eager"
        />
        <div className={styles.heroOverlay}>
          <div className={styles.heroContent}>
            <h1 className={styles.slogan}>Ignite your <div className={styles.container}>
                <span className={styles.text}>narrative</span>
                  <svg
                    className={styles.underline}
                    viewBox="0 0 200 20"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M5,15 C30,5 70,25 100,10 C130,-5 170,25 195,15"
                      stroke="#696be7"
                      strokeWidth="7"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </svg>
            </div>. 
            Built for the modern <span className={styles.detail2}>storyteller</span>.</h1>
            <p className={styles.subSlogan}>
              Unleash your creativity and let your ideas flow like never before.
            </p>
            <Link href={"/register"}><button className={`${styles.ctaButton} ${bokor.className}`}>
              <span className = {styles.ctaButtonContent}>
                Join the club ✨
              </span>
              </button></Link>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.contentWrapper}>
          <p>
            © {new Date().getFullYear()} Escritr. All Rights Reserved.
          </p>
          <nav className={styles.footerNav}>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Contact Us</a>
          </nav>
          
        </div>
        <div className = {styles.nameBig}>
          <span className={styles.detail2}>E</span>SCRITR
        </div>
      </footer>
    </div>
  );

}