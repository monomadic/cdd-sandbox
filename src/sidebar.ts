import { DOM } from "./dom";

let modelsSelector = ".sidebar--items.models";
let requestsSelector = ".sidebar--items.requests";

export module Sidebar {
  export function update(state) {
    addModels(state.project.models);
    addRequests(state.project.requests);
  }

  export function addRequests(requests) {
    let requestsContainer = document.querySelector(requestsSelector);
    requestsContainer.textContent = "";

    for (let request of requests) {
      var el = DOM.createElement(
        "div",
        ["selectable-item", "request"],
        document.createTextNode(`${request.method} ${request.path}`)
      );
      requestsContainer.appendChild(el);
    }
  }

  export function addModels(models) {
    let modelsContainer = document.querySelector(modelsSelector);
    modelsContainer.textContent = "";

    for (let model of models) {
      var el = DOM.createElement(
        "div",
        ["selectable-item", "model"],
        // document.createTextNode(model["name"])
        document.createTextNode(model.name)
      );
      for (let variable of model.vars || []) {
        el.appendChild(
          DOM.createElement(
            "div",
            ["model-member"],
            document.createTextNode(`${variable.name}: ${variable.type}`)
          )
        );
      }

      modelsContainer.appendChild(el);
    }
  }
}
