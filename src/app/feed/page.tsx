
'use client';

import { useUser } from "@/context/auth-context";
import ArticlesList from "../_components/articles-list/articles-list";
import Header from "../_components/header/header";
import SecondarySidebar from "../_components/SecondarySidebar/secondary-sidebar";
import Sidebar from "../_components/sidebar/sidebar";
import styles from "./feed.module.css"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FullscreenLoader } from "../_components/fullscreen-loading/fullscreen-loading";
import { Article } from "@/models/article";
import SplashScreenOverlay from "../_components/splash-screen/splash-screen";
import api from "@/lib/api";
export default function Feed() {

    const [articles,setArticles] = useState<Article[]>([]);
    const {isAuthenticated,isLoading} = useUser();
    const router = useRouter();

    useEffect(()=>{

        if(!isLoading && !isAuthenticated){
          router.replace("/login");
          return;
        }

        if(!isLoading && isAuthenticated){
          api.get<{content:Article[]}>("/articles").then((response)=>{
              setArticles(response.data.content);
          }).catch(()=>{
              setArticles([]);
          });


        }

    },[isAuthenticated,isLoading,router]);

  if(isLoading){
    return <SplashScreenOverlay/>
  }

  if(isAuthenticated){
      return (
        <>
        <Header location="main"/>
          <div className = {styles.mainPageHome}>
            <Sidebar></Sidebar>
            <div className = {styles.mainPageMainContainer}>
                <main className = {styles.mainPageMain}>
                  {/* <div id = "__banner__">
                    content
                  </div> */}
    
                  {/* <div id = "__tags__">
                    <button>Self improvement</button>
                    <button>Relationships</button>
                    <button>Technology</button>
                    <button>Gaming</button>
                    <button>Politics</button>
                    <button>Marketing</button>
                    <button>Travel</button>
                  </div> */}
                  <section className = {styles.mainPageSection}>
                    <article>
                      <ArticlesList articles={articles}></ArticlesList>
                    </article>
                    <SecondarySidebar></SecondarySidebar>
                  </section>
    
                </main>
            </div>
          </div>
        </>
      );
  }

  return <FullscreenLoader noText = {true}/>

}
