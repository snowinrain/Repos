package com.realestate.common;

import java.io.Serializable;

import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

@Component("FeatureBean")
@Scope("session")
public class FeatureBean extends GeneralBean implements Serializable {

//	private static final long serialVersionUID = 600229154460084043L;
//
//	private MenuModel model;
//
//	public FeatureBean(){
//		model = null;
//	}
//
//	private MenuModel generateModel() {
//		MenuModel generatedModel = new DefaultMenuModel();
//
//		Submenu submenu = new Submenu();
//		submenu.setLabel("Features");
//		MenuItem item = null;
//
//		if (isAdmin() || isAccounting() || isUser()) {
//			item = new MenuItem();
//			item.setIcon("ui-icon-triangle-1-e");
//			item.setValue("Student");
//			item.setUrl(getViewFromNameJsp("student/searchstudent.xhtml"));
//			submenu.getChildren().add(item);
//		}
//
////		if (isAdmin() || isAccounting()) {
////			item = new MenuItem();
////			item.setIcon("ui-icon-triangle-1-e");
////			item.setValue("Payment");
////			item.setUrl(getViewFromNameJsp("payment/searchpayment.xhtml"));
////			submenu.getChildren().add(item);
////		}
//
//		if (isAdmin() || isAccounting()) {
//			item = new MenuItem();
//			item.setIcon("ui-icon-triangle-1-e");
//			item.setValue("Misc Payment");
//			item.setUrl(getViewFromNameJsp("misc/miscpayment.xhtml"));
//			submenu.getChildren().add(item);
//		}
//
//		if (isAdmin() || isAccounting()) {
//			item = new MenuItem();
//			item.setIcon("ui-icon-triangle-1-e");
//			item.setValue("Misc Expense");
//			item.setUrl(getViewFromNameJsp("misc/miscexpense.xhtml"));
//			submenu.getChildren().add(item);
//		}
//
//		if (isAdmin()) {
//			item = new MenuItem();
//			item.setIcon("ui-icon-triangle-1-e");
//			item.setValue("Installment");
//			item.setUrl(getViewFromNameJsp("installment/installment.xhtml"));
//			submenu.getChildren().add(item);
//		}
//
//		if (isAdmin()) {
//			item = new MenuItem();
//			item.setIcon("ui-icon-triangle-1-e");
//			item.setValue("Installment Due Date");
//			item.setUrl(getViewFromNameJsp("installmentduedate/installmentduedate.xhtml"));
//			submenu.getChildren().add(item);
//		}
//
//		if (isAdmin()) {
//			item = new MenuItem();
//			item.setIcon("ui-icon-triangle-1-e");
//			item.setValue("Fee");
//			item.setUrl(getViewFromNameJsp("fee/managefee.xhtml"));
//			submenu.getChildren().add(item);
//		}
//
//		if (isAdmin()) {
//			item = new MenuItem();
//			item.setIcon("ui-icon-triangle-1-e");
//			item.setValue("Account");
//			item.setUrl(getViewFromNameJsp("account/manageaccount.xhtml"));
//			submenu.getChildren().add(item);
//		}
//		generatedModel.addSubmenu(submenu);
//		return generatedModel;
//	}
//
//	public MenuModel getModel() {
//		if(model == null) {
//			model = generateModel();
//		}
//		return model;
//	}
//
//	public void setModel(MenuModel model) {
//		this.model = model;
//	}
}
