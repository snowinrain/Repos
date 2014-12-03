package com.realestate.news;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import javax.faces.context.FacesContext;
import javax.faces.model.SelectItem;
import javax.servlet.ServletRequest;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.primefaces.event.FileUploadEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import com.realestate.common.LoginBean;
import com.realestate.model.Account;
import com.realestate.model.News;
import com.realestate.service.NewsService;
import com.realestate.util.CommonUtils;
import com.realestate.util.Constant;

@Component("NewsBean")
@Scope("session")
public class NewsBean implements Serializable {

	private static final long serialVersionUID = 6361017448750047324L;

	static final Logger logger = Logger.getLogger(NewsBean.class);

	private String selectedCity;
	private String selectedDistrict;
	private String selectedHouseType;


	private List<SelectItem> lstCity = new ArrayList<SelectItem>();
	private List<SelectItem> lstDistrict = new ArrayList<SelectItem>();

	private News news;

	@Autowired
	private NewsService newsService;

	@Autowired
	private LoginBean loginBean;

	@Autowired
	private SearchBean searchBean;

	private String length, width, bedRoom, bathRoom, livingRoom, price, size;

	public NewsBean() {
		resetForm();
	}

	public void resetForm() {
		news = new News();
		selectedCity = "";
		selectedDistrict= "";
		selectedHouseType = "";
		length = "";
		width = "";
		bedRoom = "";
		bathRoom = "";
		livingRoom = "";
		price = "";
		size = "";
		lstCity = CommonUtils.getPropertyValue("city", "");
	}

	public void populateDistrict() {
		lstDistrict = CommonUtils.getPropertyValue("district", selectedCity);
	}

	public String addNews() {
		String returnPage = "";
		price = price.replaceAll(",", "");
		news.setLength(Float.parseFloat(length));
		news.setWidth(Float.parseFloat(width));

		if(!StringUtils.isBlank(bedRoom)) {
			news.setBedRoom(Integer.parseInt(bedRoom));
		}

		if(!StringUtils.isBlank(bathRoom)) {
			news.setBathRoom(Integer.parseInt(bathRoom));
		}

		if(!StringUtils.isBlank(livingRoom)) {
			news.setLivingRoom(Integer.parseInt(livingRoom));
		}

		news.setPrice(Long.valueOf(price));
		news.setSize(Float.parseFloat(size));
		news.setCreatedDate(new Date());
		news.setUpdatedDate(new Date());
		news.setExpirationDate(new Date(System.currentTimeMillis() + Constant.MILLISECONDS_IN_ONE_WEEK * news.getExpirationValue()));
		news.setCity(Integer.parseInt(selectedCity));
		if(!StringUtils.isBlank(selectedDistrict)) {
			news.setDistrict(Integer.parseInt(selectedDistrict));
		}
		news.setStatus(Constant.STATUS_ACTIVE);
		news.setViewNum(0);
		news.setAccount(loginBean.getAccount());

		if(news.getImages().isEmpty()) {
			news.getImages().add(Constant.DEFAULT_NEWS_IMAGE);
		}

		newsService.add(news);

		CommonUtils.addSuccessMsg(CommonUtils.getLocaleMessage("success.addnews"));

		if(news.getId() == null) {
			logger.info(loginBean.getAccount().getUserName() + " added a news");
			returnPage = Constant.PAGE_NEWS_INDEX;
		} else {
			news.setUpdatedDate(new Date());
			logger.info(loginBean.getAccount().getUserName() + " edited news id " + news.getId());
			returnPage = Constant.PAGE_NEWS_MANAGE;
		}

		resetForm();

		return returnPage;
	}

	public void changeNewsStatus() {
		if(news.getStatus().equals(Constant.STATUS_ACTIVE)) {
			news.setStatus(Constant.STATUS_CLOSED);
			news.setExpirationDate(new Date());
			CommonUtils.addSuccessMsg(CommonUtils.getLocaleMessage("success.closeNews"));
		} else {
			news.setStatus(Constant.STATUS_ACTIVE);
			news.setCreatedDate(new Date());
			news.setExpirationDate(new Date(System.currentTimeMillis() + Constant.MILLISECONDS_IN_ONE_WEEK * news.getExpirationValue()));
			CommonUtils.addSuccessMsg(CommonUtils.getLocaleMessage("success.activateNews"));
		}
		newsService.edit(news);
	}

	public void deleteNews() {
		logger.info(loginBean.getAccount().getUserName() + " deleted news id " + news.getId());
		newsService.delete(news);
		CommonUtils.addInfoMsg("growl", CommonUtils.getLocaleMessage("success.deleteNews"), "");
	}

	public String gotoEditNews() {
		selectedCity = news.getCity() + "";
		selectedDistrict = news.getDistrict() + "";
		populateDistrict();
		selectedHouseType = news.getHouseType();
		price = news.getPrice() + "";
		length = news.getLength() + "";
		width = news.getWidth() + "";
		size = "" + (Float.parseFloat(width) * Float.parseFloat(length));

		return Constant.PAGE_NEWS_EDIT;
	}

	public String gotoAddNews() {
		if(StringUtils.isBlank(loginBean.getAccount().getUserName())) {
			return Constant.PAGE_LOGIN;
		} else {
			return Constant.PAGE_NEWS_ADD;
		}
	}

	public void handleFileUpload(FileUploadEvent event) {
		try {
			copyFile(event.getFile().getFileName(), event.getFile().getInputstream());
		} catch (IOException e) {
			CommonUtils.addErrorMsg(null, CommonUtils.getLocaleMessage("error.upload.image"), "");
			logger.error("Upload News Image Error: " + e.getMessage());
			System.out.println("handleFileUpload Error: " + e.getMessage());
		}
	}

	public void copyFile(String fileName, InputStream in) {
		try {
			
			String[] splittedFileName = fileName.split("\\.");
			fileName = splittedFileName[0].concat("_" + UUID.randomUUID().toString()) + "." + splittedFileName[1].toLowerCase();
			
			// write the inputStream to a FileOutputStream
			String uploadPath = FacesContext.getCurrentInstance().getExternalContext().getRealPath("/") + Constant.UPLOAD_NEWS_DESTINATION + fileName;
			OutputStream out = new FileOutputStream(new File(uploadPath));
			int read = 0;
			byte[] bytes = new byte[1024];

			// Refer META-INF/context.xml
			news.getImages().add("/images/news/"+fileName);

			while ((read = in.read(bytes)) != -1) {
				out.write(bytes, 0, read);
			}

			in.close();
			out.flush();
			out.close();

			logger.info("New file created : " + uploadPath);
		} catch (IOException e) {
			System.out.println("Error Copy File: " + e.getMessage());
		}
	}

	public void calculateSize() {
		if(!StringUtils.isBlank(width) && !StringUtils.isBlank(length)) {
			size = "" + (Float.parseFloat(width) * Float.parseFloat(length));
		} else {
			size = "";
		}
	}

	public void deleteImage(int index) {
		news.getImages().remove(index);
	}

	public News getNews() {
		return news;
	}

	public void setNews(News news) {
		this.news = news;
	}

	public String getLength() {
		return length;
	}

	public void setLength(String length) {
		this.length = length;
	}

	public String getWidth() {
		return width;
	}

	public String getSize() {
		return size;
	}

	public void setSize(String size) {
		this.size = size;
	}

	public void setWidth(String width) {
		this.width = width;
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

	public String getPrice() {
		return price;
	}

	public void setPrice(String price) {
		this.price = price;
	}

	public String getSelectedCity() {
		return selectedCity;
	}

	public void setSelectedCity(String selectedCity) {
		this.selectedCity = selectedCity;
	}

	public String getSelectedDistrict() {
		return selectedDistrict;
	}

	public void setSelectedDistrict(String selectedDistrict) {
		this.selectedDistrict = selectedDistrict;
	}

	public String getSelectedHouseType() {
		return selectedHouseType;
	}

	public void setSelectedHouseType(String selectedHouseType) {
		this.selectedHouseType = selectedHouseType;
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
