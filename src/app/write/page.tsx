'use client'

import { useEffect, useRef, useState } from "react";
import { Editor } from '@tiptap/react'
import Header from "../_components/header/header";
import EditorWrapper from "../_components/editor/editor-wrapper";
import Modal from "../_components/modal/modal";
import { FullscreenLoader } from "../_components/fullscreen-loading/fullscreen-loading";
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { Pen } from "lucide-react";
import api from "@/lib/api";
import { useUser } from "@/context/auth-context";
import SplashScreenOverlay from "../_components/splash-screen/splash-screen";
import { ALL_IMAGES_ADDED_LOCAL_STORAGE_KEY, DRAFT_LOCAL_STORAGE_KEY } from "@/global-variables";

interface Preview{
  title:string,
  subtitle?:string;
  content:string;
  thumbnailUrl:string | null;
  thumbnailOptions:string[];
  authorUsername:string;
}

interface Draft{
  content:string;
  title:string;
  subtitle:string;
}

export default function WritePage(){

    const router = useRouter();

    const {isLoading: AuthIsLoading,isAuthenticated} = useUser();

    const editorRef = useRef<Editor | null>(null);
    const titleRef = useRef<HTMLInputElement | null>(null);
    const subtitleRef = useRef<HTMLInputElement | null>(null);
    const [imagesUploaded,setImagesUploaded] = useState<string[]>([]);

    const [loading,setLoading] = useState(false);
    const [isErrorModalOpen,setIsErrorModalOpen] = useState(false);
    const [errorMessage,setErrorMessage] = useState("");
    const [preview,setPreview] = useState<Preview>();

    const [isPreviewModalOpen,setIsPreviewModalOpen] = useState(false);

    if(!AuthIsLoading && !isAuthenticated && router){
        router.replace("/login");
    }

    useEffect(()=>{

      const data = localStorage.getItem(DRAFT_LOCAL_STORAGE_KEY);
      if(!data)return;

      const draft = JSON.parse(data) as Draft;

      if(!editorRef?.current || !titleRef?.current || !subtitleRef?.current)return;

      editorRef?.current?.commands.setContent(draft.content || "");
      titleRef.current.value = draft.title || "";
      subtitleRef.current.value = draft.subtitle || "";


    },[]);

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
      const title = titleRef.current?.value || '';
      const subtitle = subtitleRef.current?.value || '';

      const images: string[] = [];
      editorRef.current?.state.doc.descendants((node) => {
        if (node.type.name === 'image' && node.attrs.src) {
          images.push(node.attrs.src);
        }
      });

     localStorage.setItem(DRAFT_LOCAL_STORAGE_KEY,JSON.stringify({content,images,title,subtitle} as Draft));


     //images uploaded but removed later by user
     const data = localStorage.getItem(ALL_IMAGES_ADDED_LOCAL_STORAGE_KEY);
     if(data){
      const allImages = JSON.parse(data);
      console.log("all images:",allImages);
      const imagesToDelete = (allImages.items as string[]).filter(i => !images.some(imageInContent => i === imageInContent));
      console.log("images to delete:",imagesToDelete);
    }

      setImagesUploaded(images);
      
      if(!title){
        setIsErrorModalOpen(true);
        setErrorMessage("The title can't be empty!");
        return;
      }

      if(!content || content == "" || content == "<p></p>"){
        setIsErrorModalOpen(true);
        setErrorMessage("Write something before publishing!");
        return;
      }

      //replace "" with '' to send via json
      content = content?.replaceAll("(?<=\\s\\w+)=\\\"([^\\\"]*)\\\"", "='$1'");
      const article  = {
        title,
        subtitle,
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

    if(AuthIsLoading || !isAuthenticated){

      return <SplashScreenOverlay/>

    }

    return (
        <div>
            <Header location="editor" publish={publish}/>
            <EditorWrapper editorRef = {editorRef} titleRef={titleRef} subtitleRef={subtitleRef}/>
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
            size="xlarge"
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

      <div className={styles.container}>
      <div className={styles.column}>
        <p>The thumbnail is the image that appears alongside the title of your story in the homepage.</p>
        {imagesUploaded?.length ? <button onClick={()=>setIsOpen(true)} className = {styles.button}>Edit thumbnail<>&nbsp;</><Pen size={16}/></button> : null}
        {preview?.thumbnailUrl ? (
          <img
            src={preview!.thumbnailUrl}
            alt="Preview"
            width={250}
            height={150}
            className={styles.image}
          />
        ) : (
          <div className={styles.placeholder}>
            Include a high-quality image in your story to make it more inviting to readers.
          </div>
        )}
      </div>
      <div className={styles.column}>
        <p>Select a community to post the story on. Or keep it unselected if you want to post it as a standalone story.</p>
        <input type="text" className={styles.input} />
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
      
      <div className = {styles.imgSelectionGrid}>

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