package com.realestate.selenium;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.TimeUnit;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.WebDriverWait;

public class WebProxies {

	public static void main(String[] args) throws InterruptedException {
		WebDriver driver;

	    while (true) {
	    	// download chromedriver.exe at http://chromedriver.storage.googleapis.com/index.html
//	    	System.setProperty("webdriver.chrome.driver", "D:/Git/chromedriver.exe");
//			driver = new ChromeDriver();
			driver = new FirefoxDriver();
			driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);

		    driver.get("http://www.lurk.info/");
		    driver.findElement(By.id("url")).clear();
		    driver.findElement(By.id("url")).sendKeys(randomBaseURL());
		    driver.findElement(By.cssSelector("input.button")).click();
		    // wait for the application to get fully loaded
		    WebElement wait1 = (new WebDriverWait(driver, 10)).until(new ExpectedCondition<WebElement>() {
		        public WebElement apply(WebDriver d) {
		        	System.out.println(d.findElement(By.linkText("SnowinRain")));
		            return d.findElement(By.linkText("SnowinRain"));
		        }
		    });
		    
		    driver.switchTo().frame(driver.findElements(By.xpath("//iframe[@width='728']")).get(0));
//		    driver.switchTo().frame(driver.findElements(By.xpath("//iframe[@width='120']")).get(0));
		    driver.findElement(By.cssSelector("body > a > img")).click();
		    driver.findElement(By.cssSelector("body > a > img")).click();
		    driver.findElement(By.cssSelector("body > a > img")).click();

		    Thread.sleep(15000);

		    driver.quit();

//		    System.setProperty("webdriver.chrome.driver", "D:/Git/chromedriver.exe");
//			driver = new ChromeDriver();
//		    driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
//		    driver.get("http://www.zendproxy.com/");
//		    driver.findElement(By.id("input")).click();
//		    driver.findElement(By.id("input")).clear();
//		    driver.findElement(By.id("input")).sendKeys(randomBaseURL());
//		    driver.findElement(By.cssSelector("input.button")).click();
//		    WebElement wait2 = (new WebDriverWait(driver, 10)).until(new ExpectedCondition<WebElement>() {
//		        public WebElement apply(WebDriver d) {
//		        	System.out.println(d.findElement(By.linkText("SnowinRain")));
//		            return d.findElement(By.linkText("SnowinRain"));
//		        }
//		    });
//		    driver.findElement(By.cssSelector("iframe > html > body > a > img")).click();
//		    driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
//		    driver.quit();
//
//		    driver = new FirefoxDriver();
//		    driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
//		    driver.get("http://anonymouse.org/");
//		    driver.findElement(By.linkText("English")).click();
//		    driver.findElement(By.name("what")).click();
//		    driver.findElement(By.name("what")).clear();
//		    driver.findElement(By.name("what")).sendKeys(randomBaseURL());
//		    driver.findElement(By.cssSelector("input[type=\"submit\"]")).click();
//		    WebElement wait3 = (new WebDriverWait(driver, 10)).until(new ExpectedCondition<WebElement>() {
//		        public WebElement apply(WebDriver d) {
//		        	System.out.println(d.findElement(By.linkText("SnowinRain")));
//		            return d.findElement(By.linkText("SnowinRain"));
//		        }
//		    });
//		    driver.quit();
	    }
	}

	private static String randomBaseURL() {
		Random random = new Random();
		//random.nextInt(max - min + 1) + min
		int rdIndex = random.nextInt(4);

		List<String> baseUrls = new ArrayList<String>();
		baseUrls.add("http://nhadat-online.com/");
		baseUrls.add("http://nhadat-online.com/search.xhtml");
		baseUrls.add("http://nhadat-online.com/login.xhtml");
		baseUrls.add("http://nhadat-online.com/addNews.xhtml");

		return baseUrls.get(0);
	}
}
