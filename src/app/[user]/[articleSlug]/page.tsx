import Header from "@/app/_components/header/header";
import style from './article-page.module.css'
import { Article } from "@/models/article";
import { notFound } from "next/navigation";

export default async function ArticlePage({
    params,
  }: {
    params: Promise<{ articleSlug: string }>
  }){

    const {articleSlug} = await params;
    console.log("slug:",articleSlug);
    const res = await fetch(`http://localhost:8080/api/articles/slug/${articleSlug}`, {
      next: { revalidate: 3600 }, //TODO: revalidate only after article changes
    });
    
    if(!res.ok){
      notFound();
    }

    const article: Article = await res.json();


    return (
        <>
          <Header location={'other'}/>
          <div className = {style.pageEditor}>
            <div className = {style.editorContainer}>

            <div className = {style.articleTitle}>{article.title}</div>  

            {
              article.subtitle ?
              <div className = {style.articleSubtitle}>
                {article.subtitle}
              </div>
              : null
            }

            <p>
              {articleSlug}
            </p>

            <div className = {style.editor}>
              <article className = {`${style.tiptap} ${style.ProseMirror}`} dangerouslySetInnerHTML={{ __html: article.content }}/>
            </div>

            </div>
            </div>
  
        </>
    );

}