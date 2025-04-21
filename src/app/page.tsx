import style from "./page.module.css";
import SecondarySidebar from "./_components/SecondarySidebar/secondary-sidebar";
import Sidebar from "./_components/sidebar/sidebar";
import Header from "./_components/header/header";
import ArticlesList from "./_components/articles-list/articles-list";

export default function Home() {


  return (
    <>
    <Header location="main"/>
      <div className = {style.home}>
        <Sidebar></Sidebar>
        <div className = {style.main_container}>
            <main className = {style.main}>
              
              {/* <div id = {style.__banner__}>
                content
              </div> */}
              
              <section className = {style.section}>
                <article className = {style.article}>
                  <ArticlesList></ArticlesList>
                </article>
                <SecondarySidebar></SecondarySidebar>
              </section>

            </main>
        </div>
      </div>
    </>
  );
}
