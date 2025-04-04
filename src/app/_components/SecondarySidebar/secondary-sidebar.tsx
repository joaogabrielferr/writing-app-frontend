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
        return (
            <div className = {style.inner_aside}>
                <div>
                    <div className={style.lines}>
                        <div className={`${style.thumb} ${style.pulse}`}></div>
                        <div className={`${style.line} ${style.pulse}`}></div>
                        <div className={`${style.line} ${style.pulse}`}></div>
                        <div className={`${style.line} ${style.pulse}`}></div>
                        <div className={`${style.line} ${style.pulse}`}></div>
                    </div>
                    <div className={style.lines}>
                        <div className={`${style.thumb} ${style.pulse}`}></div>
                        <div className={`${style.line} ${style.pulse}`}></div>
                        <div className={`${style.line} ${style.pulse}`}></div>
                        <div className={`${style.line} ${style.pulse}`}></div>
                        <div className={`${style.line} ${style.pulse}`}></div>
                    </div>
                    <div className={style.lines}>
                        <div className={`${style.thumb} ${style.pulse}`}></div>
                        <div className={`${style.line} ${style.pulse}`}></div>
                        <div className={`${style.line} ${style.pulse}`}></div>
                        <div className={`${style.line} ${style.pulse}`}></div>
                        <div className={`${style.line} ${style.pulse}`}></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        
        <div className = {style.inner_aside}>
            <div>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Incidunt fuga perspiciatis labore odit rerum quaerat obcaecati inventore nostrum. Qui est, temporibus ducimus error vitae quos sapiente eligendi voluptates quisquam in voluptas excepturi eaque quis, sequi, dolores libero cum iste blanditiis impedit iusto corporis quam nobis. Quasi quae, laborum voluptatibus, autem beatae perferendis consequuntur nisi, ullam rerum quas perspiciatis facilis architecto? Quia hic repellat eos animi eveniet quisquam corporis commodi, sed illum, dicta laborum. Eveniet dolores itaque perspiciatis suscipit quae aliquam quo! Officia architecto beatae, non aut itaque tenetur veniam id unde, tempora incidunt, voluptatum maxime aliquam natus placeat ipsam velit adipisci? Exercitationem dicta excepturi officia voluptatibus soluta, quos culpa et quod. Ex suscipit veritatis eveniet doloribus, quis explicabo consequatur est fugit corporis tenetur in voluptatum, ipsa fugiat saepe nesciunt beatae, nam magni pariatur accusantium repellat ipsum tempore vel voluptates consequuntur. Eum quibusdam sint perferendis vel odio ullam itaque placeat aperiam excepturi modi libero esse quam totam, non quisquam impedit! Necessitatibus error minus similique exercitationem placeat laudantium, commodi dolor, ad voluptas culpa perferendis, quasi aperiam voluptates libero laboriosam sunt aliquam dolorum iusto? Explicabo velit facere voluptatem. Labore sint, accusantium nostrum itaque voluptates culpa blanditiis modi reiciendis quo rem nemo sapiente consectetur soluta rerum officiis in fuga expedita. Consectetur voluptate veritatis accusantium explicabo tempora nemo quod at esse quas quidem, recusandae a placeat! Veniam dolorum nemo quaerat harum earum molestiae repellat. Neque libero error temporibus! Autem ut tempore, minus deserunt laborum ducimus perferendis fugit architecto fugiat necessitatibus, corporis quo aliquid at impedit facere nostrum voluptates laudantium in veritatis officia quia! Aut ullam vitae provident, architecto iusto consectetur debitis dolore maxime neque repudiandae molestias porro commodi recusandae unde quo eligendi temporibus. A quibusdam eaque iusto corrupti enim nam officiis voluptatem aut neque, repudiandae exercitationem commodi. Odio, corrupti accusantium hic doloremque temporibus earum eaque officia? Recusandae illo minus magnam aperiam voluptatibus obcaecati animi modi, ducimus tempore labore consequuntur velit impedit fugiat sequi atque fuga officia esse maiores delectus blanditiis dolor, assumenda reiciendis amet? Culpa eaque, quos repellendus consequatur libero dolor eum neque quisquam voluptatum ratione laudantium officiis iste molestias illo delectus. Consequuntur quisquam asperiores quae. Vitae mollitia eligendi, minima unde autem est eum. Architecto aperiam officiis laudantium amet facilis voluptatem minima tenetur at? Accusantium ratione aperiam quae molestias laudantium pariatur porro architecto deserunt culpa, repellat impedit id, a voluptates rem, harum delectus! Obcaecati atque id itaque dolorum accusantium minima facere officia quibusdam veniam unde earum optio, totam eligendi! Rem tempora possimus vitae dolorum dolorem incidunt, mollitia dolore quibusdam, deserunt facilis quo quasi excepturi beatae veritatis labore distinctio culpa cum ex error expedita illo. Commodi voluptates corrupti sint explicabo esse magnam illum cumque reiciendis, a tenetur? Nam tempora dolor laudantium pariatur rerum quam vel quod ullam vitae labore, modi dolore possimus ipsam nulla odio minima nemo ipsum adipisci, nesciunt voluptates sequi omnis optio eum voluptatum. Voluptas laborum ipsa harum voluptates autem, enim, facilis eos, doloribus aperiam sunt quas. Quo unde suscipit, iste repellat enim, voluptas nemo voluptatibus cumque ullam sapiente impedit nihil ratione molestias tempora quam libero! Iusto facilis aut minus asperiores nobis animi ducimus? Minima numquam quidem, reprehenderit minus accusamus repellendus soluta nisi quod incidunt blanditiis perspiciatis sequi aliquam doloremque assumenda voluptas voluptatum eaque reiciendis, suscipit dicta tempore, nihil quo. Magnam, qui officiis a laborum nobis, consectetur, recusandae culpa animi saepe quia at! Eaque, minima animi exercitationem voluptatibus veniam distinctio nemo impedit reiciendis reprehenderit assumenda. Ad illum fugit amet, inventore qui aperiam deserunt eaque voluptate eum enim, cum velit facilis necessitatibus quae reiciendis corporis fuga dicta et ab? Veritatis, voluptatum temporibus. Deserunt impedit numquam officia voluptates autem tempore nemo laboriosam, magnam, consequuntur accusamus blanditiis sequi ipsa dolor recusandae iusto commodi deleniti. Quis sequi excepturi, magnam voluptatum quod nihil mollitia dolorum, nulla corporis nisi inventore, quos laboriosam dicta atque aspernatur nemo! Quibusdam vitae excepturi laboriosam quod ea tempora adipisci vel, nisi ab quis ratione, temporibus saepe! Amet asperiores non corporis id praesentium? Optio, earum! Expedita alias modi omnis quae harum numquam tempora sed, iusto officia praesentium illum accusamus porro minima aliquid rerum, enim dicta. Voluptate adipisci tempora obcaecati quis quisquam laborum quod delectus cumque suscipit molestias deleniti, fugit earum, eligendi ab nam ducimus necessitatibus libero laboriosam et ipsa, numquam laudantium. Ratione commodi veniam omnis velit earum, maxime cupiditate labore? Porro rerum nihil nesciunt natus magnam, enim ex est doloribus maiores! Ab est aspernatur cumque temporibus consequatur accusantium cum ea iste animi error nesciunt doloremque iure dolores in corporis, cupiditate distinctio veritatis ipsum dicta placeat sed nihil assumenda. Magni cupiditate temporibus non reprehenderit architecto alias atque dolores quos iusto deleniti consequatur quasi, enim ab aliquid dolor, nam maxime delectus error rem odio, expedita harum dicta. Labore officia sequi velit tenetur ut!
            </div>
            <p style = {{'minHeight':'150px'}}>
                content
            </p>
        </div>
    );

}