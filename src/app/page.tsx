import SecondarySidebar from "./_components/SecondarySidebar/secondary-sidebar";
import Sidebar from "./_components/sidebar/sidebar";
import Header from "./_components/header/header";
import ArticlesList from "./_components/articles-list/articles-list";
import "./page.scss";

export default function Home() {


  return (
    <>
    <Header location="main"/>
      <div className = "main_page_home">
        <Sidebar></Sidebar>
        <div className = "main_page_main_container">
            <main className = "main_page_main">
              {/* <div id = "__banner__">
                content
              </div> */}
              {/* <div id = "__tags__">
                <button>Self improvement</button>
                <button>Relationships</button>
                <button>Technology</button>
                <button>Gaming</button>
                <button>Politics</button>
                <button>Marketing</button>
                <button>Travel</button>
              </div> */}
              <section className = "main_page_section">
                <article className = "main_page_article">
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
