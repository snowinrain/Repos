package com.pianodream.common;

import java.io.Serializable;
import java.util.Locale;

import javax.faces.context.FacesContext;

import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

@Component("LocaleBean")
@Scope("session")
public class LocaleBean implements Serializable {
	private static final long serialVersionUID = 1L;

	private Locale locale;

	public LocaleBean() {
		locale = new Locale("en", "US");
	}

	// value change event listener
	public void countryLocaleCodeChanged(String localeCode) {
		if (localeCode.equals("en")) {
			locale = new Locale("en", "US");
		} else if (localeCode.equals("vi")) {
			locale = new Locale("vi", "VN");
		}

		FacesContext.getCurrentInstance().getViewRoot().setLocale(locale);
		locale = FacesContext.getCurrentInstance().getViewRoot().getLocale();
	}

	public Locale getLocale() {
		return locale;
	}

	public void setLocale(Locale locale) {
		this.locale = locale;
	}


}
