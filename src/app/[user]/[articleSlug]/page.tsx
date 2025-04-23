import Header from "@/app/_components/header/header";
import style from './article-page.module.css'
import { Article } from "@/models/article";

export default async function ArticlePage({
    params,
  }: {
    params: Promise<{ articleSlug: string }>
  }){

    const {articleSlug} = await params;
    console.log(articleSlug);
    const data = await fetch(`http://localhost:8080/api/articles/slug/${articleSlug}`, {
      next: { revalidate: 120 }, //TODO: revalidate only after article changes
    })
    const article : Article = await data.json();

    return (
        <>
          <Header location={'other'}/>
          <div className = {style.pageEditor}>
            <div className = {style.editorContainer}>

            <div className = {style.articleTitle}>{article.title}</div>  

            <div className = {style.articleSubtitle}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto, facilis.
            </div>

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