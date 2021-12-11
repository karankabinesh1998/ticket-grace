import React from "react";

const LoginModal = ({
  atagLink = false,
  buttonTitle,
  title,
  id,
  bodyText,
  onClick,
  extraClass = "",
  extraStyle,
  maxwidth = "lg",
  indexStyle = {},
  buttonStyle ={}
}) => {
  return (
    <div>
      {atagLink ? (
        <a
          class={` ${extraClass}`}
          data-toggle="modal"
          data-target={`#${id}`}
          onClick={onClick}
          href="#"
        >
          {buttonTitle}
        </a>
      ) : (
        <button
          type="button"
          className={extraClass ? `btn btn-${extraClass}` : `btn btn-primary`}
          style={buttonStyle}
          data-toggle="modal"
          data-target={`#${id}`}
          onClick={onClick}
        >
          {buttonTitle}
        </button>
      )}
      <div
        className="modal fade"
        id={id}
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        style={indexStyle}
      >
        <div className={`modal-dialog modal-${maxwidth}`} role="document">
          <div className="modal-content" style={extraStyle ? extraStyle : null}>
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {title}
              </h5>
              <button
                type="button"
                className="close "
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">{bodyText}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
