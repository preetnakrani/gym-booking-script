/**
 * A Lambda function that logs the payload received from a CloudWatch scheduled event.
 */
 const puppeteer = require('puppeteer');

exports.bookingHandler = async (event, context) => {
    // All log statements are written to CloudWatch by default. For more information, see
    // https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-logging.html
    console.log(JSON.stringify(event));
    if (process.env.book === "no") {
        return;
    } else {
        if (process.env.eve === "no" && new Date().getHours() === 0) {
            return;
        }
        if (process.env.mor === "no" && new Date().getHours() === 18) {
            return;
        }
        await hello();
    }
};

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

function getDateInFormat() {
    let d = new Date();
    let utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    var nd = new Date(utc + (3600000 * (-7)));
    let yr = nd.getFullYear().toString();
    console.log(nd);
    console.log(nd.getMonth())
    console.log(nd.getDate())
    let mon = ((nd.getMonth() + 1).toString().length === 1) ? ("0" + (nd.getMonth() + 1).toString()) : (nd.getMonth() + 1).toString();
    let day = (nd.getDate().toString().length === 1) ? ("0" + nd.getDate().toString()) : nd.getDate().toString();
    let date = yr + mon + day;
    return date;
}

function refreshAt(hours, minutes, seconds) {
  var now = new Date();
  var then = new Date();

  function clickRegister() {
      document.getElementsByClassName("bm-button bm-book-button")[0].click();
  }

  function sleep(milliseconds) {
      const date = Date.now();
      let currentDate = null;
      do {
        currentDate = Date.now();
      } while (currentDate - date < milliseconds);
    }

  if(now.getHours() > hours ||
     (now.getHours() == hours && now.getMinutes() > minutes) ||
      now.getHours() == hours && now.getMinutes() == minutes && now.getSeconds() >= seconds) {
      then.setDate(now.getDate() + 1);
  }
  then.setHours(hours);
  then.setMinutes(minutes);
  then.setSeconds(seconds);

  var timeout = (then.getTime() - now.getTime());
  setTimeout(function () {
      window.location.reload(true);
      sleep(500);
      clickRegister();
  }, timeout);
}
  
async function hello() {
    let username = process.env.username;
    let password = process.env.password;
    let time = process.env.time;
    // let d = new Date();
    // let utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    // var nd = new Date(utc + (3600000 * (-7)));
    let date = getDateInFormat();
    if (process.env.date === "yes") {
        date = process.env.date_value;
    }
    let utcDate = new Date();
    let hr = 1;
    if (utcDate.getHours() === 0) {
        hr = 1;
    } else {
        hr = 19;
    }
    let min = 0;
    let sec = 0.5;
    let gym = (process.env.gym === "arc") ? 0 : 1;
    let flag = (process.env.flag === "t") ? false : true;
    const browser = await puppeteer.launch({ headless: flag });
    const page = await browser.newPage();
    await page.setViewport({ width: 1000, height: 1600 });
    await page.goto('https://portal.recreation.ubc.ca/sso/index.php');
    await page.type('#username', username);
    await page.type('#password', password);
    await page.click('button.ui-button.ui-widget.ui-state-default.ui-corner-all.ui-button-text-only.btn');
    await page.waitForSelector(`.subsection-header-text`, { timeout: 0 });
    await page.click(`[href="/Contacts/BookMe4?widgetId=15f6af07-39c5-473e-b053-96653f77a406"]`);
    await page.waitForSelector(".bm-box-title");
    await page.waitForSelector(`a.bm-category-calendar-link.enabled`);
    await page.evaluate((gym) => { document.querySelectorAll("a.bm-category-calendar-link.enabled")[gym].click() }, gym);
    await page.waitForNavigation({ waitUntil: "networkidle0" });
    await page.evaluate((date, time) => {
        let allSlots = document.querySelectorAll(".bm-class-container");
        let slot = [...allSlots].filter((el) => {
            return ((el.childNodes[3].childNodes[3].childNodes[1].onclick.toString().includes(`Date=${date}`))
                && (el.childNodes[5].childNodes[1].childNodes[0].textContent.includes(time)));
        });
        slot[0].childNodes[3].childNodes[3].childNodes[1].click();
    }, date, time);
    await page.waitForSelector(".bm-course-primary-event-name.bm-event-name-h1");
    let refreshDate = new Date();
    if (process.env.refresh === "no") {
        refreshDate.setMinutes(refreshDate.getMinutes() + 1);
        hr = refreshDate.getHours();
        min = refreshDate.getMinutes();
        sec = refreshDate.getSeconds();
    } else if (process.env.refresh === "custom") {
        let timeInputs = (process.env.refresh_value).split("_");
        hr = Number(timeInputs[0]);
        min =  Number(timeInputs[1]);
        sec =  Number(timeInputs[2]);
    }
    await page.evaluate((hr, min, sec) => {
        let book = (hours, minutes, seconds) => {
            var now = new Date();
            var then = new Date();
    
            function clickRegister() {
                document.getElementsByClassName("bm-button bm-book-button")[0].click();
            }
    
            function sleepWhileLoad() {
                let currNum = 0;
                do {
                    currNum = currNum + 1;
                } while (document.readyState !== "complete");
            }
    
            function sleep(milliseconds) {
                const date = Date.now();
                let currentDate = null;
                do {
                    currentDate = Date.now();
                } while (currentDate - date < milliseconds);
            }
    
            if (now.getHours() > hours ||
                (now.getHours() == hours && now.getMinutes() > minutes) ||
                now.getHours() == hours && now.getMinutes() == minutes && now.getSeconds() >= seconds) {
                then.setDate(now.getDate() + 1);
            }
            then.setHours(hours);
            then.setMinutes(minutes);
            then.setSeconds(seconds);
    
            var timeout = (then.getTime() - now.getTime());
            setTimeout(function () {
                window.location.reload(true);
                sleep(500);
                clickRegister();
            }, timeout);
        }
        book(hr, min, sec);

    }, hr, min, sec);
    // sleep(20000);
    // await page.mouse.click(897, 174);
    await page.waitForFunction(
        () => {
            if (document.querySelector('label[for="ParticipantsFamily_FamilyMembers_0__IsParticipating"]') === null || document.querySelector('section.bm-booking-info.bm-restrictions') === null) {
                return false;
            } else {
                return true;
            }
        }
        , { timeout: 0 });
    await page.evaluate(() => {
        document.querySelector('a[title="Next"]').click();
    });
    await page.waitForFunction(
        () => {
            if (document.querySelector('strong') === null) {
                return false;
            } else {
                if (document.querySelector('strong').innerText.includes("PROGRAM WAIVER")) {
                    return true;
                } else {
                    return false;
                }
            }
        }
        , { timeout: 0 });
    sleep(2000);
    await page.evaluate(() => {
        document.querySelector('a[title="Next"]').click();
    });
    await page.waitForFunction(
        () => {
            if (document.querySelectorAll('span')[27] === null || document.querySelectorAll('span')[27] === undefined) {
                return false;
            } else {
                if (document.querySelectorAll('span')[27].innerText.includes("Modify Booking")) {
                    return true;
                } else {
                    return false;
                }
            }
        }
        , { timeout: 0 });
    await page.click("#checkoutButton");
    sleep(10000);
    await page.mouse.click(155, 452);
    await page.waitForFunction(() => {
        if (document.querySelector('h1.h1') === null || document.querySelector('h1.h1') === undefined) {
            return false;
        } else {
            if (document.querySelector('h1.h1').innerText.includes("Thank you!")) {
                return true;
            } else {
                return false;
            }
        }
    });
    sleep(10000);
    await browser.close();
};