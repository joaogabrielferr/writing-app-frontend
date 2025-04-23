import Header from "../_components/header/header";
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
            <Header location={'other'}/>
            <h1>Server component: it already has {user} from the url</h1>
            <Profile userId = {user}></Profile>
        </div>
    );





}