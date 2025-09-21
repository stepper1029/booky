import React, { useState } from 'react';
import "../App.css";
import { searchBooksByTitle } from '../api';

const Browse = () => {


    return (
        <div className={"app-container"}>
            <div className="page-title dm-mono-regular-italic">
                <h1>BROWSE</h1>
            </div>

            <div className="page-body">
                <div className="browse-grid">

                </div>
                <div className="browse-search dm-mono-light-italic">
                    <p>title or author</p>
                </div>
            </div>
        </div>
    );
};

export default Browse;
