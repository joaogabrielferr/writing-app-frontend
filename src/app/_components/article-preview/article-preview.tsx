import { JSX, useEffect, useRef, useState } from "react";
import style from './article-preview.module.css';
import { Article } from "@/models/article";
import Link from "next/link";
import { EllipsisVertical, Heart, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import Modal from "../modal/modal";
import api from "@/lib/api";

interface props{
    article: Article;
    isUser:boolean;
    deleteArticle?: (article:Article)=>void;
}

export default function ArticlePreview({article,isUser,deleteArticle} : props) : JSX.Element{

    const [dropdownOpen,setDropdownOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);


    const router = useRouter();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setDropdownOpen(false);
        }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const navigateToEdit = () =>{
        router.push(`/edit/${article.id}`);
    }


    return (
        <div className = {style.preview}>
            <div className={style.header}>
                <div className = {style.innerHeader} ref={menuRef}>
                    
                
                <div><Link href={`/${article.author.username}`}><span className = {style.name}>{article.author.name}</span> | <span className = {style.username}>@{article.author.username}</span></Link></div>
                    {
                        isUser && (
                        <button className = {style.buttonIcon} onClick={()=>setDropdownOpen(prev => !prev)}>
                            <EllipsisVertical />
                        </button>                            
                        )
                    }
                    {
                        (isUser && deleteArticle && dropdownOpen) && (
                        <div className={style.dropdown}>
                            <button onClick={navigateToEdit} className={style.dropdownItem}>Edit</button>
                            <button onClick={()=> deleteArticle(article)} className={`${style.dropdownItem} ${style.danger}`}>Remove</button>
                        </div>

                        )
                    }

                
                </div>
            </div>
                <Link href={`${article.author.username}/${article.slug}`} className = {style.link}>
                    <div className = {style.container}>
                        <div className = {style.info}>
                            <h2 className={style.title}>{article.title}</h2>
                            <div className={style.subtitle}> {article.subtitle ? article.subtitle : article.firstParagraph}</div>
                        </div>
                        {
                            article.thumbnailUrl ?
                            (
                            <div className={style.img}>
                                {
                                    article.thumbnailUrl && <img alt = "image" src = {article.thumbnailUrl}></img>
                                }
                            </div>
                            )
                            :null
                        }

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
           teste
        </div>
    );
    
}