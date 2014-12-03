package com.realestate.news;

import java.io.Serializable;
import java.util.Iterator;

import javax.annotation.PostConstruct;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import com.realestate.common.LoginBean;
import com.realestate.model.Account;
import com.realestate.model.News;
import com.realestate.service.AccountService;
import com.realestate.service.NewsService;
import com.realestate.util.Constant;

@Component("NewsDetailBean")
@Scope("session")
public class NewsDetailBean implements Serializable {

	private static final long serialVersionUID = 6361017448750047324L;

	static final Logger logger = Logger.getLogger(NewsDetailBean.class);

	private News news;

	private boolean isFollowed;
	private int followNum;
	private int viewNum;

	@Autowired
	LoginBean loginBean;

	@Autowired
	NewsService newsService;

	@Autowired
	AccountService accountService;

	public NewsDetailBean() {
	}

	@PostConstruct
	public void init() {
	}

	public void performFollow() {
		loginBean.getAccount().getFollowedNews().add(news);
		news.getFollower().add(loginBean.getAccount());

		accountService.edit(loginBean.getAccount());
		newsService.edit(news);

		isFollowed = true;
	}

	public void performUnfollow() {
		loginBean.getAccount().getFollowedNews().remove(news);
		accountService.edit(loginBean.getAccount());

		news.getFollower().remove(loginBean.getAccount());
		newsService.edit(news);

		isFollowed = false;
	}

	public String performSelectNews(String newsId) {
		// Increase View Number
		news = newsService.getById(newsId);
		news.setViewNum(news.getViewNum() + 1);
		newsService.edit(news);

		// Check if the news is followed
		isFollowed = checkFollowed(news);

		return Constant.PAGE_NEWS_DETAIL;
	}

	public boolean checkFollowed(News news) {
		boolean isFollowed = false;
		if(!StringUtils.isBlank(loginBean.getAccount().getUserName())) {
			for (Iterator<News> it = loginBean.getAccount().getFollowedNews().iterator(); it.hasNext();) {
				if(it.next().getId().equals(news.getId())) {
					isFollowed = true;
				}
			}
		}
		return isFollowed;
	}

	public int getFollowNum() {
		followNum = news.getFollower().size();
		return followNum;
	}

	public int getViewNum() {
		viewNum = newsService.getById(news.getId().toString()).getViewNum();
		return viewNum;
	}

	public void setFollowNum(int followNum) {
		this.followNum = followNum;
	}

	public void setViewNum(int viewNum) {
		this.viewNum = viewNum;
	}

	public boolean isFollowed() {
		return isFollowed;
	}

	public void setFollowed(boolean isFollowed) {
		this.isFollowed = isFollowed;
	}

	public News getNews() {
		return news;
	}

	public void setNews(News news) {
		this.news = news;
	}
}
