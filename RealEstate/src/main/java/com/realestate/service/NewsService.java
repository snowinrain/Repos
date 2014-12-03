package com.realestate.service;

import java.util.Date;
import java.util.List;

import com.realestate.model.Account;
import com.realestate.model.News;
import com.realestate.model.TopAccount;


public interface NewsService {
	public void add(News news);
	public void edit(News news);
	public void delete(News news);

	public List<News> getNewsinRange(Date fromDate, Date toDate);
	public List<News> getActiveNews(String status);
	public List<News> getMostViewedNews(int limit);
	public List<News> getRecentlyNews(int limit);
	public List<News> searchNews(int city, int district, String houseType, String exchangeType,
			String bedRoom, String bathRoom, String livingRoom, String minPrice, String maxPrice, String currency, String minSize, String maxSize, int sortBy);

	public List<TopAccount> getTopAccount(int limit);

	public News getById(String id);
	public List<News> getByAccount(Account account);
	public String updateExpiredNews(Date expirationDate);
}
