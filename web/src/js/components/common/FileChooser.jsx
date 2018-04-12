import React  from 'react'
import PropTypes from 'prop-types'
import classnames from "classnames"

FileChooser.propTypes = {
    icon: PropTypes.string,
    text: PropTypes.string,
    className: PropTypes.string,
    title: PropTypes.string,
    onOpenFile: PropTypes.func.isRequired
}

export default function FileChooser({ icon, text, className, title, onOpenFile }) {
    let fileInput;
    return (
        <a href='#' onClick={() => fileInput.click()}
           className={classnames(className, 'btn btn-default')}
           title={title}>
            <i className={'fa fa-fw ' + icon}></i>
            {text}
             <input
                ref={ref => fileInput = ref}
                className="hidden"
                type="file"
                accept=".fl"
                onChange={e => { e.preventDefault(); if(e.target.files.length > 0) onOpenFile(e.target.files[0]); fileInput.value="";}}
            />
        </a>
    )
}
