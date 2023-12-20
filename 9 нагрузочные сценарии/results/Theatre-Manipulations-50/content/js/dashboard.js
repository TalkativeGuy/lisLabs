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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.3697260273972603, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.64, 500, 1500, "/cart/-104"], "isController": false}, {"data": [0.62, 500, 1500, "/upload/resize_cache/iblock/27b/160_160_2/%D0%93%D1%80%D0%B8%D0%B3%D0%BE%D1%80%D1%8C%D0%B5%D0%B2%D0%B0-%D0%9C%D0%B0%D0%B9%D1%8F.jpg-45"], "isController": false}, {"data": [0.71, 500, 1500, "/local/templates/novat/images/icons/arrow_2.svg-67"], "isController": false}, {"data": [0.0, 500, 1500, "/upload/iblock/8bc/%D0%9E%D0%BB%D1%8C%D0%B3%D0%B0%20%D0%93%D1%80%D0%B8%D1%88%D0%B5%D0%BD%D0%BA%D0%BE%D0%B2%D0%B0_%D0%A0%D0%BE%D0%BC%D0%B0%D0%BD%20%D0%9F%D0%BE%D0%BB%D0%BA%D0%BE%D0%B2%D0%BD%D0%B8%D0%BA%D0%BE%D0%B23.jpg-55"], "isController": false}, {"data": [0.31, 500, 1500, "/generate_204-86"], "isController": false}, {"data": [0.58, 500, 1500, "/local/templates/novat/images/icons/drop-icon.svg-69"], "isController": false}, {"data": [0.84, 500, 1500, "/local/templates/novat/images/icons/check.svg-39"], "isController": false}, {"data": [0.05, 500, 1500, "/cart/-100"], "isController": false}, {"data": [0.06, 500, 1500, "/cart/-102"], "isController": false}, {"data": [0.0, 500, 1500, "/upload/iblock/6ca/%D0%9E%D0%BB%D1%8C%D0%B3%D0%B0%20%D0%93%D1%80%D0%B8%D1%88%D0%B5%D0%BD%D0%BA%D0%BE%D0%B2%D0%B0_%D0%A0%D0%BE%D0%BC%D0%B0%D0%BD%20%D0%9F%D0%BE%D0%BB%D0%BA%D0%BE%D0%B2%D0%BD%D0%B8%D0%BA%D0%BE%D0%B22.jpg-54"], "isController": false}, {"data": [0.59, 500, 1500, "/local/templates/novat/images/icons/play.svg-70"], "isController": false}, {"data": [0.0, 500, 1500, "/upload/iblock/b04/%D0%9E%D0%BB%D1%8C%D0%B3%D0%B0%20%D0%93%D1%80%D0%B8%D1%88%D0%B5%D0%BD%D0%BA%D0%BE%D0%B2%D0%B0_%D0%92%D0%B5%D1%80%D0%B0%20%D0%A1%D0%B0%D0%B1%D0%B0%D0%BD%D1%86%D0%B5%D0%B2%D0%B0_%D0%A0%D0%BE%D0%BC%D0%B0%D0%BD%20%D0%9F%D0%BE%D0%BB%D0%BA%D0%BE%D0%B2%D0%BD%D0%B8%D0%BA%D0%BE%D0%B2.jpg-52"], "isController": false}, {"data": [0.62, 500, 1500, "/img/icon/visa1.png-92"], "isController": false}, {"data": [0.0, 500, 1500, "/upload/iblock/82e/%D0%9C%D0%B8%D1%85%D0%B0%D0%B8%D0%BB%20%D0%9B%D0%B8%D1%84%D0%B5%D0%BD%D1%86%D0%B5%D0%B2.jpg-50"], "isController": false}, {"data": [0.0, 500, 1500, "/search-37"], "isController": false}, {"data": [1.0, 500, 1500, "/generate_204-36"], "isController": false}, {"data": [0.72, 500, 1500, "/local/templates/novat/images/icons/drop-icon.svg-57"], "isController": false}, {"data": [0.38, 500, 1500, "/cart/-96"], "isController": false}, {"data": [0.58, 500, 1500, "/local/templates/novat/images/icons/vk.svg-89"], "isController": false}, {"data": [0.0, 500, 1500, "/buy_now/tickets/3305995/-68"], "isController": false}, {"data": [0.09, 500, 1500, "/cart/-98"], "isController": false}, {"data": [0.67, 500, 1500, "/upload/resize_cache/iblock/828/160_160_2/grinevich_240x240.jpg-46"], "isController": false}, {"data": [0.45, 500, 1500, "/cart/-100-1"], "isController": false}, {"data": [0.56, 500, 1500, "/img/icon/4.png-94"], "isController": false}, {"data": [0.13, 500, 1500, "/cart/-102-0"], "isController": false}, {"data": [0.63, 500, 1500, "/cart/-102-1"], "isController": false}, {"data": [0.49, 500, 1500, "/upload/resize_cache/iblock/33a/80_52_2/%D0%A1%D0%BF%D1%8F%D1%89%D0%B0%D1%8F%201600%D1%85600_1.jpg-78"], "isController": false}, {"data": [0.44, 500, 1500, "/cart/-82-0"], "isController": false}, {"data": [0.55, 500, 1500, "/upload/resize_cache/iblock/80c/260_260_2/prisca1_%D0%BA%D0%B0%D1%80%D1%82%D0%BE%D1%87%D0%BA%D0%B0.jpg-66"], "isController": false}, {"data": [0.55, 500, 1500, "/cart/-82-1"], "isController": false}, {"data": [0.28, 500, 1500, "/cart/-100-0"], "isController": false}, {"data": [0.51, 500, 1500, "/cart/-84-0"], "isController": false}, {"data": [0.54, 500, 1500, "/cart/-84-1"], "isController": false}, {"data": [0.41, 500, 1500, "/upload/resize_cache/iblock/27e/260_260_2/%D0%BB%D0%B5%D0%B1%D0%B5%D0%B4%D0%B5%D0%B2.jpg-71"], "isController": false}, {"data": [0.05, 500, 1500, "/cart/-79-0"], "isController": false}, {"data": [0.22, 500, 1500, "/auth/?login=yes-90"], "isController": false}, {"data": [0.43, 500, 1500, "/cart/-79-1"], "isController": false}, {"data": [0.47, 500, 1500, "/cart/-98-1"], "isController": false}, {"data": [0.23, 500, 1500, "/cart/-82"], "isController": false}, {"data": [0.3, 500, 1500, "/upload/resize_cache/iblock/61a/260_280_2/2_1600%D0%A5600.jpg-74"], "isController": false}, {"data": [0.21, 500, 1500, "/cart/-84"], "isController": false}, {"data": [0.0, 500, 1500, "/upload/iblock/28e/%D0%9C%D0%B8%D1%85%D0%B0%D0%B8%D0%BB%20%D0%9D%D0%B5%D0%B4%D0%B5%D0%BB%D1%8C%D1%81%D0%BA%D0%B8%D0%B9_%D0%95%D0%BA%D0%B0%D1%82%D0%B5%D1%80%D0%B8%D0%BD%D0%B0%20%D0%9B%D0%B8%D1%85%D0%BE%D0%B2%D0%B0.JPG-51"], "isController": false}, {"data": [0.78, 500, 1500, "/local/templates/novat/images/icons/play.svg-58"], "isController": false}, {"data": [0.7, 500, 1500, "/bitrix/cache/css/s1/novat/page_4e340cb13884582617e3aa61b09f0fcb/page_4e340cb13884582617e3aa61b09f0fcb.css-59"], "isController": false}, {"data": [0.14, 500, 1500, "/upload/resize_cache/iblock/33a/350_200_2/%D0%A1%D0%BF%D1%8F%D1%89%D0%B0%D1%8F%201600%D1%85600_1.jpg-97"], "isController": false}, {"data": [0.65, 500, 1500, "/upload/resize_cache/iblock/596/160_160_2/image-20-02-16-3-15-11.jpeg-44"], "isController": false}, {"data": [0.49, 500, 1500, "/img/icon/pk_short.png-65"], "isController": false}, {"data": [0.18, 500, 1500, "/theatre/repertoire/sleeping_beauty_new/-47"], "isController": false}, {"data": [0.6, 500, 1500, "/local/templates/novat/images/icons/check.svg-95"], "isController": false}, {"data": [0.27, 500, 1500, "/cart/-98-0"], "isController": false}, {"data": [0.9, 500, 1500, "/local/templates/novat/images/icons/lupa.svg-40"], "isController": false}, {"data": [0.39, 500, 1500, "/personal/order/-91"], "isController": false}, {"data": [0.0, 500, 1500, "/upload/iblock/e7f/%D0%9E%D0%BB%D1%8C%D0%B3%D0%B0%20%D0%93%D1%80%D0%B8%D1%88%D0%B5%D0%BD%D0%BA%D0%BE%D0%B2%D0%B0_%D0%A0%D0%BE%D0%BC%D0%B0%D0%BD%20%D0%9F%D0%BE%D0%BB%D0%BA%D0%BE%D0%B2%D0%BD%D0%B8%D0%BA%D0%BE%D0%B2.jpg-53"], "isController": false}, {"data": [0.8, 500, 1500, "/local/templates/novat/images/icons/lupa-purpur.png-42"], "isController": false}, {"data": [0.03, 500, 1500, "/upload/iblock/33a/%D0%A1%D0%BF%D1%8F%D1%89%D0%B0%D1%8F%201600%D1%85600_1.jpg-60"], "isController": false}, {"data": [0.0, 500, 1500, "/upload/iblock/8bc/%D0%9E%D0%BB%D1%8C%D0%B3%D0%B0%20%D0%93%D1%80%D0%B8%D1%88%D0%B5%D0%BD%D0%BA%D0%BE%D0%B2%D0%B0_%D0%A0%D0%BE%D0%BC%D0%B0%D0%BD%20%D0%9F%D0%BE%D0%BB%D0%BA%D0%BE%D0%B2%D0%BD%D0%B8%D0%BA%D0%BE%D0%B23.jpg-63"], "isController": false}, {"data": [0.57, 500, 1500, "/local/templates/novat/fonts/Lato-Light.woff-41"], "isController": false}, {"data": [0.02, 500, 1500, "/search-37-1"], "isController": false}, {"data": [0.57, 500, 1500, "/local/templates/novat/images/icons/gmail.svg-88"], "isController": false}, {"data": [0.0, 500, 1500, "/upload/iblock/6ca/%D0%9E%D0%BB%D1%8C%D0%B3%D0%B0%20%D0%93%D1%80%D0%B8%D1%88%D0%B5%D0%BD%D0%BA%D0%BE%D0%B2%D0%B0_%D0%A0%D0%BE%D0%BC%D0%B0%D0%BD%20%D0%9F%D0%BE%D0%BB%D0%BA%D0%BE%D0%B2%D0%BD%D0%B8%D0%BA%D0%BE%D0%B22.jpg-62"], "isController": false}, {"data": [0.0, 500, 1500, "/upload/iblock/82e/%D0%9C%D0%B8%D1%85%D0%B0%D0%B8%D0%BB%20%D0%9B%D0%B8%D1%84%D0%B5%D0%BD%D1%86%D0%B5%D0%B2.jpg-75"], "isController": false}, {"data": [0.17, 500, 1500, "/search/-43"], "isController": false}, {"data": [0.9, 500, 1500, "/search-37-0"], "isController": false}, {"data": [0.51, 500, 1500, "/auth/-87"], "isController": false}, {"data": [0.01, 500, 1500, "/cart/-79"], "isController": false}, {"data": [0.35, 500, 1500, "/upload/resize_cache/iblock/cdd/260_260_2/image-18-02-16-23-43-88.jpeg-73"], "isController": false}, {"data": [0.33, 500, 1500, "/upload/resize_cache/iblock/c6d/260_260_2/Odintsova.jpeg-72"], "isController": false}, {"data": [0.59, 500, 1500, "/img/icon/mastercard1.png-93"], "isController": false}, {"data": [0.5, 500, 1500, "/personal/order/-85"], "isController": false}, {"data": [0.4, 500, 1500, "/afisha/performances/detail/3305995/-56"], "isController": false}, {"data": [0.0, 500, 1500, "/upload/iblock/705/%D0%9E%D0%BB%D1%8C%D0%B3%D0%B0%20%D0%93%D1%80%D0%B8%D1%88%D0%B5%D0%BD%D0%BA%D0%BE%D0%B2%D0%B0_%D0%A0%D0%BE%D0%BC%D0%B0%D0%BD%20%D0%9F%D0%BE%D0%BB%D0%BA%D0%BE%D0%B2%D0%BD%D0%B8%D0%BA%D0%BE%D0%B24.jpg-64"], "isController": false}, {"data": [0.0, 500, 1500, "/upload/iblock/ce4/%D0%95%D0%B2%D0%B3%D0%B5%D0%BD%D0%B8%D0%B9%20%D0%93%D1%80%D0%B0%D1%89%D0%B5%D0%BD%D0%BA%D0%BE_%D0%9E%D0%BB%D1%8C%D0%B3%D0%B0%20%D0%9F%D0%BE%D1%82%D0%B5%D1%88%D0%BA%D0%B8%D0%BD%D0%B0.jpg-49"], "isController": false}, {"data": [0.23, 500, 1500, "/upload/resize_cache/iblock/33a/350_200_2/%D0%A1%D0%BF%D1%8F%D1%89%D0%B0%D1%8F%201600%D1%85600_1.jpg-81"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 3650, 0, 0.0, 5231.553424657539, 61, 203226, 1127.0, 11413.700000000003, 18296.699999999953, 97264.79999999999, 8.7169383246761, 2151.112375179115, 7.171370305689892], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["/cart/-104", 50, 0, 0.0, 1254.4199999999998, 161, 9598, 677.0, 2423.7, 7069.249999999981, 9598.0, 0.28988868274582563, 3.3971046914859695, 0.21147152930774585], "isController": false}, {"data": ["/upload/resize_cache/iblock/27b/160_160_2/%D0%93%D1%80%D0%B8%D0%B3%D0%BE%D1%80%D1%8C%D0%B5%D0%B2%D0%B0-%D0%9C%D0%B0%D0%B9%D1%8F.jpg-45", 50, 0, 0.0, 1031.0800000000002, 73, 17354, 722.5, 971.4, 2798.0499999999893, 17354.0, 1.743192831991075, 18.39204624690583, 1.3142039709932714], "isController": false}, {"data": ["/local/templates/novat/images/icons/arrow_2.svg-67", 50, 0, 0.0, 592.1800000000001, 255, 2742, 534.5, 828.1999999999999, 1436.0999999999954, 2742.0, 0.6721333512568893, 0.3807005309853475, 0.5100074354751982], "isController": false}, {"data": ["/upload/iblock/8bc/%D0%9E%D0%BB%D1%8C%D0%B3%D0%B0%20%D0%93%D1%80%D0%B8%D1%88%D0%B5%D0%BD%D0%BA%D0%BE%D0%B2%D0%B0_%D0%A0%D0%BE%D0%BC%D0%B0%D0%BD%20%D0%9F%D0%BE%D0%BB%D0%BA%D0%BE%D0%B2%D0%BD%D0%B8%D0%BA%D0%BE%D0%B23.jpg-55", 50, 0, 0.0, 8718.58, 2017, 29085, 7691.5, 15705.399999999996, 18309.79999999999, 29085.0, 0.602758221622143, 415.19504973508776, 0.5144635602517118], "isController": false}, {"data": ["/generate_204-86", 50, 0, 0.0, 1420.14, 621, 3202, 1289.0, 2275.3999999999996, 3020.499999999999, 3202.0, 0.28223871750726764, 0.042170433377550734, 0.09922454912364878], "isController": false}, {"data": ["/local/templates/novat/images/icons/drop-icon.svg-69", 50, 0, 0.0, 941.66, 278, 5557, 663.0, 1889.3999999999992, 3840.249999999988, 5557.0, 0.6296594801531331, 0.7907637612079388, 0.47900853031180735], "isController": false}, {"data": ["/local/templates/novat/images/icons/check.svg-39", 50, 0, 0.0, 349.32, 62, 835, 300.0, 777.0, 794.65, 835.0, 5.280388636603654, 5.192725934628789, 3.9963878841482736], "isController": false}, {"data": ["/cart/-100", 50, 0, 0.0, 3637.8, 854, 15456, 2269.5, 7816.199999999999, 12909.499999999985, 15456.0, 0.2150805906973343, 7.328602277273294, 0.3161096572260626], "isController": false}, {"data": ["/cart/-102", 50, 0, 0.0, 4617.88, 522, 23541, 3343.0, 10590.8, 15361.749999999993, 23541.0, 0.2841005943384433, 9.680450310095798, 0.4175501899212473], "isController": false}, {"data": ["/upload/iblock/6ca/%D0%9E%D0%BB%D1%8C%D0%B3%D0%B0%20%D0%93%D1%80%D0%B8%D1%88%D0%B5%D0%BD%D0%BA%D0%BE%D0%B2%D0%B0_%D0%A0%D0%BE%D0%BC%D0%B0%D0%BD%20%D0%9F%D0%BE%D0%BB%D0%BA%D0%BE%D0%B2%D0%BD%D0%B8%D0%BA%D0%BE%D0%B22.jpg-54", 50, 0, 0.0, 10375.000000000002, 1662, 23818, 9662.5, 19455.8, 21257.199999999986, 23818.0, 0.6111572874394955, 407.5768558936953, 0.5216322941622256], "isController": false}, {"data": ["/local/templates/novat/images/icons/play.svg-70", 50, 0, 0.0, 766.2399999999999, 307, 2188, 668.5, 1364.0999999999995, 1731.599999999998, 2188.0, 0.448527037209803, 0.4940805644264236, 0.33902336601600347], "isController": false}, {"data": ["/upload/iblock/b04/%D0%9E%D0%BB%D1%8C%D0%B3%D0%B0%20%D0%93%D1%80%D0%B8%D1%88%D0%B5%D0%BD%D0%BA%D0%BE%D0%B2%D0%B0_%D0%92%D0%B5%D1%80%D0%B0%20%D0%A1%D0%B0%D0%B1%D0%B0%D0%BD%D1%86%D0%B5%D0%B2%D0%B0_%D0%A0%D0%BE%D0%BC%D0%B0%D0%BD%20%D0%9F%D0%BE%D0%BB%D0%BA%D0%BE%D0%B2%D0%BD%D0%B8%D0%BA%D0%BE%D0%B2.jpg-52", 50, 0, 0.0, 21163.76, 8874, 39740, 21195.0, 31910.8, 35526.99999999999, 39740.0, 0.8003969969104676, 591.909993606829, 0.7464639961420865], "isController": false}, {"data": ["/img/icon/visa1.png-92", 50, 0, 0.0, 832.2800000000001, 182, 4244, 707.5, 1105.4, 2407.949999999996, 4244.0, 0.28065291093199224, 0.5741873519555895, 0.17376361868250298], "isController": false}, {"data": ["/upload/iblock/82e/%D0%9C%D0%B8%D1%85%D0%B0%D0%B8%D0%BB%20%D0%9B%D0%B8%D1%84%D0%B5%D0%BD%D1%86%D0%B5%D0%B2.jpg-50", 50, 0, 0.0, 9430.78, 2279, 43267, 6849.0, 15653.9, 26745.39999999991, 43267.0, 0.41448028317292945, 340.71412621339107, 0.31045544647816103], "isController": false}, {"data": ["/search-37", 50, 0, 0.0, 3992.859999999999, 1857, 6172, 3931.0, 5943.8, 6079.599999999999, 6172.0, 4.895721139723881, 91.02073108415745, 7.797774588759425], "isController": false}, {"data": ["/generate_204-36", 50, 0, 0.0, 164.78, 108, 347, 146.5, 224.2, 325.54999999999984, 347.0, 9.84251968503937, 1.4706108513779528, 3.4602608267716537], "isController": false}, {"data": ["/local/templates/novat/images/icons/drop-icon.svg-57", 50, 0, 0.0, 574.7799999999999, 240, 1282, 559.5, 979.8, 1071.4999999999998, 1282.0, 0.7623810685533058, 0.9574434122651866, 0.5799754417998292], "isController": false}, {"data": ["/cart/-96", 50, 0, 0.0, 1767.5199999999995, 369, 6227, 1098.0, 5306.199999999999, 6081.649999999999, 6227.0, 0.27677983271426915, 3.243373112361541, 0.2016384328172312], "isController": false}, {"data": ["/local/templates/novat/images/icons/vk.svg-89", 50, 0, 0.0, 885.34, 242, 4328, 705.5, 1132.3, 2761.1499999999983, 4328.0, 0.2844335221971921, 0.2955442066580199, 0.18249299226909685], "isController": false}, {"data": ["/buy_now/tickets/3305995/-68", 50, 0, 0.0, 18580.62, 4481, 56488, 13015.0, 40263.9, 52131.349999999984, 56488.0, 0.350973248818975, 264.7443587631001, 0.2690566409403275], "isController": false}, {"data": ["/cart/-98", 50, 0, 0.0, 4467.64, 835, 32702, 2594.5, 13044.199999999993, 17893.999999999996, 32702.0, 0.21559994998081158, 7.346328272214341, 0.31687297336047016], "isController": false}, {"data": ["/upload/resize_cache/iblock/828/160_160_2/grinevich_240x240.jpg-46", 50, 0, 0.0, 965.5800000000002, 80, 7038, 543.0, 1504.8999999999999, 6010.849999999996, 7038.0, 2.1469363218686937, 25.102801349349477, 1.4760187212847267], "isController": false}, {"data": ["/cart/-100-1", 50, 0, 0.0, 1369.0800000000006, 417, 8334, 926.0, 2450.8999999999996, 5731.249999999995, 8334.0, 0.2216321880859401, 2.5971483140439453, 0.15929813518676944], "isController": false}, {"data": ["/img/icon/4.png-94", 50, 0, 0.0, 1147.6799999999998, 226, 10487, 885.5, 1942.6999999999994, 3917.7499999999964, 10487.0, 0.2793233670755961, 1.3507903454671404, 0.17184933716564993], "isController": false}, {"data": ["/cart/-102-0", 50, 0, 0.0, 3745.7999999999984, 346, 21355, 2582.0, 9263.7, 13108.899999999987, 21355.0, 0.2843849890227394, 6.3575597350669435, 0.21356646148289707], "isController": false}, {"data": ["/cart/-102-1", 50, 0, 0.0, 872.0799999999998, 176, 6237, 651.0, 1563.3999999999999, 2520.249999999997, 6237.0, 0.2884820650700146, 3.3805928558858995, 0.20734648426907298], "isController": false}, {"data": ["/upload/resize_cache/iblock/33a/80_52_2/%D0%A1%D0%BF%D1%8F%D1%89%D0%B0%D1%8F%201600%D1%85600_1.jpg-78", 50, 0, 0.0, 1226.0999999999997, 264, 6378, 811.0, 2410.7, 4882.049999999992, 6378.0, 0.3114081252608043, 1.458205039673395, 0.21956705706865304], "isController": false}, {"data": ["/cart/-82-0", 50, 0, 0.0, 1390.9799999999998, 298, 7457, 817.5, 3060.7999999999993, 5628.999999999997, 7457.0, 0.2979364918573957, 6.660509933202639, 0.22374332249837625], "isController": false}, {"data": ["/upload/resize_cache/iblock/80c/260_260_2/prisca1_%D0%BA%D0%B0%D1%80%D1%82%D0%BE%D1%87%D0%BA%D0%B0.jpg-66", 50, 0, 0.0, 1403.3000000000002, 278, 12751, 632.0, 1938.9999999999998, 9781.449999999999, 12751.0, 0.68667170225915, 35.19058358511296, 0.4942158638330015], "isController": false}, {"data": ["/cart/-82-1", 50, 0, 0.0, 850.1199999999999, 390, 4597, 748.5, 1188.8, 1233.6, 4597.0, 0.2979577972575964, 3.491547449406766, 0.21415716677889743], "isController": false}, {"data": ["/cart/-100-0", 50, 0, 0.0, 2268.5599999999995, 408, 12286, 1386.5, 6758.0999999999985, 8134.949999999991, 12286.0, 0.21569202629717185, 4.821896353510603, 0.16197965646730972], "isController": false}, {"data": ["/cart/-84-0", 50, 0, 0.0, 1494.0, 321, 7637, 828.5, 4946.799999999999, 5707.899999999998, 7637.0, 0.2862835810640588, 6.402799388211988, 0.2616810858163663], "isController": false}, {"data": ["/cart/-84-1", 50, 0, 0.0, 950.4200000000001, 358, 6283, 718.0, 1232.5, 2702.349999999997, 6283.0, 0.28457274248443387, 3.311470735962027, 0.23538389930108936], "isController": false}, {"data": ["/upload/resize_cache/iblock/27e/260_260_2/%D0%BB%D0%B5%D0%B1%D0%B5%D0%B4%D0%B5%D0%B2.jpg-71", 50, 0, 0.0, 2798.5600000000004, 358, 40572, 826.0, 8076.899999999999, 10837.749999999998, 40572.0, 0.36503544494170387, 21.11501901834668, 0.2577349870047381], "isController": false}, {"data": ["/cart/-79-0", 50, 0, 0.0, 5612.180000000002, 851, 13051, 5587.5, 9576.1, 11952.499999999998, 13051.0, 0.2972298180953513, 6.635504751961717, 0.2928758656818452], "isController": false}, {"data": ["/auth/?login=yes-90", 50, 0, 0.0, 2065.0200000000004, 352, 6057, 1806.5, 3510.8999999999996, 5368.0, 6057.0, 0.2838183789429468, 0.3899952779717203, 0.2383630916903655], "isController": false}, {"data": ["/cart/-79-1", 50, 0, 0.0, 1347.4799999999996, 353, 6857, 869.0, 2989.3999999999987, 6026.249999999995, 6857.0, 0.3043287724594634, 3.566239867753932, 0.2543998332278327], "isController": false}, {"data": ["/cart/-98-1", 50, 0, 0.0, 1649.08, 345, 13247, 876.5, 4591.599999999998, 8962.64999999998, 13247.0, 0.216208736562627, 2.5336243435362236, 0.15540002940438816], "isController": false}, {"data": ["/cart/-82", 50, 0, 0.0, 2241.2400000000002, 842, 8040, 1604.0, 5265.5999999999985, 6479.749999999995, 8040.0, 0.29649835443413286, 10.102805013416551, 0.4357715072493848], "isController": false}, {"data": ["/upload/resize_cache/iblock/61a/260_280_2/2_1600%D0%A5600.jpg-74", 50, 0, 0.0, 2662.96, 420, 19866, 1364.5, 7574.099999999998, 9460.499999999998, 19866.0, 0.38308305240576157, 34.25076736323935, 0.26037676218204103], "isController": false}, {"data": ["/cart/-84", 50, 0, 0.0, 2444.4999999999995, 768, 9637, 1738.5, 6330.5999999999985, 7807.599999999995, 9637.0, 0.28304236578131015, 9.623971141000386, 0.492836463074293], "isController": false}, {"data": ["/upload/iblock/28e/%D0%9C%D0%B8%D1%85%D0%B0%D0%B8%D0%BB%20%D0%9D%D0%B5%D0%B4%D0%B5%D0%BB%D1%8C%D1%81%D0%BA%D0%B8%D0%B9_%D0%95%D0%BA%D0%B0%D1%82%D0%B5%D1%80%D0%B8%D0%BD%D0%B0%20%D0%9B%D0%B8%D1%85%D0%BE%D0%B2%D0%B0.JPG-51", 50, 0, 0.0, 120064.81999999999, 47443, 203226, 119477.0, 158911.4, 166675.55, 203226.0, 0.1781794338170311, 1441.3981901646735, 0.1519049274631525], "isController": false}, {"data": ["/local/templates/novat/images/icons/play.svg-58", 50, 0, 0.0, 635.3000000000003, 252, 2500, 460.5, 1104.1, 2368.449999999999, 2500.0, 0.7568533066920969, 0.833721220653013, 0.5720746673629716], "isController": false}, {"data": ["/bitrix/cache/css/s1/novat/page_4e340cb13884582617e3aa61b09f0fcb/page_4e340cb13884582617e3aa61b09f0fcb.css-59", 50, 0, 0.0, 752.6400000000002, 246, 2774, 483.0, 2149.7, 2360.8999999999996, 2774.0, 0.7374413734108138, 0.6719070326096575, 0.5113118897672635], "isController": false}, {"data": ["/upload/resize_cache/iblock/33a/350_200_2/%D0%A1%D0%BF%D1%8F%D1%89%D0%B0%D1%8F%201600%D1%85600_1.jpg-97", 50, 0, 0.0, 4921.64, 455, 28726, 3067.5, 12481.199999999999, 19494.44999999996, 28726.0, 0.24993376755159882, 11.424706827690661, 0.1720735411365988], "isController": false}, {"data": ["/upload/resize_cache/iblock/596/160_160_2/image-20-02-16-3-15-11.jpeg-44", 50, 0, 0.0, 867.8199999999999, 103, 7027, 668.0, 1394.1999999999996, 4225.299999999995, 7027.0, 1.7799295147912142, 17.84101224591506, 1.2341308159196895], "isController": false}, {"data": ["/img/icon/pk_short.png-65", 50, 0, 0.0, 1256.3800000000003, 267, 6572, 888.0, 2208.9999999999995, 4097.599999999996, 6572.0, 0.6846595188212902, 37.62016844335812, 0.43927861705623794], "isController": false}, {"data": ["/theatre/repertoire/sleeping_beauty_new/-47", 50, 0, 0.0, 2374.48, 700, 9723, 1948.0, 4740.0, 6812.949999999993, 9723.0, 1.5988232660761679, 38.32554240079302, 1.2865530969206664], "isController": false}, {"data": ["/local/templates/novat/images/icons/check.svg-95", 50, 0, 0.0, 869.7600000000001, 337, 3677, 720.5, 1739.899999999999, 2355.45, 3677.0, 0.28147922964764427, 0.27680623462419707, 0.21303359665715266], "isController": false}, {"data": ["/cart/-98-0", 50, 0, 0.0, 2818.5, 379, 29401, 1650.5, 4514.499999999999, 13646.349999999971, 29401.0, 0.21871309216569704, 4.88943369712611, 0.16424840612834082], "isController": false}, {"data": ["/local/templates/novat/images/icons/lupa.svg-40", 50, 0, 0.0, 297.24, 61, 915, 212.5, 636.3, 745.9999999999998, 915.0, 5.711674663011195, 6.481412068768563, 4.317222840986978], "isController": false}, {"data": ["/personal/order/-91", 50, 0, 0.0, 1256.76, 253, 5544, 987.5, 2005.9, 3556.099999999998, 5544.0, 0.28668902841088273, 3.3358956165247555, 0.211657134256472], "isController": false}, {"data": ["/upload/iblock/e7f/%D0%9E%D0%BB%D1%8C%D0%B3%D0%B0%20%D0%93%D1%80%D0%B8%D1%88%D0%B5%D0%BD%D0%BA%D0%BE%D0%B2%D0%B0_%D0%A0%D0%BE%D0%BC%D0%B0%D0%BD%20%D0%9F%D0%BE%D0%BB%D0%BA%D0%BE%D0%B2%D0%BD%D0%B8%D0%BA%D0%BE%D0%B2.jpg-53", 50, 0, 0.0, 12024.68, 3357, 31037, 12241.5, 17800.999999999996, 19454.6, 31037.0, 0.6486262096878811, 509.89684512265524, 0.5529791807202346], "isController": false}, {"data": ["/local/templates/novat/images/icons/lupa-purpur.png-42", 50, 0, 0.0, 447.6999999999999, 66, 1833, 350.5, 997.4, 1032.8, 1833.0, 2.6397761469827357, 3.3512783115991764, 2.0133448933530436], "isController": false}, {"data": ["/upload/iblock/33a/%D0%A1%D0%BF%D1%8F%D1%89%D0%B0%D1%8F%201600%D1%85600_1.jpg-60", 50, 0, 0.0, 5044.32, 1241, 13754, 3422.5, 12895.9, 13452.7, 13754.0, 0.6372186679580966, 190.22408491416667, 0.443066105064614], "isController": false}, {"data": ["/upload/iblock/8bc/%D0%9E%D0%BB%D1%8C%D0%B3%D0%B0%20%D0%93%D1%80%D0%B8%D1%88%D0%B5%D0%BD%D0%BA%D0%BE%D0%B2%D0%B0_%D0%A0%D0%BE%D0%BC%D0%B0%D0%BD%20%D0%9F%D0%BE%D0%BB%D0%BA%D0%BE%D0%B2%D0%BD%D0%B8%D0%BA%D0%BE%D0%B23.jpg-63", 50, 0, 0.0, 8239.04, 1645, 20228, 6163.0, 16558.899999999998, 19473.049999999996, 20228.0, 0.4091586062421237, 281.83875685852115, 0.340432746599892], "isController": false}, {"data": ["/local/templates/novat/fonts/Lato-Light.woff-41", 50, 0, 0.0, 1386.0, 156, 9628, 825.0, 2517.8999999999996, 7724.799999999989, 9628.0, 2.6753705388196263, 170.09765520493337, 1.9203099082347905], "isController": false}, {"data": ["/search-37-1", 50, 0, 0.0, 3591.1999999999994, 1212, 5857, 3623.5, 5603.099999999999, 5735.65, 5857.0, 5.329922183136126, 96.95409521239739, 4.2472817396866], "isController": false}, {"data": ["/local/templates/novat/images/icons/gmail.svg-88", 50, 0, 0.0, 973.5200000000004, 192, 3855, 753.0, 2761.499999999998, 3386.699999999997, 3855.0, 0.28415387500639344, 0.2319849995169384, 0.18314605225021452], "isController": false}, {"data": ["/upload/iblock/6ca/%D0%9E%D0%BB%D1%8C%D0%B3%D0%B0%20%D0%93%D1%80%D0%B8%D1%88%D0%B5%D0%BD%D0%BA%D0%BE%D0%B2%D0%B0_%D0%A0%D0%BE%D0%BC%D0%B0%D0%BD%20%D0%9F%D0%BE%D0%BB%D0%BA%D0%BE%D0%B2%D0%BD%D0%B8%D0%BA%D0%BE%D0%B22.jpg-62", 50, 0, 0.0, 9686.000000000002, 1946, 63626, 5814.0, 23230.6, 30822.649999999947, 63626.0, 0.3573955868792932, 238.34481336355708, 0.2973642968956619], "isController": false}, {"data": ["/upload/iblock/82e/%D0%9C%D0%B8%D1%85%D0%B0%D0%B8%D0%BB%20%D0%9B%D0%B8%D1%84%D0%B5%D0%BD%D1%86%D0%B5%D0%B2.jpg-75", 50, 0, 0.0, 15500.100000000002, 2138, 45714, 12952.0, 31676.099999999995, 37210.24999999996, 45714.0, 0.31883484992443617, 262.0909647783141, 0.23196480780635248], "isController": false}, {"data": ["/search/-43", 50, 0, 0.0, 2766.3200000000006, 843, 11493, 2068.0, 6427.5999999999985, 8101.2499999999945, 11493.0, 2.1827389007726894, 48.65691641747064, 1.7713437759200243], "isController": false}, {"data": ["/search-37-0", 50, 0, 0.0, 401.44, 262, 912, 327.5, 714.6999999999998, 862.0499999999997, 912.0, 9.094216078574027, 3.650119929974536, 7.238072367224445], "isController": false}, {"data": ["/auth/-87", 50, 0, 0.0, 1094.3, 321, 7131, 793.5, 1219.8999999999999, 4793.399999999994, 7131.0, 0.2838280456168435, 1.43760568159886, 0.213425385864228], "isController": false}, {"data": ["/cart/-79", 50, 0, 0.0, 6959.82, 1363, 18747, 6798.0, 12367.4, 14715.199999999999, 18747.0, 0.29544715927556353, 10.057869558232634, 0.5380946797352792], "isController": false}, {"data": ["/upload/resize_cache/iblock/cdd/260_260_2/image-18-02-16-23-43-88.jpeg-73", 50, 0, 0.0, 1846.88, 357, 8413, 876.0, 5020.299999999998, 7418.3499999999985, 8413.0, 0.3831564427755853, 23.036532769454766, 0.2637942306218629], "isController": false}, {"data": ["/upload/resize_cache/iblock/c6d/260_260_2/Odintsova.jpeg-72", 50, 0, 0.0, 2419.7000000000007, 381, 12275, 870.0, 6771.2, 10109.649999999992, 12275.0, 0.3650647624888655, 21.802280810553295, 0.24634741296856064], "isController": false}, {"data": ["/img/icon/mastercard1.png-93", 50, 0, 0.0, 816.1199999999998, 302, 3827, 745.0, 1106.8, 1496.2999999999965, 3827.0, 0.2867909809972296, 0.7158571752235536, 0.17924436312326852], "isController": false}, {"data": ["/personal/order/-85", 50, 0, 0.0, 1451.22, 306, 8499, 950.0, 4418.999999999997, 6057.399999999994, 8499.0, 0.2822865208186309, 3.284866796047989, 0.21281757233592097], "isController": false}, {"data": ["/afisha/performances/detail/3305995/-56", 50, 0, 0.0, 1481.5200000000002, 503, 8065, 1021.0, 2373.5999999999995, 5811.4, 8065.0, 0.7252473093324824, 14.959500603768387, 0.579347948275362], "isController": false}, {"data": ["/upload/iblock/705/%D0%9E%D0%BB%D1%8C%D0%B3%D0%B0%20%D0%93%D1%80%D0%B8%D1%88%D0%B5%D0%BD%D0%BA%D0%BE%D0%B2%D0%B0_%D0%A0%D0%BE%D0%BC%D0%B0%D0%BD%20%D0%9F%D0%BE%D0%BB%D0%BA%D0%BE%D0%B2%D0%BD%D0%B8%D0%BA%D0%BE%D0%B24.jpg-64", 50, 0, 0.0, 19301.959999999992, 2923, 81752, 17553.0, 33552.0, 37695.19999999997, 81752.0, 0.32813135754505246, 353.06998160003417, 0.2730155435824069], "isController": false}, {"data": ["/upload/iblock/ce4/%D0%95%D0%B2%D0%B3%D0%B5%D0%BD%D0%B8%D0%B9%20%D0%93%D1%80%D0%B0%D1%89%D0%B5%D0%BD%D0%BA%D0%BE_%D0%9E%D0%BB%D1%8C%D0%B3%D0%B0%20%D0%9F%D0%BE%D1%82%D0%B5%D1%88%D0%BA%D0%B8%D0%BD%D0%B0.jpg-49", 50, 0, 0.0, 13615.76, 4356, 27671, 13040.0, 22004.1, 25826.699999999997, 27671.0, 0.6622341130036291, 504.41867951345665, 0.5568198938438718], "isController": false}, {"data": ["/upload/resize_cache/iblock/33a/350_200_2/%D0%A1%D0%BF%D1%8F%D1%89%D0%B0%D1%8F%201600%D1%85600_1.jpg-81", 50, 0, 0.0, 2671.08, 443, 17545, 1715.5, 6562.399999999999, 9700.149999999998, 17545.0, 0.2990162365816464, 13.66831250186885, 0.20586567069341866], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 3650, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
