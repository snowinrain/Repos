package com.realestate.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.format.annotation.DateTimeFormat;

@Document
public class News implements Serializable{

	private static final long serialVersionUID = 1L;

	@Id
	private ObjectId id;

	private String content;
	private float length;
	private float width;
	private float size;
	private long price;
	private String currency;
	private int bedRoom;
	private int bathRoom;
	private int livingRoom;
	private int city;
	private int district;
	private int viewNum;
	private List<String> images;
	private String houseType;
	private String exchangeType;
	private String status;
	private String address;
	private String priceType;
	private int expirationValue;

	@DateTimeFormat(style = "M-")
	private Date createdDate;

	@DateTimeFormat(style = "M-")
	private Date updatedDate;

	@DateTimeFormat(style = "M-")
	private Date expirationDate;

	@DBRef
	private Account account;

	// lazy loading to prevent circular dependency
	@DBRef(lazy=true)
	private List<Account> follower;

	public News() {
		images = new ArrayList<String>();
		follower = new ArrayList<Account>();
		exchangeType = "";
		houseType= "";
	}

	public ObjectId getId() {
		return id;
	}

	public void setId(ObjectId id) {
		this.id = id;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public String getCurrency() {
		return currency;
	}

	public void setCurrency(String currency) {
		this.currency = currency;
	}

	public float getLength() {
		return length;
	}

	public void setLength(float length) {
		this.length = length;
	}

	public float getWidth() {
		return width;
	}

	public void setWidth(float width) {
		this.width = width;
	}

	public float getSize() {
		return size;
	}

	public void setSize(float size) {
		this.size = size;
	}

	public Date getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(Date createdDate) {
		this.createdDate = createdDate;
	}

	public Date getExpirationDate() {
		return expirationDate;
	}

	public void setExpirationDate(Date expirationDate) {
		this.expirationDate = expirationDate;
	}

	public Account getAccount() {
		return account;
	}

	public List<Account> getFollower() {
		if(follower == null) {
			follower = new ArrayList<Account>();
		}
		return follower;
	}

	public void setFollower(List<Account> follower) {
		this.follower = follower;
	}

	public void setAccount(Account account) {
		this.account = account;
	}

	public int getBedRoom() {
		return bedRoom;
	}

	public void setBedRoom(int bedRoom) {
		this.bedRoom = bedRoom;
	}

	public int getBathRoom() {
		return bathRoom;
	}

	public void setBathRoom(int bathRoom) {
		this.bathRoom = bathRoom;
	}

	public int getLivingRoom() {
		return livingRoom;
	}

	public void setLivingRoom(int livingRoom) {
		this.livingRoom = livingRoom;
	}

	public int getCity() {
		return city;
	}

	public void setCity(int city) {
		this.city = city;
	}

	public int getDistrict() {
		return district;
	}

	public void setDistrict(int district) {
		this.district = district;
	}

	public int getViewNum() {
		return viewNum;
	}

	public void setViewNum(int viewNum) {
		this.viewNum = viewNum;
	}

	public List<String> getImages() {
		return images;
	}

	public void setImages(List<String> images) {
		this.images = images;
	}

	public String getHouseType() {
		return houseType;
	}

	public void setHouseType(String houseType) {
		this.houseType = houseType;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getPriceType() {
		return priceType;
	}

	public void setPriceType(String priceType) {
		this.priceType = priceType;
	}

	public long getPrice() {
		return price;
	}

	public void setPrice(long price) {
		this.price = price;
	}

	public Date getUpdatedDate() {
		return updatedDate;
	}

	public void setUpdatedDate(Date updatedDate) {
		this.updatedDate = updatedDate;
	}

	public String getExchangeType() {
		return exchangeType;
	}

	public void setExchangeType(String exchangeType) {
		this.exchangeType = exchangeType;
	}

	public int getExpirationValue() {
		return expirationValue;
	}

	public void setExpirationValue(int expirationValue) {
		this.expirationValue = expirationValue;
	}
}