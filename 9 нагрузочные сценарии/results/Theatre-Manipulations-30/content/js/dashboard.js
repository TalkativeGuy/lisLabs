/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.506392694063927, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.7666666666666667, 500, 1500, "/cart/-104"], "isController": false}, {"data": [0.9, 500, 1500, "/upload/resize_cache/iblock/27b/160_160_2/%D0%93%D1%80%D0%B8%D0%B3%D0%BE%D1%80%D1%8C%D0%B5%D0%B2%D0%B0-%D0%9C%D0%B0%D0%B9%D1%8F.jpg-45"], "isController": false}, {"data": [0.7833333333333333, 500, 1500, "/local/templates/novat/images/icons/arrow_2.svg-67"], "isController": false}, {"data": [0.0, 500, 1500, "/upload/iblock/8bc/%D0%9E%D0%BB%D1%8C%D0%B3%D0%B0%20%D0%93%D1%80%D0%B8%D1%88%D0%B5%D0%BD%D0%BA%D0%BE%D0%B2%D0%B0_%D0%A0%D0%BE%D0%BC%D0%B0%D0%BD%20%D0%9F%D0%BE%D0%BB%D0%BA%D0%BE%D0%B2%D0%BD%D0%B8%D0%BA%D0%BE%D0%B23.jpg-55"], "isController": false}, {"data": [0.48333333333333334, 500, 1500, "/generate_204-86"], "isController": false}, {"data": [0.7, 500, 1500, "/local/templates/novat/images/icons/drop-icon.svg-69"], "isController": false}, {"data": [0.95, 500, 1500, "/local/templates/novat/images/icons/check.svg-39"], "isController": false}, {"data": [0.2833333333333333, 500, 1500, "/cart/-100"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "/cart/-102"], "isController": false}, {"data": [0.0, 500, 1500, "/upload/iblock/6ca/%D0%9E%D0%BB%D1%8C%D0%B3%D0%B0%20%D0%93%D1%80%D0%B8%D1%88%D0%B5%D0%BD%D0%BA%D0%BE%D0%B2%D0%B0_%D0%A0%D0%BE%D0%BC%D0%B0%D0%BD%20%D0%9F%D0%BE%D0%BB%D0%BA%D0%BE%D0%B2%D0%BD%D0%B8%D0%BA%D0%BE%D0%B22.jpg-54"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "/local/templates/novat/images/icons/play.svg-70"], "isController": false}, {"data": [0.08333333333333333, 500, 1500, "/upload/iblock/b04/%D0%9E%D0%BB%D1%8C%D0%B3%D0%B0%20%D0%93%D1%80%D0%B8%D1%88%D0%B5%D0%BD%D0%BA%D0%BE%D0%B2%D0%B0_%D0%92%D0%B5%D1%80%D0%B0%20%D0%A1%D0%B0%D0%B1%D0%B0%D0%BD%D1%86%D0%B5%D0%B2%D0%B0_%D0%A0%D0%BE%D0%BC%D0%B0%D0%BD%20%D0%9F%D0%BE%D0%BB%D0%BA%D0%BE%D0%B2%D0%BD%D0%B8%D0%BA%D0%BE%D0%B2.jpg-52"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "/img/icon/visa1.png-92"], "isController": false}, {"data": [0.0, 500, 1500, "/upload/iblock/82e/%D0%9C%D0%B8%D1%85%D0%B0%D0%B8%D0%BB%20%D0%9B%D0%B8%D1%84%D0%B5%D0%BD%D1%86%D0%B5%D0%B2.jpg-50"], "isController": false}, {"data": [0.13333333333333333, 500, 1500, "/search-37"], "isController": false}, {"data": [1.0, 500, 1500, "/generate_204-36"], "isController": false}, {"data": [0.7, 500, 1500, "/local/templates/novat/images/icons/drop-icon.svg-57"], "isController": false}, {"data": [0.6166666666666667, 500, 1500, "/cart/-96"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "/local/templates/novat/images/icons/vk.svg-89"], "isController": false}, {"data": [0.0, 500, 1500, "/buy_now/tickets/3305995/-68"], "isController": false}, {"data": [0.26666666666666666, 500, 1500, "/cart/-98"], "isController": false}, {"data": [0.9833333333333333, 500, 1500, "/upload/resize_cache/iblock/828/160_160_2/grinevich_240x240.jpg-46"], "isController": false}, {"data": [0.65, 500, 1500, "/cart/-100-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "/img/icon/4.png-94"], "isController": false}, {"data": [0.5, 500, 1500, "/cart/-102-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "/cart/-102-1"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "/upload/resize_cache/iblock/33a/80_52_2/%D0%A1%D0%BF%D1%8F%D1%89%D0%B0%D1%8F%201600%D1%85600_1.jpg-78"], "isController": false}, {"data": [0.6166666666666667, 500, 1500, "/cart/-82-0"], "isController": false}, {"data": [0.65, 500, 1500, "/upload/resize_cache/iblock/80c/260_260_2/prisca1_%D0%BA%D0%B0%D1%80%D1%82%D0%BE%D1%87%D0%BA%D0%B0.jpg-66"], "isController": false}, {"data": [0.65, 500, 1500, "/cart/-82-1"], "isController": false}, {"data": [0.55, 500, 1500, "/cart/-100-0"], "isController": false}, {"data": [0.7166666666666667, 500, 1500, "/cart/-84-0"], "isController": false}, {"data": [0.6833333333333333, 500, 1500, "/cart/-84-1"], "isController": false}, {"data": [0.5166666666666667, 500, 1500, "/upload/resize_cache/iblock/27e/260_260_2/%D0%BB%D0%B5%D0%B1%D0%B5%D0%B4%D0%B5%D0%B2.jpg-71"], "isController": false}, {"data": [0.11666666666666667, 500, 1500, "/cart/-79-0"], "isController": false}, {"data": [0.31666666666666665, 500, 1500, "/auth/?login=yes-90"], "isController": false}, {"data": [0.6166666666666667, 500, 1500, "/cart/-79-1"], "isController": false}, {"data": [0.6166666666666667, 500, 1500, "/cart/-98-1"], "isController": false}, {"data": [0.3, 500, 1500, "/cart/-82"], "isController": false}, {"data": [0.43333333333333335, 500, 1500, "/upload/resize_cache/iblock/61a/260_280_2/2_1600%D0%A5600.jpg-74"], "isController": false}, {"data": [0.31666666666666665, 500, 1500, "/cart/-84"], "isController": false}, {"data": [0.0, 500, 1500, "/upload/iblock/28e/%D0%9C%D0%B8%D1%85%D0%B0%D0%B8%D0%BB%20%D0%9D%D0%B5%D0%B4%D0%B5%D0%BB%D1%8C%D1%81%D0%BA%D0%B8%D0%B9_%D0%95%D0%BA%D0%B0%D1%82%D0%B5%D1%80%D0%B8%D0%BD%D0%B0%20%D0%9B%D0%B8%D1%85%D0%BE%D0%B2%D0%B0.JPG-51"], "isController": false}, {"data": [0.75, 500, 1500, "/local/templates/novat/images/icons/play.svg-58"], "isController": false}, {"data": [0.75, 500, 1500, "/bitrix/cache/css/s1/novat/page_4e340cb13884582617e3aa61b09f0fcb/page_4e340cb13884582617e3aa61b09f0fcb.css-59"], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "/upload/resize_cache/iblock/33a/350_200_2/%D0%A1%D0%BF%D1%8F%D1%89%D0%B0%D1%8F%201600%D1%85600_1.jpg-97"], "isController": false}, {"data": [0.95, 500, 1500, "/upload/resize_cache/iblock/596/160_160_2/image-20-02-16-3-15-11.jpeg-44"], "isController": false}, {"data": [0.55, 500, 1500, "/img/icon/pk_short.png-65"], "isController": false}, {"data": [0.48333333333333334, 500, 1500, "/theatre/repertoire/sleeping_beauty_new/-47"], "isController": false}, {"data": [0.7, 500, 1500, "/local/templates/novat/images/icons/check.svg-95"], "isController": false}, {"data": [0.48333333333333334, 500, 1500, "/cart/-98-0"], "isController": false}, {"data": [1.0, 500, 1500, "/local/templates/novat/images/icons/lupa.svg-40"], "isController": false}, {"data": [0.6, 500, 1500, "/personal/order/-91"], "isController": false}, {"data": [0.016666666666666666, 500, 1500, "/upload/iblock/e7f/%D0%9E%D0%BB%D1%8C%D0%B3%D0%B0%20%D0%93%D1%80%D0%B8%D1%88%D0%B5%D0%BD%D0%BA%D0%BE%D0%B2%D0%B0_%D0%A0%D0%BE%D0%BC%D0%B0%D0%BD%20%D0%9F%D0%BE%D0%BB%D0%BA%D0%BE%D0%B2%D0%BD%D0%B8%D0%BA%D0%BE%D0%B2.jpg-53"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "/local/templates/novat/images/icons/lupa-purpur.png-42"], "isController": false}, {"data": [0.06666666666666667, 500, 1500, "/upload/iblock/33a/%D0%A1%D0%BF%D1%8F%D1%89%D0%B0%D1%8F%201600%D1%85600_1.jpg-60"], "isController": false}, {"data": [0.016666666666666666, 500, 1500, "/upload/iblock/8bc/%D0%9E%D0%BB%D1%8C%D0%B3%D0%B0%20%D0%93%D1%80%D0%B8%D1%88%D0%B5%D0%BD%D0%BA%D0%BE%D0%B2%D0%B0_%D0%A0%D0%BE%D0%BC%D0%B0%D0%BD%20%D0%9F%D0%BE%D0%BB%D0%BA%D0%BE%D0%B2%D0%BD%D0%B8%D0%BA%D0%BE%D0%B23.jpg-63"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "/local/templates/novat/fonts/Lato-Light.woff-41"], "isController": false}, {"data": [0.25, 500, 1500, "/search-37-1"], "isController": false}, {"data": [0.7, 500, 1500, "/local/templates/novat/images/icons/gmail.svg-88"], "isController": false}, {"data": [0.0, 500, 1500, "/upload/iblock/6ca/%D0%9E%D0%BB%D1%8C%D0%B3%D0%B0%20%D0%93%D1%80%D0%B8%D1%88%D0%B5%D0%BD%D0%BA%D0%BE%D0%B2%D0%B0_%D0%A0%D0%BE%D0%BC%D0%B0%D0%BD%20%D0%9F%D0%BE%D0%BB%D0%BA%D0%BE%D0%B2%D0%BD%D0%B8%D0%BA%D0%BE%D0%B22.jpg-62"], "isController": false}, {"data": [0.0, 500, 1500, "/upload/iblock/82e/%D0%9C%D0%B8%D1%85%D0%B0%D0%B8%D0%BB%20%D0%9B%D0%B8%D1%84%D0%B5%D0%BD%D1%86%D0%B5%D0%B2.jpg-75"], "isController": false}, {"data": [0.5666666666666667, 500, 1500, "/search/-43"], "isController": false}, {"data": [0.9, 500, 1500, "/search-37-0"], "isController": false}, {"data": [0.6833333333333333, 500, 1500, "/auth/-87"], "isController": false}, {"data": [0.016666666666666666, 500, 1500, "/cart/-79"], "isController": false}, {"data": [0.6833333333333333, 500, 1500, "/upload/resize_cache/iblock/cdd/260_260_2/image-18-02-16-23-43-88.jpeg-73"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "/upload/resize_cache/iblock/c6d/260_260_2/Odintsova.jpeg-72"], "isController": false}, {"data": [0.7, 500, 1500, "/img/icon/mastercard1.png-93"], "isController": false}, {"data": [0.6833333333333333, 500, 1500, "/personal/order/-85"], "isController": false}, {"data": [0.45, 500, 1500, "/afisha/performances/detail/3305995/-56"], "isController": false}, {"data": [0.0, 500, 1500, "/upload/iblock/705/%D0%9E%D0%BB%D1%8C%D0%B3%D0%B0%20%D0%93%D1%80%D0%B8%D1%88%D0%B5%D0%BD%D0%BA%D0%BE%D0%B2%D0%B0_%D0%A0%D0%BE%D0%BC%D0%B0%D0%BD%20%D0%9F%D0%BE%D0%BB%D0%BA%D0%BE%D0%B2%D0%BD%D0%B8%D0%BA%D0%BE%D0%B24.jpg-64"], "isController": false}, {"data": [0.06666666666666667, 500, 1500, "/upload/iblock/ce4/%D0%95%D0%B2%D0%B3%D0%B5%D0%BD%D0%B8%D0%B9%20%D0%93%D1%80%D0%B0%D1%89%D0%B5%D0%BD%D0%BA%D0%BE_%D0%9E%D0%BB%D1%8C%D0%B3%D0%B0%20%D0%9F%D0%BE%D1%82%D0%B5%D1%88%D0%BA%D0%B8%D0%BD%D0%B0.jpg-49"], "isController": false}, {"data": [0.45, 500, 1500, "/upload/resize_cache/iblock/33a/350_200_2/%D0%A1%D0%BF%D1%8F%D1%89%D0%B0%D1%8F%201600%D1%85600_1.jpg-81"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2190, 0, 0.0, 2786.332420091321, 54, 81451, 797.5, 7183.8, 12222.599999999999, 38325.81000000016, 10.065772237772844, 2483.9653329087555, 8.28104747804145], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["/cart/-104", 30, 0, 0.0, 665.4666666666665, 132, 7086, 468.5, 915.2000000000003, 3754.6499999999955, 7086.0, 0.45791739170253687, 5.36590640454712, 0.334047159767378], "isController": false}, {"data": ["/upload/resize_cache/iblock/27b/160_160_2/%D0%93%D1%80%D0%B8%D0%B3%D0%BE%D1%80%D1%8C%D0%B5%D0%B2%D0%B0-%D0%9C%D0%B0%D0%B9%D1%8F.jpg-45", 30, 0, 0.0, 558.0333333333333, 82, 7140, 243.5, 1096.3, 3860.8999999999955, 7140.0, 1.951092611862643, 20.585551346253904, 1.4709409144120709], "isController": false}, {"data": ["/local/templates/novat/images/icons/arrow_2.svg-67", 30, 0, 0.0, 511.5666666666667, 224, 1109, 455.0, 868.2, 1005.0499999999998, 1109.0, 0.4210349037935245, 0.238476800976801, 0.31947667992926615], "isController": false}, {"data": ["/upload/iblock/8bc/%D0%9E%D0%BB%D1%8C%D0%B3%D0%B0%20%D0%93%D1%80%D0%B8%D1%88%D0%B5%D0%BD%D0%BA%D0%BE%D0%B2%D0%B0_%D0%A0%D0%BE%D0%BC%D0%B0%D0%BD%20%D0%9F%D0%BE%D0%BB%D0%BA%D0%BE%D0%B2%D0%BD%D0%B8%D0%BA%D0%BE%D0%B23.jpg-55", 30, 0, 0.0, 8133.633333333334, 3117, 24265, 7703.0, 12920.300000000001, 19633.449999999993, 24265.0, 0.35628607396498896, 245.41882448605733, 0.30409573109902377], "isController": false}, {"data": ["/generate_204-86", 30, 0, 0.0, 1104.7000000000003, 369, 3186, 1060.5, 1964.2000000000005, 2658.5499999999993, 3186.0, 0.28729578058263583, 0.04292602971596024, 0.10100242286108292], "isController": false}, {"data": ["/local/templates/novat/images/icons/drop-icon.svg-69", 30, 0, 0.0, 661.0333333333333, 172, 1769, 569.5, 1252.7, 1633.6999999999998, 1769.0, 0.39958443219052187, 0.5018218552705186, 0.303980735035563], "isController": false}, {"data": ["/local/templates/novat/images/icons/check.svg-39", 30, 0, 0.0, 167.56666666666666, 63, 571, 119.0, 511.1000000000006, 563.3, 571.0, 5.315379163713678, 5.227135564316088, 4.022869972537207], "isController": false}, {"data": ["/cart/-100", 30, 0, 0.0, 1561.4, 402, 5400, 1464.0, 2200.7, 3699.949999999998, 5400.0, 0.31525851197982346, 10.741992515894283, 0.463343809110971], "isController": false}, {"data": ["/cart/-102", 30, 0, 0.0, 1712.7666666666667, 301, 5990, 1403.5, 4375.900000000002, 5370.699999999999, 5990.0, 0.4454409122629883, 15.178036584618924, 0.6546763407771459], "isController": false}, {"data": ["/upload/iblock/6ca/%D0%9E%D0%BB%D1%8C%D0%B3%D0%B0%20%D0%93%D1%80%D0%B8%D1%88%D0%B5%D0%BD%D0%BA%D0%BE%D0%B2%D0%B0_%D0%A0%D0%BE%D0%BC%D0%B0%D0%BD%20%D0%9F%D0%BE%D0%BB%D0%BA%D0%BE%D0%B2%D0%BD%D0%B8%D0%BA%D0%BE%D0%B22.jpg-54", 30, 0, 0.0, 8201.633333333333, 3008, 24137, 6733.5, 14990.100000000002, 20944.799999999996, 24137.0, 0.39794659556687495, 265.38801969338215, 0.33965363723188347], "isController": false}, {"data": ["/local/templates/novat/images/icons/play.svg-70", 30, 0, 0.0, 726.2333333333331, 224, 3231, 455.0, 1984.2000000000005, 2645.7999999999993, 3231.0, 0.35255958256945424, 0.3883664151741644, 0.26648546573120857], "isController": false}, {"data": ["/upload/iblock/b04/%D0%9E%D0%BB%D1%8C%D0%B3%D0%B0%20%D0%93%D1%80%D0%B8%D1%88%D0%B5%D0%BD%D0%BA%D0%BE%D0%B2%D0%B0_%D0%92%D0%B5%D1%80%D0%B0%20%D0%A1%D0%B0%D0%B1%D0%B0%D0%BD%D1%86%D0%B5%D0%B2%D0%B0_%D0%A0%D0%BE%D0%BC%D0%B0%D0%BD%20%D0%9F%D0%BE%D0%BB%D0%BA%D0%BE%D0%B2%D0%BD%D0%B8%D0%BA%D0%BE%D0%B2.jpg-52", 30, 0, 0.0, 11288.6, 875, 30799, 8646.0, 27799.4, 30434.899999999998, 30799.0, 0.6755995946402432, 499.6197553062718, 0.6300757938295237], "isController": false}, {"data": ["/img/icon/visa1.png-92", 30, 0, 0.0, 549.1666666666666, 97, 992, 529.0, 869.7, 965.05, 992.0, 0.30642261807484883, 0.6269095555339925, 0.1897186912689982], "isController": false}, {"data": ["/upload/iblock/82e/%D0%9C%D0%B8%D1%85%D0%B0%D0%B8%D0%BB%20%D0%9B%D0%B8%D1%84%D0%B5%D0%BD%D1%86%D0%B5%D0%B2.jpg-50", 30, 0, 0.0, 9019.699999999999, 2487, 26914, 7189.5, 21297.100000000013, 24856.449999999997, 26914.0, 0.31233082080539704, 256.7444749979178, 0.23394310503685503], "isController": false}, {"data": ["/search-37", 30, 0, 0.0, 1984.0, 966, 3178, 1978.0, 2814.1000000000004, 3085.6, 3178.0, 4.5822514128608525, 85.19422660187873, 7.298488334351612], "isController": false}, {"data": ["/generate_204-36", 30, 0, 0.0, 142.23333333333335, 106, 253, 128.0, 194.00000000000003, 221.09999999999997, 253.0, 6.129955046996322, 0.9159014865140989, 2.1550623212096442], "isController": false}, {"data": ["/local/templates/novat/images/icons/drop-icon.svg-57", 30, 0, 0.0, 737.1666666666666, 149, 3088, 522.0, 1102.6000000000001, 2931.25, 3088.0, 0.45274134886739203, 0.5685794674252599, 0.34441944410908043], "isController": false}, {"data": ["/cart/-96", 30, 0, 0.0, 836.2, 153, 2241, 823.0, 1425.8000000000004, 1823.5499999999995, 2241.0, 0.3074904677954984, 3.6032137398271904, 0.22401161032757985], "isController": false}, {"data": ["/local/templates/novat/images/icons/vk.svg-89", 30, 0, 0.0, 636.2333333333335, 110, 1111, 619.5, 959.5, 1044.4499999999998, 1111.0, 0.2974213568362299, 0.30903937858764513, 0.19082600726699514], "isController": false}, {"data": ["/buy_now/tickets/3305995/-68", 30, 0, 0.0, 11835.099999999999, 4045, 22559, 10952.0, 18145.100000000002, 21699.899999999998, 22559.0, 0.2481143310837634, 187.1563390368615, 0.19020483388745532], "isController": false}, {"data": ["/cart/-98", 30, 0, 0.0, 1481.7666666666669, 414, 2418, 1437.0, 2228.7000000000003, 2344.2999999999997, 2418.0, 0.31103876579817735, 10.598230821220103, 0.4571419360607977], "isController": false}, {"data": ["/upload/resize_cache/iblock/828/160_160_2/grinevich_240x240.jpg-46", 30, 0, 0.0, 241.50000000000003, 62, 610, 221.0, 418.50000000000006, 522.5499999999998, 610.0, 3.862495171881035, 45.16177216106605, 2.6554654306682117], "isController": false}, {"data": ["/cart/-100-1", 30, 0, 0.0, 628.8333333333333, 201, 1111, 603.5, 931.0000000000001, 1058.1999999999998, 1111.0, 0.31785048313273434, 3.7246137619988557, 0.22845503475165282], "isController": false}, {"data": ["/img/icon/4.png-94", 30, 0, 0.0, 877.3333333333333, 76, 3455, 547.5, 3142.100000000003, 3367.0, 3455.0, 0.3071064430931761, 1.4851475646459062, 0.18894244057490325], "isController": false}, {"data": ["/cart/-102-0", 30, 0, 0.0, 1209.4999999999998, 141, 5122, 758.5, 2970.800000000001, 4342.0999999999985, 5122.0, 0.44650165949783444, 9.98175389572698, 0.33531228140022923], "isController": false}, {"data": ["/cart/-102-1", 30, 0, 0.0, 503.1333333333333, 150, 1467, 392.5, 1023.9000000000001, 1298.1499999999999, 1467.0, 0.45233859051295194, 5.300828133010162, 0.3251183619311842], "isController": false}, {"data": ["/upload/resize_cache/iblock/33a/80_52_2/%D0%A1%D0%BF%D1%8F%D1%89%D0%B0%D1%8F%201600%D1%85600_1.jpg-78", 30, 0, 0.0, 652.3666666666666, 223, 2658, 395.0, 1471.9000000000003, 2518.2999999999997, 2658.0, 0.27171697959405483, 1.2723465987827078, 0.19158169850283943], "isController": false}, {"data": ["/cart/-82-0", 30, 0, 0.0, 854.9333333333333, 207, 4750, 606.0, 1419.4000000000005, 2953.699999999998, 4750.0, 0.27621003010689327, 6.174804696491212, 0.20742725893769623], "isController": false}, {"data": ["/upload/resize_cache/iblock/80c/260_260_2/prisca1_%D0%BA%D0%B0%D1%80%D1%82%D0%BE%D1%87%D0%BA%D0%B0.jpg-66", 30, 0, 0.0, 1156.4999999999995, 247, 7523, 581.0, 2031.6000000000004, 7174.849999999999, 7523.0, 0.42087542087542085, 21.569043297558924, 0.3029152199074074], "isController": false}, {"data": ["/cart/-82-1", 30, 0, 0.0, 649.2000000000002, 203, 1670, 590.0, 1112.7000000000005, 1407.0999999999997, 1670.0, 0.28450311530911265, 3.3339282708374824, 0.2044866141284247], "isController": false}, {"data": ["/cart/-100-0", 30, 0, 0.0, 932.3666666666668, 201, 4757, 790.0, 1464.5000000000002, 3047.0499999999975, 4757.0, 0.31592582061731905, 7.062669810128582, 0.2372528867721859], "isController": false}, {"data": ["/cart/-84-0", 30, 0, 0.0, 665.3, 240, 1473, 647.5, 1053.0, 1406.4499999999998, 1473.0, 0.285431572537677, 6.383744017829959, 0.26090229677272037], "isController": false}, {"data": ["/cart/-84-1", 30, 0, 0.0, 651.1666666666666, 219, 1347, 625.0, 1104.9, 1223.2499999999998, 1347.0, 0.28699894767052525, 3.339707350760547, 0.23739073112981918], "isController": false}, {"data": ["/upload/resize_cache/iblock/27e/260_260_2/%D0%BB%D0%B5%D0%B1%D0%B5%D0%B4%D0%B5%D0%B2.jpg-71", 30, 0, 0.0, 1030.2, 275, 3290, 741.0, 2406.9, 3206.95, 3290.0, 0.31353859660124156, 18.13624819715307, 0.2213753958424782], "isController": false}, {"data": ["/cart/-79-0", 30, 0, 0.0, 3655.7999999999997, 873, 8282, 3551.5, 6158.000000000001, 7179.799999999998, 8282.0, 0.2609353663097651, 5.821933493011281, 0.25711307090483687], "isController": false}, {"data": ["/auth/?login=yes-90", 30, 0, 0.0, 1534.8666666666668, 329, 3099, 1531.0, 2712.8000000000006, 2986.25, 3099.0, 0.2956131015726617, 0.40479364357928344, 0.2482688157739151], "isController": false}, {"data": ["/cart/-79-1", 30, 0, 0.0, 665.9666666666667, 185, 1357, 560.0, 1030.3000000000002, 1251.9499999999998, 1357.0, 0.2731469257313509, 3.2009672104187343, 0.22833375822855112], "isController": false}, {"data": ["/cart/-98-1", 30, 0, 0.0, 659.5, 215, 1167, 612.5, 1125.2000000000003, 1157.65, 1167.0, 0.314132836305379, 3.6810703389231523, 0.22578297609449113], "isController": false}, {"data": ["/cart/-82", 30, 0, 0.0, 1504.2, 410, 5220, 1453.5, 2136.1000000000004, 3936.8499999999985, 5220.0, 0.27569475077194533, 9.393993501644978, 0.4051958983513454], "isController": false}, {"data": ["/upload/resize_cache/iblock/61a/260_280_2/2_1600%D0%A5600.jpg-74", 30, 0, 0.0, 1614.1999999999998, 326, 5576, 1243.0, 3514.600000000001, 5399.45, 5576.0, 0.3037052034824863, 27.153736523081594, 0.20642463049200244], "isController": false}, {"data": ["/cart/-84", 30, 0, 0.0, 1316.6, 459, 2012, 1366.0, 1846.8, 1968.55, 2012.0, 0.28483806955745655, 9.685032145162975, 0.4959631621298292], "isController": false}, {"data": ["/upload/iblock/28e/%D0%9C%D0%B8%D1%85%D0%B0%D0%B8%D0%BB%20%D0%9D%D0%B5%D0%B4%D0%B5%D0%BB%D1%8C%D1%81%D0%BA%D0%B8%D0%B9_%D0%95%D0%BA%D0%B0%D1%82%D0%B5%D1%80%D0%B8%D0%BD%D0%B0%20%D0%9B%D0%B8%D1%85%D0%BE%D0%B2%D0%B0.JPG-51", 30, 0, 0.0, 42735.4, 5848, 81451, 41540.5, 59024.600000000006, 69436.79999999999, 81451.0, 0.3018139015483053, 2441.5500831874565, 0.2573081406754595], "isController": false}, {"data": ["/local/templates/novat/images/icons/play.svg-58", 30, 0, 0.0, 652.4999999999999, 206, 2843, 487.5, 1098.2, 1889.8499999999988, 2843.0, 0.44964702708373927, 0.4953143032719316, 0.33986992086212325], "isController": false}, {"data": ["/bitrix/cache/css/s1/novat/page_4e340cb13884582617e3aa61b09f0fcb/page_4e340cb13884582617e3aa61b09f0fcb.css-59", 30, 0, 0.0, 580.2333333333333, 209, 1132, 518.5, 995.7000000000002, 1084.7, 1132.0, 0.44734056036860864, 0.4075866629139764, 0.3101677713493282], "isController": false}, {"data": ["/upload/resize_cache/iblock/33a/350_200_2/%D0%A1%D0%BF%D1%8F%D1%89%D0%B0%D1%8F%201600%D1%85600_1.jpg-97", 30, 0, 0.0, 1329.7333333333333, 147, 4605, 1151.0, 2475.7000000000003, 3452.1999999999985, 4605.0, 0.3090776093877173, 14.128227285371356, 0.2127926900569733], "isController": false}, {"data": ["/upload/resize_cache/iblock/596/160_160_2/image-20-02-16-3-15-11.jpeg-44", 30, 0, 0.0, 301.06666666666666, 58, 1100, 233.5, 524.7000000000002, 1086.25, 1100.0, 3.427004797806717, 34.350368403015764, 2.376145904729267], "isController": false}, {"data": ["/img/icon/pk_short.png-65", 30, 0, 0.0, 1011.3333333333334, 294, 3149, 780.0, 1849.8, 3021.3999999999996, 3149.0, 0.4231073000112828, 23.248589201596527, 0.27146630479239536], "isController": false}, {"data": ["/theatre/repertoire/sleeping_beauty_new/-47", 30, 0, 0.0, 1665.8666666666668, 343, 10036, 851.5, 5783.600000000005, 9492.05, 10036.0, 1.1852085967130215, 28.410321994014694, 0.9537225426675094], "isController": false}, {"data": ["/local/templates/novat/images/icons/check.svg-95", 30, 0, 0.0, 547.5, 89, 1904, 519.0, 815.6, 1311.0999999999992, 1904.0, 0.3057698775901257, 0.30069361985669585, 0.231417631965183], "isController": false}, {"data": ["/cart/-98-0", 30, 0, 0.0, 821.9999999999999, 199, 1619, 711.0, 1566.3000000000002, 1597.0, 1619.0, 0.31173365476536846, 6.968951977430483, 0.23410466847125816], "isController": false}, {"data": ["/local/templates/novat/images/icons/lupa.svg-40", 30, 0, 0.0, 137.06666666666666, 54, 250, 121.0, 241.20000000000002, 248.9, 250.0, 5.808325266214908, 6.591087850919651, 4.390277105517909], "isController": false}, {"data": ["/personal/order/-91", 30, 0, 0.0, 680.6000000000003, 135, 1119, 734.5, 888.1, 1040.35, 1119.0, 0.3030578537442798, 3.5265792786717984, 0.22374193108464405], "isController": false}, {"data": ["/upload/iblock/e7f/%D0%9E%D0%BB%D1%8C%D0%B3%D0%B0%20%D0%93%D1%80%D0%B8%D1%88%D0%B5%D0%BD%D0%BA%D0%BE%D0%B2%D0%B0_%D0%A0%D0%BE%D0%BC%D0%B0%D0%BD%20%D0%9F%D0%BE%D0%BB%D0%BA%D0%BE%D0%B2%D0%BD%D0%B8%D0%BA%D0%BE%D0%B2.jpg-53", 30, 0, 0.0, 9705.366666666667, 1413, 24114, 9245.0, 21329.500000000007, 22764.85, 24114.0, 0.44993026080957454, 353.6983505837845, 0.3835831227409751], "isController": false}, {"data": ["/local/templates/novat/images/icons/lupa-purpur.png-42", 30, 0, 0.0, 212.7, 55, 541, 206.0, 398.9, 535.5, 541.0, 4.333381482016467, 5.501363209591218, 3.3050497436082624], "isController": false}, {"data": ["/upload/iblock/33a/%D0%A1%D0%BF%D1%8F%D1%89%D0%B0%D1%8F%201600%D1%85600_1.jpg-60", 30, 0, 0.0, 4395.233333333333, 748, 13995, 4011.5, 7667.200000000002, 11819.749999999996, 13995.0, 0.3999413419365159, 119.39147362553493, 0.2780842143152338], "isController": false}, {"data": ["/upload/iblock/8bc/%D0%9E%D0%BB%D1%8C%D0%B3%D0%B0%20%D0%93%D1%80%D0%B8%D1%88%D0%B5%D0%BD%D0%BA%D0%BE%D0%B2%D0%B0_%D0%A0%D0%BE%D0%BC%D0%B0%D0%BD%20%D0%9F%D0%BE%D0%BB%D0%BA%D0%BE%D0%B2%D0%BD%D0%B8%D0%BA%D0%BE%D0%B23.jpg-63", 30, 0, 0.0, 7765.000000000001, 1217, 17655, 7078.5, 12420.2, 14992.449999999997, 17655.0, 0.307919694543663, 212.10284373460402, 0.2561988083507821], "isController": false}, {"data": ["/local/templates/novat/fonts/Lato-Light.woff-41", 30, 0, 0.0, 489.1, 124, 1904, 381.5, 1171.6, 1587.7499999999995, 1904.0, 4.443127962085308, 282.4900839566055, 3.1891592305983414], "isController": false}, {"data": ["/search-37-1", 30, 0, 0.0, 1600.5, 694, 2802, 1520.0, 2535.3, 2762.95, 2802.0, 5.231949773282176, 95.1736285206662, 4.169209975584234], "isController": false}, {"data": ["/local/templates/novat/images/icons/gmail.svg-88", 30, 0, 0.0, 584.6666666666666, 114, 1829, 593.0, 820.4, 1315.8499999999995, 1829.0, 0.2982492767455039, 0.24349257359300902, 0.19223097915237555], "isController": false}, {"data": ["/upload/iblock/6ca/%D0%9E%D0%BB%D1%8C%D0%B3%D0%B0%20%D0%93%D1%80%D0%B8%D1%88%D0%B5%D0%BD%D0%BA%D0%BE%D0%B2%D0%B0_%D0%A0%D0%BE%D0%BC%D0%B0%D0%BD%20%D0%9F%D0%BE%D0%BB%D0%BA%D0%BE%D0%B2%D0%BD%D0%B8%D0%BA%D0%BE%D0%B22.jpg-62", 30, 0, 0.0, 5490.4333333333325, 1579, 12015, 5538.0, 8566.600000000002, 10290.199999999997, 12015.0, 0.30535905135121383, 203.64198321161382, 0.2540682731945646], "isController": false}, {"data": ["/upload/iblock/82e/%D0%9C%D0%B8%D1%85%D0%B0%D0%B8%D0%BB%20%D0%9B%D0%B8%D1%84%D0%B5%D0%BD%D1%86%D0%B5%D0%B2.jpg-75", 30, 0, 0.0, 6962.966666666667, 2327, 15871, 6227.0, 12076.400000000001, 14198.999999999998, 15871.0, 0.25552792068413344, 210.05093789393888, 0.18590654385710878], "isController": false}, {"data": ["/search/-43", 30, 0, 0.0, 819.7666666666667, 461, 1647, 777.0, 1163.5, 1512.7999999999997, 1647.0, 3.9354584809130264, 87.72959403286107, 3.193716794569067], "isController": false}, {"data": ["/search-37-0", 30, 0, 0.0, 383.1333333333333, 219, 812, 308.0, 707.7000000000002, 812.0, 812.0, 5.533013648100332, 2.220770126337145, 4.40371691718923], "isController": false}, {"data": ["/auth/-87", 30, 0, 0.0, 620.6666666666665, 178, 1128, 634.0, 958.9, 1037.8, 1128.0, 0.2956334933039014, 1.4973951917675925, 0.22230252914453522], "isController": false}, {"data": ["/cart/-79", 30, 0, 0.0, 4321.933333333334, 1403, 9639, 4139.5, 6913.1, 8242.549999999997, 9639.0, 0.2605161693702456, 8.865529762344124, 0.47447524987842576], "isController": false}, {"data": ["/upload/resize_cache/iblock/cdd/260_260_2/image-18-02-16-23-43-88.jpeg-73", 30, 0, 0.0, 675.6666666666666, 210, 1639, 577.5, 1285.8000000000002, 1467.9499999999998, 1639.0, 0.30886758846482515, 18.57006049943889, 0.21264809557392744], "isController": false}, {"data": ["/upload/resize_cache/iblock/c6d/260_260_2/Odintsova.jpeg-72", 30, 0, 0.0, 759.8333333333335, 222, 2953, 657.0, 1374.4000000000003, 2232.499999999999, 2953.0, 0.3122527998667722, 18.648261695168408, 0.21070965303509723], "isController": false}, {"data": ["/img/icon/mastercard1.png-93", 30, 0, 0.0, 526.3333333333334, 73, 909, 568.0, 796.3000000000001, 883.6999999999999, 909.0, 0.30487495045782054, 0.7609964583693255, 0.19054684403613786], "isController": false}, {"data": ["/personal/order/-85", 30, 0, 0.0, 648.3333333333334, 161, 1695, 551.5, 1049.9, 1469.4999999999998, 1695.0, 0.29309755263543547, 3.4105792951003857, 0.22096807679155878], "isController": false}, {"data": ["/afisha/performances/detail/3305995/-56", 30, 0, 0.0, 1021.4999999999999, 575, 2107, 997.5, 1549.9000000000005, 1865.5499999999997, 2107.0, 0.45312429199329374, 9.346544030465058, 0.3619684285649554], "isController": false}, {"data": ["/upload/iblock/705/%D0%9E%D0%BB%D1%8C%D0%B3%D0%B0%20%D0%93%D1%80%D0%B8%D1%88%D0%B5%D0%BD%D0%BA%D0%BE%D0%B2%D0%B0_%D0%A0%D0%BE%D0%BC%D0%B0%D0%BD%20%D0%9F%D0%BE%D0%BB%D0%BA%D0%BE%D0%B2%D0%BD%D0%B8%D0%BA%D0%BE%D0%B24.jpg-64", 30, 0, 0.0, 9754.800000000003, 3550, 17052, 9674.0, 13914.4, 15336.549999999997, 17052.0, 0.2332143939923972, 250.93914343268267, 0.19404166375148674], "isController": false}, {"data": ["/upload/iblock/ce4/%D0%95%D0%B2%D0%B3%D0%B5%D0%BD%D0%B8%D0%B9%20%D0%93%D1%80%D0%B0%D1%89%D0%B5%D0%BD%D0%BA%D0%BE_%D0%9E%D0%BB%D1%8C%D0%B3%D0%B0%20%D0%9F%D0%BE%D1%82%D0%B5%D1%88%D0%BA%D0%B8%D0%BD%D0%B0.jpg-49", 30, 0, 0.0, 11689.4, 1129, 24125, 11204.5, 23916.100000000002, 24091.45, 24125.0, 0.5183137525915688, 394.79563725596057, 0.43580873142709053], "isController": false}, {"data": ["/upload/resize_cache/iblock/33a/350_200_2/%D0%A1%D0%BF%D1%8F%D1%89%D0%B0%D1%8F%201600%D1%85600_1.jpg-81", 30, 0, 0.0, 993.9666666666668, 343, 1870, 924.5, 1653.2, 1849.1, 1870.0, 0.2744111593871484, 12.543591356048479, 0.18892565172650355], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2190, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
