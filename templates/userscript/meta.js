// ==UserScript==
// @name         {{DOMAIN}}__{{SCRIPT}}
// @description  {{DESCRIPTION}}
// @version      0.1.0-{{moment "today" "YYMMDD"}}
// @author       Pavel Sevcik
// @namespace    @pavelsevcik
// @downloadURL  https://github.com/pavelsevcik/userscripts/dist/{{DOMAIN}}/{{SCRIPT}}/raw/master/user.js
// @updateURL    https://github.com/pavelsevcik/userscripts/dist/{{DOMAIN}}/{{SCRIPT}}/raw/master/meta.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain={{DOMAIN}}
{{#inArray REQUIRE "mousetrap"}}
// @require      https://craig.global.ssl.fastly.net/js/mousetrap/mousetrap.min.js?a4098
{{/inArray}}
{{#inArray REQUIRE "toastr"}}
// @require      https://cdnjs.cloudflare.com/ajax/libs/toastr.js/2.1.4/toastr.min.js
// @resource     TOASTR_CSS https://cdnjs.cloudflare.com/ajax/libs/toastr.js/2.1.4/toastr.min.css
{{/inArray}}
// @match        https://www.{{DOMAIN}}/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

