package com.pianodream.util;

import javax.mail.Message.RecipientType;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/**
 * Sending emails to user.
 */
@Service("MailService")
public class MailService {

	@Autowired
	private JavaMailSender mailSender;

	public void sendMail(String fromEmail, String toEmail, String subject, String body) {
		try {
			MimeMessage message = mailSender.createMimeMessage();
			
			message.addFrom(new InternetAddress[] { new InternetAddress(fromEmail) });
			message.addRecipient(RecipientType.TO, new InternetAddress(toEmail));
			message.setSubject(subject, "UTF-8");
			message.setText(body, "UTF-8", "html");
			System.setProperty("mail.mime.charset", "utf8");
			
			mailSender.send(message);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

}
