import React, { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import RegionSelect from "react-region-select";
import YouTube from "react-youtube";

import getYouTubeID from 'get-youtube-id';
export default function YoutubeUpload() {
    const inputRef = useRef();
    const [urlInput, setUrlInput] = useState("");
    const [url, setUrl] = useState("");
    const [videoId, setVideoId] = useState("")
    const [status, setStatus] = useState(null);
    const [regions, setRegions] = useState([]);

    const handleUrlChange = (event) => {
        event.preventDefault();
        setUrl(urlInput);
        const id = getYouTubeID(urlInput);
        setVideoId(id);

        setRegions([{x:0,y:0,width:50,height:50,data:{index:0}}])
    };

    const handleInputChange = (event) => {
        event.preventDefault();
        setUrlInput(event.target.value);
    };

    const regionsOnChange = (newRegions) => {
        setRegions(newRegions);
    };

    const handleUpload = async (event) => {
        event.preventDefault();
        const payload = {
            url: url,
            regions: regions
          };

        console.log(payload)
        
        const response = await fetch("http://localhost:5050/youtube-upload", {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json'
              },
        });
        if (response) setStatus(response.statusText);
    };

    return (
        <div className="VideoInput">
            <form onSubmit={handleUrlChange}>
                <input
                    type="text"
                    name="url"
                    value={urlInput}
                    onChange={handleInputChange}
                />
                <button type="submit">Submit</button>
            </form>

            {url && (
                <RegionSelect
                    regions={regions}
                    onChange={regionsOnChange}
                    maxRegions={1}
                    regionStyle={{
                        background: "rgba(0, 255, 0, 0.5)",
                        zIndex: 2,
                    }}
                    constraint
                >
                    <div style={{ zIndex: 1}}>
                        <YouTube videoId={videoId} id="video" />
                    </div>
                </RegionSelect>
            )}

            {url && <button onClick={handleUpload}>Upload</button>}
            {status && <h4>{status}</h4>}
        </div>
    );
}
