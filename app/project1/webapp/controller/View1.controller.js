sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,MessageBox) {
        "use strict";

        return Controller.extend("project1.controller.View1", {
            onInit: function () {

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
