/**
 * @fileOverview Helper functions for handling file download and displaying toasts.
 * @description This helper provides methods for initiating file download, handling responses,
 *              showing toasts, and managing exceptions.
 * @owner Dheeraj Sharma
 */
({
    /**
     * @description Initiates the file download process and shows appropriate toasts.
     * @param {Aura.Component} component - The component instance.
     */
    processFileDownload: function (component) {
        try {
            this.callDownloadFiles(component);
        } catch (err) {
            this.handleException(component, err);
        }
    },

    /**
     * @description Calls the server-side method to download files.
     * @param {Aura.Component} component - The component instance.
     */
    callDownloadFiles: function (component) {
        var action = component.get("c.fetchDownloadableFiles");
        action.setParams({ recordId: component.get("v.recordId") });
        action.setCallback(this, function (response) {
            this.handleDownloadResponse(component, response);
        });
        $A.enqueueAction(action);
    },

    /**
     * @description Handles the response from the server and takes appropriate actions.
     * @param {Aura.Component} component - The component instance.
     * @param {Aura.Response} response - The server response.
     */
    handleDownloadResponse: function (component, response) {
        try {
            var state = response.getState();
            if (state === "SUCCESS") {
                var downloadableFileData = response.getReturnValue();
                if (downloadableFileData.contentData.length > 0) {
                    this.generateAndDownloadZip(component, downloadableFileData);
                    this.showToastMessage(component, 'Success', 'Files are downloaded successfully', 'success');
                } else {
                    this.showToastMessage(component, 'Info', 'No files found for download.', 'info');
                }
            } else if (state === "ERROR") {
                var errors = response.getError();
                if (errors && errors[0] && errors[0].message) {
                    console.log("Error message: " + errors[0].message);
                    this.showToastMessage(component, 'Error', errors[0].message, 'error');
                } else {
                    console.log("Unknown error");
                }
            }
            this.closeQuickActionPanel(component);
        } catch (ex) {
            this.handleException(component, ex);
        }
    },

    /**
     * @description Generates and downloads a zip file.
     * @param {Aura.Component} component - The component instance.
     * @param {Object} downloadableFileData - The file downloadableFileData received from the server.
     */
    generateAndDownloadZip: function (component, downloadableFileData) {
        var zip = new JSZip();
        downloadableFileData.contentData.forEach(function (fileContent, index) {
            var fileName = fileContent.fileName;
            zip.file(fileName, fileContent.versionData, { base64: true });
        });

        zip.generateAsync({ type: "blob" }).then(function (blob) {
            var element = document.createElement("a");
            element.href = window.URL.createObjectURL(blob);
            element.download = downloadableFileData.fileName;
            element.style.display = "none";
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        });
    },

    /**
     * @description Handles exceptions by logging and showing an error toast.
     * @param {Aura.Component} component - The component instance.
     * @param {Error} ex - The exception object.
     */
    handleException: function (component, ex) {
        console.log('Error Occurred: ' + ex.message || 'Unknown error');
        this.showToastMessage(component, 'Error', ex.message || 'Unknown error', 'error');
    },

    /**
     * @description Shows a toast message.
     * @param {Aura.Component} component - The component instance.
     * @param {string} title - The title of the toast.
     * @param {string} message - The message to be displayed in the toast.
     * @param {string} type - The type of the toast ('success', 'error', 'info', etc.).
     */
    showToastMessage: function (component, title, message, type) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            title: title,
            message: message,
            type: type,
        });
        toastEvent.fire();
    },

    /**
     * @description Closes the quick action panel.
     * @param {Aura.Component} component - The component instance.
     */
    closeQuickActionPanel: function (component) {
        var dismissActionPanel = $A.get("e.force:closeQuickAction");
        dismissActionPanel.fire();
    },
});