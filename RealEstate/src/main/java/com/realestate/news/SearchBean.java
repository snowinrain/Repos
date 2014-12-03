package com.realestate.news;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.faces.model.SelectItem;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import com.realestate.model.News;
import com.realestate.service.NewsService;
import com.realestate.util.CommonUtils;
import com.realestate.util.Constant;

@Component("SearchBean")
@Scope("session")
public class SearchBean implements Serializable {

	@Autowired
	private NewsService newsService;

	private static final long serialVersionUID = 1L;

	private List<News> newsLst = new ArrayList<News>();
	private List<News> mostViewedNews_1 = new ArrayList<News>();
	private List<News> mostViewedNews_2 = new ArrayList<News>();
	private List<News> mostViewedNews_3 = new ArrayList<News>();

	private int selectedCity;
	private int selectedDistrict;

	private int sortBy;
	private int showPage;
	private int viewMode;

	private String bedRoom;
	private String bathRoom;
	private String livingRoom;
	private String minPrice;
	private String maxPrice;
	private String minSize;
	private String maxSize;
	private String selectedCurrency;
	private String houseType;
	private String exchangeType;

	private List<SelectItem> lstCity = new ArrayList<SelectItem>();
	private List<SelectItem> lstDistrict = new ArrayList<SelectItem>();


	public SearchBean() {
		showPage = 20;
		sortBy = 1;
		viewMode = 1;
		minPrice = "";
		maxPrice = "";
		bedRoom="";
		bathRoom="";
		livingRoom="";
		minSize="";
		maxSize="";
		selectedCurrency = "";
	}

	@PostConstruct
	public void init() {
		List<News> mostViewedNews = newsService.getMostViewedNews(12);

		lstCity = CommonUtils.getPropertyValue("city", "");

		if(mostViewedNews.size() >= 4) {
			mostViewedNews_1 = mostViewedNews.subList(0, 4);
		} else if(mostViewedNews.size() >= 0) {
			mostViewedNews_1 = mostViewedNews.subList(0, mostViewedNews.size());
		}

		if(mostViewedNews.size() >= 8) {
			mostViewedNews_2 = mostViewedNews.subList(4, 8);
		} else if(mostViewedNews.size() >= 4){
			mostViewedNews_2 = mostViewedNews.subList(4, mostViewedNews.size());
		}

		if(mostViewedNews.size() > 8) {
			mostViewedNews_3 = mostViewedNews.subList(8, mostViewedNews.size());
		}

		performFilter();
	}

	public void performFilter() {
		newsLst = newsService.searchNews(selectedCity, selectedDistrict, houseType, exchangeType, bedRoom, bathRoom, livingRoom, minPrice, maxPrice, selectedCurrency, minSize, maxSize, sortBy);
	}

	public String getCityByCode(String code) {
		return CommonUtils.getPropertyValue("city", code).get(0).getLabel();
	}

	public String getDistrictByCode(String cityCode, String districtCode) {
		return CommonUtils.getPropertyValue("district", cityCode + "_" + districtCode).get(0).getLabel();
	}

	public void populateDistrict() {
		lstDistrict = CommonUtils.getPropertyValue("district", selectedCity + "");
	}

	public void clearFilter() {
		exchangeType = "";
		houseType = "";
		exchangeType="";
		minPrice = "";
		maxPrice= "";
		selectedCurrency = "";
		maxSize = "";
		minSize = "";
	}

	public List<News> getMostViewedNews_1() {
		return mostViewedNews_1;
	}

	public void setMostViewedNews_1(List<News> mostViewedNews_1) {
		this.mostViewedNews_1 = mostViewedNews_1;
	}

	public List<News> getMostViewedNews_2() {
		return mostViewedNews_2;
	}

	public void setMostViewedNews_2(List<News> mostViewedNews_2) {
		this.mostViewedNews_2 = mostViewedNews_2;
	}

	public List<News> getMostViewedNews_3() {
		return mostViewedNews_3;
	}

	public void setMostViewedNews_3(List<News> mostViewedNews_3) {
		this.mostViewedNews_3 = mostViewedNews_3;
	}

	public List<News> getNewsLst() {
		return newsLst;
	}

	public void setNewsLst(List<News> newsLst) {
		this.newsLst = newsLst;
	}

	public NewsService getNewsService() {
		return newsService;
	}

	public void setNewsService(NewsService newsService) {
		this.newsService = newsService;
	}

	public int getSelectedCity() {
		return selectedCity;
	}

	public void setSelectedCity(int selectedCity) {
		this.selectedCity = selectedCity;
	}

	public int getSelectedDistrict() {
		return selectedDistrict;
	}

	public void setSelectedDistrict(int selectedDistrict) {
		this.selectedDistrict = selectedDistrict;
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

	public String getBedRoom() {
		return bedRoom;
	}

	public void setBedRoom(String bedRoom) {
		this.bedRoom = bedRoom;
	}

	public String getBathRoom() {
		return bathRoom;
	}

	public void setBathRoom(String bathRoom) {
		this.bathRoom = bathRoom;
	}

	public String getLivingRoom() {
		return livingRoom;
	}

	public void setLivingRoom(String livingRoom) {
		this.livingRoom = livingRoom;
	}

	public String getMinPrice() {
		return minPrice;
	}

	public void setMinPrice(String minPrice) {
		this.minPrice = minPrice;
	}

	public String getMaxPrice() {
		return maxPrice;
	}

	public void setMaxPrice(String maxPrice) {
		this.maxPrice = maxPrice;
	}

	public String getMinSize() {
		return minSize;
	}

	public void setMinSize(String minSize) {
		this.minSize = minSize;
	}

	public String getMaxSize() {
		return maxSize;
	}

	public void setMaxSize(String maxSize) {
		this.maxSize = maxSize;
	}

	public String getSelectedCurrency() {
		return selectedCurrency;
	}

	public void setSelectedCurrency(String selectedCurrency) {
		this.selectedCurrency = selectedCurrency;
	}

	public String getHouseType() {
		return houseType;
	}

	public void setHouseType(String houseType) {
		this.houseType = houseType;
	}

	public String getExchangeType() {
		return exchangeType;
	}

	public void setExchangeType(String exchangeType) {
		this.exchangeType = exchangeType;
	}

	public List<SelectItem> getLstCity() {
		return lstCity;
	}

	public void setLstCity(List<SelectItem> lstCity) {
		this.lstCity = lstCity;
	}

	public List<SelectItem> getLstDistrict() {
		return lstDistrict;
	}

	public void setLstDistrict(List<SelectItem> lstDistrict) {
		this.lstDistrict = lstDistrict;
	}
}
