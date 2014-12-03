package com.realestate.service;

import java.util.List;

import com.realestate.model.Account;
import com.realestate.model.Article;

public interface ArticleService {
	public void add(Article article);
	public void edit(Article article);
	public void delete(Article article);

	public List<Article> findAll();
	public List<Article> findLimit(int limit);
	public List<Article> findByAccount(Account account);
	public List<Article> findByCategory(int category);
}
