# next-ytdl
A simple web application that allows you to download audio or video from YouTube Videos. Built with Next.js and [youtube-dl-exec](https://github.com/microlinkhq/youtube-dl-exec).

## Features

- [x] Download YouTube audio in MP3 or MP4 format (best format)
- [x] Real-time progress updates during the download
- [x] Parallel downloads support
- [x] Error handling and notifications
- [x] Abort downloads
- [x] Download history and redownload option
- [x] Support playlist (only download the video not the playlist)
- [x] Remove file onclick trash icon
- [x] Copy link to clipboard 
- [x] Theme switch with light and dark mode
- [x] Docker support
## Demo




https://github.com/user-attachments/assets/ab24dd87-f9ec-46ba-9170-6deca3753848


## Getting Started

### Requirements for *youtube-dl-exec*

- [FFmpeg](https://ffmpeg.org/download.html)
- [python](https://www.python.org/)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/heryfitiavana22/next-ytdl.git
   ```

2. Navigate to the project directory and install the dependencies:

   ```bash
   cd next-ytdl
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Build and Start the production server:

   ```bash
   npm run build
   npm run start
   ```

   The application will be available at [`http://localhost:3000`](http://localhost:3000).

## Running with Docker

You can also run the application using Docker:

### Requirements

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Running the Application

1. Build and start the containers:

   ```bash
   docker-compose up -d
   ```

   This will build the Docker image and start the application in detached mode.

2. The application will be available at [`http://localhost:3000`].First time you run it, it will take a while to compile the app.

3. To stop the containers:

   ```bash
   docker-compose down
   ```

### Building the Docker Image Only

If you want to build the Docker image without starting the application:

```bash
docker build --target dev -t next-ytdl .
```

Then you can run the container manually:

```bash
docker run -p 3000:3000 next-ytdl
```



