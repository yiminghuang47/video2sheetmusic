
# Video2SheetMusic 

Video2SheetMusic is a web application that allows musicians to extract sheet music directly from video files or YouTube links. The tool automatically processes the selected region in the video where the sheet music appears and generates a PDF.


## [[Live Website]](https://video2sheetmusic.vercel.app/)
## [[Video Demo]](https://youtu.be/fMgDhheYRWY)


## Installation

### Prerequisites

- [Node.js](https://nodejs.org/en/download/) (v14.x or later)
- [Python](https://www.python.org/downloads/) (v3.x)

### Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yiminghuang47/video2sheetmusic.git
   cd video2sheetmusic
   cd client
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory and add the following environment variables:

   ```bash
   VITE_API_URL=<Your API URL>
   ```

   The API URL should be `http://localhost:5050` by deafult.

4. **Run the development server:**

   ```bash
   npm run dev
   ```

   The app should now be running at `http://localhost:5173` by default.

### Backend Setup

1. **Navigate to the `server` directory:**

   ```bash
   cd server
   ```

2. **Install backend dependencies:**

   ```bash
   npm install
   pip install -r requirements.txt
   ```

3. **Run the backend server:**

   ```bash
   node server.js
   ```

   The backend server will run on port `5050` by default.



## Usage



1. **Upload a Video or Enter a YouTube Link:**

   - You can either upload a video file from your device or paste a YouTube link.
   
2. **Select the Region:**

   - Use the green selection box to highlight the area of the video where the sheet music appears.

3. **Convert:**

   - Click the "Convert to Sheet Music" button. The conversion process might take a few minutes, depending on the video length.

4. **Download the PDF:**

   - Once the conversion is complete, a PDF will automatically be downloaded.

## Deployment

For production deployment, ensure that your environment variables are correctly set up for production use. Deploy the frontend and backend to your preferred hosting services.

**Note:** YouTube link upload might not work in the production environment due to YouTube's policies. Consider using local uploads or deploying the app locally using the above method.


## Tech Stack

- **Frontend:**
  - React, Vite, HTML, CSS, Javascript

- **Backend:**
  - Express, Multer, Python, OpenCV, NumPy, Scikit-Image, Pillow, AWS S3
  
- **Deployment:**
  - Vercel: For deploying the frontend.
  - Render: For deploying the backend.
  - AWS S3: For storing uploaded videos.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes. 

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For any inquiries or support, please send an email to [yiminghuang47@gmail.com](mailto:yiminghuang47@gmail.com)
