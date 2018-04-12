import React from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import shallowEqual from 'shallowequal'

import * as FlowActions from '../../ducks/ui/flow'
import * as FlowsActions from '../../ducks/flows'

RuleTable.propTypes = {
  addRule: PropTypes.func.isRequired,
  deleteRule: PropTypes.func.isRequired,
  upRule: PropTypes.func.isRequired,
  downRule: PropTypes.func.isRequired,
  editRule: PropTypes.func.isRequired,
  matcher: PropTypes.object.isRequired,
}

function RuleTable({flow, matcher, label, isEdit, selectRule, selectedMatcher, addRule, deleteRule, upRule, downRule, editRule, modifyRule, deleteRuleDis, upRuleDis, downRuleDis}){

    return (
      <div>
        <h3><span class="label label-info">{label}</span></h3>

        <row className="row row-eq-height">
          {isEdit &&
          <div className="col-md-2">
            <button type="button" onClick={()=>addRule(label)}className="btn btn-primary btn-block">Add</button>
            <button type="button" disabled={selectedMatcher === false} onClick={()=>editRule(label,selectedMatcher, matcher)} className="btn btn-primary btn-block">Edit</button>
            <button type="button" disabled={selectedMatcher === false} onClick={()=>{deleteRuleDis(flow.id,label,selectedMatcher);deleteRule(label,selectedMatcher, flow.id, matcher[label].length)}} className="btn btn-primary btn-block">Delete</button>
            <button type="button" disabled={selectedMatcher === false} onClick={()=>{upRuleDis(flow.id,label,selectedMatcher);upRule(label,selectedMatcher, flow.id, matcher[label].length)}} className="btn btn-primary btn-block">Up</button>
            <button type="button" disabled={selectedMatcher === false} onClick={()=>{downRuleDis(flow.id,label,selectedMatcher);downRule(label,selectedMatcher,flow.id,matcher[label].length)}} className="btn btn-primary btn-block">Down</button>
          </div>
        }
          <div className="col-md-10">
            <div className="table-responsive rule-table" style={{width: '100%', height: '100%', border: "1px solid black"}}>
              <table className="table table-condensed table-bordered table-striped">
                <thead>
                <tr>
                  {label == "Headers" &&
                    <th>Header</th>
                  }
                  <th>Relationship</th>
                  <th>Regex</th>
                </tr>
                </thead>
                <tbody style={{cursor: isEdit && 'pointer'}}>
                  {matcher[label].map((rule,index) => (
                    <tr className={index === selectedMatcher ? "selected" : ""} onClick={()=>{if(isEdit) selectRule(label, index)}} key={index}>
                      {label == "Headers" &&
                      <td>{rule["Header"]}</td>}
                      <td>{rule["Condition"]}</td>
                      <td>{rule["Value"]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </row><br/>
      <hr style={{height:"1px", border: "none" ,color:"#333"}}/>
      </div>

    )
  }

export default connect(
    state => ({
      modifyRule: state.ui.flow.modifyRule
    }),
    {
      addRule: FlowActions.addRule,
      deleteRule: FlowActions.deleteRule,
      upRule: FlowActions.upRule,
      downRule: FlowActions.downRule,
      editRule: FlowActions.editRule,
      upRuleDis: FlowsActions.upRuleDis,
      downRuleDis: FlowsActions.downRuleDis,
      deleteRuleDis: FlowsActions.deleteRuleDis,

    }
)(RuleTable)
