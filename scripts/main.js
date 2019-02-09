console.log("hallo");

var idbApp = (function () {
    'use strict';

    console.log("bin ready mit laden fange mit dem Script an");
    $("#besuchsbericht_erstellen").click(function () {
        alert("Danke!");
    });


    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('../your-worker-for-service.js').then(function () {
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

    if (!('indexedDB' in window)) {
        console.log('This browser doesn\'t support IndexedDB');
        return;
    }

    var dbPromise = idb.open('besuchsberichte', 1, function (upgradeDb) {
        switch (upgradeDb.oldVersion) {
            case 0:

            case 1:
                console.log("Erstelle das besuchsberichte object");
                upgradeDb.createObjectStore("besuchsberichte", {
                    keyPath: 'UNID',
                    unique: true

                });

                //später für die suche eventuell indexing einfügen
                // case 2:
                //     console.log("Creating a UNID index");
                //     var store = upgradeDb.transaction.objectStore("besuchsberichte");
                //     store.createIndex("UNID", "UNID");
                // case 3:
                // 	console.log("Creating a price index");
                // 	var store = upgradeDb.transaction.objectStore("address");
                // 	store.createIndex("phone", "Phone");
                // case 4:
                // 	console.log("Creating a description index");
                // 	var store = upgradeDb.transaction.objectStore("address");
                // 	store.createIndex("address", "Address");
        }
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


                xmlHttp.withCredentials = true;

                // Die beiden RequestHeader sollen laut IBM immer angegeben werden 
                // (http://infolib.lotus.com/resources/domino/8.5.3/doc/designer_up1/en_us/DominoDataService.html#unique_339072081)
                //xmlHttp.setRequestHeader("Content-Type", "application/json");
                //xmlHttp.setRequestHeader("Accept", "application/json");
                // Siehe: https://stackoverflow.com/questions/1652178/basic-authentication-with-xmlhttprequest
                //xmlHttp.setRequestHeader("Authorization", "Basic " + btoa("username:password"));
                //var pw1 = $("#name").val();
                //var pw2 = $("#password").val();
                //xmlHttp.setRequestHeader("Authorization", "Basic " + btoa(pw1+":"+pw2));
                var restURL = /*$("#link").val() +*/ "https://tur-top.local/pwa.nsf/api/data/collections/name/forumular_view" /*+ $("#viewName").val()*/ ;
                //+contact_view name der View
                var requestURL = restURL + "?count=20000";
                //console.log(requestURL);
                xmlHttp.open("GET", requestURL);
                //"http://169.254.80.80/address.nsf/api/data/collections/name/contact_view?count=100"
                //xmlHttp.withCredentials = true;
                xmlHttp.setRequestHeader("Access-Control-Allow-Origin", "*");
                xmlHttp.setRequestHeader("Content-Type", "application/json");
                xmlHttp.setRequestHeader("Accept", "application/json");
                var pw1 = "phil osoph" /*$("#name").val()*/ ;
                var pw2 = "Baum123" /*$("#password").val()*/ ;
                //xmlHttp.setRequestHeader("Authorization", "Basic " + btoa(pw1 + ":" + pw2));
                xmlHttp.setRequestHeader("Authorization", "Basic " + btoa("Phil Osoph:Baum123"));

                xmlHttp.onreadystatechange = function () {
                    // readyState 1 = OPENED
                    // readyState 2 = HEADERS_RECEIVED
                    // readyState 3 = LOADING
                    // readyState 4 = DONE
                    // status 200 = "OK"
                    //console.log(xmlHttp.readyState);
                    //console.log(xmlHttp.status);
                    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                        var data = null;
                        try {
                            console.log(xmlHttp.responseText);
                            data = JSON.parse(xmlHttp.responseText);
                            //console.log(data);
                            jsonData = data;
                            //document.getElementById("add").disabled = false;
                        } catch (e) {
                            // Der DDS gibt html zurück, wenn keine Zugriffsberechtigung vorliegt.
                            console.log(restURL + " does not return a valid JSON-Array: " + e);
                            // Für Screenshots des Knowledge Management Artikels Login in eine separate html verschieben
                            // und Session Authentication verwenden.
                            // Wenn die restURL ohne Paswort angefragt wird, wird eine HTML-Seite und kein JSON zurückgegeben.

                            // if (xmlHttp.responseText.startsWith("<!DOCTYPE HTML PUBLIC")) {
                            //     window.location.href = "http://169.254.80.80/login.html";
                            // }
                        }
                    }
                };

                console.log(xmlHttp);

            }
            xmlHttp.send();
        });

    });

    $("#inIDBLaden").click(function addProducts() {
        dbPromise.then(function (db) {
            console.log(jsonData);
            console.log(db);
            var items = jsonData;
            console.log("test");
            var tx = db.transaction("besuchsberichte", "readwrite");
            var store = tx.objectStore("besuchsberichte");
            //store.clear();
            return Promise.all(items.map(function (item) {
                console.log("Adding item: ", item);
                return store.add(item);
            })).catch(function (e) {
                tx.abort();
                console.log(e);
            }).then(function () {
                console.log("All items added successfully!");
                location.reload(true);
            });
        });

    });

    function getEverything() {

        return dbPromise.then(function (db) {
            var tx = db.transaction("besuchsberichte", "readonly");
            var store = tx.objectStore("besuchsberichte");
            //var index = store.index("name");
            console.log(store.getAll);
            return store.getAll();
        });
        // TODO 4.3 - use the get method to get an object by name
    }


    var template = "<article>\n\
	<h3>POS. FIRMEN_NAME</h3>\n\
    <ul>\n\
    <li><span>Firmen id:</span> <span>ID</span></li>\n\
	<li><span>Besuchs Beginn:</span> <span>BESUCHS_BEGIN</span></li>\n\
	<li><span>Besuchs Ende:</span> <span>BESUCHS_ENDE</span></li>\n\
	<li><span>Datum:</span> <span>DATUM</span></li>\n\
	<li><span>Erstellt am: <span>ERSTELLT_AM</span></li>\n\
    <li><span>Firmen Name:</span> <span>FIRMEN_NAME</span></li>\n\
    <li><span>Geändert am:</span> <span>GEAENDERT</span></li>\n\
	</ul>\n\
</article>";


    function displayByName() {
        // //var key = document.getElementById('name').value;
        // var s = '';
        // var b = "";
        // console.log(getEverything());
        // getEverything().then(function (object) {
        //     if (!object) {
        //         return;
        //     }
        //     s += '<h2> Addresses </h2><p>';
        //     for (var field in object) {
        //         for (var field2 in object[field]) {
        //             if (field2 === "Phone" || field2 === "Name" || field2 === "Address") {
        //                 b += field2 + " = " + (object[field])[field2] + "<br/>";
        //             }
        //         }
        //         s += "<p>" + b + '</p><br/>';
        //         b = "";
        //     }
        //     s += '</p>';
        // }).then(function () {
        //     if (s === '') {
        //         s = '<p>No results.</p>';
        //     }
        //     document.getElementById('results').innerHTML = s;
        // });


        var content = '';
        getEverything().then(function (object) {
            if (!object) {
                return;
            }
            for (var i = 0; i < object.length; i++) {
                var entry = template.replace(/POS/g, (i + 1))
                    .replace(/ID/g, object[i].id)
                    .replace(/BESUCHS_BEGIN/g, object[i].besuchs_beginn)
                    .replace(/BESUCHS_ENDE/g, object[i].besuchs_ende)
                    .replace(/DATUM/g, object[i].datum)
                    .replace(/ERSTELLT_AM/g, object[i].erstellt_am)
                    .replace(/FIRMEN_NAME/g, object[i].firmen_name)
                    .replace(/GEAENDERT/g, object[i].geaendert_am);
                //entry = entry.replace('<a href=\'http:///\'></a>', '-');
                content += entry;
            };
            document.getElementById('content').innerHTML = content;
        });
    }



    var date1 = new Date();


    $("#show").click(function showDatabaseData() {
        dbPromise.then(function (db) {
            // var tx = db.transaction(["address"], "readwrite");
            // var store = tx.objectStore("address");
            // var a = [{}];
            // var b = null;


        });
        console.log(date1);
        displayByName();
    });


    $("#inIDBLaden").click(function addProducts() {
        dbPromise.then(function (db) {
            console.log(jsonData);
            console.log(db);
            var items = jsonData;
            console.log("test");
            var tx = db.transaction("besuchsberichte", "readwrite");
            var store = tx.objectStore("besuchsberichte");
            //store.clear();
            return Promise.all(items.map(function (item) {
                console.log("Adding item: ", item);
                return store.add(item);
            })).catch(function (e) {
                tx.abort();
                console.log(e);
            }).then(function () {
                console.log("All items added successfully!");
                location.reload(true);
            });
        });

    });


    $("#erweitereDieDB").click(function addNewProducts() {
        dbPromise.then(function (db) {

            var objectStore2 = db.transaction("besuchsberichte", "readwrite").objectStore("besuchsberichte");
            var besuchsDaten = [{
                UNID: "456trfg",
                besuchs_beginn: $("#besuchs_beginn").val(),
                besuchs_ende: $("#besuchs_ende").val(),
                datum: $("#datum").val(),
                erstellt_am: $("#erstellt_am").val(),
                firmen_name: $("#firmen_name").val(),
                geaendert_am: $("#geaendert_am").val()
            }]
            for (var i in besuchsDaten) {
                objectStore2.add(besuchsDaten[i]);
            }
        })

    });

    $("#besuchsbericht_erstellen").click(function () {
        window.location.assign('https://localhost:8887/');
        document.location.href = '/besuchsbericht_erstellen.html';

    });

    function getDataFromINDB() {
        getEverything().then(function (object) {
            if (!object) {
                return;
            }
            console.log(object);
            return object;
        })

    };

    $('#upload').click(function putData() {
        var xhr = new XMLHttpRequest();
        var dataToPush = {
            "id": "Andere-Reise-zX1223",
            "besuchs_beginn": "2019-01-31T10:13:00Z",
            "besuchs_ende": "2019-01-30T14:00:00Z",
            "datum": "2019-01-24T16:16:35Z",
            "erstellt_am": "2019-01-31T10:11:28Z",
            "firmen_name": "Andere-Reise",
            "geaendert_am": "2019-01-24T10:13:15Z"
        };






        xhr.onload = function () {
            // do something to response
            console.log(this.responseText);
        };
        var liste = [];
        getEverything().then(function (dataen) {
            // var dataenInJson = JSON.stringify(dataToPush);
            // console.log(dataenInJson);
            // xhr.send(dataenInJson);

            // console.log(dataen);
            // var dataenInJson = JSON.stringify(dataen);
            // console.log(dataenInJson);

            console.log(dataen.length);
            var fertig = true;
            var b = 0;

            // xhr.open('POST', 'http://tur-top.local/pwa.nsf/api/data/documents?form=formular', false);
            // xhr.withCredentials = true;
            // xhr.setRequestHeader("Content-Type", "application/json");
            // xhr.setRequestHeader("Accept", "application/json");
            // xhr.setRequestHeader("Authorization", "Basic " + btoa("Phil Osoph:Baum123"));
            // //console.log("Adding item: ", dateAusDataen);
            // xhr.send(JSON.stringify(dataToPush));




            return Promise.all(dataen.map(function (dateAusDataen) {
                console.log(dateAusDataen);
                //vorerst mit false gelöst, später eventuell schauen ob man nicht eine schönere lösung findet.
                //mit onreadystatechange eventuell arbeiten und einem zähler in verbindung mit dataen.lenght
                xhr.open('POST', 'https://tur-top.local/pwa.nsf/api/data/documents?form=formular', false);
                xhr.withCredentials = true;
                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.setRequestHeader("Accept", "application/json");
                xhr.setRequestHeader("Authorization", "Basic " + btoa("Phil Osoph:Baum123"));
                console.log("Adding item: ", dateAusDataen);
                return xhr.send(JSON.stringify(dateAusDataen));
            })).catch(function (e) {
                //tx.abort();
                console.log(e);
            }).then(function () {
                console.log("All items added successfully!");
                //location.reload(true);
            });


            // for (var i of dataen) {

            //     xhr.open('POST', 'http://tur-top.local/pwa.nsf/api/data/documents?form=formular', false);
            //     xhr.withCredentials = true;
            //     xhr.setRequestHeader("Content-Type", "application/json");
            //     xhr.setRequestHeader("Accept", "application/json");
            //     xhr.setRequestHeader("Authorization", "Basic " + btoa("Phil Osoph:Baum123"));
            //     i = JSON.stringify(i);
            //     xhr.send(i);
            //     console.log(xhr.readyState);
            //     console.log(xhr.readyState);
            // }






        });



        // var data = $(document).ready(function () {

        //     // dbPromise.then(function (db) {
        //     //     var objectStore3 = db.transaction("besuchsberichte").objectStore("besuchsberichte");
        //     var dataToPush = '{"besuchs_beginn": "2019-01-31T10:13:00Z"}';
        //     dataToPush = JSON.parse(dataToPush);
        //     console.log(dataToPush);

        //     // Beispiel unter https://de.wikipedia.org/wiki/XMLHttpRequest und https://en.wikipedia.org/wiki/XMLHttpRequest.
        //     var xmlHttp = null;


        //     try {
        //         xmlHttp = new XMLHttpRequest();
        //     } catch (e) {
        //         // Fehlerbehandlung, falls die Schnittstelle vom Browser nicht unterstützt wird.
        //     }
        //     if (xmlHttp) {
        //         //var restURL = "http://169.254.80.80/address.nsf/api/data/collections/name/contact_view";
        //         // Standardanzahl der Einträge ist 10;
        //         // kann aber mithilfe dieses Response Header-Anhangs auf mehr Einträge vergrößert werden.
        //         // https://www-10.lotus.com/ldd/ddwiki.nsf/xpAPIViewer.xsp?lookupName=IBM+Domino+Access+Services+9.0.1#action=openDocument&res_title=Viewfolder_entries_GET_dds10&content=apicontent&sa=true
        //         //var requestURL = restURL + "?count=99";
        //         //xmlHttp.open("GET", requestURL, true);


        //         //xmlHttp.withCredentials = true;

        //         // Die beiden RequestHeader sollen laut IBM immer angegeben werden 
        //         // (http://infolib.lotus.com/resources/domino/8.5.3/doc/designer_up1/en_us/DominoDataService.html#unique_339072081)
        //         //xmlHttp.setRequestHeader("Content-Type", "application/json");
        //         //xmlHttp.setRequestHeader("Accept", "application/json");
        //         // Siehe: https://stackoverflow.com/questions/1652178/basic-authentication-with-xmlhttprequest
        //         //xmlHttp.setRequestHeader("Authorization", "Basic " + btoa("username:password"));
        //         //var pw1 = $("#name").val();
        //         //var pw2 = $("#password").val();
        //         //xmlHttp.setRequestHeader("Authorization", "Basic " + btoa(pw1+":"+pw2));
        //         var restURL = /*$("#link").val() +*/ "http://tur-top.itworks.local/pwa.nsf/api/data/documents?form=formular" /*+ $("#viewName").val()*/ ;
        //         //+contact_view name der View
        //         //var requestURL = restURL + "?count=20000";
        //         //console.log(requestURL);
        //         xmlHttp.open("POST", restURL, true);
        //         //"http://169.254.80.80/address.nsf/api/data/collections/name/contact_view?count=100"
        //         //xmlHttp.withCredentials = true;
        //         //xmlHttp.setRequestHeader("Access-Control-Allow-Origin", "*");
        //         //xmlHttp.setRequestHeader("Content-Type", "application/json");
        //         //xmlHttp.setRequestHeader("Accept", "application/json");
        //         //var pw1 = "phil osoph" /*$("#name").val()*/ ;
        //         //var pw2 = "Baum123" /*$("#password").val()*/ ;
        //         //xmlHttp.setRequestHeader("Authorization", "Basic " + btoa(pw1 + ":" + pw2));
        //         xmlHttp.setRequestHeader("Authorization", "Basic " + btoa("Phil Osoph:Baum123"));

        //         xmlHttp.onreadystatechange = function () {
        //             // readyState 1 = OPENED
        //             // readyState 2 = HEADERS_RECEIVED
        //             // readyState 3 = LOADING
        //             // readyState 4 = DONE
        //             // status 200 = "OK"
        //             console.log(xmlHttp.readyState);
        //             console.log(xmlHttp.status);
        //             console.log(this.responseText);

        //             if (xmlHttp.readyState == XMLHttpRequest.DONE && xmlHttp.status == 201) {
        //                 var data = null;

        //                 console.log(this.responseText);
        //                 try {

        //                     //console.log(xmlHttp.responseText);
        //                     // data = JSON.parse(xmlHttp.responseText);
        //                     // //console.log(data);
        //                     // jsonData = data;
        //                     //document.getElementById("add").disabled = false;
        //                 } catch (e) {
        //                     // Der DDS gibt html zurück, wenn keine Zugriffsberechtigung vorliegt.
        //                     console.log(restURL + " does not return a valid JSON-Array: " + e);
        //                     // Für Screenshots des Knowledge Management Artikels Login in eine separate html verschieben
        //                     // und Session Authentication verwenden.
        //                     // Wenn die restURL ohne Paswort angefragt wird, wird eine HTML-Seite und kein JSON zurückgegeben.

        //                     // if (xmlHttp.responseText.startsWith("<!DOCTYPE HTML PUBLIC")) {
        //                     //     window.location.href = "http://169.254.80.80/login.html";
        //                     // }
        //                 }
        //             }
        //         };

        //         console.log(xmlHttp);
        //         xmlHttp.send(dataToPush);

        //     }


        //     // });


        // });
    });

})();