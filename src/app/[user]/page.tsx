import { Suspense } from "react";
import Profile from "./profile";

type Params = {
    user: string; // This is the dynamic parameter from the route ([user])
  };

export default async function UserProfilePage({params} : {params: Params}){

    const { user } = await params;
    console.log(user);

    await new Promise((resolve)=>{
        setTimeout(()=>{
            console.log("timeout finished, now returning from server component");
            console.log(user);
            resolve({});
        },1000);
    });

    
    return (
        <div>
            <h1>Server component: it already has {user} from the url</h1>
            <Suspense fallback={<div><h2>Inside the fallback, in the server component...</h2></div>}>
                <Profile userId = {user}></Profile>
            </Suspense>


        </div>
    );





}