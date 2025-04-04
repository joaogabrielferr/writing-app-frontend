'use client'

import { useEffect, useState } from "react";

interface Props{
    userId:string;
}

interface Pokemon{
    [key:string] : string
}

export default function Profile({userId} : Props){

    console.log("this is a client component, it has ",userId," as it was passed as param by the server component");

    const [dados,setDados] = useState<Pokemon>({});

    useEffect(()=>{
        console.log("cliente component loaded for the first time");
        const load = async () =>{
            
            const dados: Pokemon = await new Promise(resolve =>{
                setTimeout(async ()=>{
                    console.log("buscando no servidor");
                    const _dados = await fetch("https://pokeapi.co/api/v2/pokemon/ditto");
                    const dados = await _dados.json() as Pokemon;
                    resolve(dados);
                },1000);
            });
            setDados(dados);
        }
        load();

    },[]);
    
    return (
        <div>
            <h3>Client component</h3>
            <h5>this comes from the server</h5>
            <p>{dados!.name}</p>
        </div>
    )

}