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
public class Account implements Serializable{

	private static final long serialVersionUID = 1L;

	@Id
	private ObjectId id;

	private String userName;
	private String password;
	private String role;
	private String email;

	@DateTimeFormat(style = "M-")
	private Date createdDate;

	@DBRef
	private AccountDetail accountDetail;

	// lazy loading to prevent circular dependency
	@DBRef(lazy=true)
	private List<News> followedNews;

	public Account() {
		accountDetail = new AccountDetail();
		userName="";
		password="";
		email="";
		followedNews = new ArrayList<News>();
	}

	@Override
	public String toString() {
		return "Account [Username=" + userName + ", Password=" + password + "]";
	}

	public ObjectId getId() {
		return id;
	}

	public void setId(ObjectId id) {
		this.id = id;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public AccountDetail getAccountDetail() {
		return accountDetail;
	}

	public void setAccountDetail(AccountDetail accountDetail) {
		this.accountDetail = accountDetail;
	}

	public Date getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(Date createdDate) {
		this.createdDate = createdDate;
	}

	public List<News> getFollowedNews() {
		if(followedNews == null) {
			followedNews = new ArrayList<News>();
		}
		return followedNews;
	}

	public void setFollowedNews(List<News> followedNews) {
		this.followedNews = followedNews;
	}
}