import React, { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import RegionSelect from "react-region-select";
import YouTube from "react-youtube";

import getYouTubeID from "get-youtube-id";
export default function BothUpload() {
    const inputRef = useRef();
    const [urlInput, setUrlInput] = useState(null);
    const [url, setUrl] = useState(null);
    const [videoId, setVideoId] = useState(null);
    const [status, setStatus] = useState(null);
    const [regions, setRegions] = useState([]);

    const [uploadSource, setUploadSource] = useState();
    const [file, setFile] = useState();

    const handleUploadFileChange = (event) => {
        const file = event.target.files[0];
        const url = URL.createObjectURL(file);
        setUploadSource(url);
        setFile(file);
        setRegions([{ x: 0, y: 0, width: 50, height: 50, data: { index: 0 } }]);
        setUrl(null);
        setUrlInput(null);
        setVideoId(null);
        event.target.value = null;
    };

    const handleChoose = (event) => {
        inputRef.current.click();
    };

    const handleUploadFile = async (event) => {
        event.preventDefault();
        let formData = new FormData();
        formData.append("file", file);
        formData.append("regions", JSON.stringify(regions));
        const response = await fetch("http://localhost:5050/upload", {
            method: "POST",
            body: formData,
        });
        if (response) setStatus(response.statusText);
    };

    const handleUrlChange = (event) => {
        event.preventDefault();
        setUrl(urlInput);

        setUploadSource(null);
        setRegions(null);
        setFile(null);
        setRegions(null);
        const id = getYouTubeID(urlInput);
        setVideoId(id);

        setRegions([{ x: 0, y: 0, width: 50, height: 50, data: { index: 0 } }]);
    };

    const handleUrlInputChange = (event) => {
        event.preventDefault();
        setUrlInput(event.target.value);
    };

    const regionsOnChange = (newRegions) => {
        setRegions(newRegions);
    };

    const handleUploadUrl = async (event) => {
        event.preventDefault();
        const payload = {
            url: url,
            regions: regions,
        };

        console.log(payload);

        const response = await fetch("http://localhost:5050/youtube-upload", {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (response) setStatus(response.statusText);
    };

    return (
        <div className="VideoInput">
            <div>Sheet Music Tool</div>
            <form onSubmit={handleUrlChange}>
                <input
                    type="text"
                    name="url"
                    value={urlInput}
                    onChange={handleUrlInputChange}
                />
                <button type="submit">Search</button>
            </form>

            <input
                ref={inputRef}
                className="VideoInput_input"
                type="file"
                onChange={handleUploadFileChange}
                accept=".mov,.mp4"
                hidden
            />

            {<button onClick={handleChoose}>Upload Video </button>}
            {videoId && (
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
                    <div style={{ zIndex: 1 }}>
                        <YouTube videoId={videoId} id="video" />
                    </div>
                </RegionSelect>
            )}

            {videoId && <button onClick={handleUploadUrl}>Upload Url</button>}

            {file && (
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
                    <video
                        className="VideoInput_video"
                        style={{ zIndex: 1 }}
                        width="100%"
                        height={400}
                        controls
                        src={uploadSource}
                    />
                </RegionSelect>
            )}
            {file && <button onClick={handleUploadFile}>Upload File</button>}
            {status && <h4>{status}</h4>}
        </div>
    );
}
