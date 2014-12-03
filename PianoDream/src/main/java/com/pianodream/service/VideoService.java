package com.pianodream.service;

import java.util.List;

import com.pianodream.model.Account;
import com.pianodream.model.Video;

public interface VideoService {
	public void add(Video video);
	public void edit(Video video);
	public void delete(Video video);
	public List<Video> findByAccount(Account account);
}
