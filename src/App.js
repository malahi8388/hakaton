import React, { useRef, useState } from "react";
import JSZip from "jszip";
import throttle from "lodash.throttle";
import { saveAs } from "file-saver";
import axios from 'axios';
import './App.css'

export default function App() {
  const inputRef = useRef();
  const [progress, setProgress] = useState(-1);
  const [files, setFiles] = useState([]);
  const [getdata, setGetTata] = useState('');
  let [loadingInProgress, setLoading] = useState(true);
  // const [showButton, setShowButton] = useState(false);

  // const handleFileChange = (e) =>{
  //   if(e.target.files){
  //     setFiles(e.target.files)
  //   }
  // }
 
  const sendData = async (formData) => {
    await axios.post('url', { formData }, {
      headers: { 'Content-Type': 'multipart/form-data'}
     
 
    })
    .then(response => setGetTata(response))
  }

  const onZipUpdate = (metadata) => {
    setProgress(metadata.percent);
    console.log("progression: " + metadata.percent.toFixed(2) + " %");
    if (metadata.currentFile) {
      console.log("current file = " + metadata.currentFile);
    }
  };
  const throttledZipUpdate = throttle(onZipUpdate, 50);



  const onZip = () => {
    const zip = new JSZip();
    const files = Array.from(inputRef.current.files);

    files.forEach((file) => {
      zip.file(file.webkitRelativePath, file);
    });
    zip
      .generateAsync({ type: "blob" }, throttledZipUpdate)
      .then(function (content) {

        console.log(content)
        // saveAs(content, "files.zip");

        const formData = new FormData();
        formData.append("folderzip", content);

        sendData(formData);
        console.log("ready to send to server", content);
      })
      .catch((e) => console.log(e));
  };
  // if (progress = 100) {
  //   // btn.display = 'block'
  //   // setShowButton(true);
  // }

  

  return (
    <div className="contener">

      <div classname="folder">

      <h1 className="h1">Folder upload</h1>
      <h2 classname="h2">Select a folder to send to train the model</h2>

      <div className="input-app">
          <input ref={inputRef} type="file" webkitdirectory="true" onChange={(e) => { setFiles(e.target.value); onZip() }} />
      </div>

    </div>








    
      {console.log({ files })}
      {/* {files && ( */}
      <div>

        {/* <div>
            <button onClick={console.log(files)}>gfhfh</button>
            <button onClick={onZip}>zip {files.length} files</button>
          </div> */}
        <progress max="100" value={progress}>
          {/* {progress?.toFixed(2)}%{" "}} */}
        </progress>
        {/* <button className="btn" style={{ display: 'none' }}>tast</button> */}

      </div>
    </div>
  );
}