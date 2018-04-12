import stable from 'stable'

export const SET_FILTER = 'LIST_SET_FILTER'
export const SET_SORT = 'LIST_SET_SORT'
export const ADD = 'LIST_ADD'
export const UPDATE = 'LIST_UPDATE'
export const MATCHER_UPDATE = 'MATCHER_UPDATE'
export const REMOVE = 'LIST_REMOVE'
export const RECEIVE = 'LIST_RECEIVE'
export const CHANGE = 'CHANGE_SCEN'
export const DELETE = 'DELETE_SCEN'
export const COPY   = 'COPY_SCEN'
export const RULE_UPDATE = 'RULE_UPDATE'
export const RULE_UP = 'RULE_UP'
export const RULE_DOWN = 'RULE_DOWN'
export const RULE_DELETE = 'RULE_DELETE'

const defaultState = {
    byId: {},
    RuleById: {},
    list: [],
    listIndex: {},
    view: [],
    viewIndex: {},
    scenarios: {},
    scenario: ""
}


/**
 * The store reducer can be used as a mixin to another reducer that always returns a
 * new { byId, list, listIndex, view, viewIndex } object. The reducer using the store
 * usually has to map its action to the matching store action and then call the mixin with that.
 *
 * Example Usage:
 *
 *      import reduceStore, * as storeActions from "./utils/store"
 *
 *      case EVENTLOG_ADD:
 *          return {
 *              ...state,
 *              ...reduceStore(state, storeActions.add(action.data))
 *          }
 *
 */
export default function reduce(state = defaultState, action) {

    let { byId, RuleById, list, listIndex, view, viewIndex, scenario, scenarios } = state

    if(scenario != "" || action.type == CHANGE || action.type == RECEIVE){
      switch (action.type) {
          case SET_FILTER:
              view = stable(list.filter(action.filter), action.sort)
              viewIndex = {}
              view.forEach((item, index) => {
                  viewIndex[item.id] = index
              })
              break

          case SET_SORT:
              view = stable([...view], action.sort)
              viewIndex = {}
              view.forEach((item, index) => {
                  viewIndex[item.id] = index
              })
              break

          case ADD:
              if (action.item.id in byId) {
                  // we already had that.
                  break
              }
              byId = { ...byId, [action.item.id]: action.item }
              RuleById = {...RuleById, [action.item.id]: {
                "Headers" : [],
                "Content" : [],
                "URI" : []
              }}
              listIndex = { ...listIndex, [action.item.id]: list.length }
              list = [...list, action.item]
              if (action.filter(action.item)) {
                  ({ view, viewIndex } = sortedInsert(state, action.item, action.sort))
              }
              break

          case UPDATE:
              byId = { ...byId, [action.item.id]: action.item }
              list = [...list]
              list[listIndex[action.item.id]] = action.item

              let hasOldItem = action.item.id in viewIndex
              let hasNewItem = action.filter(action.item)
              if (hasNewItem && !hasOldItem) {
                  ({view, viewIndex} = sortedInsert(state, action.item, action.sort))
              }
              else if (!hasNewItem && hasOldItem) {
                  ({data: view, dataIndex: viewIndex} = removeData(view, viewIndex, action.item.id))
              }
              else if (hasNewItem && hasOldItem) {
                  ({view, viewIndex} = sortedUpdate(state, action.item, action.sort))
              }
              break

          case MATCHER_UPDATE:
              for(var key in action.item){
                RuleById = {...RuleById, [key]: action.item[key]}
              }
              break

          case RULE_UPDATE:
              console.log(action.rule)
              let label = action.rule["Label"]
              delete action.rule["Label"]
              let RuleIndex = action.rule["Index"]
              delete action.rule["Index"]
              if(RuleIndex === -1){
                RuleById[action.id][label].push(action.rule)
              }else{
                RuleById[action.id][label][RuleIndex] = action.rule
              }
              break

          case RULE_UP:
              if(action.index > 0){
                let tmpRule = RuleById[action.id][action.label][action.index]
                RuleById[action.id][action.label][action.index] = RuleById[action.id][action.label][action.index-1]
                RuleById[action.id][action.label][action.index-1] = tmpRule
              }
              break

          case RULE_DOWN:
              if(action.index < RuleById[action.id][action.label].length-1){
                let tmpRule = RuleById[action.id][action.label][action.index]
                RuleById[action.id][action.label][action.index] = RuleById[action.id][action.label][action.index+1]
                RuleById[action.id][action.label][action.index+1] = tmpRule
              }
              break

          case RULE_DELETE:
              RuleById[action.id][action.label].splice(action.index,1)
              break

          case REMOVE:
              if (!(action.id in byId)) {
                  break
              }
              byId = {...byId}
              delete byId[action.id];
              RuleById = {...RuleById}
              delete RuleById[action.id];
              ({data: list, dataIndex: listIndex} = removeData(list, listIndex, action.id))

              if (action.id in viewIndex) {
                  ({data: view, dataIndex: viewIndex} = removeData(view, viewIndex, action.id))
              }
              break

          case RECEIVE:
              if( typeof action.list[action.list.length-1] === "string")
                scenario = action.list.pop()
              list = []
              listIndex = {}
              byId = {}
              RuleById = {}
              view = []
              viewIndex = {}
              action.list.forEach((item, i) => {
                if(item instanceof Array){
                  if(typeof item[0].scenario != "undefined" && !(item[0].scenario in scenarios))
                    scenarios[item[0].scenario] = {
                        byId: {},
                        RuleById: {},
                        list: [],
                        listIndex: {},
                        view: [],
                        viewIndex: {},
                    }
                  if(item[0].scenario === scenario && !(item[0].id in Object.keys(byId))){
                    list.push(item[0])
                    view.push(item[0])
                    byId[item[0].id] = item[0]
                    RuleById[item[0].id] = item[1]
                    listIndex[item[0].id] = i
                    viewIndex[item[0].id] = i
                  }else if (typeof item[0].scenario != "undefined" && !(item[0].id in Object.keys(scenarios[item[0].scenario].byId))){
                    scenarios[item[0].scenario].list.push(item[0])
                    scenarios[item[0].scenario].view.push(item[0])
                    scenarios[item[0].scenario].byId[item[0].id] = item[0]
                    scenarios[item[0].scenario].RuleById[item[0].id] = item[1]
                    scenarios[item[0].scenario].listIndex[item[0].id] = i
                    scenarios[item[0].scenario].viewIndex[item[0].id] = i
                  }
                }
              })
              break
          case CHANGE:
              scenario = action.scenario
              if(!(action.scenario in scenarios))
                scenarios[action.scenario] = {
                    byId: {},
                    RuleById: {},
                    list: [],
                    listIndex: {},
                    view: [],
                    viewIndex: {}
                }
              byId = scenarios[action.scenario].byId
              RuleById = scenarios[action.scenario].RuleById
              list = scenarios[action.scenario].list
              listIndex = scenarios[action.scenario].listIndex
              view = scenarios[action.scenario].view
              viewIndex = scenarios[action.scenario].viewIndex
              break
        case DELETE:
          let keys = Object.keys(scenarios)
          let index = keys.indexOf(action.scenario)
          if(keys.length == 1){
            scenario = ""
            byId = {}
            RuleById: {}
            list = []
            listIndex = {}
            view = []
            viewIndex = {}
          }else{
            index ? scenario = keys[index-1] :   scenario = keys[index+1]
            byId = scenarios[scenario].byId
            RuleById = scenarios[scenario].RuleById
            list = scenarios[scenario].list
            listIndex =  scenarios[scenario].listIndex
            view = scenarios[scenario].view
            viewIndex = scenarios[scenario].viewIndex
          }
          delete scenarios[action.scenario]
          break

        case COPY:
          scenarios[action.scenario] = scenarios[scenario]
          delete scenarios[scenario]
          scenario = action.scenario
          break
      }
      if(scenario != ""){
        scenarios[scenario] = {
            byId: byId,
            RuleById: RuleById,
            list: list,
            listIndex: listIndex,
            view: view,
            viewIndex: viewIndex,
        }
      }
    }
    return { byId, RuleById, list, listIndex, view, viewIndex, scenario, scenarios }
}


export function setFilter(filter = defaultFilter, sort = defaultSort) {
    return { type: SET_FILTER, filter, sort }
}

export function setSort(sort = defaultSort) {
    return { type: SET_SORT, sort }
}

export function add(item, filter = defaultFilter, sort = defaultSort) {
    return { type: ADD, item, filter, sort }
}

export function update(item, filter = defaultFilter, sort = defaultSort) {
    return { type: UPDATE, item, filter, sort }
}

export function updater(item, filter = defaultFilter, sort = defaultSort){
  return { type: MATCHER_UPDATE, item, filter, sort}
}

export function remove(id) {
    return { type: REMOVE, id }
}

export function receive(list, filter = defaultFilter, sort = defaultSort) {
    return { type: RECEIVE, list, filter, sort }
}

export function change(scenario){
  return {type: CHANGE, scenario}
}

export function deleteScen(scenario){
  return {type: DELETE, scenario}
}

export function copyScen(scenario){
  return {type: COPY, scenario}
}

export function updateRule(id, rule){
  return {type: RULE_UPDATE, id, rule}
}

export function upRule(label, index, id){
  return {type: RULE_UP, id, label, index}
}

export function downRule(label, index, id){
  return {type: RULE_DOWN, id, label, index}
}

export function deleteRule(label, index, id){
  return {type: RULE_DELETE, id, label, index}
}

function sortedInsert(state, item, sort) {
    const index = sortedIndex(state.view, item, sort)
    const view = [...state.view]
    const viewIndex = { ...state.viewIndex }

    view.splice(index, 0, item)
    for (let i = view.length - 1; i >= index; i--) {
        viewIndex[view[i].id] = i
    }

    return { view, viewIndex }
}

function removeData(currentData, currentDataIndex, id) {
    const index = currentDataIndex[id]
    const data = [...currentData]
    const dataIndex = { ...currentDataIndex }
    delete dataIndex[id];

    data.splice(index, 1)
    for (let i = data.length - 1; i >= index; i--) {
        dataIndex[data[i].id] = i
    }

    return { data, dataIndex }
}

function sortedUpdate(state, item, sort) {
    let view = [...state.view]
    let viewIndex = { ...state.viewIndex }
    let index = viewIndex[item.id]
    view[index] = item
    while (index + 1 < view.length && sort(view[index], view[index + 1]) > 0) {
        view[index] = view[index + 1]
        view[index + 1] = item
        viewIndex[item.id] = index + 1
        viewIndex[view[index].id] = index
        ++index
    }
    while (index > 0 && sort(view[index], view[index - 1]) < 0) {
        view[index] = view[index - 1]
        view[index - 1] = item
        viewIndex[item.id] = index - 1
        viewIndex[view[index].id] = index
        --index
    }
    return { view, viewIndex }
}

function sortedIndex(list, item, sort) {
    let low = 0
    let high = list.length

    while (low < high) {
        const middle = (low + high) >>> 1
        if (sort(item, list[middle]) >= 0) {
            low = middle + 1
        } else {
            high = middle
        }
    }

    return low
}

function defaultFilter() {
    return true
}

function defaultSort(a, b) {
    return 0
}
