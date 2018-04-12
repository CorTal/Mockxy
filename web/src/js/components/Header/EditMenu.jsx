import React from "react"
import ReactModal from "react-modal"
import PropTypes from 'prop-types'
import { connect } from "react-redux"
import Button from "../common/Button"
import Input from "../common/Input"
import FileChooser from '../common/FileChooser'
import DocsLink from "../common/DocsLink"
import HideInStatic from "../common/HideInStatic";
import * as modalActions from "../../ducks/ui/modal"
import * as editActions from "../../ducks/edit"
import * as flowsActions from "../../ducks/flows"

EditMenu.title = 'Edit'

EditMenu.propTypes = {
    learning: PropTypes.bool.isRequired,
    renaming: PropTypes.bool.isRequired,
    showModal: PropTypes.bool.isRequired,
    scenarios: PropTypes.array.isRequired,
    scenario: PropTypes.string.isRequired,
    tmpScen: PropTypes.string.isRequired,
    bouchon: PropTypes.bool.isRequired,
    flow: PropTypes.object
}

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};
function EditMenu({openEdit,
  learningAction,
  learning,
  switchLearning,
  showModal,
  modalClosed,
  handleChange,
  scenario,
  scenarios,
  selectTab,
  changeScenPY,
  tmpScen,
  validateScen,
  deleteTab,
  removeScenPY,
  dumpScen,
  loadFlows,
  renameAction,
  renaming,
  copyTab,
  copyScenPY,
  bouchon,
  switchBouchonMode,
  switchBouchonModePY,
  flow,
  removeFlow,
  duplicateFlow}) {
  return (
      <div>
        <HideInStatic>
          {!bouchon &&
          <div className="menu-group">
              <div className="menu-content">
                  <Button title={learning ? "Stop" : "Start"} icon={learning ? "fa-times text-primary" : "fa-play text-primary"}
                          onClick={() => {learningAction(); switchLearning()}}>
                      {learning ? "Arrêter" : "Commencer"}
                  </Button>

                  {(!learning && (scenario != "")) &&
                    <Button title="Sauvegarder" icon="fa-download" onClick={() => dumpScen()}>Sauvegarder</Button>
                  }
                  {(!learning && (scenario != ""))  &&
                  <Button title="Supprimer scénario" icon="fa-trash" onClick={() => {;deleteTab(scenario);removeScenPY(scenario)}}>Supprimer</Button>
                  }
                  {(!learning && (scenario != ""))  &&
                  <Button title="Renommer scénario" icon="fa-pencil" onClick={() => renameAction()}>Renommer</Button>
                  }
                  {!learning &&
                    <FileChooser
                        icon="fa-folder-open"
                        text="&nbsp;Open..."
                        onOpenFile={file => {file.name.endsWith(".fl") && selectTab(file.name.slice(0,file.name.indexOf(".fl")));
                                            file.name.endsWith(".fl") && changeScenPY(file.name.slice(0,file.name.indexOf(".fl")));
                                            file.name.endsWith(".fl") && loadFlows(file)}}
                    />}


                  <ReactModal
                    isOpen={showModal || renaming}
                    style={customStyles}
                    contentLabel='Choisissez le nom du scénario'>
                    <div className="react-modal-dialog">
                      <div className="react-modal-header">
                        <div className="title">Nom du scénario :</div>
                      </div>
                      <div className="react-modal-body">
                        <ScenInput/>
                      </div>
                      <div className="react-modal-footer">
                        <Button title="Valider" disabled={tmpScen == "" || scenarios.indexOf(tmpScen) > -1} onClick={() => {
                            if(showModal){
                              validateScen(tmpScen);
                              modalClosed();
                              selectTab(tmpScen);
                              changeScenPY(tmpScen)
                            }else{
                              copyTab(tmpScen);
                              modalClosed();
                              copyScenPY(tmpScen)
                            }}}>
                            VALIDER
                        </Button>
                        <Button title="Annuler" onClick={() => modalClosed()}>
                            ANNULER
                        </Button>
                      </div>
                    </div>
                  </ReactModal>
              </div>
              <div className="menu-legend">Scenario</div>
          </div>
          }
          { (flow && (scenario != "") && !learning && !bouchon) &&
            <div className="menu-group">
              <div className="menu-content">
                  <Button title="[D]uplicate flow" icon="fa-copy text-info" readonly
                          onClick={() => duplicateFlow(flow)}>
                      Duplicate
                  </Button>
                  <Button title="[d]elete flow" icon="fa-trash text-danger" readonly
                          onClick={() => removeFlow(flow)}>
                      Delete
                  </Button>
              </div>
              <div className="menu-legend">Flow Modification</div>
            </div>
          }

          {(!learning && (scenario != ""))  &&
          <div className="menu-group">
            <div className="menu-content">
              <Button title="Bouchonner" icon={bouchon ? "fa-stop" : "fa-forward"} onClick={() => {switchBouchonMode();switchBouchonModePY()}}>{bouchon ? "Stop" : "Bouchonner"}</Button>
            </div>
            <div className="menu-legend">Mock</div>
          </div>
        }


      </HideInStatic>
    </div>
  )
}

const ScenInput = connect(
    state => ({
        tmpScen: state.edit.tmpScen || ''
    }),
    { onChange: editActions.handleChange }
)(Input);

export default connect(
    state => ({
      learning: state.edit.learning,
      showModal: state.edit.showModal,
      scenario: state.flows.scenario,
      scenarios: Object.keys(state.flows.scenarios),
      tmpScen: state.edit.tmpScen,
      renaming: state.edit.renaming,
      bouchon: state.edit.bouchon,
      flow: state.flows.byId[state.flows.selected[0]],
    }),
    {
      openEdit: () => modalActions.setActiveModal('EditModal'),
      learningAction: editActions.learningAction,
      modalClosed: editActions.modalClosed,
      handleChange: editActions.handleChange,
      selectTab: flowsActions.selectTab,
      changeScenPY: flowsActions.changeScenario,
      validateScen: editActions.validateScen,
      deleteTab: flowsActions.deleteTab,
      removeScenPY: flowsActions.removeScen,
      dumpScen: flowsActions.download,
      loadFlows: flowsActions.upload,
      renameAction: editActions.renameAction,
      copyTab: flowsActions.copyTab,
      copyScenPY: flowsActions.copyScen,
      switchBouchonMode: editActions.switchBouchonMode,
      switchBouchonModePY: flowsActions.switchBouchonMode,
      switchLearning: flowsActions.switchLearning,
      removeFlow: flowsActions.remove,
      duplicateFlow: flowsActions.duplicate
    }
)(EditMenu)
