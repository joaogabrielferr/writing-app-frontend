'use client'

import { Article } from "@/models/article";
import ArticlePreview from "../_components/article-preview/article-preview";

interface ProfileData{
    articles:Article[] | null;
    error:boolean;
}
interface Props{
    data: ProfileData | null
}

export default function Profile({data}:Props){
 
    return (
        <div>
            <h3>Client component</h3>
            {
                data?.error ? <div>We couldn&apos;t load the articles of this user. Please try again later.</div> : data?.articles?.map(a=>{
                    return <ArticlePreview article={a} key={a.id}></ArticlePreview>
                })
            }
        </div>
    )

}