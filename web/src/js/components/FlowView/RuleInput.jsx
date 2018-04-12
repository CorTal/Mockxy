import React, { Component } from 'react'
import XPath from 'xpath'
import JSONPath from 'jsonpath'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import classnames from 'classnames'
import { Key } from '../../utils.js'
import Filt from '../../filt/filt'

export default class RuleInput extends Component {

    constructor(props, context) {
        super(props, context)

        // Consider both focus and mouseover for showing/hiding the tooltip,
        // because onBlur of the input is triggered before the click on the tooltip
        // finalized, hiding the tooltip just as the user clicks on it.
        this.state = { value: this.props.value, condition: this.props.condition , focus: false, mousefocus: false }

        this.onChange = this.onChange.bind(this)
        this.onFocus = this.onFocus.bind(this)
        this.onBlur = this.onBlur.bind(this)
        this.onKeyDown = this.onKeyDown.bind(this)
        this.onMouseEnter = this.onMouseEnter.bind(this)
        this.onMouseLeave = this.onMouseLeave.bind(this)
        this.selectFilter = this.selectFilter.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ value: nextProps.value, condition: nextProps['condition'] })
    }

    isValid(filt) {
        try {
            const str = filt == null ? this.state.value : filt
            if (str) {
              switch(this.state.condition){
                case 'm':
                  Filt.parse(str)
                  break
                case 'x':
                  console.log("XPATH")
                  console.log(XPath.select(str,""))

              }
            }
            return true
        } catch (e) {
            return false
        }
    }

    getDesc() {
        if (!this.state.value) {
            return <FilterDocs selectHandler={this.selectFilter}/>
        }
        try {
            return Filt.parse(this.state.value).desc
        } catch (e) {
            return '' + e
        }
    }

    onChange(e) {
        const value = e.target.value
        this.setState({ value })

        // Only propagate valid filters upwards.
        if (this.isValid(value)) {
            this.props.onChange(value)
        }
    }

    onFocus() {
        this.setState({ focus: true })
    }

    onBlur() {
        this.setState({ focus: false })
    }

    onMouseEnter() {
        this.setState({ mousefocus: true })
    }

    onMouseLeave() {
        this.setState({ mousefocus: false })
    }

    onKeyDown(e) {
        if (e.keyCode === Key.ESC || e.keyCode === Key.ENTER) {
            this.blur()
            // If closed using ESC/ENTER, hide the tooltip.
            this.setState({mousefocus: false})
        }
        e.stopPropagation()
    }

    selectFilter(cmd) {
        this.setState({value: cmd})
        ReactDOM.findDOMNode(this.refs.input).focus()
    }

    blur() {
        ReactDOM.findDOMNode(this.refs.input).blur()
    }

    select() {
        ReactDOM.findDOMNode(this.refs.input).select()
    }

    render() {
        const { placeholder } = this.props
        const { condition, value, focus, mousefocus } = this.state
        return (
            <div className={classnames('filter-input input-group', { 'has-error': !this.isValid() })}>
                <input
                    type="text"
                    ref="input"
                    placeholder={placeholder}
                    className="form-control"
                    value={value}
                    onChange={this.onChange}
                    onFocus={this.onFocus}
                    onBlur={this.onBlur}
                    onKeyDown={this.onKeyDown}
                />
            </div>
        )
    }
}
