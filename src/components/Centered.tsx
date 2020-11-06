import React from "react";

const Centered: React.FC<{
  vertical?: boolean,
  horizontal?: boolean,
  fullHeight?: boolean,
  style?: object,
}> = ({
  vertical = true,
  horizontal = true,
  fullHeight = false,
  children,
  ...props
}) => {
    let classStr = vertical ? "ion-align-items-center" : "";
    classStr += horizontal ? " ion-justify-content-center" : "";
    classStr += fullHeight ? " h100" : "";

    return (
      <div className={`d-flex ${classStr}`} {...props}>
        {children}
      </div>
    );
  };

export default Centered;