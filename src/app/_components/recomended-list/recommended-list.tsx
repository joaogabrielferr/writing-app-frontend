'use client'

import { Article } from "@/models/article";
import { useEffect, useState } from "react";

export default function RecommendendList(){

    const lsKey:string = "rl";

    const [recommmended,setRecommended] = useState<Article[]>([]);
    const [loading,setLoading] = useState(true);

    useEffect(()=>{
        const _list = localStorage.getItem(lsKey);
        if(_list){
         //search on API   
        }else{
            const items = JSON.parse(_list!) as Article[];
            setRecommended(items);
            setLoading(false);
        }
    },[]);

    return (

        <>
            {
            loading ? <div>loading...</div>:
            <div>
                {
                    recommmended?.map(i =>{
                        return (
                            <div key={i.id}>{i.title}</div>
                        );
                    })
                }

            </div>
            }
        </>

    );

}