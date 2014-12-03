package com.realestate.news;

import java.io.Serializable;
import java.util.List;

import javax.annotation.PostConstruct;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import com.realestate.model.Article;
import com.realestate.model.News;
import com.realestate.model.TopAccount;
import com.realestate.service.ArticleService;
import com.realestate.service.NewsService;

@Component("IndexBean")
@Scope("request")
public class IndexBean implements Serializable {

	private static final long serialVersionUID = 1L;
	static final Logger logger = Logger.getLogger(IndexBean.class);

	@Autowired
	private NewsService newsService;

	@Autowired
	private ArticleService articleService;

	private List<News> recentlyNews;
	private List<Article> articles;
	private List<TopAccount> topAccounts;



	public IndexBean() {
	}

	@PostConstruct
	public void init() {
		recentlyNews = newsService.getRecentlyNews(15);
		topAccounts = newsService.getTopAccount(5);
		articles = articleService.findLimit(5);
	}

	public List<TopAccount> getTopAccounts() {
		return topAccounts;
	}

	public void setTopAccounts(List<TopAccount> topAccounts) {
		this.topAccounts = topAccounts;
	}

	public List<News> getRecentlyNews() {
		return recentlyNews;
	}

	public void setRecentlyNews(List<News> recentlyNews) {
		this.recentlyNews = recentlyNews;
	}

	public List<Article> getArticles() {
		return articles;
	}

	public void setArticles(List<Article> articles) {
		this.articles = articles;
	}
}
