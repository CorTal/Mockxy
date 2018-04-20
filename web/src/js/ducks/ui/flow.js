import * as flowsActions from '../flows'
import { getDiff } from "../../utils"
import ReactModal from "react-modal"

import _ from 'lodash'

export const SET_CONTENT_VIEW               = 'UI_FLOWVIEW_SET_CONTENT_VIEW',
             DISPLAY_LARGE                  = 'UI_FLOWVIEW_DISPLAY_LARGE',
             SET_TAB                        = "UI_FLOWVIEW_SET_TAB",
             START_EDIT                     = 'UI_FLOWVIEW_START_EDIT',
             UPDATE_EDIT                    = 'UI_FLOWVIEW_UPDATE_EDIT',
             UPLOAD_CONTENT                 = 'UI_FLOWVIEW_UPLOAD_CONTENT',
             SET_SHOW_FULL_CONTENT          = 'UI_SET_SHOW_FULL_CONTENT',
             SET_CONTENT_VIEW_DESCRIPTION   = "UI_SET_CONTENT_VIEW_DESCRIPTION",
             SET_CONTENT                    = "UI_SET_CONTENT",
             SELECT_RULE                    = "UI_SELECT_RULE",
             ADD_RULE                       = "UI_ADD_RULE",
             DELETE_RULE                    = "UI_DELETE_RULE",
             EDIT_RULE                      = "UI_EDIT_RULE",
             UP_RULE                        = "UI_UP_RULE",
             DOWN_RULE                      = "UI_DOWN_RULE",
             CANCEL_MODIFY                  = "UI_CANCEL_MODIFY",
             SET_HEADER                     = "UI_SET_HEADER",
             SET_CONDITION                  = "UI_SET_CONDITION",
             SET_VALUE                      = "UI_SET_VALUE",
             VALIDATE_RULE                  = "UI_VALIDATE_RULE"



const defaultState = {
    displayLarge: false,
    viewDescription: '',
    showFullContent: false,
    modifiedFlow: false,
    contentView: 'Auto',
    tab: 'request',
    content: [],
    maxContentLines: 80,
    selectedMatcher: {"Headers": false, "Content": false, "URI": false},
    modifyRule: false
}

export default function reducer(state = defaultState, action) {
    let wasInEditMode = state.modifiedFlow

    let content = action.content || state.content
    let isFullContentShown = content && content.length <= state.maxContentLines

    switch (action.type) {

        case START_EDIT:
            return {
                ...state,
                modifiedFlow: action.flow,
                contentView: 'Edit',
                showFullContent: true
            }

        case UPDATE_EDIT:
            return {
                ...state,
                modifiedFlow: _.merge({}, state.modifiedFlow, action.update)
            }

        case flowsActions.SELECT:
            return {
                ...state,
                modifiedFlow: false,
                displayLarge: false,
                contentView: (wasInEditMode ? 'Auto' : state.contentView),
                showFullContent: isFullContentShown,
                selectedMatcher: {"Headers": false, "Content": false, "URI": false}
            }

        case flowsActions.UPDATE:
            // There is no explicit "stop edit" event.
            // We stop editing when we receive an update for
            // the currently edited flow from the server
            if (action.data.id === state.modifiedFlow.id) {
                return {
                    ...state,
                    modifiedFlow: false,
                    displayLarge: false,
                    contentView: (wasInEditMode ? 'Auto' : state.contentView),
                    showFullContent: false,
                    selectedMatcher: {"Headers": false, "Content": false, "URI": false}
                }
            } else {
                return state
            }

        case flowsActions.RULE_UPDATE:

          return{
            ...state,
            modifyRule: false
          }

        case flowsActions.RULE_UP:
          if(state.selectedMatcher[action.label] > 0) state.selectedMatcher[action.label] = state.selectedMatcher[action.label]-1
          return {...state}
        case flowsActions.RULE_DOWN:
          if(state.selectedMatcher[action.label] < action.rulesLength-1) state.selectedMatcher[action.label] = state.selectedMatcher[action.label]+1
          return {...state}
        case flowsActions.RULE_DELETE:
          if(state.selectedMatcher[action.label] === 0){
            if(action.rulesLength > 1){
              state.selectedMatcher[action.label] = state.selectedMatcher[action.label]+1
            }else{
              state.selectedMatcher[action.label] = false
            }
          }else{
            state.selectedMatcher[action.label] = state.selectedMatcher[action.label]-1
          }
          return {...state}

        case SET_CONTENT_VIEW_DESCRIPTION:
            return {
                ...state,
                viewDescription: action.description
            }

        case SET_SHOW_FULL_CONTENT:
            return {
                ...state,
                showFullContent: true
            }

        case SET_TAB:
            return {
                ...state,
                tab: action.tab ? action.tab : 'request',
                displayLarge: false,
                showFullContent: state.contentView === 'Edit'
            }

        case SET_CONTENT_VIEW:
            return {
                ...state,
                contentView: action.contentView,
                showFullContent: action.contentView === 'Edit'
            }

        case SET_CONTENT:
            return {
                ...state,
                content: action.content,
                showFullContent: isFullContentShown
            }

        case SET_VALUE:
          state.modifyRule["Value"] = action.value
          return{
            ...state
          }
        case SET_HEADER:
          state.modifyRule["Header"] = action.header
          return {
            ...state
          }
        case SET_CONDITION:
          let modRule = state.modifyRule
          if(action.condition == 'n'){
            if(modRule["Condition"].endsWith('n')){
              modRule["Condition"] = modRule["Condition"].slice(0,-1)
            }else{
              modRule["Condition"] += 'n'
            }
          }else{
            modRule["Condition"] = modRule["Condition"].replace(modRule["Condition"][0],action.condition)
          }
          return {
            ...state,
            modifyRule: modRule
          }
        case DISPLAY_LARGE:
            return {
                ...state,
                displayLarge: true,
            }

        case SELECT_RULE:
            let tmpSelectedMatcher = state.selectedMatcher
            tmpSelectedMatcher[action.rules] = action.index
            return {
              ...state,
              selectedMatcher: tmpSelectedMatcher,
            }

        case ADD_RULE:
          state.selectedMatcher[action.rules] = false
          return{
            ...state,
            modifyRule: {"Header":"","Condition":"c","Value":"", "Label":action.rules, "Index": -1}
          }
        case DELETE_RULE:
          return{
            ...state,
            modifyRule: true
          }
        case EDIT_RULE:
          state.modifyRule = action.matcher[action.rules][action.index]
          state.modifyRule["Label"] = action.rules
          state.modifyRule["Index"] = action.index
          return{
            ...state
          }
        case CANCEL_MODIFY:
          return{
            ...state,
            modifyRule: false
          }

        default:
            return state
    }
}

export function setContentView(contentView) {
    return { type: SET_CONTENT_VIEW, contentView }
}

export function displayLarge() {
    return { type: DISPLAY_LARGE }
}

export function selectTab(tab) {
    return { type: SET_TAB, tab }
}

export function startEdit(flow) {
    ReactModal.setAppElement('#mitmproxy')
    return { type: START_EDIT, flow }
}

export function updateEdit(update) {
    return { type: UPDATE_EDIT, update }
}

export function setContentViewDescription(description) {
    return { type: SET_CONTENT_VIEW_DESCRIPTION, description }
}

export function setShowFullContent() {
    return { type: SET_SHOW_FULL_CONTENT }
}

export function setContent(content){
    return { type: SET_CONTENT, content }
}

export function stopEdit(flow, modifiedFlow) {
    return flowsActions.update(flow, getDiff(flow, modifiedFlow))
}

export function selectRule(rules, index){
  return { type: SELECT_RULE, rules, index}
}

export function addRule(rules){

  return {type: ADD_RULE, rules}
}

export function deleteRule(rules, index, flowId, rulesLength){
  return flowsActions.deleteRule(rules, index, flowId, rulesLength)
}

export function upRule(rules, index, flowId, rulesLength){
  return flowsActions.upRule(rules, index, flowId, rulesLength)
}

export function downRule(rules, index, flowId, rulesLength){
  return flowsActions.downRule(rules, index, flowId, rulesLength)
}

export function editRule(rules, index, matcher){
  return {type: EDIT_RULE, rules, index, matcher}
}

export function validateRule(id, rule){
  return flowsActions.updateRule(id, rule)
}





export function cancelModify(){
  return {type: CANCEL_MODIFY}
}

export function setHeader(header){
  return {type: SET_HEADER, header}
}

export function setCondition(condition){
  return {type: SET_CONDITION, condition}
}

export function setValue(value){
  return {type: SET_VALUE, value}
}
