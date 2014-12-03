package com.realestate.selenium;

import java.awt.AWTException;
import java.awt.Robot;
import java.awt.event.KeyEvent;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.TimeUnit;

import org.openqa.selenium.Alert;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.NoAlertPresentException;
import org.openqa.selenium.UnhandledAlertException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class NonWebProxies {

	public static void main(String[] args) throws AWTException, InterruptedException {
		WebDriver driver;

	    while (true) {
	    	// download chromedriver.exe at http://chromedriver.storage.googleapis.com/index.html
	    	System.setProperty("webdriver.chrome.driver", "D:/Git/chromedriver.exe");
			driver = new ChromeDriver();
//			driver = new FirefoxDriver();
			driver.manage().timeouts().implicitlyWait(10, TimeUnit.SECONDS);

		    driver.get(randomBaseURL());

		    try {
			    (new WebDriverWait(driver, 10)).until(new ExpectedCondition<Boolean>() {
			        public Boolean apply(WebDriver driver) {
			        	return ((JavascriptExecutor)driver).executeScript("return document.readyState").equals("complete");
			        }
			    });
		    } catch(UnhandledAlertException ex) {
		    	handleAlertException(driver);
		    }

//		    ((JavascriptExecutor) driver).executeScript("window.scrollTo(0,200)");
//		    driver.findElement(By.cssSelector("#color > a")).click();

		    String originalTab = driver.getWindowHandle();

		    Thread.sleep(10000);

//		    clickAndCloseAds(driver, 468, 0, originalTab);


		    // Login Page
//		    driver.findElement(By.xpath("/html/body/header/section/section/div[2]/nav/ul/li[5]/a")).click();
//		    driver.manage().timeouts().pageLoadTimeout(10, TimeUnit.SECONDS);
//		    driver.findElement(By.id("username")).clear();
//		    driver.findElement(By.id("username")).sendKeys("chukimphuong");
//		    driver.findElement(By.id("password")).clear();
//		    driver.findElement(By.id("password")).sendKeys("123456");
//		    driver.findElement(By.id("btnLogin")).click();
//
//		    Thread.sleep(15000);
//
//		    for(int i = 1; i < 4; i++) {
//			    // Search Page
//			    driver.findElement(By.xpath("/html/body/header/section/section/div[2]/nav/ul/li[2]/a")).click();
//			    driver.findElement(By.id("bedRoom_search")).click();
//			    driver.findElement(By.id("bedRoom_search")).clear();
//			    driver.findElement(By.id("bedRoom_search")).sendKeys("" + i);
//			    driver.findElement(By.xpath("//button[@type='submit']")).click();
//			    Thread.sleep(7500 * i);
////			    clickAndCloseAds(driver, 728, 0, originalTab);
//
//			    // Article Page
//			    driver.findElement(By.xpath("/html/body/header/section/section/div[2]/nav/ul/li[3]/a")).click();
//			    Thread.sleep(7500 * i);
//
//			    closeTabs(driver, originalTab);
//		    }
//
//		    // Index Page
//		    driver.findElement(By.xpath("/html/body/header/section/section/div[2]/nav/ul/li[1]/a")).click();
//		    Thread.sleep(15000);
//		    driver.findElement(By.xpath("/html/body/div[3]/section/section/aside/section[2]/a/img")).click();
//
//		    Thread.sleep(3500);
//		    clickAndCloseAds(driver, 120, 1, originalTab);

		    driver.quit();
	    }
	}

	private static void handleAlertException(WebDriver driver) {
		try {
			Alert alert = driver.switchTo().alert();
		    alert.dismiss();
	    	driver.switchTo().defaultContent();
		} catch(UnhandledAlertException ex) {
			handleAlertException(driver);
		}
	}

	private static void closeTabs(WebDriver driver, String originalTab) {
		for(String handle : driver.getWindowHandles()) {
	        if (!handle.equals(originalTab)) {
	            driver.switchTo().window(handle);
	            driver.close();
	        }
	    }

	    driver.switchTo().window(originalTab);
	}

	private static void clickAndCloseAds(WebDriver driver, int width, int index, String originalTab) throws InterruptedException {
	    driver.switchTo().frame(driver.findElements(By.xpath("//iframe[@width='" + width + "']")).get(index));
	    driver.switchTo().frame(driver.findElements(By.xpath("//iframe[@width='" + width + "']")).get(index));
	    driver.switchTo().frame(driver.findElements(By.xpath("//iframe[@width='" + width + "']")).get(index));
	    System.out.println(driver.findElements(By.tagName("img")).get(0).getAttribute("width"));
	    driver.findElement(By.cssSelector("#adk2_img > img")).click();
	    driver.findElement(By.cssSelector("#adk2_img > img")).click();
	    driver.findElement(By.cssSelector("#adk2_img > img")).click();

	    Thread.sleep(15000);

	    closeTabs(driver, originalTab);
	}

	private static String randomBaseURL() {
		Random random = new Random();
		// Syntax random number: random.nextInt(max - min + 1) + min
		int rdIndex = random.nextInt(4);

		List<String> baseUrls = new ArrayList<String>();
		baseUrls.add("http://nhadat-online.com/index.xhtml");
		baseUrls.add("http://nhadat-online.com/search.xhtml");
		baseUrls.add("http://nhadat-online.com/login.xhtml");
		baseUrls.add("http://nhadat-online.com/addNews.xhtml");

		return baseUrls.get(0);
	}
}
