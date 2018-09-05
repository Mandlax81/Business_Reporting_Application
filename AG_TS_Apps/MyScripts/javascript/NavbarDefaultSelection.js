//on the page load, add a tab to the current navbar link
$(document).ready(function () {
    var pathname = window.location.pathname
    if (pathname == "/") {
        document.getElementById("linkNavBarTSEntry").style.backgroundColor = "#437070";
    }
    else if (pathname == "/TSEntry") {
        document.getElementById("linkNavBarTSEntry").style.backgroundColor = "#437070";
    }
    else if (pathname == "/TSEquipment") {
        document.getElementById("linkNavBarTSEquipment").style.backgroundColor = "#437070";
    }
    else if (pathname == "/TSEmployee") {
        document.getElementById("linkNavBarTSEmployee").style.backgroundColor = "#437070";
    }
    else if (pathname == "/TSTaskWorkOrder") {
        document.getElementById("linkNavBarTSTaskWorkOrder").style.backgroundColor = "#437070";
    }
    else if (pathname == "/TSMaintenanceOrderGroup") {
        document.getElementById("linkNavBarTSMaintenanceOrderGroup").style.backgroundColor = "#437070";
    }
    else if (pathname == "/TSMaintenanceOrderActivity") {
        document.getElementById("linkNavBarTSMaintenanceOrderActivity").style.backgroundColor = "#437070";
    }
    else if (pathname == "/TSReports") {
        document.getElementById("linkNavBarTSReports").style.backgroundColor = "#437070";
    }
    else {
    }
});




