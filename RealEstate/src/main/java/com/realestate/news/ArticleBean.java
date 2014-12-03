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

import javax.annotation.PostConstruct;
import javax.faces.context.FacesContext;
import javax.faces.model.SelectItem;
import javax.servlet.ServletRequest;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.primefaces.event.FileUploadEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import com.realestate.common.LoginBean;
import com.realestate.model.Account;
import com.realestate.model.Article;
import com.realestate.model.News;
import com.realestate.service.ArticleService;
import com.realestate.service.NewsService;
import com.realestate.util.CommonUtils;
import com.realestate.util.Constant;

@Component("ArticleBean")
@Scope("session")
public class ArticleBean implements Serializable {

	private static final long serialVersionUID = 6361017448750047324L;

	static final Logger logger = Logger.getLogger(ArticleBean.class);

	private Article article;
	private Article selectedArticle;
	private List<Article> articles;

	@Autowired
	private ArticleService articleService;

	@Autowired
	private LoginBean loginBean;

	public ArticleBean() {
	}

	@PostConstruct
	public void init() {
		article = new Article();
		selectedArticle = new Article();
		articles = new ArrayList<Article>();
	}

	public String navigateToManageArticle() {
		articles = articleService.findByAccount(loginBean.getAccount());
		selectedArticle = new Article();
		return Constant.PAGE_ARTCLE_MANAGE;
	}

	public String navigateToArticle(int category) {
		if(category == 0) {
			articles = articleService.findAll();
		} else {
			articles = articleService.findByCategory(category);
		}
		return Constant.PAGE_ARTCLE_INDEX;
	}

	public String navigateToArticleDetail(Article article) {
		selectedArticle = article;
		return Constant.PAGE_ARTCLE_DETAIL;
	}

	public String gotoEditArtice(Article article) {
		selectedArticle = article;
		return Constant.PAGE_ARTCLE_EDIT;
	}

	public String editArticle() {
		selectedArticle.setUpdatedDate(new Date());
		logger.info(loginBean.getAccount().getUserName() + " edited article id " + selectedArticle.getId());
		articleService.add(selectedArticle);
		
		selectedArticle = new Article();
		
		return navigateToManageArticle();
	}

	public String addArticle() {
		article.setCreatedDate(new Date());
		article.setUpdatedDate(new Date());
		article.setAccount(loginBean.getAccount());

		articleService.add(article);

		logger.info(loginBean.getAccount().getUserName() + " added an article");

		article = new Article();

		return navigateToManageArticle();
	}

	public void deleteArticle() {
		logger.info(loginBean.getAccount().getUserName() + " deleted news id " + selectedArticle.getId());
		articleService.delete(selectedArticle);
		articles = articleService.findByAccount(loginBean.getAccount());
		CommonUtils.addInfoMsg("growl", CommonUtils.getLocaleMessage("success.deleteNews"), "");
	}

	public void handleFileUpload(FileUploadEvent event) {
		try {
			copyFile(event.getFile().getFileName(), event.getFile().getInputstream());
		} catch (IOException e) {
			CommonUtils.addErrorMsg(null, CommonUtils.getLocaleMessage("error.upload.image"), "");
			logger.error("Upload Article Image Error: " + e.getMessage());
			System.out.println("handleFileUpload Error: " + e.getMessage());
		}
	}

	public void copyFile(String fileName, InputStream in) {
		try {
			String[] splittedFileName = fileName.split("\\.");
			fileName = splittedFileName[0].concat("_" + UUID.randomUUID().toString()) + "." + splittedFileName[1].toLowerCase();
			
			// write the inputStream to a FileOutputStream
			String uploadPath = FacesContext.getCurrentInstance().getExternalContext().getRealPath("/") + Constant.UPLOAD_ARTICLE_DESTINATION + fileName;
			OutputStream out = new FileOutputStream(new File(uploadPath));
			int read = 0;
			byte[] bytes = new byte[1024];

			// Refer META-INF/context.xml
			article.setImage("/images/article/"+fileName);
			selectedArticle.setImage("/images/article/"+fileName);

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

	public void deleteImage(int index) {
		article.setImage("");
	}

	public Article getArticle() {
		return article;
	}

	public void setArticle(Article article) {
		this.article = article;
	}

	public List<Article> getArticles() {
		return articles;
	}

	public void setArticles(List<Article> articles) {
		this.articles = articles;
	}

	public Article getSelectedArticle() {
		return selectedArticle;
	}

	public void setSelectedArticle(Article selectedArticle) {
		this.selectedArticle = selectedArticle;
	}
}
