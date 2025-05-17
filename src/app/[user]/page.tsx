'use client'

import { Article } from "@/models/article";
import Header from "../_components/header/header";
import Profile from "./profile";
import { useEffect, useState } from "react";
import SplashScreenOverlay from "../_components/splash-screen/splash-screen";
import { useUser } from "@/context/auth-context";
import api from "@/lib/api";

interface ProfileData{
    articles:Article[] | null;
    error:boolean;
}

export default function UserProfilePage(){
    
   const [profileFetchData, setProfileFetchData] = useState<ProfileData | null>(null);
    const [profileDataIsLoading, setProfileDataIsLoading] = useState(true);

    const { isAuthenticated, isLoading: authIsLoading } = useUser();



    useEffect(() => {
        if (!authIsLoading) {
            const loadProfileData = async () => {
                setProfileDataIsLoading(true);
                try {
                    const response = await api.get<{ content: Article[] }>(`/articles/user/gabriel`);

                    console.log("Profile data API response:", response);
                    if (response && response.data && response.data.content) {
                        setProfileFetchData({ articles: response.data.content,error:false});
                    } else {
                        // Handle cases where response might be ok but data is not in expected format
                        console.warn("Profile data response was not in the expected format:", response);
                        setProfileFetchData({ articles: null,error:false});
                    }
                } catch (error: unknown) {
                    console.error("Failed to fetch profile data:", error);
                    setProfileFetchData({articles:null,error:true});
                } finally {
                    setProfileDataIsLoading(false);
                }
            };
            loadProfileData();
        }
    }, [authIsLoading, isAuthenticated]); 

    
    if (authIsLoading || profileDataIsLoading) {
        return <SplashScreenOverlay />;
    }
    return (
        <div>
            <Header location={'other'}/>
            <h1>profile</h1>
            <Profile data = {profileFetchData}/>
        </div>
    );





}