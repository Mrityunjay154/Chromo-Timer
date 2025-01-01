let seconds = 30 * 60;
let timerIsRunning = false;
chrome.alarms.onAlarm.addListener((alarm) => {
    if(!timerIsRunning){
        return;
    }
    seconds--;
    const mint = Math.floor(seconds / 60) + "M";
    chrome.action.setBadgeText(
        {
          text: mint
        },
        () => { }
    );
    if(seconds <= 0){
        clearAlarm("chromo-timer");
        createNotifications("Your timer has finished. Take a break!");
        chrome.contextMenus.update("start-timer", {
            title: "Start Timer",
            contexts: ["all"]
        }); 
        chrome.action.setBadgeText(
            {
              text: "-",
            },
            () => { }
        );
        chrome.action.setBadgeBackgroundColor(
            {color: "green"},  
            () => { },
        );
    }
});
function createAlarm(name){
    chrome.alarms.create(name,
        {
            periodInMinutes:1/60
        });
}

function createNotifications(message){
    const opt = {
        type: 'list',
        title: 'Chromo timer',
        message,
        items: [{ title: 'Chromo timer', message: message}],
        iconUrl:'time-7-48.png'
    
    };
    chrome.notifications.create(opt);
}

function clearAlarm(name){
    chrome.alarms.clear(name, (wasCleared) => {
        console.log(wasCleared);
    });
}
chrome.contextMenus.create({
    id: "start-timer",
    title: "Start Timer",
    contexts: ["all"]
}); 
chrome.contextMenus.create({
    id: "reset-timer",
    title: "Reset Timer",
    contexts: ["all"]
}); 
chrome.contextMenus.onClicked.addListener(function(info, tab) {
    switch(info.menuItemId){
        case "reset-timer":
            chrome.contextMenus.update("start-timer", {
                title: "Start Timer",
                contexts: ["all"]
            });
            chrome.action.setBadgeText(
                {
                  text: "R",
                },
                () => { }
            );
            clearAlarm("chromo-timer");
            chrome.action.setBadgeBackgroundColor(
                {color: "green"},  
                () => { },
            );
            createNotifications("Your timer has reset");
            timerIsRunning = false;
            seconds = 0;
            break;
        case "start-timer":
            if(timerIsRunning){
                chrome.action.setBadgeText(
                    {
                      text: "-",
                    },
                    () => { }
                );
                chrome.action.setBadgeBackgroundColor(
                    {color: "red"},  
                    () => { },
                );
                createNotifications("Your timer has stopped");
                chrome.contextMenus.update("start-timer", {
                    title: "Start Timer",
                    contexts: ["all"]
                }); 
                timerIsRunning = false;
                return;
            }
            seconds = seconds <= 0 ? 30 * 60 : seconds;
            createNotifications("Your timer has started");
                timerIsRunning = true;
                createAlarm("chromo-timer");
                chrome.action.setBadgeBackgroundColor(
                    {color: "white"},  
                    () => { },
                );
                chrome.contextMenus.update("start-timer", {
                    title: "Stop Timer",
                    contexts: ["all"]
                }); 
                break;
                default:
                break;
            }
    });
chrome.action.setBadgeBackgroundColor(
    {color: "red"},  
        () => { }
);