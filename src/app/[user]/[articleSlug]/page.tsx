import Header from "@/app/_components/header/header";
import style from './article-page.module.css'
import { Article } from "@/models/article";
import { notFound } from "next/navigation";
import Sidebar from "@/app/_components/sidebar/sidebar";

export default async function ArticlePage({
  params,
  }: {
    params: Promise<{ articleSlug: string }>
  }){

    const {articleSlug} = await params;
    console.log("slug:",articleSlug);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/articles/slug/${articleSlug}`, {
      next: { revalidate: 3600 },
    });
    
    if(!res.ok){
      notFound();
    }

    const article: Article = await res.json();
    
    return (
      

        //   <Shell location="article">
        //  <div className = {style.container}>
        //     <div className = {style.innerContainer}>
        //       teste
        //       <div className = {style.title}>{article.title}</div>
        //       {
        //         article.subtitle ?
        //         <div className = {style.subtitle}>
        //           {article.subtitle}
        //         </div>
        //         : null
        //       }

        //       <article className = { style.content} dangerouslySetInnerHTML={{ __html: article.content }}/>

        //     </div>
        //  </div>
        //  </Shell>

        <>
        <Header location="other"/>
        <div className = {style.mainPageHome}>

         <Sidebar/>
         <div className = {style.container}>
            <div className = {style.innerContainer}>
              teste
              <div className = {style.title}>{article.title}</div>
              {
                article.subtitle ?
                <div className = {style.subtitle}>
                  {article.subtitle}
                </div>
                : null
              }

              <article className = { style.content} dangerouslySetInnerHTML={{ __html: article.content }}/>

            </div>
         </div>
        </div>
         </>

    );

}