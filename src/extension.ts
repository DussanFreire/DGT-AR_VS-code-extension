"use strict";
import * as vscode from "vscode";
import { DepNodeProvider, Dependency } from "./nodeDependencies";
import { JsonOutlineProvider } from "./jsonOutline";
import { FtpExplorer } from "./ftpExplorer";
import { FileExplorer } from "./fileExplorer";
import { TestViewDragAndDrop } from "./testViewDragAndDrop";
import { TestView } from "./testView";
export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("codeGraph.start", () => {
      // Create and show panel
      const panel = vscode.window.createWebviewPanel(
        "Code Graph",
        "Code Graph",
        vscode.ViewColumn.One,
        {
          enableScripts: true,
        }
      );
      panel.webview.html = getWebviewContent();
    })
  );

  const rootPath =
    vscode.workspace.workspaceFolders &&
    vscode.workspace.workspaceFolders.length > 0
      ? vscode.workspace.workspaceFolders[0].uri.fsPath
      : undefined;

  // Samples of `window.registerTreeDataProvider`
  const nodeDependenciesProvider = new DepNodeProvider(rootPath);
  vscode.window.registerTreeDataProvider(
    "nodeDependencies",
    nodeDependenciesProvider
  );
  vscode.commands.registerCommand("nodeDependencies.refreshEntry", () =>
    nodeDependenciesProvider.refresh()
  );
  vscode.commands.registerCommand("extension.openPackageOnNpm", (moduleName) =>
    vscode.commands.executeCommand(
      "vscode.open",
      vscode.Uri.parse(`https://www.npmjs.com/package/${moduleName}`)
    )
  );
  vscode.commands.registerCommand("nodeDependencies.addEntry", () =>
    vscode.window.showInformationMessage(`Successfully called add entry.`)
  );
  vscode.commands.registerCommand(
    "nodeDependencies.editEntry",
    (node: Dependency) =>
      vscode.window.showInformationMessage(
        `Successfully called edit entry on ${node.label}.`
      )
  );
  vscode.commands.registerCommand(
    "nodeDependencies.deleteEntry",
    (node: Dependency) =>
      vscode.window.showInformationMessage(
        `Successfully called delete entry on ${node.label}.`
      )
  );

  const jsonOutlineProvider = new JsonOutlineProvider(context);
  vscode.window.registerTreeDataProvider("jsonOutline", jsonOutlineProvider);
  vscode.commands.registerCommand("jsonOutline.refresh", () =>
    jsonOutlineProvider.refresh()
  );
  vscode.commands.registerCommand("jsonOutline.refreshNode", (offset) =>
    jsonOutlineProvider.refresh(offset)
  );
  vscode.commands.registerCommand("jsonOutline.renameNode", (args) => {
    let offset = undefined;
    if (args.selectedTreeItems && args.selectedTreeItems.length) {
      offset = args.selectedTreeItems[0];
    } else if (typeof args === "number") {
      offset = args;
    }
    if (offset) {
      jsonOutlineProvider.rename(offset);
    }
  });
  vscode.commands.registerCommand("extension.openJsonSelection", (range) =>
    jsonOutlineProvider.select(range)
  );

  // Samples of `window.createView`
  new FtpExplorer(context);
  new FileExplorer(context);

  // Test View
  new TestView(context);

  // Drag and Drop proposed API sample
  // This check is for older versions of VS Code that don't have the most up-to-date tree drag and drop API proposal.
  if (typeof vscode.DataTransferItem === "function") {
    new TestViewDragAndDrop(context);
  }
}


function getCssStyle(): string {
  return `
    <style>
    .button.filter-button{
      margin: 0px 10px 10px 0px;
    }
    .button-tools{
      display: flex;
      flex-flow: row nowrap;
      margin: 0px 10px;
    }
    .button-controls{
      width: 55%;
    }
    .buttons-container{
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      align-content: flex-start;
      justify-content: flex-start;
    }

    .buttons-section{
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: space-between;
    }
    .button-filters{
      width: 100%;
    }

    .card-controls.button-filters{
      margin-left:15px;
    }
    .button {
      background-color: #DCE5DF;
      border:3px solid #DCE5DF;
      max-height: 50px !important;
      border-radius: 10px;
      color: #122D42;
      padding: 20px 40px;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      font-size: 30px;
      margin: 4px 2px;
      white-space: nowrap;
      cursor: pointer;
      width: fit-content;
      transition-duration: 0.4s;
    }

    .button:hover {
      color: #122D42 !important;
      transform:scale(1.05,1.05);
      border-color: #E1BC29;
      background-color: #E1BC29;
    }
    .spinner-center{
      display: flex;
      justify-content: center;
      align-content: center;
      height: 75%;
      flex-direction: column;
      flex-wrap: wrap;  
      text-align:center;
      color:black;      
    }
    h1{
      margin-bottom:5px;
      margin-top:2.5px;
    }
    .composed-button{
      display: flex;
      flex-flow: row nowrap;
      text-align: center;
      align-items: center;
    }

    .composed-button.composed-button-big  {
      margin: 0px 10px 2.5px 0px;
    }

    .icon-button.composed-button-big {
      padding: 5px 20px;
    }

    .filter-circle{
      width: 30px;
      height: 30px;
      margin: 5px;
      border-radius: 50px;
      border:1px solid grey
    }
    p.filter-name {
      padding-bottom:3px;
      padding-right:5px;
    }
    p.icon-text {
      padding-right:5px;
    }
  

    .task-container{
      margin:10px;
    }
    .build-header{
      margin-left:10px;
    }
    .button-container{
      width:100%;
      height: 100%;
    }

   
    .card-controls{
      padding:10px;
      margin: 10px 0px;
      border-radius: 10px;
      background-color:white;
    }
    h2.cart-title{
      color: #122D42;
      margin: 0px 0px 15px 0px;
    }
    .card-subtitle{
      margin: 0px;
      color: #122D42;
    }
    .card-controls span.material-icons{
      color: #E15554 !important;
    }

    .card-controls span.material-icons{
      color: #E15554 !important;
    }
    .special-button  span.material-icons{
      color: #E15554 !important;
    }

    #reload-experiment-btn  span.material-icons{
      color: #E15554 !important;
    }

    .icon-button  span.material-icons{
      padding-top: 2px; 
    }

    #snackbar-ok {
      visibility: hidden;
      min-width: 250px;
      margin-left: -125px;
      background-color: #3BB273;
      color: #fff;
      text-align: center;
      border-radius: 15px;
      padding: 0 16px;
      position: fixed;
      z-index: 2;
      left: 50%;
      bottom: 30px;
      font-size: 17px;
    }
    #snackbar-wrong {
      visibility: hidden;
      min-width: 250px;
      margin-left: -125px;
      background-color: #333;
      color: #fff;
      background-color: #E15554;
      text-align: center;
      border-radius: 15px;
      padding: 0 16px;
      position: fixed;
      z-index: 2;
      left: 50%;
      bottom: 30px;
      font-size: 17px;
    }
    
    #snackbar-ok.show {
      visibility: visible;
      -webkit-animation: fadein 0.5s, fadeout 0.5s 2.5s;
      animation: fadein 0.5s, fadeout 0.5s 2.5s;
    }

    #snackbar-wrong.show {
      visibility: visible;
      -webkit-animation: fadein 0.5s, fadeout 0.5s 2.5s;
      animation: fadein 0.5s, fadeout 0.5s 2.5s;
    }
    
    @-webkit-keyframes fadein {
      from {bottom: 0; opacity: 0;} 
      to {bottom: 30px; opacity: 1;}
    }
    
    @keyframes fadein {
      from {bottom: 0; opacity: 0;}
      to {bottom: 30px; opacity: 1;}
    }
    
    @-webkit-keyframes fadeout {
      from {bottom: 30px; opacity: 1;} 
      to {bottom: 0; opacity: 0;}
    }
    
    @keyframes fadeout {
      from {bottom: 30px; opacity: 1;}
      to {bottom: 0; opacity: 0;}
    }


    </style>
  `;
}

function getHTML(): string {
  return `
  <body>
  <div id="experiment-container">
    <h1 class="build-header">
      Graph interactions<span class="material-icons">build</span>
    </h1>

    <div class="button-tools">
      <div class="card-controls button-filters">
        <div class="button-container">
          <h2 class="cart-title">
            Folder highlighting
            <span class="material-icons">filter_alt</span>
          </h2>
          <div class="buttons-container" id="button-container"></div>
        </div>
      </div>
    </div>
  </div>
</body>`;
}

function getScript(): string {
  return `
  <script>
  let effort=5;
  let currentFilter = "";
  let dataSetfilters = [];
  let tasks = ["Loading ..."];
  
  let nodes = [];
  let folders = [];
  let nodesSelected = [];
  let taskId = 0;
  const baseUrl = "http://localhost:3000/";
  const baseUrlLocal = "http://localhost:3000/";
  const header = {
    headers: {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    },
    method: "GET",
  };
  
  
  function selectSrc(event) {
    event.preventDefault();
    fetch(this.srcUrl, header);
  }
  
  
  function callGetHttpAllGraph() {
    fetch(baseUrlLocal + "graph", {
    headers: {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    },
    method: "GET",
    })
    .then((response) => {
    return response.json();
    })
    .then((jsonResponse) => {
    tasks = jsonResponse.tasks;
    nodes = jsonResponse.nodes.map((n) => n.name);
    folders = jsonResponse.filters.map((n) => n.name);
    const filtersList = document.getElementById("button-container");
    jsonResponse.filters.forEach((f, index) => {
    filtersList.innerHTML +=
      '<a href="' +
      f.name +
      '"  id="' +
      f.name +
      '" class="button composed-button filter-button"><p class="filter-name">' +
      f.name +
      '</p><span class="filter-circle" style="background-color: ' +
      f.color +
      ';"></span></a>';
    dataSetfilters.push(f.name);
    });
    if (jsonResponse.filters.length > 0) {
    filtersList.innerHTML +=
      '<a href="Hide all" id="transparent-btn" class="button composed-button composed-button-big"><p class="icon-text">Hide All</p><span class="material-icons">visibility_off</span></a>';
    }
    setFiltersListeners.bind({ filtersAdded: dataSetfilters })();
    });
  
  }
  
  
  
  
  function selectFilter(name) {
    return selectSrc.bind({
    srcUrl: baseUrl + "graph-color/toggle/" + name,
    msj: "El filtro " + "'" + name + "'" + " se uso efectivamente",
    });
  }

  function calHttpGetAction(event) {
    event.preventDefault();
    fetch(this.srcUrl, header)
    .then((response) => {
      if (response.status === 200) {
      }
    })
    .catch((error) => {
    });
  }
  
  function setFiltersListeners() {
    this.filtersAdded.forEach((f, index) => {
    document
    .getElementById(String(f))
    .addEventListener("click", selectFilter(f));
    });
    if (this.filtersAdded.length > 0) {
    document
      .getElementById("transparent-btn")
      .addEventListener(
      "click",
      calHttpGetAction.bind({ 
        srcUrl: baseUrl + "graph-color/transparent",
        msj: "Se ocultó el grafo",
        msjErr:"Hubo un error al tratar de ocultar el grafo. Vuelve a intentarlo",
      })
      );
    }
  }
  
  callGetHttpAllGraph.bind({ graphUrl: baseUrl + "graph" })();
  </script> 

  `;
}

function getWebviewContent() {
  return `<!DOCTYPE html>
  <html lang="en-us">
    <head>
      <meta charset="utf-8" />
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <title>Unity WebGL Player | Visualization Graph Layout</title>
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons"
      rel="stylesheet">
      ${getCssStyle()}
    </head>
    ${getHTML()}
    ${getScript()}
  </html>
  `;
}
