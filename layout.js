var resizeDelay = 250;
var resizeThrottled = false;

var timeout = false;

document.addEventListener("DOMContentLoaded", ready);

window.addEventListener("resize", windowResized);

var slidesContainer = document.getElementById("slides_container");
slidesContainer.addEventListener("scroll", pagesScrolled);

function pagesScrolled() {
    clearTimeout(timeout)
    timeout = setTimeout(updateTabs, 100);
}

function updateTabs() {
    let pages = slidesContainer.children;
    let smallestX = Number.POSITIVE_INFINITY;
    let targetPage;
    Array.from(pages).forEach(function (currentItem, currentIndex) {
        if (Math.abs(currentItem.getBoundingClientRect().x) < smallestX) {
            smallestX = Math.abs(currentItem.getBoundingClientRect().x);
            targetPage = currentIndex + 1;
        }
    });

    localStorage.setItem("tabNumber", targetPage);
    
    let targetTabId = "tab_"+targetPage;
    let targetTab = document.getElementById(targetTabId);

    let allTabs = targetTab.parentElement.children;
        
    Array.from(allTabs).forEach(function (currentItem, currentIndex) {
        currentItem.style.background = "#aaa"
        currentItem.style.borderBottom = "none";
    });
        
    targetTab.style.background = "#eee";
    targetTab.style.borderBottom = "solid #F30001 2px";
}


function windowResized() {
    if (!resizeThrottled) {
        resizeThrottled = true;
        checkWindowHeight();
    }
    setTimeout(function() {
        resizeThrottled = false
    }, resizeDelay);
}

function checkWindowHeight() {
    let targetTab = localStorage.getItem("tabNumber");
    let targetPageId = "page_"+targetTab;

    if (targetTab !== null) {
        let targetPage = document.getElementById(targetPageId);
        
        if (targetPage.scrollHeight > targetPage.clientHeight) {
            targetPage.style.overflowY = "scroll";
        } else {
            targetPage.style.overflowY = "hidden";
        }
    }
}

function ready() {
    let tabNumber = localStorage.getItem("tabNumber");
    //console.log(tabNumber);
    
    if (tabNumber !== null) {
        let targetTabId = "tab_"+tabNumber;
        let targetTab = document.getElementById(targetTabId);
    
        let allTabs = targetTab.parentElement.children;
    
        //console.log(allTabs);
        
        Array.from(allTabs).forEach(function (currentItem, currentIndex) {
            //console.log(currentItem);
            currentItem.style.background = "#aaa"
            currentItem.style.borderBottom = "none";
        });
        
        targetTab.style.background = "#eee";
        targetTab.style.borderBottom = "solid #F30001 2px";
        
        
        
        let targetPage = document.getElementById("page_"+tabNumber);
        //console.log(targetPage);
        
        if (targetPage.scrollHeight > targetPage.clientHeight) {
            //console.log("overflow");
            targetPage.style.overflowY = "scroll";
        } else {
            //console.log("no overflow");
            targetPage.style.overflowY = "hidden";
        }
        
        targetPage.scrollIntoView();
    }
}



let tab1 = document.getElementById("tab_1");
tab1.addEventListener("click", selectTab);

let tab2 = document.getElementById("tab_2");
tab2.addEventListener("click", selectTab);

let tab3 = document.getElementById("tab_3");
tab3.addEventListener("click", selectTab);

function selectTab() {
    let targetTab = event.target;
    let allTabs = targetTab.parentElement.children;

    console.log(allTabs);
    
    Array.from(allTabs).forEach(function (currentItem, currentIndex) {
        console.log(currentItem);
        currentItem.style.background = "#aaa"
        currentItem.style.borderBottom = "none";
    });
    
    targetTab.style.background = "#eee";
    targetTab.style.borderBottom = "solid black 2px";

    console.log(targetTab.id)
    let tabNumber = targetTab.id.split("_")[1];

    localStorage.setItem("tabNumber", tabNumber);
    
    let targetPageId = "page_"+tabNumber;
    console.log(targetPageId);
    
    let targetPage = document.getElementById(targetPageId);
    console.log(targetPage);
    
    if (targetPage.scrollHeight > targetPage.clientHeight) {
        console.log("overflow");
        targetPage.style.overflowY = "scroll";
    } else {
        console.log("no overflow");
        targetPage.style.overflowY = "hidden";
    }

    targetPage.scrollIntoView();
    
}