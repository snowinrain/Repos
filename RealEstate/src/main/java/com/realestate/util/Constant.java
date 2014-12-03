package com.realestate.util;

public class Constant {
	public static final String USERNAME = "userName";
	public static final String DEFAULT_NEWS_IMAGE = "/img/no_house.jpg";
	public static final long MILLISECONDS_IN_ONE_WEEK = 86400 * 7 * 1000;

	// User Roles
	public static final String ROLE_USER = "ROLE_USER";
	public static final String ROLE_ADMIN = "ROLE_ADMIN";

	// News Status
	public static final String STATUS_ACTIVE = "ACTIVE";
	public static final String STATUS_CLOSED = "CLOSED";

	// Upload Folders
	public static final String UPLOAD_NEWS_DESTINATION = "../upload/news/";
	public static final String UPLOAD_AVATAR_DESTINATION = "../upload/avatar/";
	public static final String UPLOAD_ARTICLE_DESTINATION = "../upload/article/";

	// Common Pages
	public static final String PAGE_LOGIN = "login?faces-redirect=true";
	
	// Article Page
	public static final String PAGE_ARTCLE_MANAGE = "manageArticle?faces-redirect=true";
	public static final String PAGE_ARTCLE_INDEX = "article?faces-redirect=true";
	public static final String PAGE_ARTCLE_DETAIL = "article-detail?faces-redirect=true";
	public static final String PAGE_ARTCLE_EDIT = "editArticle?faces-redirect=true";
	public static final String PAGE_ARTCLE_ADD = "addArticle?faces-redirect=true";
	
	// News Pages
	public static final String PAGE_SEARCH = "search-list?faces-redirect=true";
	public static final String PAGE_NEWS_INDEX = "index?faces-redirect=true";
	public static final String PAGE_NEWS_MANAGE = "manageNews?faces-redirect=true";
	public static final String PAGE_NEWS_DETAIL = "news-detail?faces-redirect=true";
	public static final String PAGE_NEWS_EDIT = "editNews?faces-redirect=true";
	public static final String PAGE_NEWS_ADD = "addNews?faces-redirect=true";

	// Admin Pages
	public static final String PAGE_ADMIN_INDEX = "/admin/index?faces-redirect=true";
}