function calendarApp(url) {
    if (url.startsWith('https://calendar.google.com/calendar/u/0/r/eventedit')) {
        waitForElm(detailedWindowClass).then((notificationElement) => {
            return appendButton(notificationElement, 'detailed window');
        });
    }
    injectFlowcasterButton();
}

function injectFlowcasterButton() {
    waitForElm(createWindowClass).then((createWindow) => {
        
        waitForElm(popupWindowBodyClass).then((popupWindow) => {
            let innerBody = $(popupWindow).children()[2];
            let innerBodyChildren = $(innerBody).children();

            for (let i = 0; i < $(innerBodyChildren).children().length; i++) {
                if ($(innerBodyChildren).children()[i].id == 'tabEvent') {
                    appendButton($(innerBodyChildren).children()[i], 'minimized window');
                    break;
                }
            }
        });

    });
}


function appendButton(element, caller) {
  let flowcasterButton = document.createElement('div');
    flowcasterButton.innerHTML = newElement().trim();

    element.appendChild(flowcasterButton);
    if (caller == 'detailed window') {
        element.insertBefore(flowcasterButton, $(detailedWindowClass).children()[0]);
    }
    else if (caller == 'minimized window') {
        element.insertBefore(flowcasterButton, $(element).children()[0]);
    }
    handleButtonClicks(caller);
}


function handleButtonClicks(caller) {

    let saveButton = {};
    if (caller == 'minimized window') {

        waitForElm(popupWindowButtonsClass).then((popupWindowButtons) => {
            let moreOptionsButton = $($(popupWindowButtons).children()).children()[0];
            saveButton = $($(popupWindowButtons).children()).children()[3];

            $(moreOptionsButton).unbind('click.moreOptionsNamespace').bind('click.moreOptionsNamespace', function (event) {
              
                waitForElm(detailedWindowClass).then((notificationElement) => {
                    return appendButton(notificationElement, 'detailed window');
                });
            });
        });
    }
    else if (caller == 'detailed window') {
        xButtonClass = xButtonClassDetailedWindow;
        waitForElm(saveButtonContainerClass).then((saveButtonContainer) => {
            saveButton = $($(saveButtonContainer).children()[1]).children()[2];
        });
    }

    $("#flowcaster-button").unbind('click.flowcasterBtn').bind('click.flowcasterBtn', function () {
        console.log(document.getElementById('location-bullet'));
        if (document.getElementById('flowcaster-button-text').innerHTML == 'Join with Flowcaster.live') {
            $('[role=combobox]').filter(function () {
                if ($(this).attr('aria-label') == 'Location') {
                    if (this.value) {
                            window.open(this.value, '_blank').focus();
                    }
                }
            });
        }
        else {
            linkFlowcasterMeetingWithEvent(caller);
        }
    });
    $(saveButton).unbind('click.saveNamespace').bind('click.saveNamespace', function (event) {
        return injectFlowcasterButton();
    });
}
