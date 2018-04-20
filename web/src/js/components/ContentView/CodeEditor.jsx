import React from 'react'
import PropTypes from 'prop-types'
import Codemirror from 'react-codemirror';
import vkbeautify from 'vkbeautify'


CodeEditor.propTypes = {
        content: PropTypes.string.isRequired,
        onChange: PropTypes.func.isRequired,
}


export default function CodeEditor ( { content, onChange} ){

    let options = {
        lineNumbers: true
    };
    content = vkbeautify.xml(content)
    console.log(content)
    return (
        <div className="codeeditor" onKeyDown={e => e.stopPropagation()}>
            <Codemirror value={content} onChange={onChange} options={options}/>
        </div>
    )
}
