import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import classnames from 'classnames'


export default class Input extends Component {

    constructor(props, context) {
        super(props, context)

        // Consider both focus and mouseover for showing/hiding the tooltip,
        // because onBlur of the input is triggered before the click on the tooltip
        // finalized, hiding the tooltip just as the user clicks on it.
        this.state = { value: this.props.value,scenario: this.props.value}

        this.onChange = this.onChange.bind(this)
        this.onKeyDown = this.onKeyDown.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ value: nextProps.value })
    }



    onChange(e) {
        const value = e.target.value
        this.setState({ value })
        this.props.onChange(value)
    }

    onKeyDown(e) {
      console.log(e.keyCode)
      if(e.keyCode != 13 && e.keyCode != 27){
        e.stopPropagation()
      }
      console.log("stop")
    }


    render() {
        const { value } = this.state
        const {placeholder} = this.props
        return (
                <input
                    type="text"
                    className="form-control"
                    value={value}
                    placeholder={placeholder}
                    onChange={this.onChange}
                    onKeyDown={this.onKeyDown}
                    autoFocus
                />
        )
    }
}
