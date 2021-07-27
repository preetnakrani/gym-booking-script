const puppeteer = require("puppeteer");

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

exports.bookSlot = async (options) => {
  // open browser
  const browser = await puppeteer.launch({
    headless: options.headless,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  // open new page and go to webpage
  let page = await browser.newPage();
  await page.setViewport({ width: 1000, height: 1600 });
  await page.goto("https://portal.recreation.ubc.ca/sso/index.php");

  // enter username and password
  await page.type("#username", options.username);
  await page.type("#password", options.password);

  // click sign in button
  await page.click(
    "button.ui-button.ui-widget.ui-state-default.ui-corner-all.ui-button-text-only.btn"
  );

  // wait for the the homepage to appear
  await page.waitForSelector(`.subsection-header-text`, { timeout: 100000 });

  // click link to open page to select arc or birdcoop
  await page.click(
    `[href="/Contacts/BookMe4?widgetId=15f6af07-39c5-473e-b053-96653f77a406"]`
  );
  await page.waitForSelector(".bm-box-title");
  await page.waitForSelector(`a.bm-category-calendar-link.enabled`);

  // click bridcoop or arc
  await page.evaluate((gym) => {
    document
      .querySelectorAll("a.bm-category-calendar-link.enabled")
      [gym].click();
  }, options.gym);

  // wait for slots page to load
  await page.waitForNavigation({ waitUntil: "networkidle0" });

  // get the desired slot, incorrect time or date is picked an error will be thrown
  await page.evaluate(
    (date, time) => {
      let allSlots = document.querySelectorAll(".bm-class-container");
      let slot = [...allSlots].filter((el) => {
        return (
          el.childNodes[3].childNodes[3].childNodes[1].onclick
            .toString()
            .includes(`Date=${date}`) &&
          el.childNodes[5].childNodes[1].childNodes[0].textContent.includes(
            time
          )
        );
      });
      slot[0].childNodes[3].childNodes[3].childNodes[1].click();
    },
    options.date,
    options.time
  );
  await page.waitForSelector(".bm-course-primary-event-name.bm-event-name-h1");

  // wait for refresh at specified time to book slot
  if (options.refresh) {
    await page.evaluate((hr) => {
      let book = (hours) => {
        function clickRegister() {
          document
            .getElementsByClassName("bm-button bm-book-button")[0]
            .click();
        }

        function sleep(milliseconds) {
          const date = Date.now();
          let currentDate = null;
          do {
            currentDate = Date.now();
          } while (currentDate - date < milliseconds);
        }

        let now = new Date(
          new Date().toLocaleString("en-US", { timeZone: "America/Vancouver" })
        );
        let then = new Date(
          new Date().toLocaleString("en-US", { timeZone: "America/Vancouver" })
        );
        then.setHours(hours);
        then.setMinutes(0);
        then.setSeconds(0);
        then.setMilliseconds(1);
        let timeout = then.getTime() - now.getTime();
        setTimeout(function () {
          Location.reload();
          sleep(500);
          clickRegister();
        }, timeout);
      };
      book(hr);
    }, parseInt(options.time.split(":")[0]));
  }

  await page.waitForFunction(
    () => {
      if (
        document.querySelector(".bm-button.bm-book-button") === null ||
        document.querySelector(".bm-button.bm-book-button") === undefined
      ) {
        return false;
      } else {
        if (
          document
            .querySelector(".bm-button.bm-book-button")
            .innerText.includes("REGISTER NOW")
        ) {
          return true;
        } else {
          return false;
        }
      }
    },
    { timeout: options.refresh ? 0 : 30000 }
  );

  // click register
  await page.click(".bm-button.bm-book-button");

  await page.waitForFunction(() => {
    if (
      document.querySelector(
        'label[for="ParticipantsFamily_FamilyMembers_0__IsParticipating"]'
      ) === null ||
      document.querySelector("section.bm-booking-info.bm-restrictions") === null
    ) {
      return false;
    } else {
      return true;
    }
  });

  // click next
  await page.evaluate(() => {
    document.querySelector('a[title="Next"]').click();
  });

  await page.waitForFunction(() => {
    if (document.querySelector("strong") === null) {
      return false;
    } else {
      if (
        document.querySelector("strong").innerText.includes("PROGRAM WAIVER")
      ) {
        return true;
      } else {
        return false;
      }
    }
  });

  await page.waitForFunction(() => {
    if (document.querySelector('a[title="Next"] > span')) {
      return true;
    } else {
      return false;
    }
  });

  // wait for the page to fully load and then clikc the next button
  sleep(2000);
  await page.evaluate(() => {
    document.querySelector('a[title="Next"] > span').click();
  });

  await page.waitForSelector("#checkoutButton");

  // click checkout button
  sleep(2000);
  await page.evaluate(() => {
    document.querySelector("#checkoutButton").click();
  });

  // wait for page load and click a specific spot to place order
  sleep(10000);
  await page.mouse.click(155, 452);

  await page.waitForFunction(() => {
    if (
      document.querySelector("h1.h1") === null ||
      document.querySelector("h1.h1") === undefined
    ) {
      return false;
    } else {
      if (document.querySelector("h1.h1").innerText.includes("Thank you!")) {
        return true;
      } else {
        return false;
      }
    }
  });

  sleep(2000);
  await browser.close();
};
