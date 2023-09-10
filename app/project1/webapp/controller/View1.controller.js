sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/util/File",
    "sap/ui/core/Fragment",

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,MessageBox,JSONModel,FileUtil, Fragment) {
        "use strict";

        return Controller.extend("project1.controller.View1", {
            onInit: function () {
                var oData = {
                    dataSet: []
                  };
                  var oModel = new JSONModel(oData);
                  this.getView().setModel(oModel);
          
                  var script = document.createElement('script');
                          script.onload = function () {
                              //The library has fully loaded, and  can call functions in it now.
                              console.log('Library loaded!');
                          };
                          script.src = '//unpkg.com/xlsx/dist/xlsx.full.min.js';
                          document.head.appendChild(script);

            },
            onFileUpload: function(oEvent) {
                debugger;
    
                var oFileUploader = oEvent.getSource();
                var oFile = oFileUploader.oFileUpload.files[0];
                
                // var sFileName = oFile.name;
                // var sFileExtension = sFileName.split(".").pop();
                
                // if (sFileExtension.toLowerCase() !== "xlsx") {
                //   MessageToast.show("Please upload an Excel file (XLSX).");
                //   return;
                // }
                
                var oReader = new FileReader();
                oReader.onload = function(e) {
                  var data = new Uint8Array(e.target.result);
                  var workbook = XLSX.read(data, {type: 'array'});
                  var sheetName = workbook.SheetNames[0];
                  var worksheet = workbook.Sheets[sheetName];
                  var jsonData = XLSX.utils.sheet_to_json(worksheet, {header: 1});
                  var oModel = this.getView().getModel();
                  
                  oModel.setProperty("/dataSet", jsonData.slice(0)); // Skip the header row
                  oModel.refresh(true);
                }.bind(this);
                
                oReader.readAsArrayBuffer(oFile);
              },
            onDownloadItem: function(oEvent) {
                var SelectValue = this.getView().byId("SelectData").getSelectedKey();
                
                if(SelectValue ==="Position"){
                    var xhr = new XMLHttpRequest();
                xhr.open("Get", "../poitiontemplate.csv", true);
                xhr.responseType = "blob";
                xhr.onload = function (oEvent) {
                    var blob = xhr.response;
                    if(blob) {
                        var url = URL.createObjectURL(blob);
                        var link = document.createElement('a');
                        link.style.display = 'none';
                        link.href = url;
                        link.download = 'poitiontemplate.csv';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    } else {
                        // Handle Error here
                        console.log("Failed to download the file.");
                    }
                };
                xhr.send();

                }else if(SelectValue ==="Personal"){
                    var xhr = new XMLHttpRequest();
                    xhr.open("Get", "../personalin.xlsx", true);
                    xhr.responseType = "blob";
                    xhr.onload = function (oEvent) {
                        var blob = xhr.response;
                        if(blob) {
                            var url = URL.createObjectURL(blob);
                            var link = document.createElement('a');
                            link.style.display = 'none';
                            link.href = url;
                            link.download = 'personalin.xlsx';
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                        } else {
                            // Handle Error here
                            console.log("Failed to download the file.");
                        }
                    };
                    xhr.send();

                }else{
                    MessageBox.information("Please select the Portlate")
                }
                
            }
        });
    });
