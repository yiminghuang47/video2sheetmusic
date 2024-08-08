import React, { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import RegionSelect from "react-region-select";
import YouTube from "react-youtube";
import getYouTubeID from "get-youtube-id";
import "./BothUpload.css";
import download from "downloadjs";
import { Blob, Buffer } from "buffer";
import axios from "axios";
import dotenv from "dotenv";

export default function BothUpload() {
    const API_URL = import.meta.env.VITE_API_URL;
    //const API_URL = "https://extract-sheet-music-from-video-server.vercel.app";
    //const API_URL = "https://video-to-sheet-music.onrender.com";
    // const API_URL = "http://localhost:5050";
    // const API_URL = "https://extract-sheet-music-from-vid-git-72ea1a-yiminghuang47s-projects.vercel.app";
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
        /*
        let formData = new FormData();
        formData.append("file", file);
        formData.append("regions", JSON.stringify(regions));
        */
        const { url } = await fetch(`${API_URL}/s3Url`).then((res) =>
            res.json()
        );
        console.log(url);

        setStatus("Converting...");

        await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "multipart/form-data",
            },
            body: file,
        });

        const videoUrl = url.split("?")[0];
        console.log(videoUrl);

        try {
            const response = await axios.post(
                `${API_URL}/upload`,
                {
                    videoUrl: videoUrl,
                    regions: JSON.stringify(regions),
                },
                {
                    responseType: "arraybuffer",
                }
            );
            console.log(response.data);
            setStatus("<span style=\"color:green\">Conversion completed!</span>");
            const pdfBytes = new Uint8Array(response.data);
            download(pdfBytes, "Sheet Music", "application/pdf");
        } catch (error) {
            console.error(error);
            setStatus("<span style=\"color:red\">An error occured during conversion.</span>");
        }

        /*
        try {
            const response = await axios.post(`${API_URL}/upload`, formData, {
                responseType: "blob",
            });
            download(response.data, "Sheet Music", "application/pdf");
        } catch (error) {
            console.error(error);
        }
            */
    };

    const handleUrlChange = (event) => {
        event.preventDefault();
        setUrl(urlInput);

        setUploadSource("");
        setRegions(null);
        setFile(null);
        setVideoId("");
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
        setStatus("Converting...");
        try {
            const response = await axios.post(
                `${API_URL}/youtube-upload`,
                {
                    url: url,
                    regions: JSON.stringify(regions),
                },
                {
                    responseType: "arraybuffer",
                }
            );
            console.log(response.data);
            setStatus("<span style=\"color:green\">Conversion completed!</span>");
            const pdfBytes = new Uint8Array(response.data);
            download(pdfBytes, "Sheet Music", "application/pdf");
        } catch (error) {
            setStatus("<span style=\"color:red\">An error occured during conversion.</span>");
            console.error(error);
        }
    };

    return (
        <div className="container">
            <p className="title">Video to Sheet Music PDF</p>
            <p className="description">
                Extract sheet music pdf from video. <a>Example</a>
            </p>

            {(!status) && (<div className="upload-area">
                <form className="form" onSubmit={handleUrlChange}>
                    <p>Enter YouTube link: </p>
                    <div className="input-container">
                        <input
                            className="input-text"
                            type="text"
                            name="url"
                            value={urlInput}
                            onChange={handleUrlInputChange}
                        />
                        <button className="button button-enter" type="submit">
                            Enter
                        </button>
                    </div>
                </form>

                <p>or</p>
                <input
                    ref={inputRef}
                    type="file"
                    onChange={handleUploadFileChange}
                    accept=".mov,.mp4"
                    hidden
                />

                <button className="button" onClick={handleChoose}>
                    Upload from computer
                </button>
                {(videoId || file) && (
                    <p>
                        Drag the green box to cover the region of the sheet
                        music.
                    </p>
                )}
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
                            <YouTube
                                className="youtube-video-container"
                                videoId={videoId}
                                id="youtube-video"
                            />
                        </RegionSelect>
                    </div>
                )}

                
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
                
                
            </div>)}
            
            {videoId && !status && (
                    <button
                        className="button convert-button"
                        onClick={handleUploadUrl}
                    >
                        Convert to Sheet Music
                    </button>
                )}

            {file && !status && (
                    <button
                        className="button convert-button"
                        onClick={handleUploadFile}
                    >
                        Convert to Sheet Music
                    </button>
                )}
            {status && <div className="status" dangerouslySetInnerHTML={{__html: status}}></div>}
            
        </div>
    );
}
