import React from 'react'

const Download = ({ downloadURL }) => {    
    return (
        <section>
            <div className="doc-download">
                <a href={`https://download.pingcap.com/${downloadURL}`}>下载 PDF</a>
            </div>
        </section>
    )
}

export default Download
