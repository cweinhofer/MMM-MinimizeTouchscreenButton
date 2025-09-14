/* global Module */

Module.register("MMM-MinimizeTouchscreenButton", {
    defaults: {
        position: "bottom_right",
    },

    requiresVersion: "2.1.0",

    getDom: function() {
        // The main container for the module
        const wrapper = document.createElement("div");
        wrapper.className = "mtsb-container";

        // Create the outer div that will act as the border
        const buttonWrapper = document.createElement("div");
        buttonWrapper.className = "mtsb-button-wrapper";

        // Create the inner div that is the visible button
        const minimizeButton = document.createElement("div");
        minimizeButton.className = "mtsb-button";

        // Create the Font Awesome icon
        const icon = document.createElement("i");
        icon.className = "fas fa-window-minimize";
        
        // Assemble the button
        minimizeButton.appendChild(icon);
        buttonWrapper.appendChild(minimizeButton); // Put the button inside the wrapper
        wrapper.appendChild(buttonWrapper); // Put the wrapper in the main container

        // Add the click listener to the wrapper
        buttonWrapper.addEventListener("click", () => {
            if (window.electronAPI) {
                window.electronAPI.minimize();
            }
        });

        return wrapper;
    },

    getStyles: function () {
        return [
            this.file("css/mmm-minimizetouchscreenbutton.css"), 
            "font-awesome.css"
        ];
    },
});
