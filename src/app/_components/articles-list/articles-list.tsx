'use client'

import { useEffect, useState } from "react";
import ArticlePreview, { ArticlePreviewSkeleton } from "../article-preview/article-preview";
import style from "./articles-list.module.css";
import { Article } from "@/models/article";
import api from "@/utils/axios";



export default function ArticlesList(){

    const [articles,setArticles] = useState<Article[]>([]);

    useEffect(()=>{
        api.get<{content:Article[]}>("/articles").then((response)=>{
            setArticles(response.data.content);
        }).catch((error)=>{
            console.error(error);
        });

    },[]);
    
    if(!articles?.length){
        return <div className = {style.articles_list}>
            <div className="inner-articles-list">
                {
                    [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map(i => <ArticlePreviewSkeleton key = {i}></ArticlePreviewSkeleton>)
                }            
            </div>
        </div>

    }

    return (
        <div className = {style.articles_list}>
            <div className="inner-articles-list">
                {    
                    articles.map(a => <ArticlePreview article={a} key = {a.id}></ArticlePreview>)
                }            
            </div>
        </div>
    );

}