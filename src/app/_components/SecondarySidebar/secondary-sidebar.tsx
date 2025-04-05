'use client'

import { useEffect, useState } from "react";
import style from "./secondary-sidebar.module.css";


export default function SecondarySidebar(){

    const [teste,setTeste] = useState(false);
    

    useEffect(()=>{
        console.log("sidebar loaded!");
        setTimeout(()=>{
            setTeste(true);
        },2000);
 

    },[]);

    if(!teste){
        return <LoadingSkeleton/>
    }

    return (
        <aside className = {style.aside}>
            <div className = {style.inner_aside}>
                <div className = {style.content}>
                    <div className = {style.inner_content}>
                        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quisquam consequatur debitis obcaecati possimus, itaque nostrum cumque, sed nulla ipsa, sunt labore beatae reprehenderit incidunt officiis ipsum! Praesentium quisquam perferendis, at nobis eum minus aliquam excepturi cum fuga, reiciendis veniam, officia adipisci quasi vitae labore assumenda tempore quidem ullam eaque laboriosam temporibus saepe? Minima iure at ex nobis officia itaque asperiores quo dolorum tempora doloremque ducimus, consequatur ea necessitatibus modi porro quia qui. Ad perspiciatis enim dolore quibusdam aspernatur excepturi velit dolores ratione itaque ipsa, ducimus autem iure consequuntur nobis. Est ducimus nemo amet, harum nobis dolor omnis. Voluptatum error quaerat tempore repudiandae sint quas maxime quae iure eum at nam rerum hic recusandae, unde accusantium molestias odit praesentium in a perferendis doloribus animi. Similique sapiente mollitia laudantium hic, delectus veniam possimus labore! Vel harum saepe voluptatum commodi aperiam perspiciatis quod quibusdam id exercitationem dolorem facere totam debitis officia ipsam quidem inventore, officiis doloremque assumenda dignissimos ullam fugiat molestiae itaque. Eius nesciunt commodi nulla adipisci, illum, harum consequatur iste assumenda non blanditiis cumque. Libero nostrum explicabo mollitia doloremque quos labore ducimus voluptates, quam, incidunt facilis sit nesciunt similique reiciendis veniam voluptatibus, sapiente corporis sed exercitationem vel. Velit aliquid repudiandae nulla voluptate?
                    </div>
                </div>
                
            </div>
        </aside>
    );

}

function LoadingSkeleton(){
    return (
        <div className = {style.inner_aside}>
            <div className = {style.content}>
                <div className = {style.skeleton}></div>
                <div className = {style.skeleton}></div>
                <div className = {style.skeleton}></div>
                <div className = {style.skeleton}></div>
                <div className = {style.skeleton}></div>
                <div className = {style.skeleton}></div>
                <div className = {style.skeleton}></div>
                <div className = {style.skeleton}></div>
                <div className = {style.skeleton}></div>
                <div className = {style.skeleton}></div>
                <div className = {style.skeleton}></div>
                <div className = {style.skeleton}></div>
            </div>
        </div>
    );
}