import Link from "next/link";
import styles from "./app-landing.module.css";

export default function LandingPage(){

  return (
    <>
      {/* <Head>
        <title>ESCRITR - Ignite Your Narrative</title>
        <meta name="description" content="ESCRITR: Where stories come alive. Join the next-gen writing platform." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;800&display=swap" rel="stylesheet" />
      </Head> 
      */}

      <main className={styles.container}>
        <div className={styles.contentWrapper}>
          <div className = {styles.hero}>
            <h1 className={styles.title}>
              <span className={styles.titleFirstLetter}>E</span>SCRITR
            </h1>

            <p className={styles.slogan}>
              Ignite Your Narrative. Built for the modern storyteller.
            </p>

            {/* <p className={styles.cta}>
              Tired of clunky tools? ESCRITR is the sleek, intuitive platform built for the modern storyteller.
              Unleash your creativity and let your ideas flow like never before.
            </p> */}

            <Link href="/register" legacyBehavior>
              <a className={styles.loginButton}>
                Join the club ✨
              </a>
            </Link>
          </div>
        </div>
      </main>
    </>
  );

}