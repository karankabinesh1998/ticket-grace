import React, { Component } from 'react';
// import { Button } from 'bootstrap';

 const ModelWindow = ({
   ButtonBody ,
   ButtonTitle,
   id,
  bodyText,
  onClick,
  extraClass = "",
  extraStyle,
  maxwidth = "lg",
  indexStyle = {},
  buttonStyle ={}

   }) => {
  //console.log(indexStyle)
  return (
    <div class="modal fade bd-example-modal-lg" id={`${id}`} style={indexStyle} tabindex="-1" role="dialog" aria-labelledby="formModal"
          aria-hidden="true">
          <div class="modal-dialog" role="document">
            <div class="modal-content" style={extraStyle ? extraStyle : null}>
              <div class="modal-header">
                <h5 class="modal-title" id="formModal">{ButtonTitle}</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                {ButtonBody}
              </div>
            </div>
          </div>
        </div>
  )
}


export default ModelWindow;