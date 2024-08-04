import React, { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import RegionSelect from "react-region-select";
import YouTube from "react-youtube";
import getYouTubeID from "get-youtube-id";
import "./BothUpload.css";
import download from "downloadjs";
import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL;

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
        try {
            const response = await axios.post(`${API_URL}/upload`, formData, {
                responseType: "blob",
            });
            download(response.data, "Sheet Music", "application/pdf");
        } catch (error) {
            console.error(error);
        }
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

        try {
            const response = await axios.post(`${API_URL}/youtube-upload`, payload, {
                headers: {
                    "Content-Type": "application/json",
                },
                responseType: "blob",
            });
            download(response.data, "Sheet Music", "application/pdf");
            setStatus(response.statusText);
        } catch (error) {
            console.error(error);
        }
    };

    const downloadFile = async () => {
        try {
            const result = await axios.get(`${API_URL}/download/${id}`, {
                responseType: "blob",
            });
            const split = path.split("/");
            const filename = split[split.length - 1];
            setErrorMsg("");
            return download(result.data, "Sheet Music", mimetype);
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setErrorMsg("Error while downloading file. Try again later");
            }
        }
    };

    return (
        <div className="container">
            <p className="title">Video to Sheet Music PDF</p>
            <p className="description">Convert sheet music video to pdf</p>
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
                Upload Video
            </button>
            {(videoId || file) && (
                <p>
                    Drag the green box to cover the region of the sheet music.
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
                        <div style={{ zIndex: 1 }}>
                            <YouTube videoId={videoId} id="video" />
                        </div>
                    </RegionSelect>
                </div>
            )}

            {videoId && (
                <button className="button" onClick={handleUploadUrl}>
                    Convert to Sheet Music
                </button>
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
                        <video className="video" controls src={uploadSource} />
                    </RegionSelect>
                </div>
            )}
            {file && (
                <button className="button" onClick={handleUploadFile}>
                    Convert to Sheet Music
                </button>
            )}
            {/*status && <h4 className="status">{status}</h4>*/}
        </div>
    );
}
