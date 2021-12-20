import React from 'react';

export default function RadioButtonInput({ OptionsList, handleChangeRadio, name }) {
  return (
    OptionsList.map(option => {
      return (
        <div class="pretty p-icon p-curve p-rotate">
          <input type="radio" name={name} onChange={() => handleChangeRadio(name, option.value)} />
          <div class="state p-success-o">
            <i class="icon material-icons">done</i>
            <label>{option.label}</label>
          </div>
        </div>
      )
    })
  )
}
