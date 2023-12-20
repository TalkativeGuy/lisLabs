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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4986301369863014, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8, 500, 1500, "/cart/-104"], "isController": false}, {"data": [0.3, 500, 1500, "/upload/resize_cache/iblock/27b/160_160_2/%D0%93%D1%80%D0%B8%D0%B3%D0%BE%D1%80%D1%8C%D0%B5%D0%B2%D0%B0-%D0%9C%D0%B0%D0%B9%D1%8F.jpg-45"], "isController": false}, {"data": [0.65, 500, 1500, "/local/templates/novat/images/icons/arrow_2.svg-67"], "isController": false}, {"data": [0.0, 500, 1500, "/upload/iblock/8bc/%D0%9E%D0%BB%D1%8C%D0%B3%D0%B0%20%D0%93%D1%80%D0%B8%D1%88%D0%B5%D0%BD%D0%BA%D0%BE%D0%B2%D0%B0_%D0%A0%D0%BE%D0%BC%D0%B0%D0%BD%20%D0%9F%D0%BE%D0%BB%D0%BA%D0%BE%D0%B2%D0%BD%D0%B8%D0%BA%D0%BE%D0%B23.jpg-55"], "isController": false}, {"data": [0.6, 500, 1500, "/generate_204-86"], "isController": false}, {"data": [0.6, 500, 1500, "/local/templates/novat/images/icons/drop-icon.svg-69"], "isController": false}, {"data": [0.7, 500, 1500, "/local/templates/novat/images/icons/check.svg-39"], "isController": false}, {"data": [0.5, 500, 1500, "/cart/-100"], "isController": false}, {"data": [0.4, 500, 1500, "/cart/-102"], "isController": false}, {"data": [0.0, 500, 1500, "/upload/iblock/6ca/%D0%9E%D0%BB%D1%8C%D0%B3%D0%B0%20%D0%93%D1%80%D0%B8%D1%88%D0%B5%D0%BD%D0%BA%D0%BE%D0%B2%D0%B0_%D0%A0%D0%BE%D0%BC%D0%B0%D0%BD%20%D0%9F%D0%BE%D0%BB%D0%BA%D0%BE%D0%B2%D0%BD%D0%B8%D0%BA%D0%BE%D0%B22.jpg-54"], "isController": false}, {"data": [0.9, 500, 1500, "/local/templates/novat/images/icons/play.svg-70"], "isController": false}, {"data": [0.0, 500, 1500, "/upload/iblock/b04/%D0%9E%D0%BB%D1%8C%D0%B3%D0%B0%20%D0%93%D1%80%D0%B8%D1%88%D0%B5%D0%BD%D0%BA%D0%BE%D0%B2%D0%B0_%D0%92%D0%B5%D1%80%D0%B0%20%D0%A1%D0%B0%D0%B1%D0%B0%D0%BD%D1%86%D0%B5%D0%B2%D0%B0_%D0%A0%D0%BE%D0%BC%D0%B0%D0%BD%20%D0%9F%D0%BE%D0%BB%D0%BA%D0%BE%D0%B2%D0%BD%D0%B8%D0%BA%D0%BE%D0%B2.jpg-52"], "isController": false}, {"data": [0.9, 500, 1500, "/img/icon/visa1.png-92"], "isController": false}, {"data": [0.0, 500, 1500, "/upload/iblock/82e/%D0%9C%D0%B8%D1%85%D0%B0%D0%B8%D0%BB%20%D0%9B%D0%B8%D1%84%D0%B5%D0%BD%D1%86%D0%B5%D0%B2.jpg-50"], "isController": false}, {"data": [0.0, 500, 1500, "/search-37"], "isController": false}, {"data": [0.6, 500, 1500, "/generate_204-36"], "isController": false}, {"data": [0.6, 500, 1500, "/local/templates/novat/images/icons/drop-icon.svg-57"], "isController": false}, {"data": [0.9, 500, 1500, "/cart/-96"], "isController": false}, {"data": [0.95, 500, 1500, "/local/templates/novat/images/icons/vk.svg-89"], "isController": false}, {"data": [0.0, 500, 1500, "/buy_now/tickets/3305995/-68"], "isController": false}, {"data": [0.6, 500, 1500, "/cart/-98"], "isController": false}, {"data": [0.3, 500, 1500, "/upload/resize_cache/iblock/828/160_160_2/grinevich_240x240.jpg-46"], "isController": false}, {"data": [0.9, 500, 1500, "/cart/-100-1"], "isController": false}, {"data": [0.9, 500, 1500, "/img/icon/4.png-94"], "isController": false}, {"data": [0.5, 500, 1500, "/cart/-102-0"], "isController": false}, {"data": [0.85, 500, 1500, "/cart/-102-1"], "isController": false}, {"data": [0.5, 500, 1500, "/upload/resize_cache/iblock/33a/80_52_2/%D0%A1%D0%BF%D1%8F%D1%89%D0%B0%D1%8F%201600%D1%85600_1.jpg-78"], "isController": false}, {"data": [0.75, 500, 1500, "/cart/-82-0"], "isController": false}, {"data": [0.3, 500, 1500, "/upload/resize_cache/iblock/80c/260_260_2/prisca1_%D0%BA%D0%B0%D1%80%D1%82%D0%BE%D1%87%D0%BA%D0%B0.jpg-66"], "isController": false}, {"data": [0.8, 500, 1500, "/cart/-82-1"], "isController": false}, {"data": [0.9, 500, 1500, "/cart/-100-0"], "isController": false}, {"data": [0.8, 500, 1500, "/cart/-84-0"], "isController": false}, {"data": [0.9, 500, 1500, "/cart/-84-1"], "isController": false}, {"data": [0.75, 500, 1500, "/upload/resize_cache/iblock/27e/260_260_2/%D0%BB%D0%B5%D0%B1%D0%B5%D0%B4%D0%B5%D0%B2.jpg-71"], "isController": false}, {"data": [0.05, 500, 1500, "/cart/-79-0"], "isController": false}, {"data": [0.5, 500, 1500, "/auth/?login=yes-90"], "isController": false}, {"data": [0.6, 500, 1500, "/cart/-79-1"], "isController": false}, {"data": [0.95, 500, 1500, "/cart/-98-1"], "isController": false}, {"data": [0.35, 500, 1500, "/cart/-82"], "isController": false}, {"data": [0.75, 500, 1500, "/upload/resize_cache/iblock/61a/260_280_2/2_1600%D0%A5600.jpg-74"], "isController": false}, {"data": [0.45, 500, 1500, "/cart/-84"], "isController": false}, {"data": [0.0, 500, 1500, "/upload/iblock/28e/%D0%9C%D0%B8%D1%85%D0%B0%D0%B8%D0%BB%20%D0%9D%D0%B5%D0%B4%D0%B5%D0%BB%D1%8C%D1%81%D0%BA%D0%B8%D0%B9_%D0%95%D0%BA%D0%B0%D1%82%D0%B5%D1%80%D0%B8%D0%BD%D0%B0%20%D0%9B%D0%B8%D1%85%D0%BE%D0%B2%D0%B0.JPG-51"], "isController": false}, {"data": [0.75, 500, 1500, "/local/templates/novat/images/icons/play.svg-58"], "isController": false}, {"data": [0.65, 500, 1500, "/bitrix/cache/css/s1/novat/page_4e340cb13884582617e3aa61b09f0fcb/page_4e340cb13884582617e3aa61b09f0fcb.css-59"], "isController": false}, {"data": [0.55, 500, 1500, "/upload/resize_cache/iblock/33a/350_200_2/%D0%A1%D0%BF%D1%8F%D1%89%D0%B0%D1%8F%201600%D1%85600_1.jpg-97"], "isController": false}, {"data": [0.4, 500, 1500, "/upload/resize_cache/iblock/596/160_160_2/image-20-02-16-3-15-11.jpeg-44"], "isController": false}, {"data": [0.25, 500, 1500, "/img/icon/pk_short.png-65"], "isController": false}, {"data": [0.1, 500, 1500, "/theatre/repertoire/sleeping_beauty_new/-47"], "isController": false}, {"data": [0.95, 500, 1500, "/local/templates/novat/images/icons/check.svg-95"], "isController": false}, {"data": [0.8, 500, 1500, "/cart/-98-0"], "isController": false}, {"data": [0.75, 500, 1500, "/local/templates/novat/images/icons/lupa.svg-40"], "isController": false}, {"data": [0.85, 500, 1500, "/personal/order/-91"], "isController": false}, {"data": [0.0, 500, 1500, "/upload/iblock/e7f/%D0%9E%D0%BB%D1%8C%D0%B3%D0%B0%20%D0%93%D1%80%D0%B8%D1%88%D0%B5%D0%BD%D0%BA%D0%BE%D0%B2%D0%B0_%D0%A0%D0%BE%D0%BC%D0%B0%D0%BD%20%D0%9F%D0%BE%D0%BB%D0%BA%D0%BE%D0%B2%D0%BD%D0%B8%D0%BA%D0%BE%D0%B2.jpg-53"], "isController": false}, {"data": [0.5, 500, 1500, "/local/templates/novat/images/icons/lupa-purpur.png-42"], "isController": false}, {"data": [0.1, 500, 1500, "/upload/iblock/33a/%D0%A1%D0%BF%D1%8F%D1%89%D0%B0%D1%8F%201600%D1%85600_1.jpg-60"], "isController": false}, {"data": [0.0, 500, 1500, "/upload/iblock/8bc/%D0%9E%D0%BB%D1%8C%D0%B3%D0%B0%20%D0%93%D1%80%D0%B8%D1%88%D0%B5%D0%BD%D0%BA%D0%BE%D0%B2%D0%B0_%D0%A0%D0%BE%D0%BC%D0%B0%D0%BD%20%D0%9F%D0%BE%D0%BB%D0%BA%D0%BE%D0%B2%D0%BD%D0%B8%D0%BA%D0%BE%D0%B23.jpg-63"], "isController": false}, {"data": [0.1, 500, 1500, "/local/templates/novat/fonts/Lato-Light.woff-41"], "isController": false}, {"data": [0.3, 500, 1500, "/search-37-1"], "isController": false}, {"data": [1.0, 500, 1500, "/local/templates/novat/images/icons/gmail.svg-88"], "isController": false}, {"data": [0.05, 500, 1500, "/upload/iblock/6ca/%D0%9E%D0%BB%D1%8C%D0%B3%D0%B0%20%D0%93%D1%80%D0%B8%D1%88%D0%B5%D0%BD%D0%BA%D0%BE%D0%B2%D0%B0_%D0%A0%D0%BE%D0%BC%D0%B0%D0%BD%20%D0%9F%D0%BE%D0%BB%D0%BA%D0%BE%D0%B2%D0%BD%D0%B8%D0%BA%D0%BE%D0%B22.jpg-62"], "isController": false}, {"data": [0.0, 500, 1500, "/upload/iblock/82e/%D0%9C%D0%B8%D1%85%D0%B0%D0%B8%D0%BB%20%D0%9B%D0%B8%D1%84%D0%B5%D0%BD%D1%86%D0%B5%D0%B2.jpg-75"], "isController": false}, {"data": [0.2, 500, 1500, "/search/-43"], "isController": false}, {"data": [0.2, 500, 1500, "/search-37-0"], "isController": false}, {"data": [0.9, 500, 1500, "/auth/-87"], "isController": false}, {"data": [0.05, 500, 1500, "/cart/-79"], "isController": false}, {"data": [0.8, 500, 1500, "/upload/resize_cache/iblock/cdd/260_260_2/image-18-02-16-23-43-88.jpeg-73"], "isController": false}, {"data": [0.8, 500, 1500, "/upload/resize_cache/iblock/c6d/260_260_2/Odintsova.jpeg-72"], "isController": false}, {"data": [1.0, 500, 1500, "/img/icon/mastercard1.png-93"], "isController": false}, {"data": [0.8, 500, 1500, "/personal/order/-85"], "isController": false}, {"data": [0.3, 500, 1500, "/afisha/performances/detail/3305995/-56"], "isController": false}, {"data": [0.0, 500, 1500, "/upload/iblock/705/%D0%9E%D0%BB%D1%8C%D0%B3%D0%B0%20%D0%93%D1%80%D0%B8%D1%88%D0%B5%D0%BD%D0%BA%D0%BE%D0%B2%D0%B0_%D0%A0%D0%BE%D0%BC%D0%B0%D0%BD%20%D0%9F%D0%BE%D0%BB%D0%BA%D0%BE%D0%B2%D0%BD%D0%B8%D0%BA%D0%BE%D0%B24.jpg-64"], "isController": false}, {"data": [0.0, 500, 1500, "/upload/iblock/ce4/%D0%95%D0%B2%D0%B3%D0%B5%D0%BD%D0%B8%D0%B9%20%D0%93%D1%80%D0%B0%D1%89%D0%B5%D0%BD%D0%BA%D0%BE_%D0%9E%D0%BB%D1%8C%D0%B3%D0%B0%20%D0%9F%D0%BE%D1%82%D0%B5%D1%88%D0%BA%D0%B8%D0%BD%D0%B0.jpg-49"], "isController": false}, {"data": [0.45, 500, 1500, "/upload/resize_cache/iblock/33a/350_200_2/%D0%A1%D0%BF%D1%8F%D1%89%D0%B0%D1%8F%201600%D1%85600_1.jpg-81"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 730, 0, 0.0, 3813.772602739723, 103, 62637, 811.5, 7695.899999999995, 25126.799999999996, 48498.84999999989, 2.6405075561921714, 651.608380373026, 2.172328950271647], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["/cart/-104", 10, 0, 0.0, 444.3, 223, 801, 321.5, 791.2, 801.0, 801.0, 0.3411222923418045, 3.9974269252089374, 0.2488460472454375], "isController": false}, {"data": ["/upload/resize_cache/iblock/27b/160_160_2/%D0%93%D1%80%D0%B8%D0%B3%D0%BE%D1%80%D1%8C%D0%B5%D0%B2%D0%B0-%D0%9C%D0%B0%D0%B9%D1%8F.jpg-45", 10, 0, 0.0, 2442.4, 849, 8868, 1042.5, 8523.100000000002, 8868.0, 8868.0, 0.40422005739924816, 4.264837402481911, 0.30474402764865194], "isController": false}, {"data": ["/local/templates/novat/images/icons/arrow_2.svg-67", 10, 0, 0.0, 592.4, 217, 890, 651.5, 883.9, 890.0, 890.0, 0.4698585725696565, 0.266130832119532, 0.3565235457877179], "isController": false}, {"data": ["/upload/iblock/8bc/%D0%9E%D0%BB%D1%8C%D0%B3%D0%B0%20%D0%93%D1%80%D0%B8%D1%88%D0%B5%D0%BD%D0%BA%D0%BE%D0%B2%D0%B0_%D0%A0%D0%BE%D0%BC%D0%B0%D0%BD%20%D0%9F%D0%BE%D0%BB%D0%BA%D0%BE%D0%B2%D0%BD%D0%B8%D0%BA%D0%BE%D0%B23.jpg-55", 10, 0, 0.0, 8783.099999999999, 3492, 19801, 7477.0, 19379.800000000003, 19801.0, 19801.0, 0.2885253469517297, 198.74352846663206, 0.24626089183184743], "isController": false}, {"data": ["/generate_204-86", 10, 0, 0.0, 683.2, 354, 1038, 687.0, 1024.7, 1038.0, 1038.0, 0.24598430620126435, 0.03675351450077485, 0.08647885764888201], "isController": false}, {"data": ["/local/templates/novat/images/icons/drop-icon.svg-69", 10, 0, 0.0, 825.4, 303, 2313, 685.5, 2184.8, 2313.0, 2313.0, 0.3377579626439693, 0.4241765038673287, 0.2569467313473165], "isController": false}, {"data": ["/local/templates/novat/images/icons/check.svg-39", 10, 0, 0.0, 550.8, 282, 883, 591.0, 875.6, 883.0, 883.0, 1.4764506127270043, 1.4519392256016537, 1.1174308836556919], "isController": false}, {"data": ["/cart/-100", 10, 0, 0.0, 840.1, 629, 1279, 802.5, 1260.4, 1279.0, 1279.0, 0.22333891680625348, 7.61003367532105, 0.32824713847012843], "isController": false}, {"data": ["/cart/-102", 10, 0, 0.0, 1420.1, 429, 2331, 1313.5, 2303.6, 2331.0, 2331.0, 0.3297174321606383, 11.234799511193907, 0.4845944681657819], "isController": false}, {"data": ["/upload/iblock/6ca/%D0%9E%D0%BB%D1%8C%D0%B3%D0%B0%20%D0%93%D1%80%D0%B8%D1%88%D0%B5%D0%BD%D0%BA%D0%BE%D0%B2%D0%B0_%D0%A0%D0%BE%D0%BC%D0%B0%D0%BD%20%D0%9F%D0%BE%D0%BB%D0%BA%D0%BE%D0%B2%D0%BD%D0%B8%D0%BA%D0%BE%D0%B22.jpg-54", 10, 0, 0.0, 15974.000000000002, 5573, 40004, 9203.0, 39480.4, 40004.0, 40004.0, 0.17378610406311912, 115.89683269394529, 0.14832915522574813], "isController": false}, {"data": ["/local/templates/novat/images/icons/play.svg-70", 10, 0, 0.0, 358.4, 139, 840, 286.0, 822.7, 840.0, 840.0, 0.4096178265678122, 0.45121963707860563, 0.3096134743784049], "isController": false}, {"data": ["/upload/iblock/b04/%D0%9E%D0%BB%D1%8C%D0%B3%D0%B0%20%D0%93%D1%80%D0%B8%D1%88%D0%B5%D0%BD%D0%BA%D0%BE%D0%B2%D0%B0_%D0%92%D0%B5%D1%80%D0%B0%20%D0%A1%D0%B0%D0%B1%D0%B0%D0%BD%D1%86%D0%B5%D0%B2%D0%B0_%D0%A0%D0%BE%D0%BC%D0%B0%D0%BD%20%D0%9F%D0%BE%D0%BB%D0%BA%D0%BE%D0%B2%D0%BD%D0%B8%D0%BA%D0%BE%D0%B2.jpg-52", 10, 0, 0.0, 35012.5, 25162, 47212, 34605.0, 46821.200000000004, 47212.0, 47212.0, 0.13857324981985478, 102.47776007600743, 0.12923579450972783], "isController": false}, {"data": ["/img/icon/visa1.png-92", 10, 0, 0.0, 295.3, 162, 580, 241.5, 576.7, 580.0, 580.0, 0.24258890883508807, 0.4963122695405366, 0.15019664863422444], "isController": false}, {"data": ["/upload/iblock/82e/%D0%9C%D0%B8%D1%85%D0%B0%D0%B8%D0%BB%20%D0%9B%D0%B8%D1%84%D0%B5%D0%BD%D1%86%D0%B5%D0%B2.jpg-50", 10, 0, 0.0, 6899.0, 2738, 10852, 7184.5, 10614.2, 10852.0, 10852.0, 0.314752447200277, 258.7351181108558, 0.23575695996348872], "isController": false}, {"data": ["/search-37", 10, 0, 0.0, 3294.5, 2247, 5445, 3015.0, 5349.6, 5445.0, 5445.0, 1.1350737797956867, 21.102396069807035, 1.8079153660612939], "isController": false}, {"data": ["/generate_204-36", 10, 0, 0.0, 739.0, 419, 1150, 745.0, 1133.7, 1150.0, 1150.0, 2.052545155993432, 0.3066791102216749, 0.721597906403941], "isController": false}, {"data": ["/local/templates/novat/images/icons/drop-icon.svg-57", 10, 0, 0.0, 713.8, 199, 2215, 554.0, 2075.9000000000005, 2215.0, 2215.0, 0.20202836478241543, 0.2537192159279163, 0.1536915001616227], "isController": false}, {"data": ["/cart/-96", 10, 0, 0.0, 434.90000000000003, 343, 639, 395.0, 636.6, 639.0, 639.0, 0.23683213338385753, 2.7752146661259003, 0.17253590967222435], "isController": false}, {"data": ["/local/templates/novat/images/icons/vk.svg-89", 10, 0, 0.0, 304.5, 160, 592, 277.5, 573.4000000000001, 592.0, 592.0, 0.24620232907403306, 0.2558196075534875, 0.1579637990250388], "isController": false}, {"data": ["/buy_now/tickets/3305995/-68", 10, 0, 0.0, 7236.099999999999, 3448, 13505, 6709.5, 13071.300000000001, 13505.0, 13505.0, 0.2390914524805738, 180.34574865511055, 0.1832878810520024], "isController": false}, {"data": ["/cart/-98", 10, 0, 0.0, 839.8, 379, 1230, 912.5, 1228.6, 1230.0, 1230.0, 0.22308481684736536, 7.60159334844733, 0.3278736810110204], "isController": false}, {"data": ["/upload/resize_cache/iblock/828/160_160_2/grinevich_240x240.jpg-46", 10, 0, 0.0, 1753.4, 814, 5006, 987.5, 4887.1, 5006.0, 5006.0, 0.4493372275893058, 5.2538228768816, 0.30891934396764775], "isController": false}, {"data": ["/cart/-100-1", 10, 0, 0.0, 428.6, 226, 697, 421.5, 678.9000000000001, 697.0, 697.0, 0.22628018011902337, 2.651654567748286, 0.16263887946054806], "isController": false}, {"data": ["/img/icon/4.png-94", 10, 0, 0.0, 336.7, 148, 941, 280.5, 899.1000000000001, 941.0, 941.0, 0.23847566355853383, 1.1532534042400973, 0.14671842582214484], "isController": false}, {"data": ["/cart/-102-0", 10, 0, 0.0, 974.1, 176, 2009, 815.0, 1977.9, 2009.0, 2009.0, 0.3323694618938412, 7.430275118822083, 0.2496016759730116], "isController": false}, {"data": ["/cart/-102-1", 10, 0, 0.0, 445.99999999999994, 242, 998, 340.5, 964.6000000000001, 998.0, 998.0, 0.338409475465313, 3.96566994500846, 0.24323181049069373], "isController": false}, {"data": ["/upload/resize_cache/iblock/33a/80_52_2/%D0%A1%D0%BF%D1%8F%D1%89%D0%B0%D1%8F%201600%D1%85600_1.jpg-78", 10, 0, 0.0, 1502.6, 214, 5596, 755.5, 5408.200000000001, 5596.0, 5596.0, 0.25681853202527094, 1.2025828721300529, 0.18107712902563047], "isController": false}, {"data": ["/cart/-82-0", 10, 0, 0.0, 917.6, 253, 3633, 440.0, 3417.500000000001, 3633.0, 3633.0, 0.2243259006684912, 5.014910662210059, 0.16846349376373995], "isController": false}, {"data": ["/upload/resize_cache/iblock/80c/260_260_2/prisca1_%D0%BA%D0%B0%D1%80%D1%82%D0%BE%D1%87%D0%BA%D0%B0.jpg-66", 10, 0, 0.0, 1460.0, 353, 3437, 1493.5, 3290.6000000000004, 3437.0, 3437.0, 0.4168577264579599, 21.363144305723456, 0.30002357851515277], "isController": false}, {"data": ["/cart/-82-1", 10, 0, 0.0, 558.1, 338, 1005, 437.0, 988.9000000000001, 1005.0, 1005.0, 0.24031529366528886, 2.8162652525112946, 0.17272661732192637], "isController": false}, {"data": ["/cart/-100-0", 10, 0, 0.0, 411.40000000000003, 207, 663, 418.0, 654.9000000000001, 663.0, 663.0, 0.22594274610813622, 5.0510559999096225, 0.16967770679409838], "isController": false}, {"data": ["/cart/-84-0", 10, 0, 0.0, 534.9, 337, 993, 452.0, 971.5000000000001, 993.0, 993.0, 0.24297793760326564, 5.434258522451161, 0.222097021090485], "isController": false}, {"data": ["/cart/-84-1", 10, 0, 0.0, 435.6, 269, 713, 392.5, 702.9000000000001, 713.0, 713.0, 0.24671864206059407, 2.870995448041054, 0.2040729392825422], "isController": false}, {"data": ["/upload/resize_cache/iblock/27e/260_260_2/%D0%BB%D0%B5%D0%B1%D0%B5%D0%B4%D0%B5%D0%B2.jpg-71", 10, 0, 0.0, 1049.5, 132, 6573, 248.5, 6021.400000000002, 6573.0, 6573.0, 0.2991325157044571, 17.302946455279688, 0.2112039148967993], "isController": false}, {"data": ["/cart/-79-0", 10, 0, 0.0, 4583.3, 972, 7718, 4753.0, 7556.700000000001, 7718.0, 7718.0, 0.21843122692820166, 4.8805300643279965, 0.2152315507524956], "isController": false}, {"data": ["/auth/?login=yes-90", 10, 0, 0.0, 1119.8, 313, 2201, 1013.5, 2195.1, 2201.0, 2201.0, 0.23623349318466375, 0.3206685112565259, 0.1983992227918074], "isController": false}, {"data": ["/cart/-79-1", 10, 0, 0.0, 836.0, 388, 1718, 593.0, 1711.2, 1718.0, 1718.0, 0.24198427102238354, 2.835705913490623, 0.20228372655777374], "isController": false}, {"data": ["/cart/-98-1", 10, 0, 0.0, 370.0, 214, 557, 387.0, 548.3000000000001, 557.0, 557.0, 0.22545372562281593, 2.642189965900124, 0.16204486529139894], "isController": false}, {"data": ["/cart/-82", 10, 0, 0.0, 1475.7, 659, 4637, 919.5, 4405.500000000001, 4637.0, 4637.0, 0.22102378215896032, 7.53127745529794, 0.32484452358323757], "isController": false}, {"data": ["/upload/resize_cache/iblock/61a/260_280_2/2_1600%D0%A5600.jpg-74", 10, 0, 0.0, 551.1999999999999, 203, 1434, 450.0, 1374.1000000000004, 1434.0, 1434.0, 0.282933454051607, 25.29657173070394, 0.19230633205070166], "isController": false}, {"data": ["/cart/-84", 10, 0, 0.0, 970.5, 739, 1706, 878.5, 1646.0000000000002, 1706.0, 1706.0, 0.2408187838651415, 8.188309000602047, 0.41931630042143286], "isController": false}, {"data": ["/upload/iblock/28e/%D0%9C%D0%B8%D1%85%D0%B0%D0%B8%D0%BB%20%D0%9D%D0%B5%D0%B4%D0%B5%D0%BB%D1%8C%D1%81%D0%BA%D0%B8%D0%B9_%D0%95%D0%BA%D0%B0%D1%82%D0%B5%D1%80%D0%B8%D0%BD%D0%B0%20%D0%9B%D0%B8%D1%85%D0%BE%D0%B2%D0%B0.JPG-51", 10, 0, 0.0, 39602.2, 18168, 49565, 43969.5, 49523.2, 49565.0, 49565.0, 0.16208243512650536, 1311.1801044823897, 0.13818160729046794], "isController": false}, {"data": ["/local/templates/novat/images/icons/play.svg-58", 10, 0, 0.0, 506.20000000000005, 132, 774, 497.5, 768.9, 774.0, 774.0, 0.20362866277057157, 0.22430969883320775, 0.15391463377385], "isController": false}, {"data": ["/bitrix/cache/css/s1/novat/page_4e340cb13884582617e3aa61b09f0fcb/page_4e340cb13884582617e3aa61b09f0fcb.css-59", 10, 0, 0.0, 572.8, 201, 884, 539.0, 878.5, 884.0, 884.0, 0.20565975649884832, 0.1873833523568608, 0.14259612022869364], "isController": false}, {"data": ["/upload/resize_cache/iblock/33a/350_200_2/%D0%A1%D0%BF%D1%8F%D1%89%D0%B0%D1%8F%201600%D1%85600_1.jpg-97", 10, 0, 0.0, 836.3, 449, 2336, 634.5, 2205.9000000000005, 2336.0, 2336.0, 0.22658268001993928, 10.357306724973943, 0.15599686466216522], "isController": false}, {"data": ["/upload/resize_cache/iblock/596/160_160_2/image-20-02-16-3-15-11.jpeg-44", 10, 0, 0.0, 1561.9, 739, 4909, 1000.5, 4710.500000000001, 4909.0, 4909.0, 0.44208664898320066, 4.431227895667551, 0.30652492263483644], "isController": false}, {"data": ["/img/icon/pk_short.png-65", 10, 0, 0.0, 2196.1, 458, 3839, 2775.0, 3788.4, 3839.0, 3839.0, 0.396290718871364, 21.775091394547037, 0.2542607444321154], "isController": false}, {"data": ["/theatre/repertoire/sleeping_beauty_new/-47", 10, 0, 0.0, 2915.0000000000005, 957, 8233, 1932.0, 7781.100000000002, 8233.0, 8233.0, 0.37220381881118103, 8.922278026947556, 0.2995077604496222], "isController": false}, {"data": ["/local/templates/novat/images/icons/check.svg-95", 10, 0, 0.0, 326.1, 166, 507, 291.5, 504.3, 507.0, 507.0, 0.24504999019800036, 0.2409817774701039, 0.18546263906586943], "isController": false}, {"data": ["/cart/-98-0", 10, 0, 0.0, 469.70000000000005, 159, 785, 446.0, 784.7, 785.0, 785.0, 0.2251694400036027, 5.03376837945554, 0.16909697203395554], "isController": false}, {"data": ["/local/templates/novat/images/icons/lupa.svg-40", 10, 0, 0.0, 525.1999999999999, 218, 876, 486.0, 873.2, 876.0, 876.0, 1.6072002571520412, 1.8237956043072965, 1.214817381870781], "isController": false}, {"data": ["/personal/order/-91", 10, 0, 0.0, 471.7, 303, 640, 455.5, 637.7, 640.0, 640.0, 0.2443195699975568, 2.8428872465184463, 0.18037655753725873], "isController": false}, {"data": ["/upload/iblock/e7f/%D0%9E%D0%BB%D1%8C%D0%B3%D0%B0%20%D0%93%D1%80%D0%B8%D1%88%D0%B5%D0%BD%D0%BA%D0%BE%D0%B2%D0%B0_%D0%A0%D0%BE%D0%BC%D0%B0%D0%BD%20%D0%9F%D0%BE%D0%BB%D0%BA%D0%BE%D0%B2%D0%BD%D0%B8%D0%BA%D0%BE%D0%B2.jpg-53", 10, 0, 0.0, 38237.200000000004, 13405, 59802, 39527.0, 59020.3, 59802.0, 59802.0, 0.12593665386310685, 99.00109112304011, 0.10736591681884013], "isController": false}, {"data": ["/local/templates/novat/images/icons/lupa-purpur.png-42", 10, 0, 0.0, 817.0, 563, 1016, 811.5, 1006.2, 1016.0, 1016.0, 0.757862826828344, 0.9621305418719212, 0.5780184255399773], "isController": false}, {"data": ["/upload/iblock/33a/%D0%A1%D0%BF%D1%8F%D1%89%D0%B0%D1%8F%201600%D1%85600_1.jpg-60", 10, 0, 0.0, 5157.9, 1203, 13042, 5427.5, 12410.500000000002, 13042.0, 13042.0, 0.2984718242597899, 89.10054349853749, 0.20753119030563516], "isController": false}, {"data": ["/upload/iblock/8bc/%D0%9E%D0%BB%D1%8C%D0%B3%D0%B0%20%D0%93%D1%80%D0%B8%D1%88%D0%B5%D0%BD%D0%BA%D0%BE%D0%B2%D0%B0_%D0%A0%D0%BE%D0%BC%D0%B0%D0%BD%20%D0%9F%D0%BE%D0%BB%D0%BA%D0%BE%D0%B2%D0%BD%D0%B8%D0%BA%D0%BE%D0%B23.jpg-63", 10, 0, 0.0, 5073.3, 2021, 7413, 5190.5, 7343.8, 7413.0, 7413.0, 0.3301092661671013, 227.38757974201962, 0.274661225365596], "isController": false}, {"data": ["/local/templates/novat/fonts/Lato-Light.woff-41", 10, 0, 0.0, 2879.5, 1203, 7006, 2180.5, 6910.200000000001, 7006.0, 7006.0, 0.7408504963698326, 47.102608951326125, 0.531762807452956], "isController": false}, {"data": ["/search-37-1", 10, 0, 0.0, 1468.4, 870, 2781, 1240.5, 2708.3, 2781.0, 2781.0, 1.57952930026852, 28.73139117043121, 1.2586874111514768], "isController": false}, {"data": ["/local/templates/novat/images/icons/gmail.svg-88", 10, 0, 0.0, 339.2, 167, 486, 346.5, 483.5, 486.0, 486.0, 0.24605693757535496, 0.20088242169237963, 0.1585913855466155], "isController": false}, {"data": ["/upload/iblock/6ca/%D0%9E%D0%BB%D1%8C%D0%B3%D0%B0%20%D0%93%D1%80%D0%B8%D1%88%D0%B5%D0%BD%D0%BA%D0%BE%D0%B2%D0%B0_%D0%A0%D0%BE%D0%BC%D0%B0%D0%BD%20%D0%9F%D0%BE%D0%BB%D0%BA%D0%BE%D0%B2%D0%BD%D0%B8%D0%BA%D0%BE%D0%B22.jpg-62", 10, 0, 0.0, 4282.200000000001, 1406, 9346, 3842.0, 9137.6, 9346.0, 9346.0, 0.2993295019157088, 199.62091555540587, 0.24905149964080459], "isController": false}, {"data": ["/upload/iblock/82e/%D0%9C%D0%B8%D1%85%D0%B0%D0%B8%D0%BB%20%D0%9B%D0%B8%D1%84%D0%B5%D0%BD%D1%86%D0%B5%D0%B2.jpg-75", 10, 0, 0.0, 6600.2, 1785, 11716, 5709.5, 11541.1, 11716.0, 11716.0, 0.23018138292974863, 189.21539079044285, 0.16746594754166283], "isController": false}, {"data": ["/search/-43", 10, 0, 0.0, 2856.4999999999995, 1035, 6205, 2051.5, 6185.1, 6205.0, 6205.0, 0.5469262743382193, 12.191008019306498, 0.44384349021001973], "isController": false}, {"data": ["/search-37-0", 10, 0, 0.0, 1825.8000000000002, 1027, 2665, 1834.5, 2646.3, 2665.0, 2665.0, 1.6246953696181965, 0.6520994110479285, 1.2930925060926075], "isController": false}, {"data": ["/auth/-87", 10, 0, 0.0, 448.5, 324, 758, 419.0, 734.8000000000001, 758.0, 758.0, 0.24660304308155165, 1.249174457781559, 0.18543392887968235], "isController": false}, {"data": ["/cart/-79", 10, 0, 0.0, 5419.5, 1424, 9368, 5461.0, 9131.400000000001, 9368.0, 9368.0, 0.21083257784992937, 7.181402326537497, 0.38398706805675614], "isController": false}, {"data": ["/upload/resize_cache/iblock/cdd/260_260_2/image-18-02-16-23-43-88.jpeg-73", 10, 0, 0.0, 400.30000000000007, 110, 858, 263.5, 852.3000000000001, 858.0, 858.0, 0.2874306573539134, 17.2812068854014, 0.19788927093213765], "isController": false}, {"data": ["/upload/resize_cache/iblock/c6d/260_260_2/Odintsova.jpeg-72", 10, 0, 0.0, 431.8, 103, 1082, 243.0, 1064.2, 1082.0, 1082.0, 0.2929372821278964, 17.494706531769047, 0.19767545112341448], "isController": false}, {"data": ["/img/icon/mastercard1.png-93", 10, 0, 0.0, 290.8, 219, 498, 255.0, 487.20000000000005, 498.0, 498.0, 0.24545900834560627, 0.6126886966126657, 0.1534118802160039], "isController": false}, {"data": ["/personal/order/-85", 10, 0, 0.0, 560.2, 347, 1125, 482.5, 1083.4, 1125.0, 1125.0, 0.24718212378880758, 2.8764854100751434, 0.1863521480126557], "isController": false}, {"data": ["/afisha/performances/detail/3305995/-56", 10, 0, 0.0, 1502.6, 560, 3527, 1333.0, 3368.3000000000006, 3527.0, 3527.0, 0.1958020050125313, 4.038760536595395, 0.156412148535401], "isController": false}, {"data": ["/upload/iblock/705/%D0%9E%D0%BB%D1%8C%D0%B3%D0%B0%20%D0%93%D1%80%D0%B8%D1%88%D0%B5%D0%BD%D0%BA%D0%BE%D0%B2%D0%B0_%D0%A0%D0%BE%D0%BC%D0%B0%D0%BD%20%D0%9F%D0%BE%D0%BB%D0%BA%D0%BE%D0%B2%D0%BD%D0%B8%D0%BA%D0%BE%D0%B24.jpg-64", 10, 0, 0.0, 8336.5, 3035, 17556, 7295.0, 17018.600000000002, 17556.0, 17556.0, 0.23648488861561748, 254.45820203495245, 0.19676281748096297], "isController": false}, {"data": ["/upload/iblock/ce4/%D0%95%D0%B2%D0%B3%D0%B5%D0%BD%D0%B8%D0%B9%20%D0%93%D1%80%D0%B0%D1%89%D0%B5%D0%BD%D0%BA%D0%BE_%D0%9E%D0%BB%D1%8C%D0%B3%D0%B0%20%D0%9F%D0%BE%D1%82%D0%B5%D1%88%D0%BA%D0%B8%D0%BD%D0%B0.jpg-49", 10, 0, 0.0, 30823.5, 17694, 62637, 25527.0, 60872.100000000006, 62637.0, 62637.0, 0.11779256728900406, 89.72170125596325, 0.09904238323811768], "isController": false}, {"data": ["/upload/resize_cache/iblock/33a/350_200_2/%D0%A1%D0%BF%D1%8F%D1%89%D0%B0%D1%8F%201600%D1%85600_1.jpg-81", 10, 0, 0.0, 1272.7, 421, 4298, 951.0, 4062.400000000001, 4298.0, 4298.0, 0.22358359790725751, 10.220215869963779, 0.15393206691857086], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 730, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
