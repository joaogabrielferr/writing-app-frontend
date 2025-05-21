import { JSX } from "react";
import style from './article-preview.module.css';
import { Article } from "@/models/article";
import Link from "next/link";
import { Heart, MessageCircle } from "lucide-react";

interface props{
    article: Article;
}

export default function ArticlePreview({article} : props) : JSX.Element{

    return (
        <div className = {style.preview}>
            <div className={style.header}>
                {article.author.name}
                 {/* {!!article.community ? " for " + article.community.name : ''} */}
            </div>
                <Link href={`${article.author.username}/${article.slug}`} className = {style.link}>
                    <div className = {style.container}>
                        <div className = {style.info}>
                            <h2 className={style.title}>{article.title}</h2>
                            <div className={style.subtitle}> {article.subtitle ? article.subtitle : article.firstParagraph}</div>
                        </div>
                        <div className={style.img}>
                            {
                                article.thumbnailUrl && <img alt = "image" src = {article.thumbnailUrl}></img>
                            }
                        </div>

                    </div>
                    <div className = {style.actions}>
                        <span className = {style.icon_container}>
                        <Heart size={20} color="#696be7" fill="#696be7"  /> 10k
                        </span>
                        <span className = {style.icon_container}>
                        <MessageCircle color="#696be7" fill="#696be7" size={20} /> 77
                        </span>
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