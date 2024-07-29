import React, { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import RegionSelect from "react-region-select";
import YouTube from "react-youtube";
import getYouTubeID from "get-youtube-id";
import './BothUpload.css';

export default function BothUpload() {
    const inputRef = useRef();
    const [urlInput, setUrlInput] = useState("");
    const [url, setUrl] = useState("");
    const [videoId, setVideoId] = useState("");
    const [status, setStatus] = useState("");
    const [regions, setRegions] = useState([]);

    const [uploadSource, setUploadSource] = useState();
    const [file, setFile] = useState();

    const handleUploadFileChange = (event) => {
        const file = event.target.files[0];
        const url = URL.createObjectURL(file);
        setUploadSource(url);
        setFile(file);
        setRegions([{ x: 0, y: 0, width: 50, height: 50, data: { index: 0 } }]);
        setUrl("");
        setUrlInput("");
        setVideoId("");
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

        setUploadSource("");
        setRegions(null);
        setFile(null);
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
        <div className="container">
            <div className="title">Sheet Music Tool</div>
            <form className="form" onSubmit={handleUrlChange}>
                <label>Enter YouTube link: </label>
                <div className="input-container">
                    <input
                        className="input-text"
                        type="text"
                        name="url"
                        value={urlInput}
                        onChange={handleUrlInputChange}
                    />
                    <button className="button button-enter" type="submit">Enter</button>
                </div>
            </form>

            <label>or</label>
            <input
                ref={inputRef}
                type="file"
                onChange={handleUploadFileChange}
                accept=".mov,.mp4"
                hidden
            />

            <button className="button" onClick={handleChoose}>Upload Video</button>

            {videoId && (
                <div className="video-container">
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
                </div>
            )}

            {videoId && <button className="button" onClick={handleUploadUrl}>Convert to Sheet Music</button>}

            {file && (
                <div className="video-container">
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
                            className="video"
                            controls
                            src={uploadSource}
                        />
                    </RegionSelect>
                </div>
            )}
            {file && <button className="button" onClick={handleUploadFile}>Convert to Sheet Music</button>}
            {/*status && <h4 className="status">{status}</h4>*/}
        </div>
    );
}
