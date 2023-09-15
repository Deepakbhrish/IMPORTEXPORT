sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    'sap/m/ColumnListItem',
    'sap/m/Input',
    "sap/ui/core/util/File",
    "sap/ui/core/Fragment",
    'sap/m/MessageToast',
    "sap/m/Text"

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,MessageBox,JSONModel,ColumnListItem, Input,FileUtil, Fragment,MessageToast,Text) {
        "use strict";

        return Controller.extend("project1.controller.View1", {
            onInit: function (evt) {
                //   this.oModel = new JSONModel(this.oData);
                //   this.getView().setModel(this.oModel);
                  
          
                  var script = document.createElement('script');
                          script.onload = function () {
                              //The library has fully loaded, and  can call functions in it now.
                              console.log('Library loaded!');
                          };
                          script.src = '//unpkg.com/xlsx/dist/xlsx.full.min.js';
                          document.head.appendChild(script);
                this.tTable = this.getView().byId("dataTable");
                // this.oReadOnlyTemplate = this.byId("dataTable").removeItem(0);
                // rebindTable(this.oReadOnlyTemplate, "Navigation");
                this.oEditableTemplate = new ColumnListItem({
                    cells: [
                        new Input({
                            value: "{code}"
                        }), new Input({
                            value: "{FirstName}",
                        }), new Input({
                            value: "{LastName}",
                        }), new Input({
                            value: "{Email}",
                        })
                    ]
                });
                this.oReadOnlyTemplate = new ColumnListItem({
                    cells: [
                        new Text({
                            text:"{code}"
                        }), new Text({
                            text: "{FirstName}",
                        }), new Text({
                            text: "{LastName}",
                        }), new Text({
                            text: "{Email}",
                        })
                    ]
                });


            },
            
            
           
            
            

           
            onFileUpload:function(oEvent){
                debugger;
                var vFileUploader = this.getView().byId("fileUploader");
        
                var vFile = vFileUploader.oFileUpload.files[0];
                var sFileName = vFile.name;
                if (vFile && window.FileReader) {
                    var reader = new FileReader();
                    reader.onload = function(e) {
                        var data = new Uint8Array(e.target.result);
                        var workbook = XLSX.read(data, {type: 'array'});
                        var firstSheetName = workbook.SheetNames[0];
                        var worksheet = workbook.Sheets[firstSheetName];
           
                        this.sheetData = XLSX.utils.sheet_to_json(worksheet, {header: 1});
                          // Extract headers (first row)
                          var headers = this.sheetData.shift();
                                              // Convert the remaining rows to objects using headers
                                                var jsonData = this.sheetData.map(function(row) {
                                                var obj = {};
                                                headers.forEach(function(header, index) {
                                                    obj[header] = row[index];
                                                    // jsonData.addStyleClass("redText");
                                                });
                                                return obj;
                                            });
                                            
                         for (var i = 0; i < jsonData.length; i++) {
                            if (!jsonData[i].code) {
                                // i.addStyleClass("redText");
                                
                                MessageBox.error("Row " + (i+1) + ": code is mandatory");
                                // this.validate_Error();
                                
                                // return;
                            }
                        }
                    // });
                               // If all rows passed the validation, set the model
                               var oModel = new JSONModel(jsonData);
                               this.getView().setModel(oModel);
                  
                               // Get the table and set its visibility to true
                               var oTable = this.getView().byId("dataTable");
                               oTable.setVisible(true);
                  
                               // Clear any old columns and items
                               oTable.removeAllColumns();
                               oTable.removeAllItems();
                  
                               // Create new columns based on the keys of the first object in the JSON data
                               headers.forEach(function(header) {
                                   var oColumn = new sap.m.Column({
                                       header: new sap.m.Label({text: header})
                                   });
                                   oTable.addColumn(oColumn);
                               });
                  
                               // Create new items using the keys
                                jsonData.forEach(function(obj) {
                                   var cells = headers.map(function(header) {
                                       return new sap.m.Text({text: obj[header]});
                                   });
                                   var columnListItem = new sap.m.ColumnListItem({
                                       cells: cells
                                   });
                                   oTable.addItem(columnListItem);
                               });
                           }.bind(this);
                           reader.readAsArrayBuffer(vFile);
                           MessageToast.show(`File uploaded successfully by the name: ${sFileName}` );
                       }
                
                },
                rebindTable: function(oTemplate, sKeyboardMode) {
                    // var oTable = this.getView().byId("dataTable");
                    this.tTable.bindItems({
                        path:"/",
                        template: oTemplate,
                        templateShareable: true,
                        
    
                        
                    }).setKeyboardMode(sKeyboardMode);
                },
                onEdit: function() {
                    // this.aProductCollection = deepExtend([], this.oModel.getProperty("/"));
                    this.byId("editButton").setVisible(false);
                    this.byId("saveButton").setVisible(true);
                    this.byId("cancelButton").setVisible(true);
                    this.rebindTable(this.oEditableTemplate, "Edit");
                    // this.rebindTable(this.oReadOnlyTemplate, "Navigation");
    
                },
                onCancel: function() {
                    // var oReadOnlyTemplate = this.getView().byId("dataTable").removeItem(0);
                    this.byId("cancelButton").setVisible(false);
                    this.byId("saveButton").setVisible(false);
                    this.byId("editButton").setVisible(true);
                    // this.oModel.setProperty("/", this.aProductCollection);
                    this.rebindTable(this.oReadOnlyTemplate, "Navigation");
                },
                onSave: function() {
                    // var oReadOnlyTemplate = this.getView().byId("dataTable").removeItem(0);
                    this.byId("saveButton").setVisible(false);
                    this.byId("cancelButton").setVisible(false);
                    this.byId("editButton").setVisible(true);
                    this.rebindTable(this.oReadOnlyTemplate, "Navigation");
                },
                

                handleValidatePress:function(oEvent){

                    debugger;
                    
                    var oTable = this.getView().byId("dataTable");
                    var oItems = oTable.getItems();
        
                    oItems.forEach(function(oItem) {
                        var oCells = oItem.getCells();
        
                        oCells.forEach(function(oCell) {
        
        
                            for (var i = 0; i < oCells.length; i++) {
                            if (!oCells[i].getText()) {
                                // MessageToast.show("cell is empty")
                                oCell.addStyleClass("redText");
                                // MessageBox.error("column " + (i+1) + ": code is mandatory");
                                
        
                              
                              return;
                            }
                            // else{
                            //     MessageToast.show("data is good to go")
        
                            // }
                        }
                          });
                        });
                
        
        
        
        
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
