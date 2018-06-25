// Business logic

function AddressBook() {
  this.contacts = [],
  this.currentId = 0
}

function Contact(firstName, lastName) {
  this.firstName = firstName,
  this.lastName = lastName,
  this.addresses = []
}

AddressBook.prototype.assignId = function() {
  this.currentId += 1;
  return this.currentId;
}

AddressBook.prototype.addContact = function(contact) {
  contact.id = this.assignId();
  this.contacts.push(contact);
}

AddressBook.prototype.findContact = function(id) {
  for (var i=0; i< this.contacts.length; i++) {
    if (this.contacts[i]) {
      if (this.contacts[i].id == id) {
        return this.contacts[i];
      }
    }
  };
  return false;
}

AddressBook.prototype.deleteContact = function(id) {
  for (var i=0; i< this.contacts.length; i++) {
    if (this.contacts[i]) {
      if (this.contacts[i].id == id) {
        delete this.contacts[i];
        return true;
      }
    }
  };
  return false;
}

Contact.prototype.addAddress = function(address) {
  this.addresses.push(address);
}

// UI logic

// This is a global variable that mocks a database.
var addressBook = new AddressBook();

function showContact(id) {
  var contact = addressBook.findContact(id);
  $("#show-contact").show();
  $(".first-name").html(contact.firstName);
  $(".last-name").html(contact.lastName);
  var addresses = "";
  contact.addresses.forEach(function(address) {
    addresses += "<li>" + address + "</li>";
  });
  $("#show-addresses").html(addresses);
  var buttons = $("#buttons");
  buttons.empty();
  buttons.append("<button class='updateButton' id=" + contact.id + ">Update</button>");
  buttons.append("<button class='deleteButton' id=" +  + contact.id + ">Delete</button>");
}

// Below uses event delegation, which is the best practice for click handlers. We are attaching click handlers to different dynamic elements. The parent element must exist when the DOM is loaded. For instance, "ul#contacts" exists at that time. Then .on() can be used to dynamically attach a listener to a child element, in this case the "li" inside of "ul#contacts".

function attachContactListeners() {
  var list = $("ul#contacts");
  list.on("click", "li", function() {
    showContact(this.id);
  });
  var buttons = $("#buttons");
  buttons.on("click", ".deleteButton", function() {
    addressBook.deleteContact(this.id);
    $("#show-contact").hide();
    display(addressBook);
  });
  buttons.on("click", ".updateButton", function() {
    showUpdate(this.id);
  });
}

function display(book) {
  var list = $("ul#contacts");
  var records = "";
  book.contacts.forEach(function(contact) {
    records += "<li id=" + contact.id + ">" + contact.firstName + " " + contact.lastName + "</li>"
  });
  list.html(records);
}

function appendAddress() {
  $("#additional-addresses").append('<div class="new-address">' +
                                 '<div class="form-group">' +
                                   '<label for="address">Address</label>' +
                                   '<input type="text" class="form-control address">' +
                                 '</div>');
}

$(document).ready(function() {
  attachContactListeners();

  $("form#new-contact").submit(function(event) {
    event.preventDefault();

    var inputtedFirstName = $("input#new-first-name").val();
    var inputtedLastName = $("input#new-last-name").val();
    var newContact = new Contact(inputtedFirstName, inputtedLastName);
    $(".new-address").each(function() {
      var address = $(this).find("input.address").val();
      newContact.addAddress(address);
    });
    addressBook.addContact(newContact);
    display(addressBook);
    $("#additional-addresses").empty();
  });

  $("#add-address").click(function() {
    appendAddress();
  });
});
