if (document.readyState === 'complete') {
    console.log("bin ready mit laden fange mit dem Script an");
    $("#besuchsbericht_erstellen").click(function () {
        alert("Danke!");
    });


    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/your-worker-for-service.js').then(function () {
            console.log('Service Worker Registered');
        });
    };

    let deferredPrompt;
    const addBtn = document.querySelector('.add-button');
    addBtn.style.display = 'none';

    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later.
        deferredPrompt = e;
        // Update UI to notify the user they can add to home screen
        addBtn.style.display = 'block';

        addBtn.addEventListener('click', (e) => {
            // hide our user interface that shows our A2HS button
            addBtn.style.display = 'none';
            // Show the prompt
            deferredPrompt.prompt();
            // Wait for the user to respond to the prompt
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the A2HS prompt');
                } else {
                    console.log('User dismissed the A2HS prompt');
                }
                deferredPrompt = null;
            });
        });
    });

    var jsonData = "";

    $("#load").click(function getData() {

        var data = $(document).ready(function () {
            // Beispiel unter https://de.wikipedia.org/wiki/XMLHttpRequest und https://en.wikipedia.org/wiki/XMLHttpRequest.
            var xmlHttp = null;
            try {
                xmlHttp = new XMLHttpRequest();
            } catch (e) {
                // Fehlerbehandlung, falls die Schnittstelle vom Browser nicht unterstützt wird.
            }
            if (xmlHttp) {
                //var restURL = "http://169.254.80.80/address.nsf/api/data/collections/name/contact_view";
                // Standardanzahl der Einträge ist 10;
                // kann aber mithilfe dieses Response Header-Anhangs auf mehr Einträge vergrößert werden.
                // https://www-10.lotus.com/ldd/ddwiki.nsf/xpAPIViewer.xsp?lookupName=IBM+Domino+Access+Services+9.0.1#action=openDocument&res_title=Viewfolder_entries_GET_dds10&content=apicontent&sa=true
                //var requestURL = restURL + "?count=99";
                //xmlHttp.open("GET", requestURL, true);


                //xmlHttp.withCredentials = true;

                // Die beiden RequestHeader sollen laut IBM immer angegeben werden 
                // (http://infolib.lotus.com/resources/domino/8.5.3/doc/designer_up1/en_us/DominoDataService.html#unique_339072081)
                //xmlHttp.setRequestHeader("Content-Type", "application/json");
                //xmlHttp.setRequestHeader("Accept", "application/json");
                // Siehe: https://stackoverflow.com/questions/1652178/basic-authentication-with-xmlhttprequest
                //xmlHttp.setRequestHeader("Authorization", "Basic " + btoa("username:password"));
                //var pw1 = $("#name").val();
                //var pw2 = $("#password").val();
                //xmlHttp.setRequestHeader("Authorization", "Basic " + btoa(pw1+":"+pw2));
                var restURL = /*$("#link").val() +*/ "http://192.168.100.60/pwa.nsf/api/data/collections/name/forumular" /*+ $("#viewName").val()*/ ;
                //+contact_view name der View
                var requestURL = restURL + "?count=20000";
                console.log(requestURL);
                xmlHttp.open("GET", requestURL, true);
                //"http://169.254.80.80/address.nsf/api/data/collections/name/contact_view?count=100"
                xmlHttp.withCredentials = true;
                xmlHttp.setRequestHeader("Access-Control-Allow-Origin", "*");
                xmlHttp.setRequestHeader("Content-Type", "application/json");
                xmlHttp.setRequestHeader("Accept", "application/json");
                var pw1 = "phil osoph" /*$("#name").val()*/ ;
                var pw2 = "Baum123" /*$("#password").val()*/ ;
                xmlHttp.setRequestHeader("Authorization", "Basic " + btoa(pw1 + ":" + pw2));
                //xmlHttp.setRequestHeader("Authorization", "Basic " + btoa("Phil Osoph:Baum123"));

                xmlHttp.onreadystatechange = function () {
                    // readyState 1 = OPENED
                    // readyState 2 = HEADERS_RECEIVED
                    // readyState 3 = LOADING
                    // readyState 4 = DONE
                    // status 200 = "OK"
                    console.log(xmlHttp.readyState);
                    console.log(xmlHttp.status);
                    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                        var data = null;
                        try {
                            data = JSON.parse(xmlHttp.responseText);
                            console.log(data);
                            jsonData = data;
                            document.getElementById("add").disabled = false;
                        } catch (e) {
                            // Der DDS gibt html zurück, wenn keine Zugriffsberechtigung vorliegt.
                            console.log(restURL + " does not return a valid JSON-Array: " + e);
                            // Für Screenshots des Knowledge Management Artikels Login in eine separate html verschieben
                            // und Session Authentication verwenden.
                            // Wenn die restURL ohne Paswort angefragt wird, wird eine HTML-Seite und kein JSON zurückgegeben.
                            if (xmlHttp.responseText.startsWith("<!DOCTYPE HTML PUBLIC")) {
                                window.location.href = "http://169.254.80.80/login.html";
                            }
                        }
                    }
                };
                xmlHttp.send();
            }
        });
    });
}