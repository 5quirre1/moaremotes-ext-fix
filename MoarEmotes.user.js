// ==UserScript==
// @name         MoarEmotes
// @namespace    http://tampermonkey.net/
// @version      2025-04-29
// @description  Extended Emote List for Pikidiary
// @author       zav
// @match        https://pikidiary.lol/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pikidiary.lol
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    fetch('https://raw.githubusercontent.com/5quirre1/moaremotes-ext-fix/refs/heads/patch-2/emotes.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Oops: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Fetched Data:", data);
            console.log("Found images:");
            const startIndex = (Array.isArray(data) && data.length > 0 && Array.isArray(data[0]) && data[0].includes('original')) ? 1 : 0;

            for (let i = startIndex; i < data.length; i++) {
                const imageUrl = Array.isArray(data[i]) ? data[i][0] : data[i];
                loadEmotes(imageUrl);
            }
            console.log(`\nFound ${data.length - startIndex} images.`);
            return data;
        })
        .catch(error => {
            console.error("Oops:", error);
            return [];
        });

    function loadEmotes(link) {
        console.log("called with:", link, typeof link);
        const dropdown = document.getElementById("emoji-dropdown");
        if (!dropdown) {
            console.warn("Emoji dropdown not found.");
            return;
        }

        const emotesContainer = dropdown.querySelector(".dropdown-cont");
        if (!emotesContainer) {
            console.warn("Emotes container not found inside emoji dropdown.");
            return;
        }

        const image = document.createElement("img");
        let filenameWithoutExtension = "";

        const match = link.match(/\/([^/]+)\.(png|gif|jpeg)$/);

        if (match && match[1]) {
            filenameWithoutExtension = match[1];
        } else {
            console.warn(`Could not extract filename using regex: ${link}.`);
        }

        image.src = link;
        image.alt = "Emote";
        image.style.cursor = "pointer";
        image.style.marginRight = "5px";

        image.onclick = function() {
            if (!window.__cfRLUnblockHandlers) return false;
            insertEmote(`:${filenameWithoutExtension}:`);
        };

        emotesContainer.appendChild(image);
    }
})();
