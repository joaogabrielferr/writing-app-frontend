'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Editor, useEditor } from '@tiptap/react'
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

    // Refs to hold the latest title and subtitle for the debounced save function.
    const latestTitleRef = useRef(title);
    const latestSubtitleRef = useRef(subtitle);


    useEffect(() => {
        latestTitleRef.current = title;
    }, [title]);

    useEffect(() => {
        latestSubtitleRef.current = subtitle;
    }, [subtitle]);

    const editor = useEditor({
        extensions: [
          StarterKit,Image,Underline,Dropcursor,
          LastParagraphMarker,
          Placeholder.configure({
            placeholder: 'Write something ...',
          }),
        ],
        immediatelyRender:false,
        onUpdate: () => {
            debouncedSaveRef.current?.(); // Call the debounced save function
        }
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


    function handleAction(){
      console.log("aqui");
      setIsPreviewModalOpen(false);
      setLoading(true);

      api.post("/articles",preview,{}).then(
        (response)=>{
          console.log(response);
          setIsErrorModalOpen(false);
          
          localStorage.removeItem(DRAFT_LOCAL_STORAGE_KEY);
          localStorage.removeItem(ALL_IMAGES_ADDED_LOCAL_STORAGE_KEY);

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


     //images uploaded but removed later by user (TODO: maybe remove it from bucket)
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

      const performSaveToLocalStorage = useCallback((currentEditor: Editor | null) => {
      if (!currentEditor || !currentEditor.state || !currentEditor.state.doc) {
          console.log("Debounced save: Editor not ready or state missing at time of save execution.");
          return;
      }

      const currentTitle = latestTitleRef.current;
      const currentSubtitle = latestSubtitleRef.current;

      console.log("Debounced save: PERFORMING SAVE with title:", currentTitle, "subtitle:", currentSubtitle);
      const content = currentEditor.getHTML();
      const images: string[] = [];
      currentEditor.state.doc.descendants((node) => {
          if (node.type.name === 'image' && node.attrs.src) {
              images.push(node.attrs.src as string);
          }
      });

      localStorage.setItem(DRAFT_LOCAL_STORAGE_KEY, JSON.stringify({
          content,
          images,
          title: currentTitle,
          subtitle: currentSubtitle
      }));
  }, []); 

  const debouncedSave = useMemo(() => {
        // Pass the current `editor` instance to `performSaveToLocalStorage` when called.
        // This ensures the save function operates on the correct editor instance
        // that was active when the debounce was initiated or re-triggered.
        const callback = () => {
             if (editor) { // Check if editor is initialized
                performSaveToLocalStorage(editor);
             }
        }
        return debounce(callback, 3000); 
    }, [editor, performSaveToLocalStorage]); 

    // Store the debounced function in a ref so onUpdate can call the latest version
    // without causing onUpdate to be re-created frequently if debouncedSave identity changes.
    const debouncedSaveRef = useRef(debouncedSave);
    useEffect(() => {
        debouncedSaveRef.current = debouncedSave;
    }, [debouncedSave]);

    // Effect to trigger debounced save also when title or subtitle change (from input fields)
    useEffect(() => {
        console.log("Title or Subtitle changed, triggering debounced save.");
        debouncedSaveRef.current?.(); // Call the debounced save function

    }, [title, subtitle]);

    // General cleanup for the main debounced function when EditPage unmounts
    // or if the editor instance itself were to change fundamentally.
    useEffect(() => {
        return () => {
            console.log("EditPage unmounting or editor changing: Cancelling main debounced save.");
            debouncedSaveRef.current?.cancel();
        };
    }, []); // Run only on mount and unmount for this cleanup. Relies on debouncedSaveRef.current


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