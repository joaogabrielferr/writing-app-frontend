'use client'

import ArticlePreview, { ArticlePreviewSkeleton } from "../article-preview/article-preview";
import style from "./articles-list.module.css";
import { Article } from "@/models/article";
import Button from "../button/button";


interface Props{
    articles: Article[];
    loadingArticles:boolean;
    error:boolean;
}

export default function ArticlesList({articles,loadingArticles,error} : Props){


    
    if(loadingArticles){
        return <div className = {style.articles_list}>
            <div>

                {
                    [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map(i => <ArticlePreviewSkeleton key = {i}></ArticlePreviewSkeleton>)
                }            
            </div>
        </div>

    }

    if(error){
    return (
        <div className = {style.articles_list}>
            Whoops! We couldn&apos;t load the stories for now...
        </div>
    );
    }

    return (
        <div className = {style.articles_list}>
            <div>
                {    
                    articles.map(a => <ArticlePreview isUser={false} article={a} key = {a.id}></ArticlePreview>)
                }            
            </div>
            <div className = {style.load_more}>
                <Button click={()=>console.log(".")}>Load more</Button>
            </div>
        </div>
    );

}