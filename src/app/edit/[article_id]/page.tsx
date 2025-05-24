'use client'

import { useEffect, useState } from "react";
import { useEditor } from '@tiptap/react'
import { useParams, useRouter } from 'next/navigation';
import styles from './page.module.css';
import { Pen } from "lucide-react";
import api from "@/lib/api";
import { useUser } from "@/context/auth-context";
import { ALL_IMAGES_ADDED_LOCAL_STORAGE_KEY, DRAFT_LOCAL_STORAGE_KEY } from "@/global-variables";
import { Article } from "@/models/article";
import SplashScreenOverlay from "@/app/_components/splash-screen/splash-screen";
import Header from "@/app/_components/header/header";
import EditorWrapper from "@/app/_components/editor/editor-wrapper";
import { FullscreenLoader } from "@/app/_components/fullscreen-loading/fullscreen-loading";
import Modal from "@/app/_components/modal/modal";
import StarterKit from "@tiptap/starter-kit";
import Dropcursor from "@tiptap/extension-dropcursor";
import { LastParagraphMarker } from "@/app/_components/editor/extension";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";

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


export default function EditPage(){

    const router = useRouter();
    const params = useParams();
    const article_id = params?.article_id;

    const {isLoading: AuthIsLoading,isAuthenticated,user} = useUser();

    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');

    const [imagesUploaded,setImagesUploaded] = useState<string[]>([]);

    const [saving,setSaving] = useState(false);
    const [isErrorModalOpen,setIsErrorModalOpen] = useState(false);
    const [errorMessage,setErrorMessage] = useState("");
    const [preview,setPreview] = useState<Preview>();

    const [isPreviewModalOpen,setIsPreviewModalOpen] = useState(false);

    const [loaded,setLoaded] = useState(false);

    const [definedUser,setDefinedUser] = useState(false);

    const editor = useEditor({
        extensions: [
          StarterKit,Image,Underline,Dropcursor,
          LastParagraphMarker,
          Placeholder.configure({
            placeholder: 'Write something ...',
          }),
        ],
        onCreate({ editor }) {
          editor.commands.focus('start')
        },
        immediatelyRender:false,
      });



    if(!AuthIsLoading && !isAuthenticated && router){
        router.replace("/login");
    }


    useEffect(()=>{
    
      const loadArticle = async () =>{
            console.log("USER:",user);
            try{
                const response = await api.get(`/articles/${article_id}`);
                const article = response.data as Article;
                console.log(article.author.username,user?.username);
                if(article.author.username !== user?.username){
                    console.log("aqui ?");
                    router.replace("/");
                }else{
                    setDefinedUser(true);
                }
                console.log("aqui!!!!!!!");
                editor?.commands.setContent(article.content || "");
                setTitle(article.title || "");
                setSubtitle(article.subtitle || "");

            }catch(err:unknown){
                console.log(err);
        
            }finally{
                setLoaded(true);
            }
      }

    console.log(AuthIsLoading || !isAuthenticated || !article_id);
    
    console.log({
        AuthIsLoading,
        isAuthenticated,
        user,
        article_id,
        editor
    });

    if(!loaded  && !AuthIsLoading && isAuthenticated && user && article_id && editor){
        loadArticle();
    }

      


    //   const data = localStorage.getItem(DRAFT_LOCAL_STORAGE_KEY);
    //   if(!data)return;

    //   if(!editorRef?.current || !titleRef?.current || !subtitleRef?.current)return;

    //   editorRef?.current?.commands.setContent(draft.content || "");
    //   titleRef.current.value = draft.title || "";
    //   subtitleRef.current.value = draft.subtitle || "";


    },[AuthIsLoading,isAuthenticated,article_id,loaded,user,router,editor]);

    function handleAction(){
      console.log("aqui");
      setIsPreviewModalOpen(false);
      setSaving(true);

      api.put(`/articles/${article_id}`,preview,{}).then(
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
        setSaving(false);
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

      setPreview(article);

      setIsPreviewModalOpen(true);
    
    }


    function changeImage(index: number){
      setPreview({...preview!,thumbnailUrl:imagesUploaded[index]});
      setImagesUploaded([imagesUploaded[index],...imagesUploaded.filter((_,i) => i != index)]);
    }

    if(AuthIsLoading || !isAuthenticated || !definedUser || !editor){

      return  <SplashScreenOverlay/>;

      
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
          {saving && <FullscreenLoader text="Publishing your article..." />}
          <Modal
            isOpen={isErrorModalOpen}
            onClose={() => setIsErrorModalOpen(false)}
            title="Error"
            size="medium"
            actionText="Close"
            loading={saving}
            showCancelButton={false}
            onAction={()=>setIsErrorModalOpen(false)}
          >
            {errorMessage}
          </Modal>
          <Modal
            isOpen={isPreviewModalOpen}
            onClose={()=>setIsPreviewModalOpen(false)}
            title="You're about edit your story"
            size="xlarge"
            actionText="Edit"
            loading={saving}
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