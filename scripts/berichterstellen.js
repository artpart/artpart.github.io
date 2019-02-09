$("#erweitereDieDB").click(function () {
    var objectStore2 = transaction.objectStore("besuchsberichte");
    var besuchsDaten = [{
        UNID: "",
        besuchs_beginn: $("#besuchs_beginn").val(),
        besuchs_ende: $("#besuchs_ende").val(),
        datum: $("#datum").val(),
        erstellt_am: $("#erstellt_am").val(),
        firmen_name: $("#firmen_name").val(),
        geaendert_am: $("#geaendert_am").val()
    }]

});