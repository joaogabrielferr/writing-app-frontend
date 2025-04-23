'use client'

import { Article } from "@/models/article";
import api from "@/utils/axios";
import { useEffect, useState } from "react";
import ArticlePreview from "../_components/article-preview/article-preview";

interface Props{
    userId:string;
}

export default function Profile({userId} : Props){

    console.log("this is a client component, it has ",userId," as it was passed as param by the server component");

    const [articles,setArticles] = useState<Article[]>();

    useEffect(()=>{
        console.log("cliente component loaded for the first time");
        const load = async () =>{
            
            const data = await api.get<{content:Article[]}>("/articles/user/gabriel");
            console.log(data);
            if(!data){
                window.prompt("ops! we couldnt load your stories. Please try again later");
                return;
            }

            setArticles(data.data?.content as Article[]);

        }
        load();

    },[]);
    
    return (
        <div>
            <h3>Client component</h3>
            <h5>this comes from the server</h5>
            {
                articles?.map(a=>{
                    return <ArticlePreview article={a} key={a.id}></ArticlePreview>
                })
            }
        </div>
    )

}