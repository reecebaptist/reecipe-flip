import React from "react";
import HTMLFlipBook from "react-pageflip";
import "./App.css";
const chapters = Array.from({ length: 10 }, (_, i) => `Chapter ${i + 1}`);

const App: React.FC = () => {
  return (
    <div className="App app-bg">
      <div className="flipbook-fullscreen">
        <HTMLFlipBook
          usePortrait={true}
          width={window.innerWidth}
          height={window.innerHeight}
          size="stretch"
          minWidth={400}
          maxWidth={window.innerWidth}
          minHeight={400}
          maxHeight={window.innerHeight}
          maxShadowOpacity={0.25}
          showCover={true}
          mobileScrollSupport={true}
          className="flipbook"
          style={{ margin: "0 auto", width: `90%`, height: `90vh` }}
          startPage={0}
          drawShadow={true}
          flippingTime={750}
          useMouseEvents={true}
          clickEventForward={true}
          swipeDistance={50}
          disableFlipByClick={false}
          startZIndex={0}
          autoSize={false}
          showPageCorners={true}
        >
          {chapters.map((chapter, idx) => (
            <div className="page" key={idx}>
              <h2>{chapter}</h2>
              <p>This is the content of {chapter}.</p>
            </div>
          ))}
        </HTMLFlipBook>
      </div>
    </div>
  );
};

export default App;