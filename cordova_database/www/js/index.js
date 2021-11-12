// Create or Open Database.
var db = window.openDatabase('FGW', '1.0', 'FGW', 20000);

// To detect whether users use mobile phones horizontally or vertically.
$(window).on('orientationchange', onOrientationChange);

function onOrientationChange(e) {
    if (e.orientation == 'portrait') {
        console.log('Portrait.');
    }
    else {
        console.log('Landscape.');
    }
}

// To detect whether users open applications on mobile phones or browsers.
if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
    $(document).on('deviceready', onDeviceReady);
}
else {
    onDeviceReady();
}

// Display messages in the console.
function log(message) {
    console.log(`[${new Date()}] ${message}`);
}

// Display errors when executing SQL queries.
function transactionError(tx, error) {
    log(`Errors when executing SQL query. [Code: ${error.code}] [Message: ${error.message}]`);
}

// Run this function after starting the application.
function onDeviceReady() {
    // Logging.
    log(`Device is ready.`);

    db.transaction(function (tx) {
        // Create TABLE 'ACCOUNT'
        var query = `CREATE TABLE IF NOT EXISTS Account (Id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                         Username TEXT NOT NULL UNIQUE,
                                                         Password TEXT NOT NULL)`;

        // Execute a query.
        tx.executeSql(query, [], transactionSuccess, transactionError);

        function transactionSuccess(tx, result) {
            // Logging.
            log(`Create table 'Account' successfully.`);
        }

        //CREATE TABLE 'NOTE'
        var query = `CREATE TABLE IF NOT EXISTS Note (Id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                        CustomerID INTEGER NOT NULL,
                                                        Note TEXT NOT NULL,
                                                        Datetime REAL NOT NULL,
                                                        FOREIGN KEY(CustomerID) REFERENCES Customer(Id))`;

        // Execute a query.
        tx.executeSql(query, [], transactionSuccess, transactionError);

        function transactionSuccess(tx, result) {
        log(`Create table 'Note' successfully.`);
        }

        //Create table comment
        var query = `CREATE TABLE IF NOT EXISTS Comment (Id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                        CustomerID INTEGER NOT NULL,
                                                        Comment TEXT NOT NULL,
                                                        Datetime DATE NOT NULL,
                                                        FOREIGN KEY(CustomerID) REFERENCES Customer(Id))`;

        // Execute a query.
        tx.executeSql(query, [], transactionSuccess, transactionError);

        function transactionSuccess(tx, result) {
        log(`Create table 'Comment' successfully.`);
        }

        //create table type
        var query = `CREATE TABLE IF NOT EXISTS Type (Id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                        TypeID INTEGER NOT NULL,
                                                        Type TEXT NOT NULL)`;

        // var query = "INSERT INTO Type (TypeID, Type) VALUES (? ,?)";
         
        //  tx.executeSql(query, [], transactionSuccess, transactionError);   
        //  tx.executeSql(query, [1, 'Apartment'], transactionSuccessForTableData('Type', 1, 'Apartment'), transactionError);
        //  tx.executeSql(query, [2, 'Penthouse'], transactionSuccessForTableData('Type', 2, 'Penthouse'), transactionError);
        //  tx.executeSql(query, [3, 'House'], transactionSuccessForTableData('Type', 3, 'House'), transactionError);
        //  tx.executeSql(query, [4, 'Villa'], transactionSuccessForTableData('Type', 4, 'Villa'), transactionError);

         
        // Execute a query.
        tx.executeSql(query, [], transactionSuccess, transactionError);  

        function transactionSuccess(tx, result) {
            log(`Create table 'Type' successfully.`);
            }


            //CREATE TABLE FURNITURE
        var query = `CREATE TABLE IF NOT EXISTS Furniture (Id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                        FurnitureID INTEGER NOT NULL,
                                                        FurnitureName TEXT NOT NULL)`;

        //  var query = "INSERT INTO Furniture (FurnitureID, FurnitureName) VALUES (? ,?)";
        //  tx.executeSql(query, [1, 'Unfurnished'], transactionSuccessForTableData('Furniture', 1, 'Unfurnished'), transactionError);
        //  tx.executeSql(query, [2, 'Half furnished'], transactionSuccessForTableData('Furniture', 2, 'Half furnished'), transactionError);
        //  tx.executeSql(query, [3, 'Furnished'], transactionSuccessForTableData('Furniture', 3, 'Ffurnished'), transactionError);

        // Execute a query.
        tx.executeSql(query, [], transactionSuccess, transactionError);  

        function transactionSuccess(tx, result) {
            log(`Create table 'Furniture' successfully.`);
            }

        //CREATE TABLE CUSTOMER
        var query = `CREATE TABLE IF NOT EXISTS Customer (Id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                            CustomerName TEXT UNIQUE NOT NULL,
                                                            Street TEXT NOT NULL,
                                                            City INTEGER NOT NULL,
                                                            District INTEGER NOT NULL,
                                                            Ward INTEGER NOT NULL,
                                                            Type INTEGER NOT NULL,
                                                            Bedroom INTEGER NOT NULL,
                                                            Price REAL NOT NULL,
                                                            Furniture INTEGER NULL,
                                                            Reporter TEXT NOT NULL,
                                                            Datetime REAL NOT NULL)`;

        tx.executeSql(query, [], transactionSuccessForTable('Property'), transactionError);

        function transactionSuccess(tx, result) {
            log(`Create table 'Customer' successfully.`);
            }

    });
    prepareDatabase(db);
}

$(document).on('pagebeforeshow', '#page-create', function() {
    importType('#page-create #frm-register');
});

$(document).on('pagebeforeshow', '#page-create', function() {
    importFurniture('#page-create #frm-register');
});



//Import Furniture
function importFurniture(form, selectedName = ``) {
    db.transaction(function (tx) {
        var query = 'SELECT * FROM Furniture ORDER BY FurnitureName';
        tx.executeSql(query, [], transactionSuccess, transactionError);

        function transactionSuccess(tx, result) {
            var optionList = `<option value=''>--Select Furniture--</option>`;
            for (let item of result.rows) {
                if (selectedName == item.FurnitureName){
                    optionList += `<option value='${item.Id}' selected>${item.FurnitureName}</option>`;
                }
                else{
                    optionList += `<option value='${item.Id}'>${item.FurnitureName}</option>`;
                }
                
            }

            $(`${form} #furniture`).html(optionList);
            $(`${form} #furniture`).selectmenu('refresh', true);
        }
    });
}

//Import Type
function importType(form, selectedName = ``) {
    db.transaction(function (tx) {
        var query = 'SELECT * FROM Type ORDER BY Type';
        tx.executeSql(query, [], transactionSuccess, transactionError);

        function transactionSuccess(tx, result) {
            var optionList = `<option value=''>--Select Type--</option>`;
            for (let item of result.rows) {
                if (selectedName == item.Type){
                    optionList += `<option value='${item.Id}' selected>${item.Type}</option>`;
                }
                else{
                    optionList += `<option value='${item.Id}'>${item.Type}</option>`;
                }
                
            }

            $(`${form} #type`).html(optionList);
            $(`${form} #type`).selectmenu('refresh', true);
        }
    });
}

$(document).on('pagebeforeshow', '#page-create', function() {
    importCity('#page-create #frm-register');
    importDistrict('#page-create #frm-register');
    importWard('#page-create #frm-register');
});

$(document).on('change', '#page-create #frm-register #city', function() {
    importDistrict('#page-create #frm-register');
    importWard('#page-create #frm-register');
});

$(document).on('change', '#page-create #frm-register #district', function() {
    importWard('#page-create #frm-register');
});

$(document).on('change', '#page-detail #frm-update #city', function() {
    importDistrict('#page-detail #frm-update');
    importWard('#page-detail #frm-update');
});

$(document).on('change', '#page-detail #frm-update #district', function() {
    importWard('#page-detail #frm-update');
});

$(document).on('click', '#page-create #frm-confirm #edit', editBtn);

function editBtn(){
    $('#page-create #frm-confirm').popup('close');
}

$(document).on('click', '#page-detail #frm-update #cancel-btn', cancelBtn);
function cancelBtn(){
    $('#page-detail #frm-update').popup('close');
}


//Import City
function importCity(form, selectedName = ``) {
    db.transaction(function (tx) {
        var query = 'SELECT * FROM City ORDER BY Name';
        tx.executeSql(query, [], transactionSuccess, transactionError);

        function transactionSuccess(tx, result) {
            var optionList = `<option value=''>--Select City--</option>`;

            for (let item of result.rows) {
                if (selectedName == item.Name) {
                    optionList += `<option value='${item.Id}' selected>${item.Name}</option>`;
                }
                else{
                    optionList += `<option value='${item.Id}'>${item.Name}</option>`;
                }
            }

            $(`${form} #city`).html(optionList);
            $(`${form} #city`).selectmenu('refresh', true);
        }
    });
}

//Import District
function importDistrict(form, selectedName = ``, selectedCity = ``) {
    var name = $(`${form} #city option:selected`).val(); 
    var id = $(`${form} #city`).val(); 
    db.transaction(function (tx) {
        var query = '';
        if (selectedCity)
            query = `SELECT District.* FROM District LEFT JOIN City ON District.CityId = City.Id WHERE City.Name = '${selectedCity}' ORDER BY District.Name`;
        else
            query = `SELECT * FROM District WHERE CityId = ${id} ORDER BY Name`;

        tx.executeSql(query, [], transactionSuccess, transactionError);

        function transactionSuccess(tx, result) {
            var optionList = `<option value=''>--Select District--</option>`;

            for (let item of result.rows) {
                if (selectedName == item.Name) {
                    optionList += `<option value='${item.Id}' selected>${item.Name}</option>`;
                }
                else{
                    optionList += `<option value='${item.Id}'>${item.Name}</option>`;
                }
            }

            $(`${form} #district`).html(optionList);
            $(`${form} #district`).selectmenu('refresh', true);
        }
    });
}

//Import Ward
function importWard(form, selectedName = ``,  selectedDistrict = ``) {
    var name = $(`${form} #city option:selected`).val(); 
    var id = $(`${form} #district`).val(); 
    db.transaction(function (tx) {
        var query = '';
        if (selectedDistrict)
            query = `SELECT Ward.* FROM Ward LEFT JOIN District ON Ward.DistrictId = District.Id WHERE District.Name = '${selectedDistrict}' ORDER BY District.Name`;
        else
            query = `SELECT * FROM Ward WHERE DistrictId = ${id} ORDER BY Name`;
        tx.executeSql(query, [], transactionSuccess, transactionError);

        function transactionSuccess(tx, result) {
            var optionList = `<option value=''>--Select Ward--</option>`;

            for (let item of result.rows) {
                if (selectedName == item.Name) {
                    optionList += `<option value='${item.Id}' selected>${item.Name}</option>`;
                }
                else{
                    optionList += `<option value='${item.Id}'>${item.Name}</option>`;
                }
            }

            $(`${form} #ward`).html(optionList);
            $(`${form} #ward`).selectmenu('refresh', true);
        }
    });
}

// Submit a form to register a new account.
$(document).on('submit', '#page-create #frm-register', confirmCustomer);

//function confirmAccount(e) {
  function confirmCustomer(e) {
    e.preventDefault();

    var propertyname = $('#page-create #frm-register #propertyname').val();
    var street = $('#page-create #frm-register #street').val();
    var city = $('#page-create #frm-register #city option:selected').text();
    var district = $('#page-create #frm-register #district option:selected').text();
    var ward = $('#page-create #frm-register #ward option:selected').text();
    var type = $('#page-create #frm-register #type option:selected').text();
    var furniture = $('#page-create #frm-register #furniture option:selected').text();
    var bedroom = $('#page-create #frm-register #bedroom').val();
    var price = $('#page-create #frm-register #price').val();
    var reporter = $('#page-create #frm-register #reporter').val();
    var note = $('#page-create #frm-register #note').val();


     db.transaction(function (tx) {
         
         var query = 'SELECT * FROM Customer WHERE CustomerName = ?';
         tx.executeSql(query, [propertyname], transactionSuccess, transactionError);
         function transactionSuccess(tx, result) {
            if (result.rows[0] == null){
                $('#page-create #frm-confirm #propertyname').text(propertyname);
                $('#page-create #frm-confirm #street').text(street);
                $('#page-create #frm-confirm #city').text(city);
                $('#page-create #frm-confirm #district').text(district);
                $('#page-create #frm-confirm #ward').text(ward);
                $('#page-create #frm-confirm #type').text(type);
                $('#page-create #frm-confirm #furniture').text(furniture);
                $('#page-create #frm-confirm #bedroom').text(bedroom);
                $('#page-create #frm-confirm #price').text(price);
                $('#page-create #frm-confirm #reporter').text(reporter);
                $('#page-create #frm-confirm #note').text(note);
                $('#page-create #frm-confirm').popup('open');
            }
            else{
             alert('Account exists.');
            } 
         }
    });
}


//$(document).on('vclick', '#btn-register-confirm', registerAccount);
$(document).on('submit', '#page-create #frm-confirm', registerCustomer);

function registerCustomer(e) {
    e.preventDefault();

    // Get user's input.
    // var username = $('#page-create #popup-register-confirm #username').text();
    // var password = $('#page-create #popup-register-confirm #password').text();
    
    var propertyname = $('#page-create #frm-register #propertyname').val();
    var street = $('#page-create #frm-register #street').val();
    var city = $('#page-create #frm-register #city option:selected').text();
    var district = $('#page-create #frm-register #district option:selected').text();
    var ward = $('#page-create #frm-register #ward option:selected').text();
    var type = $('#page-create #frm-register #type option:selected').text();
    var furniture = $('#page-create #frm-register #furniture option:selected').text();
    var bedroom = $('#page-create #frm-register #bedroom').val();
    var price = $('#page-create #frm-register #price').val();
    var reporter = $('#page-create #frm-register #reporter').val();
    var note = $('#page-create #frm-register #note').val();
    var datetime = new Date();
    
        db.transaction(function (tx) {
            //var query = 'INSERT INTO Account (Username, Password) VALUES (?, ?)';
            var query = `INSERT INTO Customer (CustomerName, Street, City, District, Ward, Type, Bedroom, Price, Furniture, Reporter, Datetime) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            
            tx.executeSql(query, [propertyname, street, city, district, ward, type, bedroom, price, furniture, reporter, datetime], transactionSuccess, transactionError);

            function transactionSuccess(tx, result) {
                // Logging.
                log(`Create a username '${propertyname}' successfully.`);
                if (note != ''){
                    var queryNote = 'INSERT INTO Note (CustomerId, Note, Datetime) VALUES(?, ?, ?)';
                    tx.executeSql(queryNote, [result.insertId, note, datetime], transactionSuccess, transactionError);
                    function transactionSuccess(tx, result){
                        log(`Create a note to '${propertyname}' successfully.`);
                    }
                }
                // Reset the form.
                $('#frm-register').trigger('reset');
                $('#username').focus();

                $('#page-create #frm-confirm').popup('close');
            }
        });
    
}

//Display CustomerList
$(document).on('pagebeforeshow', '#page-list', showListCustomer);

function showListCustomer() {
    db.transaction(function (tx) { 
        var query = 'SELECT * FROM Customer';
        tx.executeSql(query, [], transactionSuccess, transactionError);

        function transactionSuccess(tx, result) {
            log(`Show list of customer successfully.`);

            // Prepare the list of Customer.
            var listCustomer = `<ul id='list-customer' data-role='listview' data-filter='true' data-filter-placeholder='Search accounts...'
                                    data-corners='false' class='ui-nodisc-icon ui-alt-icon'>`;
            
            for (let customer of result.rows) {
                listCustomer += `<li><a data-details='{"Id" : ${customer.Id}}'>
                                    <img src='img/hotel.jpg'>
                                    <h3>Customer Name: ${customer.CustomerName}</h3>
                                    <p>${customer.City}</p>
                                    <p>Bedroom: ${customer.Bedroom} bedroom</p>
                                    <p>Type: ${customer.Type}</p>
                                    <p>Price: ${customer.Price}$/month</p>
                                    <small>${customer.Datetime}</small>
                                </a></li>`;
            }
            listCustomer += `</ul>`;
            // Add list to UI.
            $('#list-customer').empty().append(listCustomer).listview('refresh').trigger('create');
        }
    });
}




// Show Customer Details.
$(document).on('vclick', '#page-list #list-customer li a', currentId);

function currentId(e){
    e.preventDefault();

    var id = $(this).data('details').Id;
    localStorage.setItem('currentCusId', id);
    $.mobile.navigate('#page-detail', { transition: 'none' });
}

$(document).on('pagebeforeshow', '#page-detail', showDetailCustomer);

function showDetailCustomer() {
    var id = localStorage.getItem('currentCusId');
 log(`Here ${id}`);
    db.transaction(function (tx) {
        var query = 'SELECT * FROM Customer WHERE Id = ?';
        tx.executeSql(query, [id], transactionSuccess, transactionError);
       
        function transactionSuccess(tx, result) {
            if (result.rows[0] != null) {
    
               var propertyname = result.rows[0].CustomerName;
               var street = result.rows[0].Street;
               var city = result.rows[0].City;
               var district = result.rows[0].District;
               var ward = result.rows[0].Ward;
               var type = result.rows[0].Type;
               var furniture = result.rows[0].Furniture;
               var bedroom = result.rows[0].Bedroom;
               var price = result.rows[0].Price;
               var reporter = result.rows[0].Reporter;

                $('#page-detail #id').text(id);
                $('#page-detail #customername').text(propertyname);
                $('#page-detail #street').text(street);
                $('#page-detail #ward').text(ward);
                $('#page-detail #district').text(district);
                $('#page-detail #city').text(city);
                $('#page-detail #type').text(type);
                $('#page-detail #furniture').text(furniture);
                $('#page-detail #bedroom').text(bedroom);
                $('#page-detail #price').text(price);
                $('#page-detail #reporter').text(reporter);
                noteHere();     
                commentHere()   
                }
            else {
                var errorMessage = 'Customer dose not existed.';
                log(errorMessage);
           
                // var propertyname = errorMessage;
                // var street = errorMessage;
                // var city = errorMessage;
                // var district = errorMessage;
                // var ward = errorMessage;
                // var type = errorMessage;
                // var furniture = errorMessage;
                // var bedroom = errorMessage;
                // var price = errorMessage;
                // var reporter = errorMessage;

                $('#page-detail #btn-update').addClass('ui-disabled');
                $('#page-detail #btn-delete-confirm').addClass('ui-disabled');
            }
        }
        
    });
}

//show Note
function noteHere(){
    var id = localStorage.getItem('currentCusId');

     db.transaction(function (tx) {
         var query = 'SELECT * FROM Note WHERE CustomerId = ?';
         tx.executeSql(query, [id], transactionSuccess, transactionError);

         function transactionSuccess(tx, result) {
            
            log(`Getlist of Notes successfully.`);

             var listNote = '';
             for (let note of result.rows) {
                 listNote += `<h3>${note.Note}</h3>       
                 `;
             }
 
             $('#list-note').empty().append(listNote);
             log(`Show list of Notes successfully.`);
         }
     });
}
//Add note
$(document).on('submit', '#page-detail #frm-note', addNote);

    function addNote(e) {
        e.preventDefault();
        var id = localStorage.getItem('currentCusId');
        var note = $('#page-detail #frm-note #txt-note').val();
        

        db.transaction(function (tx) {
            var query = 'INSERT INTO Note (CustomerId, Note) VALUES(?, ?)';
            tx.executeSql(query, [id, note], transactionSuccess, transactionError);

            function transactionSuccess(tx, result) {
                log(`Create note for account '${id}' successfully.`);
               
                $('#page-detail #frm-note').trigger('reset');
                noteHere();
                // $('#page-detail #popup-note #txt-note').val('');
                // $('#page-detail #popup-note').popup('close');
            }
        });
 }

//Add comment
 $(document).on('submit', '#page-detail #frm-comment', addComment);

    function addComment(e) {
        e.preventDefault();
        var id = localStorage.getItem('currentCusId');
        var comment = $('#page-detail #frm-comment #txt-comment').val();
        var dateTime = new Date();

        db.transaction(function (tx) {
            var query = 'INSERT INTO Comment (CustomerId, Comment, Datetime) VALUES(?, ?, ?)';
            tx.executeSql(query, [id, comment, dateTime], transactionSuccess, transactionError);

            function transactionSuccess(tx, result) {
                log(`Create comment for account '${id}' successfully.`);
               
                $('#page-detail #frm-comment').trigger('reset');
                commentHere();
                // $('#page-detail #popup-note #txt-note').val('');
                // $('#page-detail #popup-note').popup('close');
            }
        });
 }

 //show Comment
function commentHere(){
    var id = localStorage.getItem('currentCusId');

     db.transaction(function (tx) {
         var query = 'SELECT * FROM Comment WHERE CustomerId = ?';
         tx.executeSql(query, [id], transactionSuccess, transactionError);

         function transactionSuccess(tx, result) {
            
            log(`Getlist of Comments successfully.`);

             var listComment = '';
             for (let comment of result.rows) {
                listComment += `<h3>${comment.Comment}</h3>    
                        <small>${comment.Datetime}</small>   
                 `;
             }
 
             $('#list-comment').empty().append(listComment);
             log(`Show list of Comment successfully.`);
         }
     });
}


//Show update
$(document).on('vclick', '#page-detail #btn-update', showUpdate);

function showUpdate(){
    var id = localStorage.getItem('currentCusId');
        db.transaction(function(tx){
            var query = "SELECT * FROM Customer WHERE Id = ?";
            tx.executeSql(query, [id], transactionSuccess, transactionError);
            function transactionSuccess(tx, result) {
                if(result.rows[0] != null){
                    log(`Get information of Customer ${result.rows[0].CustomerName} Successfully`);
                    
                    $('#page-detail #frm-update #propertyname').val(result.rows[0].CustomerName);
                    $('#page-detail #frm-update #street').val(result.rows[0].Street);                  
                    $('#page-detail #frm-update #bedroom').val(result.rows[0].Bedroom);
                    $('#page-detail #frm-update #price').val(result.rows[0].Price);
                    $('#page-detail #frm-update #reporter').val(result.rows[0].Reporter);

                    importCity('#page-detail #frm-update',result.rows[0].City);
                    importDistrict('#page-detail #frm-update',result.rows[0].District,result.rows[0].City);
                    importWard('#page-detail #frm-update',result.rows[0].Ward,result.rows[0].District);
                    importFurniture('#page-detail #frm-update',result.rows[0].Furniture);
                    importType('#page-detail #frm-update',result.rows[0].Type);
                }
            }
    });
}
//Update customer
$(document).on('submit', '#page-detail #frm-update', updateCus);

 function updateCus(e){
     e.preventDefault();

     var id = localStorage.getItem('currentCusId');
     var propertyname = $('#page-detail #frm-update #propertyname').val();
     var street = $('#page-detail #frm-update #street').val();
     var city = $('#page-detail #frm-update #city option:selected').text();
     var district = $('#page-detail #frm-update #district option:selected').text();
     var ward = $('#page-detail #frm-update #ward option:selected').text();
     var type = $('#page-detail #frm-update #type option:selected').text();
     var furniture = $('#page-detail #frm-update #furniture option:selected').text();
     var bedroom = $('#page-detail #frm-update #bedroom').val();
     var price = $('#page-detail #frm-update #price').val();
     var reporter = $('#page-detail #frm-update #reporter').val();
    
     db.transaction(function(tx){
            var query = `UPDATE Customer SET CustomerName = ?, Street = ?, City = ?, District = ?, Ward = ?, Type = ?, Bedroom = ?, Price = ?, Furniture = ?, Reporter = ? WHERE Id = ?`;
        tx.executeSql(query, [propertyname, street, city, district, ward, type, bedroom, price, furniture, reporter, id], transactionSuccess, transactionError);

        function transactionSuccess(tx, result) {
            // Logging.
            log(`Update a Customer information of '${propertyname}' successfully.`);
            showDetailCustomer();

                $('#page-detail #frm-update').popup('close');
        }
     });

 }

// Delete Account.
 $(document).on('vclick', '#page-detail #btn-delete', deleteCustomer);

 function deleteCustomer() {
     var id = localStorage.getItem('currentCusId');

     db.transaction(function (tx) {
        var query = 'DELETE FROM Comment WHERE CustomerId = ?';
        tx.executeSql(query, [id], transactionSuccess, transactionError);
 
         function transactionSuccess(tx, result) {
            log(`Delete Comment '${id}' successfully.`);
 
             $.mobile.navigate('#page-list', { transition: 'none' });
         }
         var query = 'DELETE FROM Note WHERE CustomerId = ?';
         tx.executeSql(query, [id], transactionSuccess, transactionError);
  
          function transactionSuccess(tx, result) {
             log(`Delete Note '${id}' successfully.`);
  
              $.mobile.navigate('#page-list', { transition: 'none' });
          }
         var query = 'DELETE FROM Customer WHERE Id = ?';
        tx.executeSql(query, [id], transactionSuccess, transactionError);

         function transactionSuccess(tx, result) {
            log(`Delete Customer '${id}' successfully.`);

             $.mobile.navigate('#page-list', { transition: 'none' });
         }
     });
 }


 //Search
 $(document).on('submit', '#page-search #frm-search', search);

 function search(e) {
    e.preventDefault();
    var propertyname = $('#page-search #frm-seach #propertyname').val();
    // var street = $('#page-search #frm-seach #street').val();
    var price = $('#page-search #frm-seach #price').val();
    
    db.transaction(function (tx) { 
        var query = `SELECT Id, CustomerName, Price FROM Customer WHERE`;

       
            if (propertyname) {
                query += ` CustomerName LIKE "%${propertyname}%"   AND`;
            }
            if (price) {
                query += ` Price > ${price}   AND`;

        query = query.substring(0, query.length - 6);

        tx.executeSql(query, [], transactionSuccess, transactionError);

        function transactionSuccess(tx, result) {
            log(`Show list of customer successfully.`);
        }
            // Prepare the list of Customer.
            var listCustomer = `<ul id='list-customer' data-role='listview' class='ui-nodisc-icon ui-alt-icon'>`;
            
            for (let customer of result.rows) {
                listCustomer += `<li><a data-details='{"Id" : ${customer.id}}'>
                                    <img src='img/hotel.jpg'>
                                    <h3>Customer Name: ${customer.CustomerName}</h3>
                                    <h3>Price: ${customer.Price}</h3>
                                </a></li>`;
            }
            listCustomer += `</ul>`;
            // Add list to UI.
            $('#page-search #list-search').empty().append(listCustomer).listview('refresh').trigger('create');
        }
    
    });
 }

//  $(document).on('vclick', '#page-search #frm-search', SearchRentalApartment);
//      if(e.which === 13){
//         SearchRentalApartment(e);
//      }


// function SearchRentalApartment(e){
//     e.preventDefault();
//     var keyWord = $('#page-search #frm-search').val();

//     db.transaction(function(tx){
//         var query = `SELECT Id, Price, Street, Bedroom, FROM Customer WHERE`;

//         query += ` Street LIKE "%${keyWord}%"   AND`;

//         query = query.substring(0, query.length - 6);

//         tx.executeSql(query, [], transactionSuccess, transactionError);

//         function transactionSuccess(tx, result){
//             log('Get list apartment successful');

//             ShowRentalListUI(result.rows);
//         }
//     })
// }

// // Search Apartment in User Apartment List
// $(document).on('vclick', '#apartment-list-page #frm-rental-search span', SearchAllRentalApartment);
//      if(e.which === 13){
//         SearchAllRentalApartment(e);
//      }

// function SearchAllRentalApartment(e){
//     e.preventDefault();
//     var keyWord = $('#page-search #frm-search').val();

//     db.transaction(function(tx){
//         var query = `SELECT Id, Price, Street, Bedroom, FROM Customer WHERE`;

//         query += ` Street LIKE "%${keyWord}%"   AND`;

//         query = query.substring(0, query.length - 6);

//         tx.executeSql(query, [], transactionSuccess, transactionError);

//         function transactionSuccess(tx, result){
//             log('Get list apartment successful');

//             ShowAllRentalListUI(result.rows);
//         }
//     })
// }




