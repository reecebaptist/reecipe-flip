import React from "react";
import HTMLFlipBook from "react-pageflip";
import "./App.css";
const chapters = Array.from({ length: 10 }, (_, i) => `Chapter ${i + 1}`);

const App: React.FC = () => {
  const bookWidth = Math.floor(window.innerWidth * 0.9);
  const bookHeight = Math.floor(window.innerHeight * 0.9);
  return (
    <div className="App app-bg">
      <div className="flipbook-fullscreen">
        <HTMLFlipBook
          usePortrait={true}
          width={bookWidth}
          height={bookHeight}
          size="fixed"
          minWidth={bookWidth}
          maxWidth={bookWidth}
          minHeight={bookHeight}
          maxHeight={bookHeight}
          maxShadowOpacity={0.25}
          showCover={true}
          mobileScrollSupport={true}
          className="flipbook"
          style={{ width: bookWidth, height: bookHeight }}
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