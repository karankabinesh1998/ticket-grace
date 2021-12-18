import React, { useRef } from 'react'

export default function SelectImage({profileImageUrl,handleImageFile}) {
    const inputFile = useRef(null); 
   
    const onButtonClick = () => {
       inputFile.current.click();
      };
      const chooseImage = async(e)=>{
        console.log(e.target.files[0]);
        handleImageFile(e.target.files[0])
      }
    return (
        <div>
            <input type='file' id='file' ref={inputFile} onChange={chooseImage} style={{display: 'none'}}/>
            <button class="btn btn-primary" type="button" onClick={onButtonClick} >
                <i class="fa fa-fw fa-camera"></i>
                <span>Change Photo</span>
            </button>
        </div>
    )
}
