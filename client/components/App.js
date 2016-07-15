/* eslint-disable react/prop-types */

import React from 'react';

export default (props) => (
  <div>
    <div className="container">
      <div className="row">
        <div className="col-xs-12">
          {props.children}
        </div>
      </div>
    </div>
  </div>
);
