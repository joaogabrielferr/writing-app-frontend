'use client'

import { useEffect, useState } from "react";
import ArticlePreview, { ArticlePreviewSkeleton } from "../article-preview/article-preview";
import style from "./articles-list.module.css";
import { Article } from "@/models/article";
import api from "@/utils/axios";
import Button from "../button/button";



export default function ArticlesList(){

    const [articles,setArticles] = useState<Article[]>([]);
    const [error,setError] = useState<boolean>(false);


    useEffect(()=>{
        api.get<{content:Article[]}>("/articles").then((response)=>{
            setArticles(response.data.content);
        }).catch(()=>{
            setError(true);
        });

    },[]);

    if(error){
        return <div  className = {style.articles_list}>
            There was a problem loading the articles. Please try again later.
        </div>
    }
    
    if(!articles?.length){
        return <div className = {style.articles_list}>
            <div>
                {
                    [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map(i => <ArticlePreviewSkeleton key = {i}></ArticlePreviewSkeleton>)
                }            
            </div>
        </div>

    }

    return (
        <div className = {style.articles_list}>
            <div>
                {    
                    articles.map(a => <ArticlePreview article={a} key = {a.id}></ArticlePreview>)
                }            
            </div>
            <div className = {style.load_more}>
                <Button text="Load More" click={()=>console.log(".")} />
            </div>
        </div>
    );

}