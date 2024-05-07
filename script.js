(() => {
    const datePicker = document.getElementById("datePicker");
    const confirmBtn = document.getElementById("confirmBtn");
    const today = new Date().toISOString().split('T')[0];
    datePicker.setAttribute('max', today)

    chrome.storage.local.get(['literalnieGameDate'], function(result) {
        datePicker.value = result.literalnieGameDate ? result.literalnieGameDate : today;
    });

    function dateChange() {
        const date = datePicker.valueAsDate.toISOString().split('T')[0]
        chrome.storage.local.set({literalnieGameDate: date});

        const diff = calcDaysDifference(datePicker.valueAsDate);
        chrome.declarativeNetRequest.updateDynamicRules({
            addRules: [
                {
                    id: 1,
                    priority: 1,
                    action: {
                        type: 'redirect',
                        redirect: {
                            url: `https://api.literalnie.fun/literalnies?_limit=1&_start=${diff}&_sort=created_at:DESC`
                        }
                    },
                    condition: {
                        urlFilter: '*://*.literalnie.fun/literalnies?*',
                        resourceTypes: ['xmlhttprequest']
                    }
                }
            ],
            removeRuleIds: [1]
        });

    }

    function calcDaysDifference(givenDate) {
        const epoch = new Date(0);
        const currentDate = new Date();

        const currentMillis = currentDate - epoch;
        const givenMillis = givenDate - epoch;

        const millisecondsInADay = 24 * 60 * 60 * 1000;
        return Math.floor((currentMillis - givenMillis) / millisecondsInADay);
    }

    confirmBtn.addEventListener("click", dateChange)
})();
