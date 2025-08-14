import "./styles.css";
import coverImg from "../assets/images/cover-bg-2.avif";

function CoverPage() {
  return (
    <div className="page-content cover-full">
      <div
        className="cover-full-image"
        role="img"
        aria-label="Cookbook cover"
        style={{ backgroundImage: `url(${coverImg})` }}
      />
    </div>
  );
}

export default CoverPage;
