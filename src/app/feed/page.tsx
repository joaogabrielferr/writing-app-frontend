
'use client';

import { useUser } from "@/context/auth-context";
import ArticlesList from "../_components/articles-list/articles-list";
import SecondarySidebar from "../_components/SecondarySidebar/secondary-sidebar";
import styles from "./feed.module.css"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FullscreenLoader } from "../_components/fullscreen-loading/fullscreen-loading";
import { Article } from "@/models/article";
import SplashScreenOverlay from "../_components/splash-screen/splash-screen";
import api from "@/lib/api";
import Shell from "../_components/shell/shell";
export default function Feed() {

    const [articles,setArticles] = useState<Article[]>([]);
    const {isAuthenticated,isLoading} = useUser();
    const router = useRouter();
    const [isLoadingArticles,setIsLoadingArticles] = useState(false);
    const [error,setError] = useState(false);

    useEffect(()=>{

        if(!isLoading && !isAuthenticated){
          router.replace("/login");
          return;
        }

        const loadArticles = async () =>{
          
              setIsLoadingArticles(true);
              try{
                const response = await api.get<{content:Article[]}>("/articles");
                setError(false);
                setArticles(response?.data?.content || []);
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              }catch(err){
                setError(true);
                setArticles([]);
              }finally{
                setIsLoadingArticles(false);
              }
              
          
        }

        if(!isLoading && isAuthenticated){
          loadArticles();
        }



    },[isAuthenticated,isLoading,router]);


  if(isLoading){
    return <SplashScreenOverlay/>
  }

  if(isAuthenticated){
      return (
        <>
            <Shell location="main">
                  <div className={styles.banner}>
                    <img src="/banner.jpg"></img>
                  </div>
                  <section className = {styles.mainPageSection}>
                      <ArticlesList articles={articles} loadingArticles={isLoadingArticles} error={error}></ArticlesList>
                      <SecondarySidebar/>
                  </section>
    
            </Shell>
          </>

      );
  }

  return <FullscreenLoader/>

}
