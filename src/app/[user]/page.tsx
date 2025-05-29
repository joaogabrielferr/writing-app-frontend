'use client'

import { Article } from "@/models/article";
import { useEffect, useState } from "react";
import SplashScreenOverlay from "../_components/splash-screen/splash-screen";
import { useUser } from "@/context/auth-context";
import api from "@/lib/api";
import styles from './user.module.css';
import axios from "axios";
import { useParams } from 'next/navigation';
import ArticlePreview from "../_components/article-preview/article-preview";
import ProfileSidebar from "../_components/profile-sidebar/profile-sidebar";
import Shell from "../_components/shell/shell";
import Modal from "../_components/modal/modal";


export default function UserProfilePage(){
    
    const params = useParams();
    const username = params?.user;

    const [articles, setArticles] = useState<Article[]>([]);
    const [profileDataIsLoading, setProfileDataIsLoading] = useState(true);
    const [error,setError] = useState(false);

    const { isAuthenticated, isLoading: authIsLoading,user } = useUser();

    const [currentArticle,setCurrentArticle] = useState<Article>();

    const [isModalOpen,setIsModalOpen] = useState(false);
    const [isModalErrorOpen,setModalErrorOpen] = useState(false);

    useEffect(() => {
        if (!authIsLoading && params?.user) {
            const loadProfileData = async () => {
                setProfileDataIsLoading(true);
                try {
                    const response = await api.get<{ content: Article[] }>(`/articles/user/${params.user}`);

                    console.log("Profile data API response:", response);
                    if (response && response.data && response.data.content) {
                        setArticles(response.data.content);
                        setError(false);
                    }
                } catch (error) {
                    if(axios.isAxiosError(error) && error.response?.status === 404){
                        setArticles([]);
                        setError(false);
                    }else{
                        setArticles([]);
                        setError(true);
                    }
                } finally {
                    setProfileDataIsLoading(false);
                    console.log("finalizou");
                }

            };
            loadProfileData();
        }
    }, [params,authIsLoading, isAuthenticated]);


    

    const deleteArticle = async (article:Article) =>{
        setCurrentArticle(article);
        setIsModalOpen(true);
    }
    
    const onDeleteArticle = async () =>{
        if(!currentArticle){
            setIsModalOpen(false);
            setModalErrorOpen(true);
            return;
        }
        setIsModalOpen(false);
        setArticles(prev => prev.filter(a => a.id !== currentArticle.id));
        try{
            await api.delete(`/articles/${currentArticle.id}`);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        }catch(err){
            // setModalErrorOpen(true);
        }
        
    }

    
    if (authIsLoading) {
        return <SplashScreenOverlay />;
    }


    const loadingSkeleton = () =>{
        return (
            <div>
                {
                    [1,2,3,4,5,6,7,8,9,10].map(i => <div className = {styles.skeleton} key = {i}></div>)
                }            
            </div>
        );
    }

    return (
        <Shell location="other">
            <div className = {styles.mainPageSection}>
                <div className = {styles.left}>
                    <h1>{username ? "/" + username : null}</h1>
                    <div className={styles.list}>
                        {
                            profileDataIsLoading 
                            ?
                            loadingSkeleton()    
                            : 
                            (
                                error ? <div>We couldn&apos;t load the articles. Please try again later.</div> 
                                : (
                                    articles?.length ?
                                    articles?.map(a=>{
                                        return <ArticlePreview isUser = {username === user?.username} article={a} key={a.id} deleteArticle={deleteArticle}></ArticlePreview>
                                    })

                                    : <div>
                                        You still haven&apos;t write anything.
                                    </div>

                                )
                            )
                        }
                    </div>
                </div>
                <ProfileSidebar/>
                <Modal
                    isOpen={isModalOpen}
                    onClose={()=>setIsModalOpen(false)}
                    title="Confirm your action"
                    size="medium"
                    actionText="Delete"
                    showCancelButton={true}
                    onAction={onDeleteArticle}
                    loading={false}
                >
                    Are you sure you want to delete the story {currentArticle?.title ? '"' + currentArticle.title + '"' : '' }?
                </Modal>
                <Modal
                    isOpen={isModalErrorOpen}
                    onClose={()=>setModalErrorOpen(false)}
                    title="Whoops"
                    size="small"
                    actionText="Close"
                    showCancelButton={false}
                    onAction={()=>setModalErrorOpen(false)}
                    loading={false}
                >
                    We couldn&apos;t delete this article. Please try again later.
                </Modal>
            </div>
        </Shell>

    );





}