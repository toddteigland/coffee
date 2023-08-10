import styles from "../styles/home.css";
import video from "../media/ID6CWWYR2Q25BOQE.mp4";

export default function Home() {
  return (
    <div className="container">
      {/* <h1>On The Go</h1> */}
      <div className="videoContainer">
        <video controls width="100%" height="100%" autoPlay="true" muted="true">
          <source type="video/mp4" src={video} />
        </video>
      </div>
    </div>
  );
}
