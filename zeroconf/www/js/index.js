/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var container = document.getElementById('content');
var print = (data) => container.innerHTML = container.innerHTML + '\n' + JSON.stringify(data, ' ', 2);
var findDevice = () => new Promise(
    (resolve, reject) => {
        window.ZeroConf.list('_arduino._tcp.local.', 3000, resolve, reject);
    }
);

var getAdress = (res) => {
  if (res.service.length === 0) {
    alert("Nothing found");
  }
  try {
      return res.service[0].addresses[0];
  } catch (err) {
    alert('Wrong service found: \n\n' + JSON.stringify(res, ' ', 2));
  }
};

var findDeviceAdress = () => {
    var counter = 0;
    var maxTryies = 2;
    return findDevice()
        .then(getAdress)
        .catch(err => {
            if (counter < maxTryies) {
                counter++;
                return findDeviceAdress();
            }
            return Promise.reject(err);
        });

}

var tap = fn => a => { fn(a); return a; }

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        findDeviceAdress()
            .then(tap(print))
            .then(addr => {
                var url = 'http://' + addr;
                window.open(url, '_self ', 'location=no');
                // window.location.href = url;
            })
            .catch(err => alert('ERROR: ' + err));
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
    }
};
