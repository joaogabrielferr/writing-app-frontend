import { JSX } from "react";
import style from './article-preview.module.css';
import { Article } from "@/models/article";
import Link from "next/link";

interface props{
    article: Article;
}

export default function ArticlePreview({article} : props) : JSX.Element{

    return (
        <div className = {style.preview}>
            <div className={style.header}>
                {article.authorName} {!!article.community ? " for " + article.community.name : ''}
            </div>
                <Link href={`${article.authorId}/${article.id}`} className = {style.link}>
                <div className = {style.container}>
                    <div className = {style.info}>
                        <h2 className={style.title}>{article.title}</h2>
                        <div className={style.subtitle}>{article.subtitle}</div>
                    </div>
                    <div className={style.img}>
                        {
                            article.imgUrl && <img alt = "image" src = {article.imgUrl}></img>

                        }
                    </div>

                </div>
                </Link>
        </div>
    );
    
}

export function ArticlePreviewSkeleton(){
    return (
        <div className = {style.previewSkeleton}>
        </div>
    );
    
}