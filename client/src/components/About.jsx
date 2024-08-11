import "./About.css";

export default function About() {
    return (
        <div className="about-container">
            <p>
                <span style={{ fontWeight: "bold" }}>Video2SheetMusic</span> is
                a tool designed to help musicians easily extract sheet music
                directly from videos. Instead of taking screenshots and manually
                compiling them into a PDF, this tool autonatically does it for
                you.
            </p>
            <h2>How to Use</h2>
            <p>
                Here's a{" "}
                <a
                    href="https://youtu.be/fMgDhheYRWY"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    video demonstration
                </a>{" "}
                of the usage of this tool.{" "}
            </p>
            <ol>
                <li>
                    <span style={{ fontWeight: "bold" }}>
                        Upload Your Video:
                    </span>{" "}
                    You can either upload a video file from your local device or
                    input a YouTube link. &#40;
                    <a href="#youtube-upload-note">Note about YouTube upload</a>
                    &#41;
                </li>
                <li>
                    <span style={{ fontWeight: "bold" }}>
                        Select the Region:
                    </span>{" "}
                    Use the green selection box to highlight the region in the
                    video where the sheet music appears.
                </li>
                <li>
                    <span style={{ fontWeight: "bold" }}>Convert:</span> Click
                    the convert button. The conversion may take a few minutes
                    depending on the length of your video. When the conersion is
                    complete, an automatic download will pop up.
                </li>
            </ol>
            <h2 id="youtube-upload-note">Note about YouTube upload</h2>
            <p>
                If you are running this website from the domain{" "}
                <a href="https://video2sheetmusic.vercel.app/">
                    https://video2sheetmusic.vercel.app/
                </a>
                , then the YouTube link upload won't work due to YouTube's
                policies. 
            </p>
            <p>There are two alternatives.</p>
            <ol>
                <li>
                    Download the YouTube video to your device using other tools,
                    then upload the video from your device.
                </li>
                <li>
                    {"("}For Programmers{")"} Go to the{" "}
                    <a
                        href="https://github.com/yiminghuang47/video2sheetmusic"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        GitHub page
                    </a>{" "}
                    and follow the instructions in README.md. You need to clone
                    the repository and run the website on your local machine.
                </li>
            </ol>
        </div>
    );
}
