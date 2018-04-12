import ReactModal from "react-modal"
import {selectTab} from "./flows"

export const LEARNING_ACTION            = 'LEARNING_ACTION'
export const HANDLE_CHANGE              = 'HANDLE_CHANGE'
export const MODAL_CLOSED               = 'MODAL_CLOSED'
export const SWITCH_SCEN                = 'SWITCH_SCEN'
export const VALIDATE_SCEN              = 'VALIDATE_SCEN'
export const REMOVE_SCEN                = 'REMOVE_SCEN'
export const RENAME_ACTION              = 'RENAME_ACTION'
export const SWITCH_BOUCHON             = 'SWITCH_BOUCHON'

const defaultState = {learning: false,
                      tmpScen: "",
                      showModal: false,
                      renaming: false,
                      bouchon: false}

export default function reduce(state = defaultState, action) {
  switch(action.type){
    case LEARNING_ACTION:
        state.learning ? state.learning = !state.learning : state.showModal = !state.showModal
        return {...state}
    case MODAL_CLOSED :
        return {...state,
                showModal: false,
                renaming: false,
                tmpScen: ""}
    case HANDLE_CHANGE:
      return {...state,
              tmpScen: action.scenario}

    case VALIDATE_SCEN:
      return {...state,
              learning: action.learning}
    case RENAME_ACTION:
      return{...state,
              renaming: true}
    case SWITCH_BOUCHON:
      state.bouchon = !state.bouchon
      return {...state}
    default:
        return state
  }
}

export function learningAction(){
  ReactModal.setAppElement('#mitmproxy')
  return {type : LEARNING_ACTION}
}

export function renameAction(){
  ReactModal.setAppElement('#mitmproxy')
  return {type: RENAME_ACTION}
}
export function modalClosed(){
  return {type : MODAL_CLOSED}
  }

export function validateScen(scen){
  return {type: VALIDATE_SCEN,
          learning: true,
          scenario: scen}
}
export function handleChange(scen){
  return {type : HANDLE_CHANGE,
          scenario: scen}
  }

export function switchScen(scen){
  return {type : SWITCH_SCEN,
          scenario: scen}
}

export function removeScen(){
  return {type: REMOVE_SCEN}
}

export function switchBouchonMode(){
  return {type: SWITCH_BOUCHON}
}
