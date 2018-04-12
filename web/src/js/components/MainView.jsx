import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Splitter from './common/Splitter'
import FlowTable from './FlowTable'
import FlowView from './FlowView'
import Nav from './FlowView/Nav'
import * as flowsActions from "../ducks/flows"
import {switchScen} from '../ducks/edit'

MainView.propTypes = {
    hasSelection: PropTypes.bool.isRequired,
    scenarios: PropTypes.array.isRequired,
    scenario: PropTypes.string.isRequired,
    learning: PropTypes.bool.isRequired,
    bouchon: PropTypes.bool.isRequired
}

function MainView({ hasSelection, scenarios, scenario, selectTab, switchScen, changeScen, learning, bouchon}) {
    return (
      <div id="container">
      {scenarios.length > 0 &&   <Nav
            tabs={scenarios}
            active={scenario}
            onSelectTab={(scenario) => {!learning && selectTab(scenario); !learning && changeScen(scenario)}}
        />}
          <div className="main-view">
              <FlowTable/>
              {(hasSelection && !learning && !bouchon)&& <Splitter key="splitter"/>}
              {(hasSelection && !learning && !bouchon) && <FlowView key="flowDetails"/>}
          </div>
        </div>
    )
}

export default connect(
    state => ({
        hasSelection: !!state.flows.byId[state.flows.selected[0]],
        scenarios: Object.keys(state.flows.scenarios),
        scenario: state.flows.scenario,
        learning: state.edit.learning,
        bouchon: state.edit.bouchon
    }),
    {selectTab: flowsActions.selectTab,
      changeScen: flowsActions.changeScenario}
)(MainView)
