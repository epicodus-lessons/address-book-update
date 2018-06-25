# Week 4 Address book
The following is a proposed rewrite of the Address Book lessons in week 4. Here are the general changes:
* Build out constructors and prototype methods without any jQuery. Students should test in console first. This gives students more practice with writing this business logic without entangling it with view logic.
* Mock a database by creating an AddressBook constructor that is a global variable. This gives students some introduction to database concepts and also avoids convoluted use of `this` to identify contacts.
* Introduce to more advanced jQuery concepts: assigning dynamic IDs, event bubbling/propagation, event delegation. Value added curriculum! They won't be expected to incorporate it in the Friday independent project.

# Building an Address Book I

Let's build an address book with contacts using constructors and prototype methods. We'll focus on business logic for now. We won't use jQuery or create any user interface logic until after we've written our business logic.

We'll start by building a simple `Contact` constructor:

```
function Contact(firstName, lastName, phoneNumber) {
  this.firstName = firstName,
  this.lastName = lastName,
  this.phoneNumber = phoneNumber
}
```

We can now create a new `Contact` in the console:

```
var contact = new Contact("Ada", "Lovelace", "503-111-1111");
```

If we check the value of `contact`, we'll see the following: `Contact {firstName: "Ada", lastName: "Lovelace", phoneNumber: "503-111-1111"}`. Our object has been saved and we can access its individual properties. For instance, we can type in `contact.lastName`. Note that we don't use parentheses after `lastName` because it's a property of the object, not a method being called on the object.

Let's also create a simple prototype method to call on a `Contact`. Let's say we want to have a `fullName()` method to return the contact's first and last name.

```
Contact.prototype.fullName = function() {
  return this.firstName + " " + this.lastName;
}
```

Assuming that we've stored a `Contact` object inside a variable named `contact`, we can call our new method like this: `contact.fullName()`. Note that we need to use parentheses because this is a method on the object, not a property. Also, it's important to remember that this method can only be called on `Contact` objects.

Now that we've created a constructor for `Contact` and a simple prototype method that can only be called on `Contact` objects, let's move on to constructing the address book itself.

Building an Address Book II

In a real world application, we'd save our contacts in a database. However, we aren't working with databases yet. Instead, we'll create an address book and make it a global variable. That way, we can save our contacts inside it. While we generally want to avoid working with global variables, we make an exception here because we're using this global variable to mimic a database.

In our application, our global variable will look like this:

```
var addressBook = new AddressBook();
```

We'll be able to call retrieve our address book whenever we need it.

Next, we need to create an `AddressBook` constructor to store contacts:

```
function AddressBook() {
  this.contacts = []
}
```

For now, our address book can only do one thing: store an array of contacts. Let's create a prototype method to add a contact to an address book:

```
AddressBook.prototype.addContact = function(contact) {
  this.contacts.push(contact);
}
```

Now we can do the following:

```
var addressBook = new AddressBook();
var contact = new Contact("Ada", "Lovelace", "503-111-1111");
var contact2 = new Contact("Grace", "Hopper", "503-222-2222")
addressBook.addContact(contact);
addressBook.addContact(contact2)
```

We create an address book and two contacts, then add the contacts to the address book. We can access the list of contacts like this: `addressBook.contacts`.

This will return the following array in the console: `[Contact, Contact]`. We can expand the array to get further information about the contacts.

We can even get specific information about each contact if we like. For instance, we could do the following: `addressBook.contacts[0].firstName`. That'll return `"Ada"`.

In a real world application, we'd be using a database, which means that each `Contact` object would have an ID. This allows us to identify records by their unique ID instead of by, say, their last name, which might not be unique. Let's update our code so each contact is assigned an ID on creation. This is another way we'll mimic using a database. It'll also come in handy when we want to retrieve specific contacts in our application.

We'll need to update several functions to make this work:

```
function AddressBook() {
  this.contacts = [],
  this.currentId = 0
}

AddressBook.prototype.assignId = function() {
  this.currentId += 1
  return this.currentId
}

AddressBook.prototype.addContact = function(contact) {
  contact.id = this.assignId()
  this.contacts.push(contact)
}
```

First, we make a change to our `AddressBook` constructor. It now has a `currentId` property that begins at `0`. We'll also add a method to the `AddressBook` prototype called `assignId`. It will increment `this.currentId` by 1 and return that value. This mimics a SQL database because we have a sequentially incrementing ID value which is never repeated (making the ID unique). Finally, we'll add a line of code to the `addContact()` method on the `AddressBook` prototype. This will create an `id` property on a `Contact` object and then assign it a unique, incrementing value. Then we'll push the contact to the address book. In the real world, we'd make a method like this much more robust; for example, we'd make sure that contacts that already have an ID don't get a new value assigned to their `id` property. However, this is fine for now!

We can now create a `Contact` and add it to our `AddressBook` "database". When we do so, it will have a unique ID. It doesn't have the complexity or efficiency of a real database, but soon we'll be able to use our `AddressBook` to retrieve specific contacts just as we would with an actual database.

Building an Address Book III

We can now add a `Contact` to our `AddressBook`, but what if we want to find a specific contact? We should have a `find()` method that allows us to find a record by ID. Let's write one now. It should be on the `AddressBook` prototype because that's where we're trying to find the specific `Contact`.

```
AddressBook.prototype.findContact = function(id) {
  for (var i=0; i< this.contacts.length; i++) {
      if (this.contacts[i].id == id) {
        return this.contacts[i];
      }
    };
  return false;
}
```

This method loops through our array of contacts until it finds a contact with a matching ID. Note that we use a `for` loop instead of `forEach` loop. This is because we can return from, or break out of, a `for` loop. We can't escape from a `forEach` loop. We want to stop looping as soon as we find a matching ID. It wouldn't be efficient if the loop continued even after finding a match, especially if there were a million records! (Note that it's not very efficient anyway, but it'll have to do for now.) If there's a contact with a matching ID, it returns the `Contact`. If there isn't, it returns `false` because there's no match.

Let's add one more method for practice. What if we wanted to delete a contact from our address book? Here's a method to do that:

```
AddressBook.prototype.deleteContact = function(id) {
  for (var i=0; i< this.contacts.length; i++) {
    if (this.contacts[i].id == id) {
      delete this.contacts[i];
      return true;
    }
  };
  return false;
}
```

It's very similar to our `findContact()` method. However, it deletes the contact with a matching ID and then returns `true` because the operation was completed. (If there's no record with a matching ID to delete, it returns `false`.) There's one problem: the `delete` method will leave gaps in the array, breaking our `findContact()` method! (You can test this out in the console; now that some elements in the contacts array are empty, or undefined, they won't have an ID property.)

Let's update the `findContact()` method:

```
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
```

This time, we only check an array element's ID property if that element is a `Contact`. We'll also need to update the `deleteContact()` method in the same way:

```
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
```

Astute observers may note a refactoring opportunity for our methods since the length of the array should always be equal to the number of `Contact`s it contains, even if some `Contact`s are deleted:

```
AddressBook.prototype.findContact = function(id) {
  if this.contacts[id + 1] {
    return this.contacts[id + 1]
  } else {
    return false
  }
}
```

You can also experiment with adding other methods as well. For instance, try adding an `update()` method on the `Contact` prototype. The main focus this week is constructors and prototype methods, so we encourage you to focus on this. When working with business logic, make sure to test it in the console before incorporating it into your UI logic.

Building an Address Book IV

We now have a very simple codebase that will allow us to create contacts and add, delete, and find them in an address book. Let's start building out the UI. In the process, we'll experiment with adding dynamic elements to the DOM and learn about event bubbling and event delegation. These are more advanced jQuery techniques and concepts and you won't be expected to apply them to this Friday's independent project. The primary focus will be constructors and prototype methods (along with a basic UI that uses jQuery). However, you are encouraged to experiment with these more advanced concepts as they'll make you a better coder in the long run.

For now, let's get the basics up and running. Here's our HTML:

```
<!DOCTYPE html>
<html>
  <head>
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" rel="stylesheet">
    <link href="css/styles.css" rel="stylesheet" type="text/css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
    <script src="js/scripts.js"></script>
    <title>Address book</title>
  </head>
  <body>
    <div class="container">
      <h1>Address book</h1>

      <div class="row">

        <div class="col-md-6">
          <h2>Add a contact:</h2>
          <form id="new-contact">
            <div class="form-group">
              <label for="new-first-name">First name</label>
              <input type="text" class="form-control" id="new-first-name">
            </div>
            <div class="form-group">
              <label for="new-last-name">Last name</label>
              <input type="text" class="form-control" id="new-last-name">
            </div>
            <div class="form-group">
              <label for="new-address">Address</label>
              <input type="text" class="form-control" id="new-addresss">
            </div>

            <button type="submit" class="btn">Add</button>
          </form>

          <h2>Contacts:</h2>
          <ul id="contacts">

          </ul>
        </div>

        <div class="col-md-6">
          <div id="show-contact">
            <h2></h2>
            <p>First name: <span class="first-name"></span></p>
            <p>Last name: <span class="last-name"></span></p>
            <p>Address:<span class="last-name"></span></p>
            <ul id="addresses">

            </ul>
            <div id="buttons">
            </div>
          </div>
        </div>

      </div>
    </div>
  </body>
</html>
```

Here's our CSS:

```
#show-contact {
  display: none;
}
```

Our HTML has a form for adding new contacts. It also has an `<ul>` with an ID of `contacts` which we'll use to show all of our contacts as they're added. Finally, there's also a `<div>` with an ID of `show-contact`, which we'll use to show the full detail of a contact that's clicked on.

Now let's add a script file:

```
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

function Address(street, city, state) {
  this.street = street,
  this.city = city,
  this.state = state
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

// Note: this is a global variable that mocks a database.
var addressBook = new AddressBook();

$(document).ready(function() {
  $("form#new-contact").submit(function(event) {
    event.preventDefault();
    var inputtedFirstName = $("input#new-first-name").val();
    var inputtedLastName = $("input#new-last-name").val();
    var address = $("input#address").val();
    var newContact = new Contact(inputtedFirstName, inputtedLastName, address);
    addressBook.addContact(newContact);
    console.log(addressBook.contacts);
  })

})
```

Our script has all the constructors and prototype methods we've created so far. There's also some basic code to submit a form and then log all the contacts in our address book to the console. We're ready for the next step: displaying contacts in our application and adding dynamic IDs.

Address Book V

Let's add code to display all the contacts onscreen. We'll attach the records to our unordered list of `#contacts`. We'll start by writing a method with nothing in it.

```
function display(addressBook) {
  //code goes here
}
```

Note that we're not just plopping code directly into the UI logic. This is a best practice. By separating it out first, we'll simplify things for ourselves in the long run (and the short run, too). Notice that it's named simply and in a way that makes it very human readable: it will display our address book.

Let's write the rest of the method. We'll apply some new best practices on the way:

```
function display(book) {
  var list = $("ul#contacts");
  var records = "";
  book.contacts.forEach(function(contact) {
    records += "<li id=" + contact.id + ">" + contact.firstName + " " + contact.lastName + "</li>";
  })
  list.html(records);
}
```

First, we save our jQuery element inside a variable. This is considered a best practice because it takes jQuery time to query the DOM so it can find `ul#contacts`. Save it in a variable and the element is already stored there. No need to query the DOM again. It doesn't save us time here because we only use need to find `ul#contacts` once, but if we needed to use that selector multiple times, this would be more efficient.

Next, we iterate through our contacts, assigning each to its own `<li>` with a dynamic ID that corresponds to the ID of the contact. This is very important. We can combine the dynamic ID stored in each `<li>` with our `AddressBook` prototype method to find a contact.

We could've appended each contact to the DOM one at a time but that's inefficient. It's much faster to concatenate all of our contacts inside of `<li>`s first and _then_ add them to the DOM, which is what we do here.

Let's recap some of the best practices we just used:
1. We created a separate UI function instead of just adding the code to the UI. That allows us to focus on writing one function at a time and helps us keep our code modular as soon as we write it.
2. We store a jQuery selector inside a variable. That way, if we need to use the selector multiple times, jQuery only needs to query the DOM once (making our code faster and more efficient).
3. We create a list of all the elements we want to append and then add them to the DOM all at once instead of one a time. This is also faster and more efficient.

Along the way, we also created custom IDs for our dynamically created content!

You aren't expected to master best practices just yet. However, these kinds of details separate beginning coders from more experienced ones.

Let's call our new method whenever we add a new contact. Here's our UI logic with the new function:

```
var addressBook = new AddressBook();

function display(book) {
  var list = $("ul#contacts");
  var records = "";
  book.contacts.forEach(function(contact) {
    records += "<li id=" + contact.id + ">" + contact.firstName + " " + contact.lastName + "</li>";
  });
  list.html(records);
};

$(document).ready(function() {
  $("form#new-contact").submit(function(event) {
    event.preventDefault();
    var inputtedFirstName = $("input#new-first-name").val();
    var inputtedLastName = $("input#new-last-name").val();
    var address = $("input#address").val();
    var newContact = new Contact(inputtedFirstName, inputtedLastName, address);
    addressBook.addContact(newContact);
    display(addressBook);
  });

})
```

Each time we add a new contact, the page will update the list of contacts and we'll see their first and last names onscreen! If we open Chrome Developer Tools and inspect the elements on the page, we'll see that each contact has a unique ID that corresponds to the contact's assigned ID. In the next lesson, we'll add UI functions that will allow us to display the detailed information of an individual contact onscreen.

Address Book VI: Event Delegation with jQuery

We can now dynamically add contacts to our list. However, what if we want to see additional details about each contact? It would be nice if we could click on a contact and get that contact's details. That's what we'll do next. Before we do, we'll dive into some new concepts: **event bubbling** and **event delegation**.

In order to click on a contact, we'll need to add an **event listener**. An event listener "listens" for an event such as a click or a mouseover. When that event happens, that code associated with that listener is executed. We've already been using click functions and other event listeners for the past few weeks.

However, we have a tricky situation here. Up to this point, we've written jQuery code that waits until the document is ready before attaching event listeners. The problem is that jQuery can only attach an event listener to an element in the DOM if that element already exists. Our `<li>`s for contacts don't exist yet.

We'll take advantage of two more advanced concepts to solve this problem. Let's start with **event bubbling**.

### Event Bubbling

Whe we click an element in the DOM, it triggers an event. That event "bubbles" upwards. This process is called **event bubbling** or **event propagation**. Let's take a look at an example, starting with an unordered list nested inside a `div`.

```
<div id="top-level">
  <ul id="contacts">
    <li id=1>Contact 1</li>
    <li id=2>Contact 2</li>
    <li id=3>Contact 3</li>
  </ul>
</div>
```

When a user clicks on an `<li>` element, that triggers a click event. That event will then bubble upwards to all of the `<li>`'s parent elements. So first, any click handlers on `li` will be triggered. Then any click handlers on `ul#contacts` will be triggered. And finally, any click handlers on `#top-level` will be triggered. We could write handlers for all three of those elements and all of them would be triggered if a user were to click on an `<li>`. In fact, this can become a source of errors for people new to coding, particularly if they don't mean to trigger an event on one of the parent elements.

If this concept isn't clear yet, don't worry. You don't need to apply it on Friday's independent project. However, it's a very important part of how the DOM works and will save lots of headaches in the future once you understand this general concept.

We can apply the concept of event bubbling to our advantage. Remember that jQuery can only attach handlers to elements in the DOM that already exist. Our `<li>` items don't exist yet when the DOM is created. However, its parent element (`ul#contacts`) does. We can use **event delegation** in tandem with **event bubbling** to solve this problem.

### Event delegation

We can attach an event listener to a parent element that fires for all specified child elements. This is called **event delegation**. Let's write a new function in our code to demonstrate how it works. Once again, we'll start with a named function to keep the code modular:

```
function attachContactListeners() {
  //code goes here.
}
```

We'll call this function as soon as the document is ready:

```
$(document).ready(function() {
  attachContactListeners();
  ...
});

Let's add our code now. (Note that this function is part of our UI logic and that we'll define it before `$(document).ready`. That way, we don't clutter the code inside `$(document).ready`.)

```
function attachContactListeners() {
  $("ul#contacts").on("click", "li", function() {
    console.log("The id of this <li> is" + this.id + ".");
  });
}
```

First, we call jQuery's `.on()` method on the parent element that we want to attach the event listener to. In this case, that's `ul#contacts`. (It would be better to save this selector in a variable, but for simplicity's sake, we aren't doing so here.)

The `.on()` method takes two arguments. The first is the type of the event. We want the code to trigger if's it a click event, but we could specify other types of events like hover or keyup as well. The second argument is the child element that should trigger the event listener. In this case, it's all `<li>`s inside of `ul#contacts`.

Now, if we click any `<li>` inside of `"ul#contacts"`, even if it's dynamically created, our code will log the dynamic id of the `<li>`. In the code above, `this` refers to the `li` that was clicked. How does the event listener know the `<li>`'s id if it's attached to the parent element? Whenever an event is triggered, it has an `event.target` property which stores information about the element that triggered the event. `event.target` is JavaScript code, not jQuery; remember that jQuery utilizes JS under the hood. You don't need to worry too much about `event.target` right now, but if you'd like to read more about it, check out Mozilla's documentation: https://developer.mozilla.org/en-US/docs/Web/API/Event/target.

In the next lesson, we'll create a function to show a contact's detail. We'll also add code to delete contacts to further practice with event delegation.

Address Book VII

In the last lesson, we used event delegation to target dynamically created `li` elements. Let's actually create some code to show a contact's detail. We'll start by making a modification to our function for attaching event listeners:

```
function attachContactListeners() {
  $("ul#contacts").on("click", "li", function() {
    showContact(this.id);
  });
}
```

We haven't actually written a `showContact()` method yet. However, this illustrates how we'll aim to make our code modular immediately. The function above is just concerned about adding event listeners. It doesn't care about showing a contact's detail. For that reason, we'll start with a `showContact()` function so we don't have to bloat the function above with unrelated code. We have to pass the contact into the `showContact()` function; otherwise, it won't know which contact we are talking about. In the code snippet above, `this` refers to the `li`, which has a specific ID. In other words, we are passing a contact's unique ID into this function.

Let's write that function now.

```
function showContact(id) {
  var contact = addressBook.findContact(id);
  $("#show-contact").show();
  $(".first-name").html(contact.firstName);
  $(".last-name").html(contact.lastName);
  $(".address").html(contact.address);
  var buttons = $("#buttons");
  buttons.empty();
  buttons.append("<button class='deleteButton' id=" +  + contact.id + ">Delete</button>");
}
```

We start by utilizing our address book's `findContact()` method. (Remember that we are cheating a bit and that `addressBook` is global in scope; that's why we can use it here.) The rest is straightforward. We show the hidden `#show-contact` content with the contact's full information. Note that we save our selector in a variable and it saves us some overhead; since we need to access `buttons` twice, it makes sense to just query the DOM once instead of multiple times. We are also appending a button that we can use to delete that specific contact.

Now we can click on an `<li>` and see that contact's detail. We're ready to move on to deleting a contact. We'll modify `attachContactListeners()` and use event delegation again:

```
function attachContactListeners() {
  ...
  $("#buttons").on("click", ".deleteButton", function() {
    addressBook.deleteContact(this.id)
    $("#show-contact").hide()
    display(addressBook)
  });
}

Now, when a user clicks on the delete button, the contact will be deleted. The contact detail will be hidden (since the contact has been deleted) and we'll call `display(addressBook)` to refresh the list of contacts. We could refactor this code into a separate function as well, but we'll leave that to you.
