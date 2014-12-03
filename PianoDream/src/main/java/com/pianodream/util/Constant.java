package com.pianodream.util;

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
	public static final String PAGE_INDEX = "index?faces-redirect=true";
	public static final String PAGE_VIDEO = "video?faces-redirect=true";
	public static final String PAGE_VIDEO_DETAIL = "video-detail?faces-redirect=true";

	// Video Pages
	public static final String PAGE_VIDEO_INDEX = "my-video?faces-redirect=true";
	public static final String PAGE_VIDEO_EDIT = "edit-video?faces-redirect=true";
	public static final String PAGE_VIDEO_ADD = "add-video?faces-redirect=true";

	// Admin Pages
	public static final String PAGE_ADMIN_INDEX = "/admin/index?faces-redirect=true";
}