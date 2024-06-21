import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import RegionSelect from "react-region-select";
export default function Upload() {
    // const [form, setForm] = useState();
    const inputRef = React.useRef();

    const [source, setSource] = React.useState();
    const [file, setFile] = React.useState();
    const [status, setStatus] = useState();
    const [regions, setRegions] = useState([]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        const url = URL.createObjectURL(file);
        setSource(url);
        setFile(file);
        setRegions([{x:0,y:0,width:50,height:50,data:{index:0}}])
    };

    const handleChoose = (event) => {
        inputRef.current.click();
    };
    const regionsOnChange = (r) => {
        setRegions(r);
    };
    const handleUpload = async (event) => {
        event.preventDefault();
        let formData = new FormData();
        formData.append("file", file);
        formData.append("regions",JSON.stringify(regions));
        const response = await fetch("http://localhost:5050/upload", {
            method: "POST",
            body: formData
        });
        if (response) setStatus(response.statusText);
    };

    return (
        <div className="VideoInput">
            <input
                ref={inputRef}
                className="VideoInput_input"
                type="file"
                onChange={handleFileChange}
                accept=".mov,.mp4"
            />
            {!source && <button onClick={handleChoose}>Choose</button>}
            {source && (
                <RegionSelect
                    regions={regions}
                    onChange={regionsOnChange}
                    maxRegions={1}
                    regionStyle={{
                        background: "rgba(0, 255, 0, 0.5)",zIndex:2
                    }}
                    constraint
                >
                    <video
                        className="VideoInput_video"
                        style={{zIndex:1}}
                        width="100%"
                        height={400}
                        controls
                        src={source}
                    />
                </RegionSelect>
            )}
            <div className="VideoInput_footer">
                {source || "Nothing selected"}
            </div>
            {source && <button onClick={handleUpload}>Upload</button>}
            {status && <h4>{status}</h4>}
        </div>
    );
    
}
