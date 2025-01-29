import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import areasData from "./areasData.json";
import roMapImg from "./judete-romania.png";
import "./InteractiveMap.css";

const InteractiveMap = ({ onAreaClick }) => {
  const [imageSize, setImageSize] = useState({ width: 1300, height: 1000 });

  const handleResize = () => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const searchBarHeight =
      document.querySelector(".search-bar")?.offsetHeight || 0;
    const imgElem = document.getElementById("ro-map");
    const aspectRatio = 1300 / 1000;
    const imageTopPadding = 90;
    let newWidth = windowWidth;
    let newHeight = windowWidth / aspectRatio;

    if (newHeight > windowHeight) {
      newHeight = windowHeight;
      newWidth = windowHeight * aspectRatio;
    }
    const scale = newWidth / 1300;
    let dY = 0;
    const offsetValue = searchBarHeight - imageTopPadding * scale;
    if (offsetValue > 0) dY = offsetValue;

    const dX = Math.floor((windowWidth - newWidth) / 2);
    imgElem.style.transform = `translate(${dX}px,${dY}px)`;
    setImageSize({ width: newWidth, height: newHeight });
  };

  useEffect(() => {
    handleResize();
    window.onresize = handleResize;
  }, []);

  const scaleCoords = (coords) => {
    const scaleX = imageSize.width / 1300;
    const scaleY = imageSize.height / 1000;

    return coords
      .split(",")
      .map((coord, index) =>
        (index % 2 === 0
          ? parseInt(coord) * scaleX
          : parseInt(coord) * scaleY
        ).toFixed(0)
      )
      .join(",");
  };

  return (
    <div className="image-map-container">
      <img
        src={roMapImg}
        alt="Harta Judete Romania"
        id="ro-map"
        useMap="#harta-judete"
        style={{
          width: `${imageSize.width}px`,
          height: `${imageSize.height}px`,
        }}
      />
      <map name="harta-judete" id="harta-judete">
        {areasData.map((area) => (
          <area
            key={area.id}
            id={area.id}
            alt={area.name}
            title={area.name}
            coords={scaleCoords(area.coords)}
            shape="poly"
            onClick={() => onAreaClick(area.name)}
          />
        ))}
      </map>
    </div>
  );
};

InteractiveMap.propTypes = {
  onAreaClick: PropTypes.func.isRequired,
};

export default InteractiveMap;
