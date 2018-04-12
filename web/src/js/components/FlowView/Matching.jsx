import React, { Component } from 'react'
import ReactModal from 'react-modal'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import InputRange from 'react-input-range';


import { RequestUtils, isValidHttpVersion, parseUrl } from '../../flow/utils.js'
import { formatTimeStamp } from '../../utils.js'
import ContentView from '../ContentView'
import ContentViewOptions from '../ContentView/ContentViewOptions'
import ValidateEditor from '../ValueEditor/ValidateEditor'
import ValueEditor from '../ValueEditor/ValueEditor'
import HideInStatic from '../common/HideInStatic'
import Button from "../common/Button"
import Input from "../common/Input"
import RuleInput from "./RuleInput"

import Headers from './Headers'
import * as UIActions from '../../ducks/ui/flow'
import * as FlowActions from '../../ducks/flows'
import ToggleEdit from './ToggleEdit'
import RuleTable from './RuleTable'


const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : '50%',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

const HeaderInput = connect(
    state => ({
        value: state.ui.flow.modifyRule["Header"],
        placeholder: 'Header'
    }),
    { onChange: UIActions.setHeader }
)(Input);

const ValueInput = connect(
    state => ({
        value: state.ui.flow.modifyRule["Value"],
        placeholder: 'Value',
        condition: state.ui.flow.modifyRule["Condition"].charAt(0)
    }),
    { onChange: UIActions.setValue}
)(RuleInput);





export function MatchingView ({flow,
  matcher,
  isEdit,
  updateFlow,
  uploadContent,
  selectedHeaders,
  selectedContent,
  selectedURI,
  cancelModifyRule,
  selectRule,
  modifyingRule,
  header,
  condition,
  currentCond,
  setCondition,
  value,
 validateRule,
  dispatchRule}){

  return(
      <section className="matching">
          <article>
            {!modifyingRule &&
              <ToggleEdit/>
              }
              <RuleTable
                isEdit={isEdit}
                flow={flow}
                matcher={matcher}
                selectedMatcher={selectedHeaders}
                label={"Headers"}
                selectRule={selectRule}
              />
              <RuleTable
                isEdit={isEdit}
                flow={flow}
                matcher={matcher}
                selectedMatcher={selectedContent}
                label={"Content"}
                selectRule={selectRule}
              />
              <RuleTable
                isEdit={isEdit}
                flow={flow}
                matcher={matcher}
                selectedMatcher={selectedURI}
                label={"URI"}
                selectRule={selectRule}
              />
            {modifyingRule &&
              <ReactModal
                isOpen={modifyingRule}
                style={customStyles}
                contentLabel='Choisissez le nom du scénario'>
                <div className="react-modal-dialog">
                  <div className="react-modal-header">
                    <div className="title"><h3 style={{textAlign: 'center'}}>Matching</h3></div>
                  </div>
                  <div className="react-modal-body">
                    <form>

                      <div className="form-group">
                        {modifyingRule["Label"] === "Headers" &&
                        <div><h4><span class="label label-info">Header</span></h4><HeaderInput/><br/><br/><hr/></div>}

                        <h4><span class="label label-info">Condition</span></h4>
                        <hr/>
                        <label className="switch">
                        <input type="checkbox" checked={condition.charAt(1) == 'n'} onChange={()=>setCondition('n')} value="Not"/>
                        <span className="slider round"></span>
                        </label> <label style={{lineHeight: '25px'}}>Not</label> <br/> <br/>
                        <label className="radio-inline"><input type="radio" value="" checked={condition.charAt(0) == 'c'} onChange={()=>setCondition('c')}/>contains</label>
                        <label className="radio-inline"><input type="radio" value="" checked={condition.charAt(0) == 'e'} onChange={()=>setCondition('e')}/>equals</label>
                        <label className="radio-inline"><input type="radio" value="" checked={condition.charAt(0) == 'm'} onChange={()=>setCondition('m')}/>match</label>
                        <label className="radio-inline"><input type="radio" value="" checked={condition.charAt(0) == 'x'} onChange={()=>setCondition('x')}/>match XPath/JSONPath</label><br/> <br/>
                          <h4><span class="label label-info">Value</span></h4>
                          <hr/>
                          <ValueInput/><br/> <br/>
                      </div>
                    </form>
                  </div>
                  <div className="react-modal-footer">
                    <Button title="Valider"  disabled={((modifyingRule["Label"] === "Headers" && header==="") || value==="")} onClick={() => {dispatchRule(flow.id, modifyingRule);validateRule(flow.id,modifyingRule)}}>
                        VALIDER
                    </Button>
                    <Button title="Annuler" onClick={() => cancelModifyRule()}>
                        ANNULER
                    </Button>
                  </div>
                </div>
              </ReactModal>
            }
          </article>
      </section>
    )
  }


export default connect(
      state => ({
          flow: state.ui.flow.modifiedFlow || state.flows.byId[state.flows.selected[0]],
          isEdit: !!state.ui.flow.modifiedFlow,
          matcher: state.flows.RuleById[state.flows.selected[0]],
          selectedMatcher: state.ui.flow.selectedMatcher,
          selectedHeaders: state.ui.flow.selectedMatcher["Headers"],
          selectedContent: state.ui.flow.selectedMatcher["Content"],
          selectedURI: state.ui.flow.selectedMatcher["URI"],
          modifyingRule: state.ui.flow.modifyRule,
          header: state.ui.flow.modifyRule["Header"],
          condition: state.ui.flow.modifyRule["Condition"],
          value: state.ui.flow.modifyRule["Value"]
      }),
      {
          updateFlow: UIActions.updateEdit,
          uploadContent: FlowActions.uploadContent,
          selectRule: UIActions.selectRule,
          cancelModifyRule: UIActions.cancelModify,
          setCondition: UIActions.setCondition,
          validateRule: UIActions.validateRule,
          dispatchRule: FlowActions.dispatchRule

      }
  )(MatchingView)
