sap.ui.define(['sap/ui/core/UIComponent'],
	function(UIComponent) {
	"use strict";

	var Component = UIComponent.extend("ZHR_PERHAREKET.Component", {

		metadata : {
			rootView : "ZHR_PERHAREKET.Page",
			dependencies : {
				libs : [
					"sap.m"
				]
			},
			config : {
				sample : {
					stretch : true,
					files : [
						"Page.view.xml",
						"Page.controller.js"
					]
				}
			}
		}
	});


	return Component;

});