import React from 'react';
import './Toolbar.css';

const toolbar = (props) => {
    return (
        <div className={props.show ? 'open Toolbar': 'Toolbar'}>
            <h1>Toolbar</h1>
        </div>
    );
}

export default toolbar;