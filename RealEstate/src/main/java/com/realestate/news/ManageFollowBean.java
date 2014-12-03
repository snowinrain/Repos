package com.realestate.news;

import java.io.Serializable;
import java.util.List;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import com.realestate.common.LoginBean;
import com.realestate.model.Account;
import com.realestate.model.News;
import com.realestate.util.CommonUtils;

@Component("ManageFollowBean")
@Scope("session")
public class ManageFollowBean implements Serializable {

	@Autowired
	private LoginBean loginBean;

	private static final long serialVersionUID = 1L;

	private int sortBy;
	private int showPage;
	private int viewMode;
	private Account account;

	private List<News> newsLst;

	public ManageFollowBean() {
		showPage = 20;
		sortBy = 1;
		viewMode = 2;
	}

	@PostConstruct
	public void init() {
		account = loginBean.getAccount();
	}

	public String getCityByCode(String code) {
		return CommonUtils.getPropertyValue("city", code).get(0).getLabel();
	}

	public String getDistrictByCode(String cityCode, String districtCode) {
		return CommonUtils.getPropertyValue("district", cityCode + "_" + districtCode).get(0).getLabel();
	}

	public List<News> getNewsLst() {
		newsLst = account.getFollowedNews();
		return newsLst;
	}

	public void setNewsLst(List<News> newsLst) {
		this.newsLst = newsLst;
	}

	public int getSortBy() {
		return sortBy;
	}

	public void setSortBy(int sortBy) {
		this.sortBy = sortBy;
	}

	public int getShowPage() {
		return showPage;
	}

	public void setShowPage(int showPage) {
		this.showPage = showPage;
	}

	public int getViewMode() {
		return viewMode;
	}

	public void setViewMode(int viewMode) {
		this.viewMode = viewMode;
	}

}
