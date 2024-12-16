import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Card = ({
  title,
  content,
  icon,
  color,
  textColor,
  iconColor,
  progress,
  className,
  children,
}) => {
  return (
    <div
      className={`card shadow-md rounded-lg p-4 ${className}`}
      style={{
        backgroundColor: color,
        fontFamily: "Inter, Helvetica, sans-serif",
      }}
    >
      <div className="card-header">
        {icon && (
          <FontAwesomeIcon
            icon={icon}
            size="2x"
            className="mr-4"
            style={{ color: iconColor }}
          />
        )}
        <h3
          className="card-title"
          style={{ color: textColor }}
        >
          {title}
        </h3>
      </div>
      <div
        className="card-content"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "200px", // Adjust based on your card's height
          textAlign: "center",
        }}
      >
        {content && (
          <p
            style={{
              color: textColor,
              fontSize: "1.5em",
              fontWeight: "bold",
              margin: "0", // Remove extra space around the content
            }}
          >
            {content}
          </p>
        )}
      </div>
      {progress !== undefined && (
        <div className="progress-container mt-4">
          <div className="progress-bar bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
