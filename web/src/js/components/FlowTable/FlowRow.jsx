import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import columns from './FlowColumns'
import { pure } from '../../utils'

FlowRow.propTypes = {
    onSelect: PropTypes.func.isRequired,
    flow: PropTypes.object.isRequired,
    highlighted: PropTypes.bool,
    selected: PropTypes.bool,
    matcher:PropTypes.object
}

function FlowRow({ flow, selected, highlighted, onSelect, matcher }) {
    const className = classnames({
        'selected': selected,
        'highlighted': highlighted,
        'intercepted': flow.intercepted,
        'has-request': flow.request,
        'has-response': flow.response,
    })
    console.log(matcher)
    return (
        <tr className={className} onClick={() => onSelect(flow.id)}>
            {columns.map(Column => (
                <Column key={Column.name} flow={flow} matcher={matcher}/>
            ))}
        </tr>
    )
}

export default pure(FlowRow)
