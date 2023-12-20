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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.31035900246642917, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.555, 500, 1500, "/cart/-104"], "isController": false}, {"data": [0.945, 500, 1500, "/upload/resize_cache/iblock/27b/160_160_2/%D0%93%D1%80%D0%B8%D0%B3%D0%BE%D1%80%D1%8C%D0%B5%D0%B2%D0%B0-%D0%9C%D0%B0%D0%B9%D1%8F.jpg-45"], "isController": false}, {"data": [0.46, 500, 1500, "/local/templates/novat/images/icons/arrow_2.svg-67"], "isController": false}, {"data": [0.0, 500, 1500, "/upload/iblock/8bc/%D0%9E%D0%BB%D1%8C%D0%B3%D0%B0%20%D0%93%D1%80%D0%B8%D1%88%D0%B5%D0%BD%D0%BA%D0%BE%D0%B2%D0%B0_%D0%A0%D0%BE%D0%BC%D0%B0%D0%BD%20%D0%9F%D0%BE%D0%BB%D0%BA%D0%BE%D0%B2%D0%BD%D0%B8%D0%BA%D0%BE%D0%B23.jpg-55"], "isController": false}, {"data": [0.125, 500, 1500, "/generate_204-86"], "isController": false}, {"data": [0.325, 500, 1500, "/local/templates/novat/images/icons/drop-icon.svg-69"], "isController": false}, {"data": [1.0, 500, 1500, "/local/templates/novat/images/icons/check.svg-39"], "isController": false}, {"data": [0.01, 500, 1500, "/cart/-100"], "isController": false}, {"data": [0.045, 500, 1500, "/cart/-102"], "isController": false}, {"data": [0.0, 500, 1500, "/upload/iblock/6ca/%D0%9E%D0%BB%D1%8C%D0%B3%D0%B0%20%D0%93%D1%80%D0%B8%D1%88%D0%B5%D0%BD%D0%BA%D0%BE%D0%B2%D0%B0_%D0%A0%D0%BE%D0%BC%D0%B0%D0%BD%20%D0%9F%D0%BE%D0%BB%D0%BA%D0%BE%D0%B2%D0%BD%D0%B8%D0%BA%D0%BE%D0%B22.jpg-54"], "isController": false}, {"data": [0.405, 500, 1500, "/local/templates/novat/images/icons/play.svg-70"], "isController": false}, {"data": [0.0, 500, 1500, "/upload/iblock/b04/%D0%9E%D0%BB%D1%8C%D0%B3%D0%B0%20%D0%93%D1%80%D0%B8%D1%88%D0%B5%D0%BD%D0%BA%D0%BE%D0%B2%D0%B0_%D0%92%D0%B5%D1%80%D0%B0%20%D0%A1%D0%B0%D0%B1%D0%B0%D0%BD%D1%86%D0%B5%D0%B2%D0%B0_%D0%A0%D0%BE%D0%BC%D0%B0%D0%BD%20%D0%9F%D0%BE%D0%BB%D0%BA%D0%BE%D0%B2%D0%BD%D0%B8%D0%BA%D0%BE%D0%B2.jpg-52"], "isController": false}, {"data": [0.47, 500, 1500, "/img/icon/visa1.png-92"], "isController": false}, {"data": [0.0, 500, 1500, "/upload/iblock/82e/%D0%9C%D0%B8%D1%85%D0%B0%D0%B8%D0%BB%20%D0%9B%D0%B8%D1%84%D0%B5%D0%BD%D1%86%D0%B5%D0%B2.jpg-50"], "isController": false}, {"data": [0.0, 500, 1500, "/search-37"], "isController": false}, {"data": [1.0, 500, 1500, "/generate_204-36"], "isController": false}, {"data": [0.455, 500, 1500, "/local/templates/novat/images/icons/drop-icon.svg-57"], "isController": false}, {"data": [0.355, 500, 1500, "/cart/-96"], "isController": false}, {"data": [0.49, 500, 1500, "/local/templates/novat/images/icons/vk.svg-89"], "isController": false}, {"data": [0.0, 500, 1500, "/buy_now/tickets/3305995/-68"], "isController": false}, {"data": [0.02, 500, 1500, "/cart/-98"], "isController": false}, {"data": [0.965, 500, 1500, "/upload/resize_cache/iblock/828/160_160_2/grinevich_240x240.jpg-46"], "isController": false}, {"data": [0.395, 500, 1500, "/cart/-100-1"], "isController": false}, {"data": [0.435, 500, 1500, "/img/icon/4.png-94"], "isController": false}, {"data": [0.085, 500, 1500, "/cart/-102-0"], "isController": false}, {"data": [0.52, 500, 1500, "/cart/-102-1"], "isController": false}, {"data": [0.395, 500, 1500, "/upload/resize_cache/iblock/33a/80_52_2/%D0%A1%D0%BF%D1%8F%D1%89%D0%B0%D1%8F%201600%D1%85600_1.jpg-78"], "isController": false}, {"data": [0.34, 500, 1500, "/cart/-82-0"], "isController": false}, {"data": [0.25, 500, 1500, "/upload/resize_cache/iblock/80c/260_260_2/prisca1_%D0%BA%D0%B0%D1%80%D1%82%D0%BE%D1%87%D0%BA%D0%B0.jpg-66"], "isController": false}, {"data": [0.44, 500, 1500, "/cart/-82-1"], "isController": false}, {"data": [0.21, 500, 1500, "/cart/-100-0"], "isController": false}, {"data": [0.345, 500, 1500, "/cart/-84-0"], "isController": false}, {"data": [0.42, 500, 1500, "/cart/-84-1"], "isController": false}, {"data": [0.25, 500, 1500, "/upload/resize_cache/iblock/27e/260_260_2/%D0%BB%D0%B5%D0%B1%D0%B5%D0%B4%D0%B5%D0%B2.jpg-71"], "isController": false}, {"data": [0.03535353535353535, 500, 1500, "/cart/-79-0"], "isController": false}, {"data": [0.225, 500, 1500, "/auth/?login=yes-90"], "isController": false}, {"data": [0.3383838383838384, 500, 1500, "/cart/-79-1"], "isController": false}, {"data": [0.415, 500, 1500, "/cart/-98-1"], "isController": false}, {"data": [0.02, 500, 1500, "/cart/-82"], "isController": false}, {"data": [0.165, 500, 1500, "/upload/resize_cache/iblock/61a/260_280_2/2_1600%D0%A5600.jpg-74"], "isController": false}, {"data": [0.03, 500, 1500, "/cart/-84"], "isController": false}, {"data": [0.0, 500, 1500, "/upload/iblock/28e/%D0%9C%D0%B8%D1%85%D0%B0%D0%B8%D0%BB%20%D0%9D%D0%B5%D0%B4%D0%B5%D0%BB%D1%8C%D1%81%D0%BA%D0%B8%D0%B9_%D0%95%D0%BA%D0%B0%D1%82%D0%B5%D1%80%D0%B8%D0%BD%D0%B0%20%D0%9B%D0%B8%D1%85%D0%BE%D0%B2%D0%B0.JPG-51"], "isController": false}, {"data": [0.455, 500, 1500, "/local/templates/novat/images/icons/play.svg-58"], "isController": false}, {"data": [0.46, 500, 1500, "/bitrix/cache/css/s1/novat/page_4e340cb13884582617e3aa61b09f0fcb/page_4e340cb13884582617e3aa61b09f0fcb.css-59"], "isController": false}, {"data": [0.035, 500, 1500, "/upload/resize_cache/iblock/33a/350_200_2/%D0%A1%D0%BF%D1%8F%D1%89%D0%B0%D1%8F%201600%D1%85600_1.jpg-97"], "isController": false}, {"data": [0.955, 500, 1500, "/upload/resize_cache/iblock/596/160_160_2/image-20-02-16-3-15-11.jpeg-44"], "isController": false}, {"data": [0.195, 500, 1500, "/img/icon/pk_short.png-65"], "isController": false}, {"data": [0.0, 500, 1500, "/theatre/repertoire/sleeping_beauty_new/-47"], "isController": false}, {"data": [0.495, 500, 1500, "/local/templates/novat/images/icons/check.svg-95"], "isController": false}, {"data": [0.185, 500, 1500, "/cart/-98-0"], "isController": false}, {"data": [1.0, 500, 1500, "/local/templates/novat/images/icons/lupa.svg-40"], "isController": false}, {"data": [0.355, 500, 1500, "/personal/order/-91"], "isController": false}, {"data": [0.0, 500, 1500, "/upload/iblock/e7f/%D0%9E%D0%BB%D1%8C%D0%B3%D0%B0%20%D0%93%D1%80%D0%B8%D1%88%D0%B5%D0%BD%D0%BA%D0%BE%D0%B2%D0%B0_%D0%A0%D0%BE%D0%BC%D0%B0%D0%BD%20%D0%9F%D0%BE%D0%BB%D0%BA%D0%BE%D0%B2%D0%BD%D0%B8%D0%BA%D0%BE%D0%B2.jpg-53"], "isController": false}, {"data": [1.0, 500, 1500, "/local/templates/novat/images/icons/lupa-purpur.png-42"], "isController": false}, {"data": [0.0, 500, 1500, "/upload/iblock/33a/%D0%A1%D0%BF%D1%8F%D1%89%D0%B0%D1%8F%201600%D1%85600_1.jpg-60"], "isController": false}, {"data": [0.0, 500, 1500, "/upload/iblock/8bc/%D0%9E%D0%BB%D1%8C%D0%B3%D0%B0%20%D0%93%D1%80%D0%B8%D1%88%D0%B5%D0%BD%D0%BA%D0%BE%D0%B2%D0%B0_%D0%A0%D0%BE%D0%BC%D0%B0%D0%BD%20%D0%9F%D0%BE%D0%BB%D0%BA%D0%BE%D0%B2%D0%BD%D0%B8%D0%BA%D0%BE%D0%B23.jpg-63"], "isController": false}, {"data": [0.935, 500, 1500, "/local/templates/novat/fonts/Lato-Light.woff-41"], "isController": false}, {"data": [0.0, 500, 1500, "/search-37-1"], "isController": false}, {"data": [0.435, 500, 1500, "/local/templates/novat/images/icons/gmail.svg-88"], "isController": false}, {"data": [0.0, 500, 1500, "/upload/iblock/6ca/%D0%9E%D0%BB%D1%8C%D0%B3%D0%B0%20%D0%93%D1%80%D0%B8%D1%88%D0%B5%D0%BD%D0%BA%D0%BE%D0%B2%D0%B0_%D0%A0%D0%BE%D0%BC%D0%B0%D0%BD%20%D0%9F%D0%BE%D0%BB%D0%BA%D0%BE%D0%B2%D0%BD%D0%B8%D0%BA%D0%BE%D0%B22.jpg-62"], "isController": false}, {"data": [0.0, 500, 1500, "/upload/iblock/82e/%D0%9C%D0%B8%D1%85%D0%B0%D0%B8%D0%BB%20%D0%9B%D0%B8%D1%84%D0%B5%D0%BD%D1%86%D0%B5%D0%B2.jpg-75"], "isController": false}, {"data": [0.0, 500, 1500, "/search/-43"], "isController": false}, {"data": [0.935, 500, 1500, "/search-37-0"], "isController": false}, {"data": [0.425, 500, 1500, "/auth/-87"], "isController": false}, {"data": [0.005, 500, 1500, "/cart/-79"], "isController": false}, {"data": [0.255, 500, 1500, "/upload/resize_cache/iblock/cdd/260_260_2/image-18-02-16-23-43-88.jpeg-73"], "isController": false}, {"data": [0.25, 500, 1500, "/upload/resize_cache/iblock/c6d/260_260_2/Odintsova.jpeg-72"], "isController": false}, {"data": [0.495, 500, 1500, "/img/icon/mastercard1.png-93"], "isController": false}, {"data": [0.4, 500, 1500, "/personal/order/-85"], "isController": false}, {"data": [0.335, 500, 1500, "/afisha/performances/detail/3305995/-56"], "isController": false}, {"data": [0.0, 500, 1500, "/upload/iblock/705/%D0%9E%D0%BB%D1%8C%D0%B3%D0%B0%20%D0%93%D1%80%D0%B8%D1%88%D0%B5%D0%BD%D0%BA%D0%BE%D0%B2%D0%B0_%D0%A0%D0%BE%D0%BC%D0%B0%D0%BD%20%D0%9F%D0%BE%D0%BB%D0%BA%D0%BE%D0%B2%D0%BD%D0%B8%D0%BA%D0%BE%D0%B24.jpg-64"], "isController": false}, {"data": [0.0, 500, 1500, "/upload/iblock/ce4/%D0%95%D0%B2%D0%B3%D0%B5%D0%BD%D0%B8%D0%B9%20%D0%93%D1%80%D0%B0%D1%89%D0%B5%D0%BD%D0%BA%D0%BE_%D0%9E%D0%BB%D1%8C%D0%B3%D0%B0%20%D0%9F%D0%BE%D1%82%D0%B5%D1%88%D0%BA%D0%B8%D0%BD%D0%B0.jpg-49"], "isController": false}, {"data": [0.11, 500, 1500, "/upload/resize_cache/iblock/33a/350_200_2/%D0%A1%D0%BF%D1%8F%D1%89%D0%B0%D1%8F%201600%D1%85600_1.jpg-81"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 7298, 0, 0.0, 5896.823787338992, 54, 182942, 1551.5, 13624.60000000001, 22423.149999999998, 86260.90000000011, 16.352376001577426, 4036.304166510287, 13.450729641174243], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["/cart/-104", 100, 0, 0.0, 1004.5799999999997, 152, 7981, 834.0, 1165.3, 1984.5999999999985, 7972.829999999996, 0.6052829092317749, 7.093182736423505, 0.4415491535118515], "isController": false}, {"data": ["/upload/resize_cache/iblock/27b/160_160_2/%D0%93%D1%80%D0%B8%D0%B3%D0%BE%D1%80%D1%8C%D0%B5%D0%B2%D0%B0-%D0%9C%D0%B0%D0%B9%D1%8F.jpg-45", 100, 0, 0.0, 271.13999999999993, 60, 7663, 82.0, 318.8, 959.6499999999992, 7626.899999999981, 4.494786048184107, 47.42350435994246, 3.388647294138799], "isController": false}, {"data": ["/local/templates/novat/images/icons/arrow_2.svg-67", 100, 0, 0.0, 1057.3899999999994, 544, 3862, 985.0, 1111.8, 2308.5499999999975, 3850.219999999994, 0.7732158045310445, 0.43795426428516193, 0.5867076954302946], "isController": false}, {"data": ["/upload/iblock/8bc/%D0%9E%D0%BB%D1%8C%D0%B3%D0%B0%20%D0%93%D1%80%D0%B8%D1%88%D0%B5%D0%BD%D0%BA%D0%BE%D0%B2%D0%B0_%D0%A0%D0%BE%D0%BC%D0%B0%D0%BD%20%D0%9F%D0%BE%D0%BB%D0%BA%D0%BE%D0%B2%D0%BD%D0%B8%D0%BA%D0%BE%D0%B23.jpg-55", 100, 0, 0.0, 13401.549999999996, 2571, 60799, 11741.0, 23136.600000000017, 28432.149999999987, 60601.2699999999, 0.6583581863548682, 453.49370630147536, 0.5619189989005419], "isController": false}, {"data": ["/generate_204-86", 100, 0, 0.0, 1793.6099999999997, 827, 3875, 1773.5, 2220.9, 3032.149999999999, 3871.9199999999983, 0.46234650096168073, 0.06908106899134488, 0.16254369174434086], "isController": false}, {"data": ["/local/templates/novat/images/icons/drop-icon.svg-69", 100, 0, 0.0, 1553.9099999999999, 530, 6118, 1041.0, 2992.2, 3048.5, 6117.0599999999995, 0.7556008916090522, 0.9489284634855869, 0.5748174751596207], "isController": false}, {"data": ["/local/templates/novat/images/icons/check.svg-39", 100, 0, 0.0, 78.22999999999996, 56, 140, 74.0, 96.70000000000002, 117.94999999999999, 139.92999999999995, 8.6333419666753, 8.490015000431667, 6.534023461106794], "isController": false}, {"data": ["/cart/-100", 100, 0, 0.0, 3737.959999999999, 1387, 15479, 2795.0, 7892.3, 9385.999999999998, 15475.229999999998, 0.4676962219499191, 15.936378807924177, 0.6873855605806917], "isController": false}, {"data": ["/cart/-102", 100, 0, 0.0, 5695.29, 534, 19389, 5003.5, 11677.800000000001, 13839.949999999999, 19354.059999999983, 0.5888622592289438, 20.064906422426233, 0.8654665040425394], "isController": false}, {"data": ["/upload/iblock/6ca/%D0%9E%D0%BB%D1%8C%D0%B3%D0%B0%20%D0%93%D1%80%D0%B8%D1%88%D0%B5%D0%BD%D0%BA%D0%BE%D0%B2%D0%B0_%D0%A0%D0%BE%D0%BC%D0%B0%D0%BD%20%D0%9F%D0%BE%D0%BB%D0%BA%D0%BE%D0%B2%D0%BD%D0%B8%D0%BA%D0%BE%D0%B22.jpg-54", 100, 0, 0.0, 15647.410000000002, 2820, 39381, 13104.5, 28152.5, 34079.699999999975, 39371.469999999994, 0.7605661654535637, 507.2166736543683, 0.6491551060609518], "isController": false}, {"data": ["/local/templates/novat/images/icons/play.svg-70", 100, 0, 0.0, 1305.8599999999997, 615, 5788, 967.5, 2407.4, 3033.1499999999996, 5784.079999999998, 0.5966551512222481, 0.6572529400182576, 0.4509873896933789], "isController": false}, {"data": ["/upload/iblock/b04/%D0%9E%D0%BB%D1%8C%D0%B3%D0%B0%20%D0%93%D1%80%D0%B8%D1%88%D0%B5%D0%BD%D0%BA%D0%BE%D0%B2%D0%B0_%D0%92%D0%B5%D1%80%D0%B0%20%D0%A1%D0%B0%D0%B1%D0%B0%D0%BD%D1%86%D0%B5%D0%B2%D0%B0_%D0%A0%D0%BE%D0%BC%D0%B0%D0%BD%20%D0%9F%D0%BE%D0%BB%D0%BA%D0%BE%D0%B2%D0%BD%D0%B8%D0%BA%D0%BE%D0%B2.jpg-52", 100, 0, 0.0, 28793.719999999994, 2179, 52282, 29010.0, 44050.8, 46891.399999999994, 52256.71999999999, 1.7415534656913967, 1287.914503330721, 1.624202695053988], "isController": false}, {"data": ["/img/icon/visa1.png-92", 100, 0, 0.0, 1108.1799999999996, 403, 6076, 853.5, 2462.200000000008, 3859.9999999999936, 6060.089999999992, 0.4758166202745462, 0.9734724799562249, 0.2945973996621702], "isController": false}, {"data": ["/upload/iblock/82e/%D0%9C%D0%B8%D1%85%D0%B0%D0%B8%D0%BB%20%D0%9B%D0%B8%D1%84%D0%B5%D0%BD%D1%86%D0%B5%D0%B2.jpg-50", 100, 0, 0.0, 15075.970000000003, 2475, 49099, 13025.5, 27181.9, 35005.849999999984, 49090.78, 0.5630852567387228, 462.8714779017191, 0.4217640546080082], "isController": false}, {"data": ["/search-37", 100, 0, 0.0, 6201.249999999999, 2964, 10673, 6134.5, 8683.6, 10141.449999999993, 10671.83, 6.503642039542143, 120.91502686817118, 10.358828287591052], "isController": false}, {"data": ["/generate_204-36", 100, 0, 0.0, 137.13000000000002, 101, 302, 124.5, 184.0, 228.79999999999995, 301.5599999999998, 20.128824476650564, 3.0075294384057973, 7.076539855072464], "isController": false}, {"data": ["/local/templates/novat/images/icons/drop-icon.svg-57", 100, 0, 0.0, 1116.0699999999997, 564, 6261, 955.5, 1121.8000000000002, 2337.999999999999, 6240.849999999989, 0.9181218898620981, 1.1530319827760334, 0.6984540548853265], "isController": false}, {"data": ["/cart/-96", 100, 0, 0.0, 1741.0599999999995, 463, 27988, 1140.5, 2190.3, 4134.849999999999, 27771.019999999888, 0.4763061505413219, 5.581805730201144, 0.3469964729529552], "isController": false}, {"data": ["/local/templates/novat/images/icons/vk.svg-89", 100, 0, 0.0, 969.0799999999999, 374, 3450, 903.5, 1108.8, 2240.499999999987, 3446.9799999999987, 0.46428488520556216, 0.48242101353390443, 0.2978859077930218], "isController": false}, {"data": ["/buy_now/tickets/3305995/-68", 100, 0, 0.0, 16900.249999999993, 5747, 38087, 15262.0, 27867.500000000004, 33057.85, 38082.53, 0.47693540386890004, 359.75952916936933, 0.3656194258174673], "isController": false}, {"data": ["/cart/-98", 100, 0, 0.0, 3760.52, 1237, 11716, 2925.0, 7380.100000000001, 8997.649999999992, 11715.96, 0.46328039582677016, 15.785786347532104, 0.6808955036321183], "isController": false}, {"data": ["/upload/resize_cache/iblock/828/160_160_2/grinevich_240x240.jpg-46", 100, 0, 0.0, 142.04000000000002, 55, 828, 80.0, 241.1000000000001, 775.249999999998, 827.98, 7.626019980172348, 89.16634494394876, 5.2428887363684895], "isController": false}, {"data": ["/cart/-100-1", 100, 0, 0.0, 1586.4699999999996, 546, 8819, 1066.5, 3186.3000000000006, 5779.099999999993, 8808.829999999994, 0.4701059618838086, 5.5090496499473485, 0.33788866010398744], "isController": false}, {"data": ["/img/icon/4.png-94", 100, 0, 0.0, 1276.0300000000009, 418, 8995, 877.5, 2517.300000000003, 3983.4999999999986, 8989.809999999998, 0.4759321130433955, 2.301577952920795, 0.29280979611068275], "isController": false}, {"data": ["/cart/-102-0", 100, 0, 0.0, 4492.850000000002, 308, 17378, 3952.0, 8074.400000000003, 11656.69999999999, 17346.049999999985, 0.5894314933246884, 13.177017329285905, 0.44264923668621614], "isController": false}, {"data": ["/cart/-102-1", 100, 0, 0.0, 1202.42, 151, 10775, 907.0, 2008.3000000000002, 2848.4999999999914, 10745.139999999985, 0.5989924946240424, 7.01932630565389, 0.43052585551103045], "isController": false}, {"data": ["/upload/resize_cache/iblock/33a/80_52_2/%D0%A1%D0%BF%D1%8F%D1%89%D0%B0%D1%8F%201600%D1%85600_1.jpg-78", 100, 0, 0.0, 1321.2500000000005, 551, 6346, 919.5, 2754.9, 3500.149999999995, 6334.309999999994, 0.5204971789052903, 2.437289035987175, 0.3669911749703317], "isController": false}, {"data": ["/cart/-82-0", 100, 0, 0.0, 1704.59, 558, 11290, 1125.0, 3516.1000000000017, 5921.449999999981, 11259.079999999984, 0.4669231631242763, 10.43828618187591, 0.35064835199469574], "isController": false}, {"data": ["/upload/resize_cache/iblock/80c/260_260_2/prisca1_%D0%BA%D0%B0%D1%80%D1%82%D0%BE%D1%87%D0%BA%D0%B0.jpg-66", 100, 0, 0.0, 2344.759999999999, 630, 15658, 1505.0, 5785.000000000001, 8020.699999999984, 15596.019999999968, 0.7744013877272867, 39.68655861831304, 0.5573572487841898], "isController": false}, {"data": ["/cart/-82-1", 100, 0, 0.0, 1366.2799999999995, 513, 8567, 1045.0, 1852.4000000000017, 5416.099999999971, 8546.83999999999, 0.46582910593419696, 5.458798361795492, 0.3348146698902041], "isController": false}, {"data": ["/cart/-100-0", 100, 0, 0.0, 2151.4600000000005, 658, 7792, 1740.5, 5080.700000000003, 6716.999999999999, 7788.719999999998, 0.47024965554212733, 10.512651479170293, 0.35314646983583586], "isController": false}, {"data": ["/cart/-84-0", 100, 0, 0.0, 1994.7300000000002, 518, 10952, 1115.0, 5936.8000000000075, 7557.749999999997, 10940.859999999993, 0.462472656304196, 10.343309350272165, 0.42272891240305416], "isController": false}, {"data": ["/cart/-84-1", 100, 0, 0.0, 1493.7999999999993, 421, 7517, 1031.5, 3558.600000000003, 5542.799999999996, 7504.4099999999935, 0.4634629021120004, 5.393309645068523, 0.3833526153211566], "isController": false}, {"data": ["/upload/resize_cache/iblock/27e/260_260_2/%D0%BB%D0%B5%D0%B1%D0%B5%D0%B4%D0%B5%D0%B2.jpg-71", 100, 0, 0.0, 3620.8899999999994, 603, 56111, 1368.5, 8096.100000000002, 10895.69999999999, 55743.60999999981, 0.5201181708484167, 30.085585445013105, 0.3672318725814505], "isController": false}, {"data": ["/cart/-79-0", 99, 0, 0.0, 5717.232323232324, 1311, 26492, 5701.0, 10907.0, 13012.0, 26492.0, 0.5111603339580849, 11.406313733690629, 0.5036726337536207], "isController": false}, {"data": ["/auth/?login=yes-90", 100, 0, 0.0, 1976.4199999999998, 502, 8008, 1694.0, 3106.4, 4357.04999999999, 7987.36999999999, 0.46454585996729597, 0.6344589521471309, 0.3901459370819087], "isController": false}, {"data": ["/cart/-79-1", 99, 0, 0.0, 1852.9595959595965, 570, 20378, 1094.0, 3295.0, 5890.0, 20378.0, 0.4758951876901778, 5.576774677448817, 0.39781863345975804], "isController": false}, {"data": ["/cart/-98-1", 100, 0, 0.0, 1400.8700000000006, 595, 6719, 1013.0, 2707.9000000000005, 5016.0999999999885, 6717.539999999999, 0.46569894426049335, 5.4572776156563325, 0.3347211161872296], "isController": false}, {"data": ["/cart/-82", 100, 0, 0.0, 3070.9199999999996, 1102, 12557, 2199.0, 6090.800000000007, 8764.349999999984, 12553.899999999998, 0.46366919984606186, 15.799029902606286, 0.681466939226878], "isController": false}, {"data": ["/upload/resize_cache/iblock/61a/260_280_2/2_1600%D0%A5600.jpg-74", 100, 0, 0.0, 2961.2099999999996, 484, 13100, 2038.5, 6635.8, 9239.349999999986, 13099.0, 0.5065240294999594, 45.287403317225866, 0.3442780513007537], "isController": false}, {"data": ["/cart/-84", 100, 0, 0.0, 3488.5899999999997, 1070, 15398, 2199.5, 7266.6, 11091.39999999998, 15387.089999999995, 0.4609102054737696, 15.671968730411317, 0.8025418909763], "isController": false}, {"data": ["/upload/iblock/28e/%D0%9C%D0%B8%D1%85%D0%B0%D0%B8%D0%BB%20%D0%9D%D0%B5%D0%B4%D0%B5%D0%BB%D1%8C%D1%81%D0%BA%D0%B8%D0%B9_%D0%95%D0%BA%D0%B0%D1%82%D0%B5%D1%80%D0%B8%D0%BD%D0%B0%20%D0%9B%D0%B8%D1%85%D0%BE%D0%B2%D0%B0.JPG-51", 100, 0, 0.0, 106274.88999999998, 26271, 182942, 106596.5, 145663.9, 153049.09999999998, 182754.7899999999, 0.400600901352028, 3240.6962005508262, 0.341527916875313], "isController": false}, {"data": ["/local/templates/novat/images/icons/play.svg-58", 100, 0, 0.0, 1016.8300000000003, 596, 2483, 953.5, 1126.1000000000001, 2194.9499999999985, 2481.7699999999995, 0.9189909479391628, 1.012325966089234, 0.6946279235399532], "isController": false}, {"data": ["/bitrix/cache/css/s1/novat/page_4e340cb13884582617e3aa61b09f0fcb/page_4e340cb13884582617e3aa61b09f0fcb.css-59", 100, 0, 0.0, 1013.6299999999998, 607, 2717, 950.5, 1092.6, 2058.5499999999997, 2713.229999999998, 0.9187376544627681, 0.8370920230603152, 0.6370153658872709], "isController": false}, {"data": ["/upload/resize_cache/iblock/33a/350_200_2/%D0%A1%D0%BF%D1%8F%D1%89%D0%B0%D1%8F%201600%D1%85600_1.jpg-97", 100, 0, 0.0, 3604.709999999999, 1097, 14924, 3175.5, 6406.000000000001, 7270.3, 14908.179999999991, 0.4646904928972058, 21.24143807766837, 0.31992851317629895], "isController": false}, {"data": ["/upload/resize_cache/iblock/596/160_160_2/image-20-02-16-3-15-11.jpeg-44", 100, 0, 0.0, 196.95999999999998, 59, 5214, 79.0, 237.10000000000005, 859.8499999999992, 5172.459999999979, 5.4776511831726555, 54.90489428133216, 3.797980800832603], "isController": false}, {"data": ["/img/icon/pk_short.png-65", 100, 0, 0.0, 3099.6600000000003, 601, 19488, 1936.5, 6792.700000000003, 9169.299999999987, 19451.18999999998, 0.8069461928278622, 44.339486802395015, 0.5177379381717827], "isController": false}, {"data": ["/theatre/repertoire/sleeping_beauty_new/-47", 100, 0, 0.0, 5266.200000000001, 1814, 13000, 5427.0, 6064.4, 6193.599999999999, 12942.97999999997, 2.842685769515038, 68.14164858896186, 2.287473705156632], "isController": false}, {"data": ["/local/templates/novat/images/icons/check.svg-95", 100, 0, 0.0, 921.9400000000002, 406, 2974, 858.5, 1101.7, 2245.999999999999, 2973.0499999999997, 0.47570118354454466, 0.4678038006146059, 0.360027751217795], "isController": false}, {"data": ["/cart/-98-0", 100, 0, 0.0, 2359.46, 553, 9806, 1841.5, 5003.900000000001, 6920.6999999999925, 9788.89999999999, 0.4651963361136568, 10.39968215460335, 0.34935154538222857], "isController": false}, {"data": ["/local/templates/novat/images/icons/lupa.svg-40", 100, 0, 0.0, 80.6, 54, 148, 77.0, 104.60000000000002, 131.39999999999986, 147.99, 8.6333419666753, 9.796819692653026, 6.525592463092463], "isController": false}, {"data": ["/personal/order/-91", 100, 0, 0.0, 1375.83, 501, 5565, 1034.0, 2284.7000000000007, 3061.049999999998, 5559.169999999997, 0.47543204887441465, 5.532529395072147, 0.3510025673330639], "isController": false}, {"data": ["/upload/iblock/e7f/%D0%9E%D0%BB%D1%8C%D0%B3%D0%B0%20%D0%93%D1%80%D0%B8%D1%88%D0%B5%D0%BD%D0%BA%D0%BE%D0%B2%D0%B0_%D0%A0%D0%BE%D0%BC%D0%B0%D0%BD%20%D0%9F%D0%BE%D0%BB%D0%BA%D0%BE%D0%B2%D0%BD%D0%B8%D0%BA%D0%BE%D0%B2.jpg-53", 100, 0, 0.0, 15339.0, 2727, 52741, 14165.5, 23800.2, 27675.849999999973, 52717.51999999999, 0.8947344875408223, 703.3670326689929, 0.7627961011944705], "isController": false}, {"data": ["/local/templates/novat/images/icons/lupa-purpur.png-42", 100, 0, 0.0, 83.13999999999997, 59, 227, 74.0, 109.0, 169.29999999999984, 226.48999999999972, 8.596234849136078, 10.913188773317287, 6.556308024585232], "isController": false}, {"data": ["/upload/iblock/33a/%D0%A1%D0%BF%D1%8F%D1%89%D0%B0%D1%8F%201600%D1%85600_1.jpg-60", 100, 0, 0.0, 7869.009999999999, 1744, 35316, 6313.5, 14870.300000000001, 17875.399999999998, 35313.09, 0.7151490012944196, 213.48803980340557, 0.4972520399625262], "isController": false}, {"data": ["/upload/iblock/8bc/%D0%9E%D0%BB%D1%8C%D0%B3%D0%B0%20%D0%93%D1%80%D0%B8%D1%88%D0%B5%D0%BD%D0%BA%D0%BE%D0%B2%D0%B0_%D0%A0%D0%BE%D0%BC%D0%B0%D0%BD%20%D0%9F%D0%BE%D0%BB%D0%BA%D0%BE%D0%B2%D0%BD%D0%B8%D0%BA%D0%BE%D0%B23.jpg-63", 100, 0, 0.0, 12696.160000000003, 2736, 48023, 11001.0, 25571.000000000007, 29126.34999999998, 47871.11999999992, 0.5676754258984883, 391.0291361186328, 0.4723236942046016], "isController": false}, {"data": ["/local/templates/novat/fonts/Lato-Light.woff-41", 100, 0, 0.0, 412.76, 290, 885, 381.5, 505.9, 757.0999999999998, 884.8399999999999, 8.47314014573801, 538.714637879173, 6.081794928825623], "isController": false}, {"data": ["/search-37-1", 100, 0, 0.0, 5846.07, 2693, 10368, 5868.0, 8251.7, 9878.799999999994, 10366.529999999999, 6.90035881865857, 125.52116577249517, 5.498723433618548], "isController": false}, {"data": ["/local/templates/novat/images/icons/gmail.svg-88", 100, 0, 0.0, 1041.9399999999998, 407, 2546, 919.0, 2113.2000000000003, 2386.6999999999994, 2545.98, 0.4645048610433708, 0.37922467171118945, 0.2993878987193601], "isController": false}, {"data": ["/upload/iblock/6ca/%D0%9E%D0%BB%D1%8C%D0%B3%D0%B0%20%D0%93%D1%80%D0%B8%D1%88%D0%B5%D0%BD%D0%BA%D0%BE%D0%B2%D0%B0_%D0%A0%D0%BE%D0%BC%D0%B0%D0%BD%20%D0%9F%D0%BE%D0%BB%D0%BA%D0%BE%D0%B2%D0%BD%D0%B8%D0%BA%D0%BE%D0%B22.jpg-62", 100, 0, 0.0, 11676.86, 3596, 37491, 9761.0, 21932.000000000015, 27151.44999999999, 37449.82999999998, 0.5119593709043251, 341.42240471796157, 0.42596619532273916], "isController": false}, {"data": ["/upload/iblock/82e/%D0%9C%D0%B8%D1%85%D0%B0%D0%B8%D0%BB%20%D0%9B%D0%B8%D1%84%D0%B5%D0%BD%D1%86%D0%B5%D0%B2.jpg-75", 100, 0, 0.0, 18292.469999999994, 3373, 53158, 14176.5, 36770.8, 42516.149999999994, 53155.34, 0.4581061890146136, 376.57581371111826, 0.33329014728113976], "isController": false}, {"data": ["/search/-43", 100, 0, 0.0, 6987.98, 5798, 8749, 6777.5, 8096.1, 8223.099999999999, 8747.89, 5.405989836739106, 120.5074851842091, 4.387087455400583], "isController": false}, {"data": ["/search-37-0", 100, 0, 0.0, 354.96, 236, 904, 284.0, 657.6000000000006, 889.9499999999994, 903.99, 19.86886548778065, 7.974710659646334, 15.813598996622291], "isController": false}, {"data": ["/auth/-87", 100, 0, 0.0, 1440.1, 586, 8082, 1023.5, 2933.4000000000005, 4560.8499999999985, 8070.559999999994, 0.4643258453052014, 2.351814940902928, 0.34915127039551275], "isController": false}, {"data": ["/cart/-79", 100, 0, 0.0, 7504.719999999998, 1008, 29788, 7162.5, 13985.400000000003, 15795.1, 29718.609999999964, 0.4671718351444028, 15.77720038664309, 0.8469496890971437], "isController": false}, {"data": ["/upload/resize_cache/iblock/cdd/260_260_2/image-18-02-16-23-43-88.jpeg-73", 100, 0, 0.0, 2714.65, 504, 14022, 1443.5, 6616.600000000001, 10645.449999999995, 14017.429999999998, 0.5077533943314411, 30.527681128329593, 0.34957631152701757], "isController": false}, {"data": ["/upload/resize_cache/iblock/c6d/260_260_2/Odintsova.jpeg-72", 100, 0, 0.0, 2910.02, 665, 32016, 1485.5, 6626.000000000001, 8233.299999999997, 32000.43999999999, 0.5046630869231701, 30.139327227330536, 0.34054901666397513], "isController": false}, {"data": ["/img/icon/mastercard1.png-93", 100, 0, 0.0, 982.13, 419, 3593, 846.5, 1100.8, 2749.3999999999983, 3592.1799999999994, 0.4762244922256352, 1.1887009786413314, 0.29764030764102195], "isController": false}, {"data": ["/personal/order/-85", 100, 0, 0.0, 1636.3599999999994, 562, 7665, 1063.5, 4027.800000000001, 5937.799999999997, 7658.179999999997, 0.46419867703377043, 5.401663318150168, 0.349962283857491], "isController": false}, {"data": ["/afisha/performances/detail/3305995/-56", 100, 0, 0.0, 2024.94, 824, 7712, 1305.0, 3928.0, 5665.999999999996, 7703.739999999996, 0.9141854150858877, 18.856466890489727, 0.7302770210354064], "isController": false}, {"data": ["/upload/iblock/705/%D0%9E%D0%BB%D1%8C%D0%B3%D0%B0%20%D0%93%D1%80%D0%B8%D1%88%D0%B5%D0%BD%D0%BA%D0%BE%D0%B2%D0%B0_%D0%A0%D0%BE%D0%BC%D0%B0%D0%BD%20%D0%9F%D0%BE%D0%BB%D0%BA%D0%BE%D0%B2%D0%BD%D0%B8%D0%BA%D0%BE%D0%B24.jpg-64", 100, 0, 0.0, 19596.620000000006, 5085, 49005, 17133.0, 33266.200000000004, 37103.75, 48982.43999999999, 0.49196619208327996, 529.3565835530783, 0.4093312457567916], "isController": false}, {"data": ["/upload/iblock/ce4/%D0%95%D0%B2%D0%B3%D0%B5%D0%BD%D0%B8%D0%B9%20%D0%93%D1%80%D0%B0%D1%89%D0%B5%D0%BD%D0%BA%D0%BE_%D0%9E%D0%BB%D1%8C%D0%B3%D0%B0%20%D0%9F%D0%BE%D1%82%D0%B5%D1%88%D0%BA%D0%B8%D0%BD%D0%B0.jpg-49", 100, 0, 0.0, 16481.77, 5090, 48306, 14508.0, 26198.9, 30957.249999999996, 48215.879999999954, 0.9658009870486088, 735.6432551477193, 0.8120650877430197], "isController": false}, {"data": ["/upload/resize_cache/iblock/33a/350_200_2/%D0%A1%D0%BF%D1%8F%D1%89%D0%B0%D1%8F%201600%D1%85600_1.jpg-81", 100, 0, 0.0, 2807.6, 504, 14915, 1983.5, 7043.800000000001, 7802.6, 14869.039999999975, 0.46435818733137996, 21.226248078718, 0.3196997285826395], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 7298, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
