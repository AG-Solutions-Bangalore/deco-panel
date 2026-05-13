import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const QuotationsFilter = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleButtonClick = (path) => {
    navigate(path);
  };

  const buttons = [
    {
      label: "Open Quotation",
      path: "/quotations",
      color: "from-blue-500 to-cyan-400",
      hoverColor: "hover:bg-blue-50",
      textColor: "text-blue-900",
    },

    {
      label: "Processing Quotation",
      path: "/all-quotations",
      color: "from-purple-500 to-indigo-400",
      hoverColor: "hover:bg-purple-50",
      textColor: "text-purple-900",
    },
    {
      label: "Completed Quotation",
      path: "/completed-quotation",
      color: "from-yellow-500 to-orange-300",
      hoverColor: "hover:bg-yellow-50",
      textColor: "text-yellow-900",
    },
  ];

  return (
    <div className="bg-white rounded-t-lg shadow-lg p-1  mx-auto  w-full">
      <div className="flex flex-wrap justify-center items-center gap-1  ">
        {buttons.map((button, index) => (
          <button
            key={index}
            className={`relative group px-4 py-2 m-1 rounded-lg transition-all duration-200 text-sm font-medium ${
              location.pathname === button.path
                ? `bg-gradient-to-r ${button.color}  text-white`
                : ` ${button.hoverColor} ${button.textColor} bg-gray-100`
            }`}
            onClick={() => handleButtonClick(`${button.path}`)}
          >
            {button.label}
            {location.pathname !== button.path && (
              <span
                className={`absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r ${button.color}  group-hover:w-full transition-all duration-300`}
              ></span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuotationsFilter;
