package com.realestate.news;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.faces.model.SelectItem;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import com.realestate.common.LoginBean;
import com.realestate.model.News;
import com.realestate.service.NewsService;
import com.realestate.util.CommonUtils;
import com.realestate.util.Constant;

@Component("ManageNewsBean")
@Scope("session")
public class ManageNewsBean implements Serializable {

	@Autowired
	private NewsService newsService;

	@Autowired
	private LoginBean loginBean;

	private static final long serialVersionUID = 1L;

	private int sortBy;
	private int showPage;
	private int viewMode;

	private List<News> newsLst;

	public ManageNewsBean() {
		showPage = 20;
		sortBy = 1;
		viewMode = 2;
	}

	@PostConstruct
	public void init() {

	}

	public String getCityByCode(String code) {
		return CommonUtils.getPropertyValue("city", code).get(0).getLabel();
	}

	public String getDistrictByCode(String cityCode, String districtCode) {
		return CommonUtils.getPropertyValue("district", cityCode + "_" + districtCode).get(0).getLabel();
	}

	public List<News> getNewsLst() {
		newsLst = newsService.getByAccount(loginBean.getAccount());
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
