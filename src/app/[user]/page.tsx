'use client'

import { Article } from "@/models/article";
import Header from "../_components/header/header";
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


export default function UserProfilePage(){
    
    const params = useParams();
    const username = params?.user;

    const [articles, setArticles] = useState<Article[]>([]);
    const [profileDataIsLoading, setProfileDataIsLoading] = useState(true);
    const [error,setError] = useState(false);

    const { isAuthenticated, isLoading: authIsLoading,user } = useUser();


    const loadUserInfo = () =>{



    }


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

    
    if (authIsLoading) {
        return <SplashScreenOverlay />;
    }


    const loadingSkeleton = () =>{
        console.log("aqui!!!!!!!");
        return (
            <div>
                {
                    [1,2,3,4,5,6,7,8,9,10].map(i => <div className = {styles.skeleton} key = {i}></div>)
                }            
            </div>
        );
    }

    return (
        <Shell>
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
                                : articles?.map(a=>{
                                    return <ArticlePreview article={a} key={a.id}></ArticlePreview>
                                })
                            )
                        }
                    </div>
                </div>
                <div className = {styles.right}>
                    <ProfileSidebar/>
                </div>
            </div>
        </Shell>

    );





}