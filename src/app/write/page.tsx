'use client'

import { useEffect, useState } from "react";
import { useEditor } from '@tiptap/react'
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
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import Dropcursor from "@tiptap/extension-dropcursor";
import { LastParagraphMarker } from "../_components/editor/extension";
import Placeholder from "@tiptap/extension-placeholder";
import { debounce } from "lodash";

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

    const {isLoading: AuthIsLoading,isAuthenticated,user} = useUser();

    const [imagesUploaded,setImagesUploaded] = useState<string[]>([]);

    const [loading,setLoading] = useState(false);
    const [isErrorModalOpen,setIsErrorModalOpen] = useState(false);
    const [errorMessage,setErrorMessage] = useState("");
    const [preview,setPreview] = useState<Preview>();

    const [isPreviewModalOpen,setIsPreviewModalOpen] = useState(false);

    const [draftInitialized,setDraftInitialized] = useState(false);

    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');

    const editor = useEditor({
        extensions: [
          StarterKit,Image,Underline,Dropcursor,
          LastParagraphMarker,
          Placeholder.configure({
            placeholder: 'Write something ...',
          }),
        ],
        immediatelyRender:false,
      });

    if(!AuthIsLoading && !isAuthenticated && router){
        router.replace("/login");
    }

    useEffect(()=>{
      const data = localStorage.getItem(DRAFT_LOCAL_STORAGE_KEY);
      if(!data)return;

      const draft = JSON.parse(data) as Draft;


      if(!editor || draftInitialized)return;

      editor.commands.setContent(draft.content || "");
      setTitle(draft.title || "");
      setSubtitle(draft.subtitle || "");

      setDraftInitialized(true);

    },[editor,draftInitialized]);

      useEffect(()=>{

        const saveData = () =>{
          if (!editor) return;
      
          const content = editor?.getHTML();
          const images:string[] = [];
          editor.state.doc.descendants((node) => {
            if (node.type.name === 'image' && node.attrs.src) {
              images.push(node.attrs.src);
            }
          });
      
  
          localStorage.setItem(DRAFT_LOCAL_STORAGE_KEY,JSON.stringify({content,images,title,subtitle}));          

        }

        const debouncedSave = debounce(saveData,5000);

        if(editor){
          debouncedSave();
        }

        return () =>{
          debouncedSave.cancel();
        }

          
      },[editor,title,subtitle]);


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
            router.push(`/${user!.username}`);
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
      if (!editor) {
        console.error("Publish: Editor not available!");
        setErrorMessage("Editor is not ready. Please wait and try again.");
        setIsErrorModalOpen(true);
        return;
    }
      let content = editor.getHTML();

      const images: string[] = [];
      editor.state.doc.descendants((node) => {
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
        authorUsername:user?.username
      } as Preview;
      console.log(article);
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
            <EditorWrapper 
                editor={editor}
                onTitleChange={setTitle}
                onSubtitleChange={setSubtitle}
                title={title}
                subtitle={subtitle}
            />
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
          // eslint-disable-next-line @next/next/no-img-element
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