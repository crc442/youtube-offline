var offline = true;
var presentIndexedDB = false;

if ('indexedDB' in window) {
    console.log('indexedDB present');
    presentIndexedDB = true;
}

if (navigator.onLine) {
    console.log('online');
    offline = false;
} else {
    console.log('offline');
}

if (indexedDB) {}

if (!offline) {
    if (presentIndexedDB) {
        $('.watch-title-container').append('<span id="yt-offline-download-icon"></span>');


        var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.OIndexedDB || window.msIndexedDB,
            IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.OIDBTransaction || window.msIDBTransaction,
            dbVersion = 1.0;

        // Create/open database
        var request = indexedDB.open("YoutubeOfflineVideos", dbVersion);
        var db;
        var createObjectStore = function(dataBase) {
                // Create an objectStore
                console.log("Creating objectStore");
                dataBase.createObjectStore("YTOfflineVideos");
            },

            getVideoFile = function() {
                // Create XHR
                var xhr = new XMLHttpRequest(),
                    blob;

                xhr.open("GET", "day_the_earth_stood_still.ogv", true);
                // Set the responseType to blob
                xhr.responseType = "blob";

                xhr.addEventListener("load", function() {
                    if (xhr.status === 200) {
                        console.log("Video retrieved");

                        // Blob as response
                        blob = xhr.response;
                        console.log("Blob:" + blob);

                        // Put the received blob into IndexedDB
                        putEarthInDb(blob);
                    }
                }, false);
                // Send XHR
                xhr.send();
            },

            putEarthInDb = function(blob) {
                console.log("Putting earth in IndexedDB");

                // Open a transaction to the database
                var transaction = db.transaction(["earth"], "readwrite");

                // Put the blob into the dabase
                var put = transaction.objectStore("earth").put(blob, "video");




                // Retrieve the file that was just stored
                transaction.objectStore("earth").get("video").onsuccess = function(event) {
                    var vidFile = event.target.result;
                    console.log("Got earth!" + vidFile);
                    console.log('File Type: ' + vidFile.type); /// THIS SHOWS : application/xml

                    // Get window.URL object
                    var URL = window.URL || window.webkitURL;

                    // Create and revoke ObjectURL
                    var vidURL = URL.createObjectURL(vidFile);

                    // Set vid src to ObjectURL

                    var vidEarth = document.getElementById("earth");
                    vidEarth.setAttribute("src", vidURL);




                    // Revoking ObjectURL
                    URL.revokeObjectURL(vidURL);
                };
            };

        request.onerror = function(event) {
            console.log("Error creating/accessing IndexedDB database");
        };

        request.onsuccess = function(event) {
            console.log("Success creating/accessing IndexedDB database");
            db = request.result;

            db.onerror = function(event) {
                console.log("Error creating/accessing IndexedDB database");
            };

            // Interim solution for Google Chrome to create an objectStore. Will be deprecated
            if (db.setVersion) {
                if (db.version != dbVersion) {
                    var setVersion = db.setVersion(dbVersion);
                    setVersion.onsuccess = function() {
                        createObjectStore(db);
                        getVideoFile();
                    };
                } else {
                    getVideoFile();
                }
            } else {
                getVideoFile();
            }
        }

        // For future use. Currently only in latest Firefox versions
        request.onupgradeneeded = function(event) {
            createObjectStore(event.target.result);
        };
    } else {
        console.log('Oops! No IndexedDB support! :/');
    }

    //File System API
    // window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;

    // function onInitFs(fs) {
    //   console.log('Opened file system: ' + fs.name);
    // }

    // function errorHandler(e) {
    //   var msg = '';

    //   switch (e.code) {
    //     case FileError.QUOTA_EXCEEDED_ERR:
    //       msg = 'QUOTA_EXCEEDED_ERR';
    //       break;
    //     case FileError.NOT_FOUND_ERR:
    //       msg = 'NOT_FOUND_ERR';
    //       break;
    //     case FileError.SECURITY_ERR:
    //       msg = 'SECURITY_ERR';
    //       break;
    //     case FileError.INVALID_MODIFICATION_ERR:
    //       msg = 'INVALID_MODIFICATION_ERR';
    //       break;
    //     case FileError.INVALID_STATE_ERR:
    //       msg = 'INVALID_STATE_ERR';
    //       break;
    //     default:
    //       msg = 'Unknown Error';
    //       break;
    //   };

    //   console.log('Error: ' + msg);
    // }

    // window.requestFileSystem(window.TEMPORARY, 1*1024*1024*1024 /*1GB*/, onInitFs, errorHandler);
}