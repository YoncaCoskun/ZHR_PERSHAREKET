sap.ui.define([
	'jquery.sap.global',
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel',
	"sap/m/MessageToast"
], function(jQuery, Controller, JSONModel, MessageToast) {
	"use strict";
	var osCostJsonModel = new sap.ui.model.json.JSONModel();
	var ePernr = "";
	var ePronr = "";
	var eDepar = "";
	var eActio = "";
	var eScdr = "";
	var eSnctx = "";
	var eCompl = "";
	var PageController = Controller.extend("ZHR_PERHAREKET.Page", {

		onInit: function() {

			var oThat = this;

			var oCostJsonModel = new sap.ui.model.json.JSONModel();
			var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHR_PERSHAREKET_SRV");

			oModel.read("/HeadSet", null, null, true,

				function(oData) {

					oCostJsonModel.setData(oData);

				},

				function() {

				});

			oThat.getView().setModel(oCostJsonModel, "iModel");
			this.getView().byId("listId").setModel(this.getView().getModel("iModel"));

		},

		filtreMaster: function(oEvent) {
			if (oEvent) {
				if (oEvent.getSource().getPressed()) {
					var mercBinding = this.getView().byId("listId").getBinding("items");

				var aFilters = [];
				var filter = new sap.ui.model.Filter("Hstat", sap.ui.model.FilterOperator.EQ, "1");
				var filters = new sap.ui.model.Filter("Hstat", sap.ui.model.FilterOperator.EQ, "0");
				var filterss = new sap.ui.model.Filter("Hstat", sap.ui.model.FilterOperator.EQ, "2");
				aFilters.push(filters);
				aFilters.push(filter);
				aFilters.push(filterss);
				mercBinding.filter(aFilters);
					sap.m.MessageToast.show("Tüm Talepler Gösteriliyor");
				} else {
				var mercBinding = this.getView().byId("listId").getBinding("items");

				var aFilters = [];
				var filter = new sap.ui.model.Filter("Hstat", sap.ui.model.FilterOperator.EQ, "1");
				var filters = new sap.ui.model.Filter("Hstat", sap.ui.model.FilterOperator.EQ, "0");
				aFilters.push(filters);
				aFilters.push(filter);
				mercBinding.filter(aFilters);
					sap.m.MessageToast.show("Başlanmayan ve Devam Eden Talepler Gösteriliyor");
				}

			

			} else {
				var mercBinding = this.getView().byId("listId").getBinding("items");

				var aFilters = [];
				var filter = new sap.ui.model.Filter("Hstat", sap.ui.model.FilterOperator.EQ, "1");
				var filters = new sap.ui.model.Filter("Hstat", sap.ui.model.FilterOperator.EQ, "0");
				aFilters.push(filters);
				aFilters.push(filter);
				mercBinding.filter(aFilters);
					sap.m.MessageToast.show("Başlanmayan ve Devam Eden Talepler Gösteriliyor");
			}

		},

		vstatus: function(sStatus) {
			if (sStatus === "Tamamlandı") {
				return "Success";
			} else if (sStatus === "Devam ediyor") {
				return "Warning";
			} else {
				return "Error";
			}
		},

		onOnError: function(event) {
			var textToDisplay = "Exception happened : ";
			textToDisplay += event.getParameter("text");
			sap.m.MessageToast.show(textToDisplay);
		},

		onNodePress: function(event) {

			var textToDisplay = event.getParameters().getNodeId();

			ePernr = osCostJsonModel.oData.results[textToDisplay].Pernr;
			ePronr = osCostJsonModel.oData.results[textToDisplay].Pronr;
			eDepar = osCostJsonModel.oData.results[textToDisplay].Depar;
			eActio = osCostJsonModel.oData.results[textToDisplay].Actio;

			this.pressDialog();
		},
		pressDialog: function() {
			this.oPersonAddDialog = sap.ui.xmlfragment("ZHR_PERHAREKET.Comp", this);
			this.oPersonAddDialog.open();
		},

		compDialogSend: function() {
			var selectedChck = sap.ui.getCore().byId("idIslem").getSelected();

			if (selectedChck) {
				selectedChck = "X";
			} else {
				selectedChck = "";
			}
			eScdr = selectedChck;
			eSnctx = sap.ui.getCore().byId("compInput").getValue();
			eCompl = "X";

			var oeModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHR_PERSHAREKET_SRV");
			oeModel.read("/CompSet(Pernr='" + ePernr + "',Pronr='" + ePronr + "',Depar='" + eDepar + "',Actio='" + eActio + "',Sncdr='" + eScdr +
				"',Snctx='" + eSnctx + "',Compl='" + eCompl + "')", null, null, false,

				function() {
					sap.m.MessageToast.show("Başarıyla Gönderildi");
					window.location.reload();
				},
				function() {});

			this.oPersonAddDialog.close();
			this.oPersonAddDialog.destroy();

		},

		compDialogClose: function() {
			this.oPersonAddDialog.close();
			this.oPersonAddDialog.destroy();

		},
		onZoomIn: function() {
			this.getView().byId("processflow1").zoomIn();
			this.getView().byId("processflow1").getZoomLevel();

			sap.m.MessageToast.show("Zoom level changed to: " + this.getView().byId("processflow1").getZoomLevel());
		},

		onZoomOut: function() {
			this.getView().byId("processflow1").zoomOut();
			this.getView().byId("processflow1").getZoomLevel();

			sap.m.MessageToast.show("Zoom level changed to: " + this.getView().byId("processflow1").getZoomLevel());
		},

		onUpdateModelAdd: function() {
			if (this.getView().byId("processflow1").getLanes().length < 3) {
				var pfl1 = new sap.suite.ui.commons.ProcessFlowLaneHeader({
					iconSrc: "sap-icon://money-bills",
					text: "In Accounting",
					position: 2
				});
				this.getView().byId("processflow1").addLane(pfl1);
				this.getView().byId("processflow1").updateModel();
				sap.m.MessageToast.show("Model has been updated");
			}
		},

		onListItemPress: function(oEvent) {
			var oDataProcessFlowLanesAndNodes = {
				nodes: [],
				lanes: []
			};

			var headModel = this.getView().getModel("iModel");
			var sIds = oEvent.getSource().oBindingContexts.undefined.sPath.slice(9);
			var sId = headModel.oData.results[sIds].Pernr;

			var filter = "Pernr eq '" + sId + "'";

			var osModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHR_PERSHAREKET_SRV");
			var childs = "";
			var is = 1;
			var states = sap.suite.ui.commons.ProcessFlowNodeState.Negative;
			var statesText = "Tamamlanmadı";
			osModel.read("/ItemsSet", null, ["$filter=" + filter], false,

				function(oData) {

					for (var i = 0; i < oData.results.length; i++) {
						if (oData.results.length > 1) {
							if (i < oData.results.length - 1) {
								childs = [is];
								is++;
							} else {
								childs = [];
							}
						}

						if (oData.results[i].Compl === "X") {
							states = sap.suite.ui.commons.ProcessFlowNodeState.Critical;
							statesText = "Tamamlandı";
						}

						if (oData.results[i].Sncdr === "X") {
							states = sap.suite.ui.commons.ProcessFlowNodeState.Positive;
							statesText = "Tamamlandı";
						}

						oDataProcessFlowLanesAndNodes.nodes.push({
							id: i,
							lane: i,
							title: oData.results[i].Acttx,
							titleAbbreviation: oData.results[i].Acttx,
							children: childs,
							state: states,
							stateText: statesText,
							texts: [oData.results[i].Snctx]
						});

						oDataProcessFlowLanesAndNodes.lanes.push({
							id: i,
							icon: "sap-icon://monitor-payments",
							label: oData.results[i].Acttx,
							position: i
						});
					}
					osCostJsonModel.setData(oData);
				},
				function() {});
			var oModelPf1 = new sap.ui.model.json.JSONModel();
			var viewPf1 = this.getView();
			oModelPf1.setData(oDataProcessFlowLanesAndNodes);
			viewPf1.setModel(oModelPf1);
			viewPf1.byId("processflow1").updateModel();

			this.getView().byId("detailHead").setTitle(headModel.oData.results[sIds].Ename + " Personel Heketleri");

		},

		onAfterRendering: function() {
			this.filtreMaster();
		},

		vdate: function(value) {

			if (value) {
				var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
					pattern: "dd/MM/yyyy"
				});
				return oDateFormat.format(new Date(value));
			} else {
				return value;
			}

		}
	});

	return PageController;

});