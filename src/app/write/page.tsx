'use client'

import { useRef, useState } from "react";
import { Editor } from '@tiptap/react'
import Header from "../_components/header/header";
import EditorWrapper from "../_components/editor/editor-wrapper";
import api from '../../utils/axios';
import Modal from "../_components/modal/modal";
import { FullscreenLoader } from "../_components/fullscreen-loading/fullscreen-loading";
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import Button from "../_components/button/button";
import { Pen } from "lucide-react";

interface Preview{
  title:string,
  subtitle?:string;
  content:string;
  thumbnailUrl:string | null;
  thumbnailOptions:string[];
  authorUsername:string;
}

export default function WritePage(){

    const router = useRouter();

    const editorRef = useRef<Editor | null>(null);
    const titleRef = useRef<HTMLInputElement | null>(null);
    const [imagesUploaded,setImagesUploaded] = useState<string[]>([]);

    const [loading,setLoading] = useState(false);
    const [isErrorModalOpen,setIsErrorModalOpen] = useState(false);
    const [errorMessage,setErrorMessage] = useState("");
    const [preview,setPreview] = useState<Preview>();

    const [isPreviewModalOpen,setIsPreviewModalOpen] = useState(false);

    function handleAction(){
      console.log("aqui");
      setIsPreviewModalOpen(false);
      setLoading(true);

      api.post("/articles",preview,{}).then(
        (response)=>{
          console.log(response);
          setIsErrorModalOpen(false);
          //TODO: also clear draft
          //TODO: retrieve user username and use it to navigate
          setTimeout(()=>{
            router.push("/gabriel");
          },500);
        }
      ).catch(()=>{
        setErrorMessage("There was a problem saving your article, please try again later. Don't worry, the draft is saved and you can access it later.");
        setIsErrorModalOpen(true);
      }).finally(()=>{
        setLoading(false);
      });

    };

    function publish(){
      let content = editorRef.current?.getHTML();
      const title = titleRef.current?.value;

      const images: string[] = [];
      editorRef.current?.state.doc.descendants((node) => {
      if (node.type.name === 'image' && node.attrs.src) {
        images.push(node.attrs.src);
      }
    });


      setImagesUploaded(images);
      
      if(!title){
        setIsErrorModalOpen(true);
        setErrorMessage("The title can't be empty!");
        return;
      }
      
      //replace "" with '' to send via json
      content = content?.replaceAll("(?<=\\s\\w+)=\\\"([^\\\"]*)\\\"", "='$1'");
      const article  = {
        title,
        content,
        thumbnailUrl: images?.[0] || null,
        authorUsername:"gabriel"
      } as Preview;

      setPreview(article);

      setIsPreviewModalOpen(true);
    
    }


    function changeImage(index: number){
      setPreview({...preview!,thumbnailUrl:imagesUploaded[index]});
      setImagesUploaded([imagesUploaded[index],...imagesUploaded.filter((_,i) => i != index)]);
    }

    return (
        <div>
            <Header location="editor" publish={publish}/>
            <EditorWrapper editorRef = {editorRef} titleRef={titleRef}/>
          {loading && <FullscreenLoader text="Publishing your article..." />}
          <Modal
            isOpen={isErrorModalOpen}
            onClose={() => setIsErrorModalOpen(false)}
            title="Error"
            size="medium"
            actionText="Close"
            loading={loading}
            showCancelButton={false}
            onAction={()=>setIsErrorModalOpen(false)}
          >
            {errorMessage}
          </Modal>
          <Modal
            isOpen={isPreviewModalOpen}
            onClose={()=>setIsPreviewModalOpen(false)}
            title="You're about to publish your story!"
            size="large"
            actionText="Publish"
            loading={loading}
            showCancelButton={true}
            onAction={handleAction}
          >
            <br/>
            <MyPreview preview = {preview!} imagesUploaded={imagesUploaded} changeImage={changeImage}/>
            
          </Modal>
          
        </div>
    );

}

function MyPreview({preview,imagesUploaded,changeImage} : {preview:Preview, imagesUploaded:string[],changeImage:(index:number)=>void}){

  const [isOpen,setIsOpen] = useState(false);
  const [selected,setSelected] = useState(0);
  
  function onChangeImage(){
    setIsOpen(false);
    changeImage(selected);
    setSelected(0);
  }

  return (
    <div>
      <div>
        <p className = {styles.description}>
          The thumbnail is the image readers will see along side the title in the story preview.
          <br/>
          { imagesUploaded.length ? <Button text="edit" bgColor="transparent" fontColor="purple" Icon={Pen} click={()=>setIsOpen(true)}></Button> : null}
        </p>
        <div className = {styles.img}>
          {preview.thumbnailUrl ?
            <div className = {styles.imgContainer}>
              <img alt = "image" src = {preview.thumbnailUrl!}></img>
              </div>
          : <div className = {styles.imgPlaceholder}>
            Include a high-quality image in your story to make it more inviting to readers.
          </div>
        }
      
        </div>
        <div>
          select community here
        </div>
      </div>
    <Modal
        isOpen={isOpen}
        onClose={()=>setIsOpen(false)}
        title="Preview"
        size="medium"
        actionText="Confirm"
        showCancelButton={true}
        onAction={onChangeImage}
        loading={false}
    >
      
      <div className = {styles.grid}>

      {
        imagesUploaded.map((image,index) =>{
          return(  
            <div className = {styles.imgOption} key={image + index} onClick={()=>setSelected(index)} style = {{border: selected == index ? '3px solid var(--purple)' :'none'}}>
              <div className = {styles.imgContainer}>
                <img alt = "image" src = {image}></img>
              </div>
            </div>
          ); 
        })
      }
      </div>

    </Modal>
    </div>


  );

}