import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'

import Nav from './FlowView/Nav'
import { ErrorView as Error, Request, Response } from './FlowView/Messages'
import Matching from './FlowView/Matching'
import Details from './FlowView/Details'

import { selectTab } from '../ducks/ui/flow'

export const allTabs = { Request, Response, Error, Details, Matching }

function FlowView({ flow, matcher, tabName, selectTab }) {

    // only display available tab names
    const tabs = ['request', 'response', 'error'].filter(k => flow[k])
    tabs.push('matching')
    tabs.push("details")

    if (tabs.indexOf(tabName) < 0) {
        if (tabName === 'response' && flow.error) {
            tabName = 'error'
        } else if (tabName === 'error' && flow.response) {
            tabName = 'response'
        } else {
            tabName = tabs[0]
        }
    }

    const Tab = allTabs[_.capitalize(tabName)]

    return (
        <div className="flow-detail">
            <Nav
                tabs={tabs}
                active={tabName}
                onSelectTab={selectTab}
            />
          <Tab flow={flow} matcher={matcher}/>
        </div>
    )
}

export default connect(
    state => ({
        flow: state.flows.byId[state.flows.selected[0]],
        matcher: state.flows.RuleById[state.flows.selected[0]],
        tabName: state.ui.flow.tab,
    }),
    {
        selectTab,
    }
)(FlowView)
