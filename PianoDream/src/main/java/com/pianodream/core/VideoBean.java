package com.pianodream.core;

import java.io.Serializable;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import javax.annotation.PostConstruct;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import com.pianodream.model.Video;
import com.pianodream.service.VideoService;
import com.pianodream.util.CommonUtils;
import com.pianodream.util.Constant;

@Component("VideoBean")
@Scope("session")
public class VideoBean implements Serializable {

	private static final long serialVersionUID = 6361017448750047324L;

	static final Logger logger = Logger.getLogger(VideoBean.class);

	private Video addVideo;
	private Video selectedVideo;

	private String tags;
	private List<Video> myVideos;


	@Autowired
	LoginBean loginBean;

	@Autowired
	VideoService videoService;


	public VideoBean(){
		super();
	}

	@PostConstruct
	private void init(){
		addVideo = new Video();
		tags = "";
		myVideos = videoService.findByAccount(loginBean.getAccount());
	}

	public String add() {
		addVideo.setTags(Arrays.asList(tags.split(",")));
		addVideo.setCreatedDate(new Date());
		addVideo.setAccount(loginBean.getAccount());

		videoService.add(addVideo);

		String msg = "Video '" + addVideo.getTitle() + "' added !!!";

		logger.info(msg);

		CommonUtils.addSuccessMsg(msg);

		init();
		return Constant.PAGE_VIDEO_INDEX;
	}

	public String navToVideoDetail(Video video) {
		selectedVideo = video;
		return Constant.PAGE_VIDEO_DETAIL;
	}

	public Video getAddVideo() {
		return addVideo;
	}

	public void setAddVideo(Video addVideo) {
		this.addVideo = addVideo;
	}

	public String getTags() {
		return tags;
	}

	public void setTags(String tags) {
		this.tags = tags;
	}

	public List<Video> getMyVideos() {
		return myVideos;
	}

	public void setMyVideos(List<Video> myVideos) {
		this.myVideos = myVideos;
	}

	public Video getSelectedVideo() {
		return selectedVideo;
	}

	public void setSelectedVideo(Video selectedVideo) {
		this.selectedVideo = selectedVideo;
	}

}
